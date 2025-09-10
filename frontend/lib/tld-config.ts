// TLD Configuration for Domain Trading Platform
// This file contains all supported Top Level Domains (TLDs)

export interface TLDInfo {
  tld: string
  category: 'gTLD' | 'ccTLD' | 'nTLD'
  popularity: number // 0-1 scale
  market_demand: number // 0-1 scale
  price_range: {
    min: number
    max: number
    currency: string
  }
  description: string
}

// Generic Top Level Domains (gTLDs)
export const SUPPORTED_GTLDS: TLDInfo[] = [
  {
    tld: 'com',
    category: 'gTLD',
    popularity: 1.0,
    market_demand: 1.0,
    price_range: { min: 100, max: 1000000, currency: 'USD' },
    description: 'Most popular and valuable TLD for commercial websites'
  },
  {
    tld: 'net',
    category: 'gTLD',
    popularity: 0.9,
    market_demand: 0.9,
    price_range: { min: 50, max: 500000, currency: 'USD' },
    description: 'Popular TLD for network and technology websites'
  },
  {
    tld: 'org',
    category: 'gTLD',
    popularity: 0.8,
    market_demand: 0.8,
    price_range: { min: 30, max: 300000, currency: 'USD' },
    description: 'Trusted TLD for organizations and non-profits'
  },
  {
    tld: 'app',
    category: 'gTLD',
    popularity: 0.7,
    market_demand: 0.8,
    price_range: { min: 100, max: 100000, currency: 'USD' },
    description: 'Modern TLD for mobile applications and web apps'
  },
  {
    tld: 'dev',
    category: 'gTLD',
    popularity: 0.6,
    market_demand: 0.7,
    price_range: { min: 50, max: 50000, currency: 'USD' },
    description: 'Developer-focused TLD for coding projects'
  },
  {
    tld: 'ai',
    category: 'gTLD',
    popularity: 0.8,
    market_demand: 0.9,
    price_range: { min: 200, max: 200000, currency: 'USD' },
    description: 'High-demand TLD for artificial intelligence companies'
  },
  {
    tld: 'io',
    category: 'gTLD',
    popularity: 0.7,
    market_demand: 0.8,
    price_range: { min: 100, max: 100000, currency: 'USD' },
    description: 'Popular TLD for tech startups and SaaS companies'
  },
  {
    tld: 'eth',
    category: 'gTLD',
    popularity: 0.6,
    market_demand: 0.7,
    price_range: { min: 50, max: 50000, currency: 'USD' },
    description: 'Ethereum-focused TLD for blockchain projects'
  },
  {
    tld: 'crypto',
    category: 'gTLD',
    popularity: 0.5,
    market_demand: 0.6,
    price_range: { min: 30, max: 30000, currency: 'USD' },
    description: 'Cryptocurrency and blockchain project TLD'
  },
  {
    tld: 'nft',
    category: 'gTLD',
    popularity: 0.4,
    market_demand: 0.5,
    price_range: { min: 20, max: 20000, currency: 'USD' },
    description: 'NFT and digital art project TLD'
  }
]

// Country Code Top Level Domains (ccTLDs)
export const SUPPORTED_CC_TLDS: TLDInfo[] = [
  {
    tld: 'us',
    category: 'ccTLD',
    popularity: 0.8,
    market_demand: 0.8,
    price_range: { min: 50, max: 100000, currency: 'USD' },
    description: 'United States country code TLD'
  },
  {
    tld: 'uk',
    category: 'ccTLD',
    popularity: 0.7,
    market_demand: 0.7,
    price_range: { min: 40, max: 80000, currency: 'USD' },
    description: 'United Kingdom country code TLD'
  },
  {
    tld: 'de',
    category: 'ccTLD',
    popularity: 0.6,
    market_demand: 0.6,
    price_range: { min: 30, max: 60000, currency: 'USD' },
    description: 'Germany country code TLD'
  },
  {
    tld: 'ca',
    category: 'ccTLD',
    popularity: 0.6,
    market_demand: 0.6,
    price_range: { min: 30, max: 60000, currency: 'USD' },
    description: 'Canada country code TLD'
  },
  {
    tld: 'au',
    category: 'ccTLD',
    popularity: 0.5,
    market_demand: 0.5,
    price_range: { min: 25, max: 50000, currency: 'USD' },
    description: 'Australia country code TLD'
  }
]

// All supported TLDs combined
export const ALL_SUPPORTED_TLDS: TLDInfo[] = [
  ...SUPPORTED_GTLDS,
  ...SUPPORTED_CC_TLDS
]

// Utility functions
export const getTLDInfo = (tld: string): TLDInfo | null => {
  const cleanTLD = tld.toLowerCase().replace('.', '')
  return ALL_SUPPORTED_TLDS.find(tldInfo => tldInfo.tld === cleanTLD) || null
}

export const isTLDSupported = (tld: string): boolean => {
  return getTLDInfo(tld) !== null
}

export const getTLDsByCategory = (category: 'gTLD' | 'ccTLD' | 'nTLD'): TLDInfo[] => {
  return ALL_SUPPORTED_TLDS.filter(tldInfo => tldInfo.category === category)
}

export const getPopularTLDs = (limit: number = 10): TLDInfo[] => {
  return ALL_SUPPORTED_TLDS
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
}

export const getHighDemandTLDs = (limit: number = 10): TLDInfo[] => {
  return ALL_SUPPORTED_TLDS
    .sort((a, b) => b.market_demand - a.market_demand)
    .slice(0, limit)
}

export const getTLDsByPriceRange = (minPrice: number, maxPrice: number): TLDInfo[] => {
  return ALL_SUPPORTED_TLDS.filter(tldInfo => 
    tldInfo.price_range.min >= minPrice && tldInfo.price_range.max <= maxPrice
  )
}
