import { TLDInfo, TLDMarketData } from './api'
import { SUPPORTED_TLD_LIST, isTLDSupported, getAllSupportedTLDs } from './tld-list'

export class TLDService {
  private static instance: TLDService
  private tldCache: Map<string, TLDInfo> = new Map()
  private marketDataCache: Map<string, TLDMarketData> = new Map()

  private constructor() {
    this.initializeCache()
  }

  public static getInstance(): TLDService {
    if (!TLDService.instance) {
      TLDService.instance = new TLDService()
    }
    return TLDService.instance
  }

  private initializeCache(): void {
    // Initialize with basic TLD information
    SUPPORTED_TLD_LIST.gTLDs.forEach(tld => {
      this.tldCache.set(tld, this.createDefaultTLDInfo(tld, 'gTLD'))
    })

    SUPPORTED_TLD_LIST.ccTLDs.forEach(tld => {
      this.tldCache.set(tld, this.createDefaultTLDInfo(tld, 'ccTLD'))
    })
  }

  private createDefaultTLDInfo(tld: string, category: 'gTLD' | 'ccTLD' | 'nTLD'): TLDInfo {
    const baseInfo: TLDInfo = {
      tld,
      category,
      popularity: this.calculateDefaultPopularity(tld, category),
      market_demand: this.calculateDefaultMarketDemand(tld, category),
      price_range: this.calculateDefaultPriceRange(tld, category),
      description: this.generateDefaultDescription(tld, category)
    }

    // Add special handling for premium TLDs
    if (['com', 'net', 'org', 'ai', 'io'].includes(tld)) {
      baseInfo.popularity = Math.min(1.0, baseInfo.popularity + 0.2)
      baseInfo.market_demand = Math.min(1.0, baseInfo.market_demand + 0.2)
      baseInfo.price_range.max *= 2
    }

    return baseInfo
  }

  private calculateDefaultPopularity(tld: string, category: 'gTLD' | 'ccTLD' | 'nTLD'): number {
    let basePopularity = 0.5

    // Premium TLDs get higher popularity
    if (['com', 'net', 'org'].includes(tld)) {
      basePopularity = 0.9
    } else if (['ai', 'io', 'app', 'dev'].includes(tld)) {
      basePopularity = 0.7
    } else if (['eth', 'crypto', 'nft'].includes(tld)) {
      basePopularity = 0.6
    }

    // ccTLDs generally have lower popularity than gTLDs
    if (category === 'ccTLD') {
      basePopularity *= 0.8
    }

    return Math.min(1.0, basePopularity + Math.random() * 0.1)
  }

  private calculateDefaultMarketDemand(tld: string, category: 'gTLD' | 'ccTLD' | 'nTLD'): number {
    let baseDemand = 0.5

    // High-demand TLDs
    if (['com', 'net', 'org', 'ai', 'io'].includes(tld)) {
      baseDemand = 0.8
    } else if (['app', 'dev', 'tech'].includes(tld)) {
      baseDemand = 0.7
    } else if (['eth', 'crypto', 'nft'].includes(tld)) {
      baseDemand = 0.6
    }

    // ccTLDs have varying demand
    if (category === 'ccTLD') {
      if (['us', 'uk', 'de', 'ca', 'au'].includes(tld)) {
        baseDemand = 0.7
      } else {
        baseDemand *= 0.6
      }
    }

    return Math.min(1.0, baseDemand + Math.random() * 0.1)
  }

  private calculateDefaultPriceRange(tld: string, category: 'gTLD' | 'ccTLD' | 'nTLD'): { min: number; max: number; currency: string } {
    let minPrice = 10
    let maxPrice = 1000

    // Premium TLDs
    if (['com', 'net', 'org'].includes(tld)) {
      minPrice = 100
      maxPrice = 1000000
    } else if (['ai', 'io'].includes(tld)) {
      minPrice = 200
      maxPrice = 200000
    } else if (['app', 'dev'].includes(tld)) {
      minPrice = 100
      maxPrice = 100000
    } else if (['eth', 'crypto', 'nft'].includes(tld)) {
      minPrice = 50
      maxPrice = 50000
    }

    // ccTLDs
    if (category === 'ccTLD') {
      if (['us', 'uk', 'de', 'ca', 'au'].includes(tld)) {
        minPrice = 50
        maxPrice = 100000
      } else {
        minPrice = 20
        maxPrice = 50000
      }
    }

    return {
      min: minPrice,
      max: maxPrice,
      currency: 'USD'
    }
  }

  private generateDefaultDescription(tld: string, category: 'gTLD' | 'ccTLD' | 'nTLD'): string {
    if (category === 'gTLD') {
      if (['com', 'net', 'org'].includes(tld)) {
        return `Premium ${tld.toUpperCase()} TLD for ${tld === 'com' ? 'commercial' : tld === 'net' ? 'network' : 'organizational'} websites`
      } else if (['ai', 'io', 'app', 'dev'].includes(tld)) {
        return `Modern ${tld.toUpperCase()} TLD for ${tld === 'ai' ? 'artificial intelligence' : tld === 'io' ? 'tech startups' : tld === 'app' ? 'applications' : 'development'} projects`
      } else if (['eth', 'crypto', 'nft'].includes(tld)) {
        return `Blockchain-focused ${tld.toUpperCase()} TLD for ${tld === 'eth' ? 'Ethereum' : tld === 'crypto' ? 'cryptocurrency' : 'NFT'} projects`
      }
      return `Generic ${tld.toUpperCase()} TLD for various use cases`
    } else if (category === 'ccTLD') {
      const countryNames: Record<string, string> = {
        'us': 'United States',
        'uk': 'United Kingdom',
        'de': 'Germany',
        'ca': 'Canada',
        'au': 'Australia',
        'io': 'British Indian Ocean Territory'
      }
      const countryName = countryNames[tld] || tld.toUpperCase()
      return `${countryName} country code TLD`
    }

    return `${tld.toUpperCase()} TLD`
  }

  // Public methods
  public getAllSupportedTLDs(): string[] {
    return getAllSupportedTLDs()
  }

  public getTLDsByCategory(category: 'gTLD' | 'ccTLD'): string[] {
    if (category === 'gTLD') return SUPPORTED_TLD_LIST.gTLDs
    if (category === 'ccTLD') return SUPPORTED_TLD_LIST.ccTLDs
    return []
  }

  public isTLDSupported(tld: string): boolean {
    return isTLDSupported(tld)
  }

  public getTLDInfo(tld: string): TLDInfo | null {
    const cleanTLD = tld.toLowerCase().replace('.', '')
    return this.tldCache.get(cleanTLD) || null
  }

  public getPopularTLDs(limit: number = 10): TLDInfo[] {
    return Array.from(this.tldCache.values())
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit)
  }

  public getHighDemandTLDs(limit: number = 10): TLDInfo[] {
    return Array.from(this.tldCache.values())
      .sort((a, b) => b.market_demand - a.market_demand)
      .slice(0, limit)
  }

  public getTLDsByPriceRange(minPrice: number, maxPrice: number): TLDInfo[] {
    return Array.from(this.tldCache.values()).filter(tldInfo => 
      tldInfo.price_range.min >= minPrice && tldInfo.price_range.max <= maxPrice
    )
  }

  public searchTLDs(query: string, limit: number = 20): TLDInfo[] {
    const cleanQuery = query.toLowerCase()
    return Array.from(this.tldCache.values())
      .filter(tldInfo => 
        tldInfo.tld.includes(cleanQuery) || 
        tldInfo.description.toLowerCase().includes(cleanQuery)
      )
      .slice(0, limit)
  }

  public updateTLDMarketData(tld: string, marketData: Partial<TLDMarketData>): void {
    const cleanTLD = tld.toLowerCase().replace('.', '')
    const existing = this.marketDataCache.get(cleanTLD) || {
      tld: cleanTLD,
      category: this.getTLDInfo(cleanTLD)?.category || 'gTLD',
      total_domains: 0,
      total_volume_24h: 0,
      average_price: 0,
      price_change_24h: 0,
      market_sentiment: 'neutral' as const,
      trending_keywords: [],
      top_domains: []
    }

    this.marketDataCache.set(cleanTLD, { ...existing, ...marketData })
  }

  public getTLDMarketData(tld: string): TLDMarketData | null {
    const cleanTLD = tld.toLowerCase().replace('.', '')
    return this.marketDataCache.get(cleanTLD) || null
  }

  public getTrendingTLDs(limit: number = 10): TLDMarketData[] {
    return Array.from(this.marketDataCache.values())
      .sort((a, b) => b.total_volume_24h - a.total_volume_24h)
      .slice(0, limit)
  }

  public clearCache(): void {
    this.tldCache.clear()
    this.marketDataCache.clear()
    this.initializeCache()
  }
}

// Export singleton instance
export const tldService = TLDService.getInstance()
