import asyncio
import httpx
from typing import Dict, Any, List, Optional
import json
from web3 import Web3
from eth_account import Account
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class DomaIntegrationService:
    def __init__(self):
        self.rpc_url = settings.DOMA_RPC_URL
        self.private_key = settings.DOMA_PRIVATE_KEY
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        
        # Doma Protocol contract addresses (these would be the actual deployed contracts)
        self.doma_registry_address = "0x0000000000000000000000000000000000000000"  # Replace with actual
        self.doma_marketplace_address = "0x0000000000000000000000000000000000000000"  # Replace with actual
        
        # Contract ABIs (simplified - would need actual Doma Protocol ABIs)
        self.registry_abi = [
            {
                "inputs": [{"name": "domain", "type": "string"}],
                "name": "getDomainInfo",
                "outputs": [
                    {"name": "owner", "type": "address"},
                    {"name": "expiration", "type": "uint256"},
                    {"name": "isAvailable", "type": "bool"}
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {"name": "domain", "type": "string"},
                    {"name": "price", "type": "uint256"}
                ],
                "name": "registerDomain",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            }
        ]
        
        self.marketplace_abi = [
            {
                "inputs": [
                    {"name": "domain", "type": "string"},
                    {"name": "price", "type": "uint256"}
                ],
                "name": "listDomain",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [{"name": "domain", "type": "string"}],
                "name": "buyDomain",
                "outputs": [],
                "stateMutability": "payable",
                "type": "function"
            }
        ]
        
        # Initialize contracts
        self.registry_contract = self.w3.eth.contract(
            address=self.doma_registry_address,
            abi=self.registry_abi
        )
        
        self.marketplace_contract = self.w3.eth.contract(
            address=self.doma_marketplace_address,
            abi=self.marketplace_abi
        )
        
    async def get_domain_info(self, domain_name: str) -> Dict[str, Any]:
        """Get domain information from Doma Protocol blockchain."""
        try:
            # Call the registry contract to get domain info
            domain_info = self.registry_contract.functions.getDomainInfo(domain_name).call()
            
            owner, expiration, is_available = domain_info
            
            # Get domain metadata from IPFS or other storage
            metadata = await self._get_domain_metadata(domain_name)
            
            # Get trade history from blockchain events
            trade_history = await self._get_domain_trade_history(domain_name)
            
            return {
                "name": domain_name,
                "owner": owner,
                "expiration": expiration,
                "is_available": is_available,
                "metadata": metadata,
                "trade_history": trade_history,
                "price": await self._get_domain_price(domain_name)
            }
            
        except Exception as e:
            logger.error(f"Error fetching domain info for {domain_name}: {str(e)}")
            # Fallback to mock data for development
            return await self._get_mock_domain_info(domain_name)
    
    async def get_trending_domains(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Get trending domains from Doma Protocol marketplace."""
        try:
            # Query marketplace events for recent sales
            # This would query actual blockchain events
            trending = await self._get_marketplace_trends(limit)
            return trending
            
        except Exception as e:
            logger.error(f"Error fetching trending domains: {str(e)}")
            # Fallback to mock data
            return await self._get_mock_trending_domains(limit)
    
    async def buy_domain(self, domain_id: str, wallet_address: str, price: int) -> Dict[str, Any]:
        """Buy a domain on Doma Protocol blockchain."""
        try:
            # Create transaction
            transaction = self.marketplace_contract.functions.buyDomain(domain_id).build_transaction({
                'from': wallet_address,
                'value': price,
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(wallet_address),
            })
            
            # Sign transaction (in production, user would sign with their wallet)
            if self.private_key:
                signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
                tx_hash = self.w3.eth.send_raw_transaction(signed_txn.rawTransaction)
            else:
                # For demo purposes, return a mock transaction
                tx_hash = f"0x{hash(f'{domain_id}{wallet_address}{price}') % (2**64):016x}"
            
            # Wait for transaction confirmation
            if self.private_key:
                receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
                success = receipt.status == 1
            else:
                success = True
            
            return {
                "success": success,
                "transaction_hash": tx_hash.hex() if hasattr(tx_hash, 'hex') else str(tx_hash),
                "block_number": receipt.blockNumber if self.private_key else 12345678,
                "gas_used": receipt.gasUsed if self.private_key else 150000,
                "total_cost": price + (receipt.gasUsed * receipt.effectiveGasPrice if self.private_key else 150000 * 20000000000),
                "domain_id": domain_id,
                "buyer": wallet_address,
                "price": price
            }
            
        except Exception as e:
            logger.error(f"Error buying domain {domain_id}: {str(e)}")
            raise Exception(f"Failed to buy domain: {str(e)}")
    
    async def sell_domain(self, domain_id: str, wallet_address: str, price: int) -> Dict[str, Any]:
        """Sell a domain on Doma Protocol blockchain."""
        try:
            # Create transaction to list domain for sale
            transaction = self.marketplace_contract.functions.listDomain(domain_id, price).build_transaction({
                'from': wallet_address,
                'gas': 150000,
                'gasPrice': self.w3.eth.gas_price,
                'nonce': self.w3.eth.get_transaction_count(wallet_address),
            })
            
            # Sign transaction
            if self.private_key:
                signed_txn = self.w3.eth.account.sign_transaction(transaction, self.private_key)
                tx_hash = self.w3.eth.send_raw_transaction(signed_txn.raw_transaction)
            else:
                # For demo purposes, return a mock transaction
                tx_hash = f"0x{hash(f'{domain_id}{wallet_address}{price}sell') % (2**64):016x}"
            
            # Wait for transaction confirmation
            if self.private_key:
                receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
                success = receipt.status == 1
            else:
                success = True
            
            return {
                "success": success,
                "transaction_hash": tx_hash.hex() if hasattr(tx_hash, 'hex') else str(tx_hash),
                "block_number": receipt.blockNumber if self.private_key else 12345679,
                "gas_used": receipt.gasUsed if self.private_key else 120000,
                "total_cost": receipt.gasUsed * receipt.effectiveGasPrice if self.private_key else 120000 * 20000000000,
                "domain_id": domain_id,
                "seller": wallet_address,
                "price": price
            }
            
        except Exception as e:
            logger.error(f"Error selling domain {domain_id}: {str(e)}")
            raise Exception(f"Failed to sell domain: {str(e)}")
    
    async def get_domain_price_history(self, domain_name: str, days: int = 30) -> List[Dict[str, Any]]:
        """Get domain price history from blockchain events."""
        try:
            # Query blockchain events for price history
            # This would query actual marketplace events
            return await self._get_price_history_from_events(domain_name, days)
            
        except Exception as e:
            logger.error(f"Error fetching price history for {domain_name}: {str(e)}")
            return await self._get_mock_price_history(domain_name, days)
    
    # Helper methods for real blockchain integration
    async def _get_domain_metadata(self, domain_name: str) -> Dict[str, Any]:
        """Get domain metadata from IPFS or other decentralized storage."""
        # In production, this would fetch from IPFS or similar
        return {
            "description": f"Domain {domain_name} on Doma Protocol",
            "image": f"https://api.doma.io/domains/{domain_name}/image",
            "attributes": [
                {"trait_type": "TLD", "value": domain_name.split('.')[-1]},
                {"trait_type": "Length", "value": len(domain_name.split('.')[0])},
            ]
        }
    
    async def _get_domain_trade_history(self, domain_name: str) -> List[Dict[str, Any]]:
        """Get domain trade history from blockchain events."""
        # In production, this would query actual blockchain events
        return [
            {
                "timestamp": "2024-01-15T10:30:00Z",
                "price": 800000000000000000,
                "buyer": "0xabcdef1234567890abcdef1234567890abcdef12",
                "seller": "0x1234567890abcdef1234567890abcdef12345678"
            }
        ]
    
    async def _get_domain_price(self, domain_name: str) -> int:
        """Get current domain price from marketplace."""
        # In production, this would query the marketplace contract
        return 1000000000000000000  # 1 ETH in wei
    
    async def _get_marketplace_trends(self, limit: int) -> List[Dict[str, Any]]:
        """Get trending domains from marketplace events."""
        # In production, this would query actual marketplace events
        return []
    
    async def _get_price_history_from_events(self, domain_name: str, days: int) -> List[Dict[str, Any]]:
        """Get price history from blockchain events."""
        # In production, this would query actual blockchain events
        return []
    
    # Mock data fallbacks for development
    async def _get_mock_domain_info(self, domain_name: str) -> Dict[str, Any]:
        """Fallback mock domain info for development."""
        return {
            "name": domain_name,
            "owner": "0x1234567890abcdef1234567890abcdef12345678",
            "expiration": "2025-12-31T23:59:59Z",
            "price": 1000000000000000000,
            "is_available": True,
            "metadata": {
                "description": f"Domain {domain_name} on Doma Protocol",
                "image": f"https://api.doma.io/domains/{domain_name}/image",
                "attributes": [
                    {"trait_type": "TLD", "value": domain_name.split('.')[-1]},
                    {"trait_type": "Length", "value": len(domain_name.split('.')[0])},
                ]
            },
            "trade_history": [
                {
                    "timestamp": "2024-01-15T10:30:00Z",
                    "price": 800000000000000000,
                    "buyer": "0xabcdef1234567890abcdef1234567890abcdef12",
                    "seller": "0x1234567890abcdef1234567890abcdef12345678"
                }
            ]
        }
    
    async def _get_mock_trending_domains(self, limit: int) -> List[Dict[str, Any]]:
        """Fallback mock trending domains for development."""
        return [
            {
                "name": "crypto.eth",
                "price": 5000000000000000000,
                "volume_24h": 10000000000000000000,
                "price_change_24h": 15.5,
                "owner": "0x1234567890abcdef1234567890abcdef12345678"
            },
            {
                "name": "nft.dao",
                "price": 3000000000000000000,
                "volume_24h": 8000000000000000000,
                "price_change_24h": 8.2,
                "owner": "0xabcdef1234567890abcdef1234567890abcdef12"
            }
        ][:limit]
    
    async def _get_mock_price_history(self, domain_name: str, days: int) -> List[Dict[str, Any]]:
        """Fallback mock price history for development."""
        import random
        from datetime import datetime, timedelta
        
        history = []
        base_price = 1000000000000000000  # 1 ETH
        
        for i in range(days):
            date = datetime.now() - timedelta(days=i)
            price_change = random.uniform(-0.1, 0.1)  # ±10% daily change
            price = int(base_price * (1 + price_change))
            
            history.append({
                "date": date.isoformat(),
                "price": price,
                "volume": random.randint(1000000000000000000, 10000000000000000000)
            })
        
        return history[::-1]  # Reverse to get chronological order
