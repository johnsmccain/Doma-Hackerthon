import re
import hashlib
from typing import Dict, Any, Tuple
import numpy as np
from app.schemas.domain import DomainScore, DomainTraits

class DomainScoringService:
    def __init__(self):
        # Predefined keyword values (in practice, this would come from ML model)
        self.keyword_values = {
            'crypto': 0.9, 'blockchain': 0.85, 'nft': 0.8, 'defi': 0.8,
            'tech': 0.7, 'ai': 0.8, 'web3': 0.85, 'metaverse': 0.8,
            'finance': 0.6, 'banking': 0.6, 'trading': 0.7,
            'gaming': 0.6, 'play': 0.5, 'game': 0.6,
            'shop': 0.5, 'store': 0.5, 'buy': 0.5, 'sell': 0.5,
            'app': 0.6, 'api': 0.7, 'dev': 0.6, 'code': 0.6,
        }
        
        # TLD rarity scores
        self.tld_rarity = {
            'com': 0.3, 'net': 0.4, 'org': 0.4, 'io': 0.7,
            'eth': 0.9, 'crypto': 0.9, 'nft': 0.9, 'dao': 0.9,
            'ai': 0.8, 'app': 0.7, 'dev': 0.7, 'tech': 0.6,
        }

    def score_domain(self, domain: str) -> DomainScore:
        """Score a domain and return comprehensive analysis."""
        domain = domain.lower().strip()
        
        # Extract components
        name, tld = self._extract_components(domain)
        
        # Calculate traits
        traits = self._calculate_traits(name, tld)
        
        # Calculate overall score
        score = self._calculate_score(traits)
        
        # Calculate valuation
        valuation = self._calculate_valuation(score, traits)
        
        # Generate reasoning
        reasoning = self._generate_reasoning(domain, score, traits)
        
        return DomainScore(
            domain=domain,
            score=score,
            valuation=valuation,
            traits=traits,
            reasoning=reasoning
        )

    def _extract_components(self, domain: str) -> Tuple[str, str]:
        """Extract domain name and TLD."""
        parts = domain.split('.')
        if len(parts) != 2:
            raise ValueError("Invalid domain format")
        
        name, tld = parts
        return name, tld

    def _calculate_traits(self, name: str, tld: str) -> DomainTraits:
        """Calculate domain traits."""
        # Length score (shorter is better, but not too short)
        length = len(name)
        length_score = max(0, 10 - abs(length - 6))  # Optimal length around 6
        
        # TLD rarity
        tld_rarity = self.tld_rarity.get(tld, 0.5)
        
        # Keyword value
        keyword_value = self._calculate_keyword_value(name)
        
        # Rarity based on character patterns
        rarity = self._calculate_rarity(name)
        
        # On-chain activity (simulated)
        on_chain_activity = self._simulate_on_chain_activity(name, tld)
        
        return DomainTraits(
            length=length,
            tld=tld,
            keyword_value=keyword_value,
            rarity=rarity,
            on_chain_activity=on_chain_activity
        )

    def _calculate_keyword_value(self, name: str) -> float:
        """Calculate keyword value based on predefined keywords."""
        name_lower = name.lower()
        max_value = 0.0
        
        for keyword, value in self.keyword_values.items():
            if keyword in name_lower:
                max_value = max(max_value, value)
        
        # Bonus for exact matches
        if name_lower in self.keyword_values:
            max_value = max(max_value, self.keyword_values[name_lower] + 0.1)
        
        return max_value

    def _calculate_rarity(self, name: str) -> float:
        """Calculate rarity based on character patterns."""
        # Check for repeated characters
        repeated_chars = len(re.findall(r'(.)\1+', name))
        
        # Check for numeric patterns
        numeric_chars = sum(1 for c in name if c.isdigit())
        
        # Check for special patterns
        has_hyphens = '-' in name
        has_underscores = '_' in name
        
        # Calculate rarity score
        rarity = 1.0
        
        # Penalize repeated characters
        rarity -= repeated_chars * 0.1
        
        # Bonus for numeric patterns (some numbers are valuable)
        if numeric_chars == 1 and len(name) <= 4:
            rarity += 0.2
        elif numeric_chars > 2:
            rarity -= 0.2
        
        # Penalize special characters
        if has_hyphens or has_underscores:
            rarity -= 0.1
        
        return max(0.0, min(1.0, rarity))

    def _simulate_on_chain_activity(self, name: str, tld: str) -> float:
        """Simulate on-chain activity based on domain characteristics."""
        # This would normally query blockchain data
        # For now, simulate based on domain characteristics
        
        activity = 0.5  # Base activity
        
        # Higher activity for crypto-related domains
        if tld in ['eth', 'crypto', 'nft', 'dao']:
            activity += 0.3
        
        # Higher activity for short domains
        if len(name) <= 4:
            activity += 0.2
        
        # Higher activity for keyword domains
        if self._calculate_keyword_value(name) > 0.5:
            activity += 0.2
        
        return min(1.0, activity)

    def _calculate_score(self, traits: DomainTraits) -> float:
        """Calculate overall domain score."""
        # Weighted combination of traits
        weights = {
            'length': 0.15,
            'keyword_value': 0.25,
            'rarity': 0.20,
            'tld_rarity': 0.20,
            'on_chain_activity': 0.20,
        }
        
        # Normalize length (shorter is better, but not too short)
        length_score = max(0, 10 - abs(traits.length - 6)) / 10.0
        
        # Get TLD rarity
        tld_rarity = self.tld_rarity.get(traits.tld, 0.5)
        
        # Calculate weighted score
        score = (
            weights['length'] * length_score +
            weights['keyword_value'] * traits.keyword_value +
            weights['rarity'] * traits.rarity +
            weights['tld_rarity'] * tld_rarity +
            weights['on_chain_activity'] * traits.on_chain_activity
        )
        
        return min(100.0, max(0.0, score * 100))

    def _calculate_valuation(self, score: float, traits: DomainTraits) -> int:
        """Calculate domain valuation in USD cents."""
        # Base valuation based on score
        base_value = score * 100  # $1 per point
        
        # Multipliers based on traits
        keyword_multiplier = 1 + (traits.keyword_value * 2)
        rarity_multiplier = 1 + (traits.rarity * 1.5)
        tld_multiplier = 1 + (self.tld_rarity.get(traits.tld, 0.5) * 2)
        
        # Length bonus/penalty
        if traits.length <= 4:
            length_multiplier = 2.0
        elif traits.length <= 6:
            length_multiplier = 1.5
        elif traits.length <= 8:
            length_multiplier = 1.2
        else:
            length_multiplier = 0.8
        
        # Calculate final valuation
        valuation = base_value * keyword_multiplier * rarity_multiplier * tld_multiplier * length_multiplier
        
        # Add some randomness to simulate market variation
        variation = np.random.normal(1.0, 0.2)
        valuation *= max(0.5, variation)
        
        return int(valuation * 100)  # Convert to cents

    def _generate_reasoning(self, domain: str, score: float, traits: DomainTraits) -> str:
        """Generate human-readable reasoning for the score."""
        reasons = []
        
        # Length reasoning
        if traits.length <= 4:
            reasons.append("Very short domain name, highly valuable")
        elif traits.length <= 6:
            reasons.append("Short domain name, good value")
        elif traits.length <= 8:
            reasons.append("Medium length domain name")
        else:
            reasons.append("Longer domain name, reduced value")
        
        # Keyword reasoning
        if traits.keyword_value > 0.8:
            reasons.append("Contains high-value keywords")
        elif traits.keyword_value > 0.5:
            reasons.append("Contains valuable keywords")
        
        # TLD reasoning
        tld_rarity = self.tld_rarity.get(traits.tld, 0.5)
        if tld_rarity > 0.8:
            reasons.append("Rare and valuable TLD")
        elif tld_rarity > 0.6:
            reasons.append("Good TLD choice")
        
        # Rarity reasoning
        if traits.rarity > 0.8:
            reasons.append("Unique character pattern")
        elif traits.rarity < 0.3:
            reasons.append("Common character pattern")
        
        # On-chain activity
        if traits.on_chain_activity > 0.7:
            reasons.append("High on-chain activity")
        
        # Overall assessment
        if score >= 80:
            assessment = "Excellent investment potential"
        elif score >= 60:
            assessment = "Good investment potential"
        elif score >= 40:
            assessment = "Moderate investment potential"
        else:
            assessment = "Limited investment potential"
        
        return f"{assessment}. {' '.join(reasons)}."

# Global instance
domain_scoring_service = DomainScoringService()
