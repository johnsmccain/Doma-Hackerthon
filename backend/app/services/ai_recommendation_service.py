import asyncio
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import json
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import pickle
import os

logger = logging.getLogger(__name__)

class AIRecommendationService:
    def __init__(self):
        self.model_path = "models/domain_recommendation_model.pkl"
        self.scaler_path = "models/domain_scaler.pkl"
        self.model = None
        self.scaler = None
        
        # Load or initialize the model
        self._load_model()
        
        # Feature weights for scoring
        self.feature_weights = {
            "length": 0.15,
            "tld_popularity": 0.20,
            "keyword_value": 0.25,
            "market_volume": 0.20,
            "price_trend": 0.10,
            "social_sentiment": 0.10
        }
    
    def _load_model(self):
        """Load the trained ML model and scaler."""
        try:
            # Create models directory if it doesn't exist
            os.makedirs("models", exist_ok=True)
            
            if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                with open(self.scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
                logger.info("ML model loaded successfully")
            else:
                logger.info("No existing model found, will train new one")
                self._train_model()
                
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self._train_model()
    
    def _train_model(self):
        """Train a new ML model with synthetic data (in production, use real historical data)."""
        try:
            # Generate synthetic training data
            # In production, this would use real historical domain sales data
            np.random.seed(42)
            n_samples = 1000
            
            # Generate synthetic features
            lengths = np.random.randint(3, 20, n_samples)
            tld_popularities = np.random.uniform(0.1, 1.0, n_samples)
            keyword_values = np.random.uniform(0.1, 1.0, n_samples)
            market_volumes = np.random.uniform(1000, 100000, n_samples)
            price_trends = np.random.uniform(-0.3, 0.5, n_samples)
            social_sentiments = np.random.uniform(-1.0, 1.0, n_samples)
            
            # Generate synthetic target (domain value)
            # This is a simplified formula - in production, use real pricing data
            base_value = 1000
            target_values = (
                base_value * 
                (1 + 0.1 * (20 - lengths)) *  # Shorter names are more valuable
                (1 + 0.5 * tld_popularities) *  # Popular TLDs are more valuable
                (1 + 0.8 * keyword_values) *  # High keyword value increases price
                (1 + 0.3 * np.log(market_volumes / 1000)) *  # Market volume impact
                (1 + 0.2 * price_trends) *  # Price trend impact
                (1 + 0.1 * social_sentiments)  # Social sentiment impact
            )
            
            # Add some noise
            target_values += np.random.normal(0, 0.1 * target_values)
            target_values = np.maximum(target_values, 100)  # Minimum value
            
            # Prepare features
            X = np.column_stack([
                lengths, tld_popularities, keyword_values, 
                market_volumes, price_trends, social_sentiments
            ])
            y = target_values
            
            # Scale features
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X)
            
            # Train Random Forest model
            self.model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            self.model.fit(X_scaled, y)
            
            # Save model and scaler
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.model, f)
            with open(self.scaler_path, 'wb') as f:
                pickle.dump(self.scaler, f)
            
            logger.info("New ML model trained and saved successfully")
            
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            self.model = None
            self.scaler = None
    
    async def analyze_domain(self, domain_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a domain and provide comprehensive insights."""
        try:
            analysis = {
                "domain": domain_data.get("name", "Unknown"),
                "timestamp": datetime.utcnow().isoformat(),
                "score": 0,
                "valuation": 0,
                "risk_assessment": {},
                "recommendations": [],
                "market_analysis": {},
                "technical_analysis": {}
            }
            
            # Calculate domain score
            score = await self._calculate_domain_score(domain_data)
            analysis["score"] = score
            
            # Calculate valuation
            valuation = await self._calculate_valuation(domain_data, score)
            analysis["valuation"] = valuation
            
            # Risk assessment
            risk_assessment = await self._assess_risk(domain_data, score)
            analysis["risk_assessment"] = risk_assessment
            
            # Generate recommendations
            recommendations = await self._generate_recommendations(domain_data, score, risk_assessment)
            analysis["recommendations"] = recommendations
            
            # Market analysis
            market_analysis = await self._analyze_market(domain_data)
            analysis["market_analysis"] = market_analysis
            
            # Technical analysis
            technical_analysis = await self._analyze_technical(domain_data)
            analysis["technical_analysis"] = technical_analysis
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing domain: {str(e)}")
            return {"error": str(e)}
    
    async def get_investment_recommendations(
        self, 
        user_profile: Dict[str, Any], 
        market_data: List[Dict[str, Any]],
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get personalized investment recommendations based on user profile and market data."""
        try:
            recommendations = []
            
            for domain_data in market_data:
                # Analyze domain
                analysis = await self.analyze_domain(domain_data)
                
                if "error" not in analysis:
                    # Calculate recommendation score based on user profile
                    recommendation_score = await self._calculate_recommendation_score(
                        analysis, user_profile
                    )
                    
                    # Determine action based on analysis and user profile
                    action = await self._determine_action(analysis, user_profile)
                    
                    # Calculate expected return and risk
                    expected_return = await self._calculate_expected_return(analysis, user_profile)
                    risk_level = analysis.get("risk_assessment", {}).get("overall_risk", "medium")
                    
                    recommendation = {
                        "domain": analysis["domain"],
                        "action": action,
                        "confidence": recommendation_score,
                        "reasoning": await self._generate_reasoning(analysis, user_profile),
                        "expected_return": expected_return,
                        "risk_level": risk_level,
                        "price_target": analysis.get("valuation", 0),
                        "analysis": analysis
                    }
                    
                    recommendations.append(recommendation)
            
            # Sort by recommendation score and return top results
            recommendations.sort(key=lambda x: x["confidence"], reverse=True)
            return recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return []
    
    async def _calculate_domain_score(self, domain_data: Dict[str, Any]) -> float:
        """Calculate a comprehensive domain score (0-100)."""
        try:
            score = 0
            
            # Length score (shorter = better)
            name = domain_data.get("name", "")
            if "." in name:
                base_name = name.split(".")[0]
                length_score = max(0, 100 - (len(base_name) - 3) * 5)  # 3 chars = 100, 20+ chars = 0
                score += length_score * self.feature_weights["length"]
            
            # TLD popularity score
            tld = name.split(".")[-1] if "." in name else ""
            tld_popularity = self._get_tld_popularity(tld)
            score += tld_popularity * 100 * self.feature_weights["tld_popularity"]
            
            # Keyword value score
            keyword_value = domain_data.get("keyword_value", 0.5)
            score += keyword_value * 100 * self.feature_weights["keyword_value"]
            
            # Market volume score
            market_volume = domain_data.get("market_volume", 0)
            if market_volume > 0:
                volume_score = min(100, np.log(market_volume / 1000) * 20)
                score += volume_score * self.feature_weights["market_volume"]
            
            # Price trend score
            price_trend = domain_data.get("price_change_24h", 0)
            trend_score = 50 + (price_trend * 10)  # -50% = 0, +50% = 100
            trend_score = max(0, min(100, trend_score))
            score += trend_score * self.feature_weights["price_trend"]
            
            # Social sentiment score
            social_sentiment = domain_data.get("social_sentiment", 0)
            sentiment_score = 50 + (social_sentiment * 50)  # -1 = 0, +1 = 100
            sentiment_score = max(0, min(100, sentiment_score))
            score += sentiment_score * self.feature_weights["social_sentiment"]
            
            return min(100, max(0, score))
            
        except Exception as e:
            logger.error(f"Error calculating domain score: {str(e)}")
            return 50.0
    
    async def _calculate_valuation(self, domain_data: Dict[str, Any], score: float) -> float:
        """Calculate domain valuation using ML model or heuristics."""
        try:
            if self.model and self.scaler:
                # Use ML model for prediction
                features = self._extract_features(domain_data)
                features_scaled = self.scaler.transform([features])
                prediction = self.model.predict(features_scaled)[0]
                return max(100, prediction)
            else:
                # Fallback to heuristic calculation
                base_value = 1000
                multiplier = 1 + (score - 50) / 50  # 0-100 score maps to 0.5-1.5x multiplier
                return base_value * multiplier
                
        except Exception as e:
            logger.error(f"Error calculating valuation: {str(e)}")
            return 1000.0
    
    async def _assess_risk(self, domain_data: Dict[str, Any], score: float) -> Dict[str, Any]:
        """Assess various risk factors for the domain."""
        try:
            risk_factors = {
                "market_volatility": "low",
                "liquidity_risk": "low",
                "regulatory_risk": "low",
                "technical_risk": "low",
                "overall_risk": "low"
            }
            
            # Market volatility risk
            price_change = abs(domain_data.get("price_change_24h", 0))
            if price_change > 20:
                risk_factors["market_volatility"] = "high"
            elif price_change > 10:
                risk_factors["market_volatility"] = "medium"
            
            # Liquidity risk
            market_volume = domain_data.get("market_volume", 0)
            if market_volume < 1000:
                risk_factors["liquidity_risk"] = "high"
            elif market_volume < 10000:
                risk_factors["liquidity_risk"] = "medium"
            
            # Overall risk calculation
            risk_scores = {
                "low": 1, "medium": 2, "high": 3
            }
            
            total_risk = sum(risk_scores[risk] for risk in risk_factors.values() if risk != "overall_risk")
            avg_risk = total_risk / (len(risk_factors) - 1)
            
            if avg_risk <= 1.5:
                risk_factors["overall_risk"] = "low"
            elif avg_risk <= 2.5:
                risk_factors["overall_risk"] = "medium"
            else:
                risk_factors["overall_risk"] = "high"
            
            return risk_factors
            
        except Exception as e:
            logger.error(f"Error assessing risk: {str(e)}")
            return {"overall_risk": "medium"}
    
    async def _generate_recommendations(
        self, 
        domain_data: Dict[str, Any], 
        score: float, 
        risk_assessment: Dict[str, Any]
    ) -> List[str]:
        """Generate specific recommendations for the domain."""
        try:
            recommendations = []
            
            # Score-based recommendations
            if score >= 80:
                recommendations.append("Strong buy recommendation - high potential value")
            elif score >= 60:
                recommendations.append("Buy recommendation - good value proposition")
            elif score >= 40:
                recommendations.append("Hold recommendation - monitor for improvements")
            else:
                recommendations.append("Consider selling - low value proposition")
            
            # Risk-based recommendations
            if risk_assessment.get("overall_risk") == "high":
                recommendations.append("High risk - consider smaller position size")
            elif risk_assessment.get("liquidity_risk") == "high":
                recommendations.append("Low liquidity - may be difficult to exit quickly")
            
            # Market-based recommendations
            price_change = domain_data.get("price_change_24h", 0)
            if price_change > 20:
                recommendations.append("High volatility - consider dollar-cost averaging")
            elif price_change < -20:
                recommendations.append("Significant decline - research for buying opportunities")
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return ["Unable to generate specific recommendations"]
    
    async def _analyze_market(self, domain_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze market conditions for the domain."""
        try:
            market_analysis = {
                "trend": "neutral",
                "volume_trend": "stable",
                "market_sentiment": "neutral",
                "competition_level": "medium"
            }
            
            # Trend analysis
            price_change = domain_data.get("price_change_24h", 0)
            if price_change > 5:
                market_analysis["trend"] = "bullish"
            elif price_change < -5:
                market_analysis["trend"] = "bearish"
            
            # Volume trend
            volume = domain_data.get("market_volume", 0)
            if volume > 50000:
                market_analysis["volume_trend"] = "high"
            elif volume < 5000:
                market_analysis["volume_trend"] = "low"
            
            # Market sentiment
            sentiment = domain_data.get("social_sentiment", 0)
            if sentiment > 0.3:
                market_analysis["market_sentiment"] = "bullish"
            elif sentiment < -0.3:
                market_analysis["market_sentiment"] = "bearish"
            
            return market_analysis
            
        except Exception as e:
            logger.error(f"Error analyzing market: {str(e)}")
            return {"trend": "neutral"}
    
    async def _analyze_technical(self, domain_data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform technical analysis on the domain."""
        try:
            technical_analysis = {
                "support_level": 0,
                "resistance_level": 0,
                "momentum": "neutral",
                "volatility": "low"
            }
            
            # Calculate support and resistance levels
            current_price = domain_data.get("price", 1000)
            price_change = domain_data.get("price_change_24h", 0)
            
            # Simple support/resistance calculation
            if price_change > 0:
                technical_analysis["support_level"] = current_price * 0.9
                technical_analysis["resistance_level"] = current_price * 1.1
            else:
                technical_analysis["support_level"] = current_price * 0.8
                technical_analysis["resistance_level"] = current_price * 1.05
            
            # Momentum analysis
            if price_change > 10:
                technical_analysis["momentum"] = "strong_bullish"
            elif price_change > 5:
                technical_analysis["momentum"] = "bullish"
            elif price_change < -10:
                technical_analysis["momentum"] = "strong_bearish"
            elif price_change < -5:
                technical_analysis["momentum"] = "bearish"
            
            # Volatility analysis
            if abs(price_change) > 15:
                technical_analysis["volatility"] = "high"
            elif abs(price_change) > 8:
                technical_analysis["volatility"] = "medium"
            
            return technical_analysis
            
        except Exception as e:
            logger.error(f"Error analyzing technical: {str(e)}")
            return {"momentum": "neutral"}
    
    def _get_tld_popularity(self, tld: str) -> float:
        """Get TLD popularity score (0-1)."""
        tld_popularity = {
            "eth": 1.0, "crypto": 0.9, "nft": 0.8, "dao": 0.7,
            "com": 0.6, "org": 0.5, "net": 0.4, "io": 0.3
        }
        return tld_popularity.get(tld.lower(), 0.2)
    
    def _extract_features(self, domain_data: Dict[str, Any]) -> List[float]:
        """Extract features for ML model prediction."""
        try:
            name = domain_data.get("name", "")
            base_name = name.split(".")[0] if "." in name else name
            
            features = [
                len(base_name),  # length
                self._get_tld_popularity(name.split(".")[-1] if "." in name else ""),  # tld_popularity
                domain_data.get("keyword_value", 0.5),  # keyword_value
                domain_data.get("market_volume", 10000),  # market_volume
                domain_data.get("price_change_24h", 0),  # price_trend
                domain_data.get("social_sentiment", 0)  # social_sentiment
            ]
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting features: {str(e)}")
            return [10, 0.5, 0.5, 10000, 0, 0]
    
    async def _calculate_recommendation_score(
        self, 
        analysis: Dict[str, Any], 
        user_profile: Dict[str, Any]
    ) -> float:
        """Calculate recommendation score based on user profile and domain analysis."""
        try:
            base_score = analysis.get("score", 50)
            
            # Adjust based on user risk profile
            user_risk = user_profile.get("risk_profile", "moderate")
            risk_adjustment = {
                "conservative": -10,
                "moderate": 0,
                "aggressive": 10
            }
            
            # Adjust based on user budget
            user_budget = user_profile.get("budget", 10000)
            domain_value = analysis.get("valuation", 1000)
            
            if domain_value > user_budget * 0.5:
                budget_adjustment = -15  # Too expensive
            elif domain_value < user_budget * 0.1:
                budget_adjustment = 5  # Good value
            else:
                budget_adjustment = 0
            
            # Calculate final score
            final_score = base_score + risk_adjustment.get(user_risk, 0) + budget_adjustment
            return max(0, min(100, final_score))
            
        except Exception as e:
            logger.error(f"Error calculating recommendation score: {str(e)}")
            return 50.0
    
    async def _determine_action(
        self, 
        analysis: Dict[str, Any], 
        user_profile: Dict[str, Any]
    ) -> str:
        """Determine recommended action (buy/sell/hold)."""
        try:
            score = analysis.get("score", 50)
            risk = analysis.get("risk_assessment", {}).get("overall_risk", "medium")
            user_risk = user_profile.get("risk_profile", "moderate")
            
            # High score domains
            if score >= 75:
                if risk == "high" and user_risk == "conservative":
                    return "hold"
                else:
                    return "buy"
            
            # Medium score domains
            elif score >= 50:
                if risk == "low":
                    return "buy"
                else:
                    return "hold"
            
            # Low score domains
            else:
                if score < 30:
                    return "sell"
                else:
                    return "hold"
                    
        except Exception as e:
            logger.error(f"Error determining action: {str(e)}")
            return "hold"
    
    async def _calculate_expected_return(
        self, 
        analysis: Dict[str, Any], 
        user_profile: Dict[str, Any]
    ) -> float:
        """Calculate expected return percentage."""
        try:
            base_return = 0
            
            # Base return based on score
            score = analysis.get("score", 50)
            if score >= 80:
                base_return = 25
            elif score >= 60:
                base_return = 15
            elif score >= 40:
                base_return = 5
            else:
                base_return = -5
            
            # Adjust based on market trend
            market_trend = analysis.get("market_analysis", {}).get("trend", "neutral")
            trend_adjustment = {
                "bullish": 10,
                "neutral": 0,
                "bearish": -10
            }
            
            # Adjust based on user risk profile
            user_risk = user_profile.get("risk_profile", "moderate")
            risk_adjustment = {
                "conservative": -5,
                "moderate": 0,
                "aggressive": 5
            }
            
            final_return = base_return + trend_adjustment.get(market_trend, 0) + risk_adjustment.get(user_risk, 0)
            return max(-50, min(100, final_return))  # Cap between -50% and +100%
            
        except Exception as e:
            logger.error(f"Error calculating expected return: {str(e)}")
            return 0.0
    
    async def _generate_reasoning(
        self, 
        analysis: Dict[str, Any], 
        user_profile: Dict[str, Any]
    ) -> str:
        """Generate human-readable reasoning for the recommendation."""
        try:
            score = analysis.get("score", 50)
            risk = analysis.get("risk_assessment", {}).get("overall_risk", "medium")
            market_trend = analysis.get("market_analysis", {}).get("trend", "neutral")
            
            reasoning_parts = []
            
            # Score-based reasoning
            if score >= 80:
                reasoning_parts.append("Excellent domain score indicates high potential value")
            elif score >= 60:
                reasoning_parts.append("Good domain score suggests solid investment potential")
            elif score >= 40:
                reasoning_parts.append("Average domain score - monitor for improvements")
            else:
                reasoning_parts.append("Low domain score suggests limited upside potential")
            
            # Risk-based reasoning
            if risk == "high":
                reasoning_parts.append("High risk profile requires careful consideration")
            elif risk == "low":
                reasoning_parts.append("Low risk profile suitable for conservative investors")
            
            # Market trend reasoning
            if market_trend == "bullish":
                reasoning_parts.append("Bullish market trend supports positive outlook")
            elif market_trend == "bearish":
                reasoning_parts.append("Bearish market trend suggests caution")
            
            # User profile reasoning
            user_risk = user_profile.get("risk_profile", "moderate")
            if user_risk == "conservative" and risk == "high":
                reasoning_parts.append("Conservative risk profile may not align with high-risk domain")
            elif user_risk == "aggressive" and risk == "low":
                reasoning_parts.append("Aggressive risk profile may seek higher-risk opportunities")
            
            return ". ".join(reasoning_parts) + "."
            
        except Exception as e:
            logger.error(f"Error generating reasoning: {str(e)}")
            return "Unable to generate specific reasoning for this recommendation."
