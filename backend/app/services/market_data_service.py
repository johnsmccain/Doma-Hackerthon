import asyncio
import httpx
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime, timedelta
import json
import aiohttp
from decimal import Decimal

logger = logging.getLogger(__name__)

class MarketDataService:
    def __init__(self):
        # API endpoints and keys
        self.coingecko_base = "https://api.coingecko.com/api/v3"
        self.opensea_base = "https://api.opensea.io/api/v1"
        self.etherscan_base = "https://api.etherscan.io/api"
        self.polygonscan_base = "https://api.polygonscan.com/api"
        
        # API keys (should be in environment variables)
        self.opensea_api_key = "YOUR_OPENSEA_API_KEY"  # Replace with actual key
        self.etherscan_api_key = "YOUR_ETHERSCAN_API_KEY"  # Replace with actual key
        self.polygonscan_api_key = "YOUR_POLYGONSCAN_API_KEY"  # Replace with actual key
        
        # Cache for market data
        self.cache = {}
        self.cache_ttl = 300  # 5 minutes
        
    async def get_crypto_prices(self, symbols: List[str]) -> Dict[str, float]:
        """Get real-time cryptocurrency prices from CoinGecko."""
        try:
            # Convert symbols to CoinGecko IDs
            symbol_to_id = {
                'ETH': 'ethereum',
                'MATIC': 'matic-network',
                'OP': 'optimism',
                'ARB': 'arbitrum',
                'USDC': 'usd-coin',
                'USDT': 'tether',
                'DAI': 'dai'
            }
            
            ids = [symbol_to_id.get(symbol.upper(), symbol.lower()) for symbol in symbols]
            ids = [id for id in ids if id]
            
            if not ids:
                return {}
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.coingecko_base}/simple/price",
                    params={
                        "ids": ",".join(ids),
                        "vs_currencies": "usd",
                        "include_24hr_change": "true",
                        "include_24hr_vol": "true"
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    prices = {}
                    
                    for symbol in symbols:
                        symbol_upper = symbol.upper()
                        if symbol_upper in symbol_to_id:
                            coin_id = symbol_to_id[symbol_upper]
                            if coin_id in data:
                                prices[symbol_upper] = {
                                    "price_usd": data[coin_id].get("usd", 0),
                                    "change_24h": data[coin_id].get("usd_24h_change", 0),
                                    "volume_24h": data[coin_id].get("usd_24h_vol", 0)
                                }
                    
                    return prices
                else:
                    logger.error(f"CoinGecko API error: {response.status_code}")
                    return {}
                    
        except Exception as e:
            logger.error(f"Error fetching crypto prices: {str(e)}")
            return {}
    
    async def get_ens_market_data(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get real ENS market data from OpenSea and other sources."""
        try:
            # Get ENS collection stats from OpenSea
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.opensea_base}/collection/ens/stats",
                    headers={
                        "X-API-KEY": self.opensea_api_key
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    stats = response.json()
                    
                    # Get recent ENS sales
                    sales_response = await client.get(
                        f"{self.opensea_base}/events",
                        params={
                            "collection": "ens",
                            "event_type": "successful",
                            "limit": limit
                        },
                        headers={
                            "X-API-KEY": self.opensea_api_key
                        }
                    )
                    
                    if sales_response.status_code == 200:
                        sales_data = sales_response.json()
                        recent_sales = sales_data.get("asset_events", [])
                        
                        # Process sales data
                        market_data = []
                        for sale in recent_sales:
                            if sale.get("payment_token") and sale.get("total_price"):
                                payment_token = sale["payment_token"]["symbol"]
                                total_price = float(sale["total_price"]) / (10 ** sale["payment_token"]["decimals"])
                                
                                # Convert to USD if not already
                                if payment_token != "WETH":
                                    # Get current price for conversion
                                    prices = await self.get_crypto_prices([payment_token])
                                    if payment_token in prices:
                                        total_price_usd = total_price * prices[payment_token]["price_usd"]
                                    else:
                                        total_price_usd = total_price
                                else:
                                    # WETH is roughly 1:1 with ETH
                                    eth_price = await self.get_crypto_prices(["ETH"])
                                    total_price_usd = total_price * eth_price.get("ETH", {}).get("price_usd", 0)
                                
                                market_data.append({
                                    "domain": sale.get("asset", {}).get("name", "Unknown"),
                                    "price": total_price,
                                    "price_usd": total_price_usd,
                                    "currency": payment_token,
                                    "buyer": sale.get("winner_account", {}).get("address"),
                                    "seller": sale.get("seller", {}).get("address"),
                                    "transaction_hash": sale.get("transaction"),
                                    "timestamp": sale.get("created_date"),
                                    "block_number": sale.get("block_number")
                                })
                        
                        return {
                            "collection_stats": {
                                "floor_price": stats.get("stats", {}).get("floor_price", 0),
                                "total_volume": stats.get("stats", {}).get("total_volume", 0),
                                "total_sales": stats.get("stats", {}).get("total_sales", 0),
                                "total_supply": stats.get("stats", {}).get("total_supply", 0),
                                "num_owners": stats.get("stats", {}).get("num_owners", 0)
                            },
                            "recent_sales": market_data[:limit]
                        }
                
                logger.error(f"OpenSea API error: {response.status_code}")
                return {}
                
        except Exception as e:
            logger.error(f"Error fetching ENS market data: {str(e)}")
            return {}
    
    async def get_unstoppable_market_data(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get real Unstoppable Domains market data."""
        try:
            # Query Unstoppable Domains API for market data
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.unstoppabledomains.com/marketplace/domains",
                    params={
                        "limit": limit,
                        "sortBy": "volume",
                        "sortDirection": "desc"
                    },
                    headers={
                        "Authorization": "Bearer YOUR_UNSTOPPABLE_API_KEY"  # Replace with actual key
                    },
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("domains", [])
                else:
                    logger.error(f"Unstoppable API error: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error fetching Unstoppable market data: {str(e)}")
            return []
    
    async def get_domain_analytics(self, domain: str) -> Dict[str, Any]:
        """Get comprehensive domain analytics from multiple sources."""
        try:
            analytics = {
                "domain": domain,
                "timestamp": datetime.utcnow().isoformat(),
                "market_data": {},
                "blockchain_data": {},
                "social_data": {},
                "seo_data": {}
            }
            
            # Get market data based on domain type
            if domain.endswith('.eth'):
                ens_data = await self.get_ens_market_data(1)
                if ens_data and "recent_sales" in ens_data:
                    # Find matching domain in recent sales
                    for sale in ens_data["recent_sales"]:
                        if sale["domain"] == domain:
                            analytics["market_data"] = sale
                            break
                    
                    analytics["market_data"]["collection_stats"] = ens_data.get("collection_stats", {})
            
            elif any(domain.endswith(suffix) for suffix in ['.crypto', '.nft', '.dao']):
                unstoppable_data = await self.get_unstoppable_market_data(1)
                if unstoppable_data:
                    for item in unstoppable_data:
                        if item.get("name") == domain:
                            analytics["market_data"] = item
                            break
            
            # Get blockchain data
            analytics["blockchain_data"] = await self._get_blockchain_analytics(domain)
            
            # Get social data
            analytics["social_data"] = await self._get_social_analytics(domain)
            
            # Get SEO data
            analytics["seo_data"] = await self._get_seo_analytics(domain)
            
            return analytics
            
        except Exception as e:
            logger.error(f"Error fetching domain analytics for {domain}: {str(e)}")
            return {"domain": domain, "error": str(e)}
    
    async def get_market_trends(self, category: str = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Get real market trends from multiple sources."""
        try:
            trends = []
            
            # Get ENS trends
            ens_data = await self.get_ens_market_data(limit // 2)
            if ens_data and "recent_sales" in ens_data:
                for sale in ens_data["recent_sales"][:limit // 2]:
                    trends.append({
                        "tld": "eth",
                        "domain": sale["domain"],
                        "volume_24h": sale.get("price_usd", 0),
                        "price_change_24h": 0,  # Would need historical data
                        "trending_keywords": [sale["domain"].split('.')[0]],
                        "market_sentiment": "bullish" if sale.get("price_usd", 0) > 1000 else "neutral",
                        "source": "opensea",
                        "timestamp": sale.get("timestamp")
                    })
            
            # Get Unstoppable trends
            unstoppable_data = await self.get_unstoppable_market_data(limit // 2)
            if unstoppable_data:
                for item in unstoppable_data[:limit // 2]:
                    trends.append({
                        "tld": item.get("name", "").split('.')[-1] if '.' in item.get("name", "") else "unknown",
                        "domain": item.get("name", ""),
                        "volume_24h": item.get("volume_24h", 0),
                        "price_change_24h": item.get("price_change_24h", 0),
                        "trending_keywords": [item.get("name", "").split('.')[0]] if '.' in item.get("name", "") else [],
                        "market_sentiment": "bullish" if item.get("price_change_24h", 0) > 0 else "bearish",
                        "source": "unstoppable",
                        "timestamp": item.get("timestamp")
                    })
            
            # Sort by volume and return top results
            trends.sort(key=lambda x: x.get("volume_24h", 0), reverse=True)
            return trends[:limit]
            
        except Exception as e:
            logger.error(f"Error fetching market trends: {str(e)}")
            return []
    
    async def get_portfolio_performance(self, domains: List[str]) -> Dict[str, Any]:
        """Get real portfolio performance data."""
        try:
            portfolio_data = {
                "total_domains": len(domains),
                "total_value_usd": 0,
                "performance_24h": 0,
                "performance_7d": 0,
                "performance_30d": 0,
                "domains": []
            }
            
            for domain in domains:
                analytics = await self.get_domain_analytics(domain)
                if analytics and "market_data" in analytics:
                    market_data = analytics["market_data"]
                    price_usd = market_data.get("price_usd", 0)
                    
                    portfolio_data["total_value_usd"] += price_usd
                    portfolio_data["domains"].append({
                        "domain": domain,
                        "current_value_usd": price_usd,
                        "market_data": market_data
                    })
            
            return portfolio_data
            
        except Exception as e:
            logger.error(f"Error fetching portfolio performance: {str(e)}")
            return {"error": str(e)}
    
    # Helper methods
    async def _get_blockchain_analytics(self, domain: str) -> Dict[str, Any]:
        """Get blockchain-specific analytics."""
        try:
            # This would query blockchain data for analytics
            return {
                "transactions_count": 0,
                "unique_holders": 0,
                "last_transaction": None
            }
        except Exception as e:
            logger.error(f"Error fetching blockchain analytics: {str(e)}")
            return {}
    
    async def _get_social_analytics(self, domain: str) -> Dict[str, Any]:
        """Get social media analytics for domain."""
        try:
            # This would query social media APIs
            return {
                "mentions": 0,
                "sentiment": "neutral",
                "trending_score": 0
            }
        except Exception as e:
            logger.error(f"Error fetching social analytics: {str(e)}")
            return {}
    
    async def _get_seo_analytics(self, domain: str) -> Dict[str, Any]:
        """Get SEO analytics for domain."""
        try:
            # This would query SEO APIs
            return {
                "search_volume": 0,
                "keyword_difficulty": 0,
                "organic_traffic": 0
            }
        except Exception as e:
            logger.error(f"Error fetching SEO analytics: {str(e)}")
            return {}
