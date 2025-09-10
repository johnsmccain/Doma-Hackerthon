import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Types
export interface DomainScore {
  domain: string
  score: number
  valuation: number
  traits: {
    length: number
    tld: string
    keyword_value: number
    rarity: number
    on_chain_activity: number
  }
  reasoning: string
}

export interface MarketTrend {
  tld: string
  volume_24h: number
  price_change_24h: number
  trending_keywords: string[]
  market_sentiment: 'bullish' | 'bearish' | 'neutral'
}

export interface TLDMarketData {
  tld: string
  category: 'gTLD' | 'ccTLD' | 'nTLD'
  total_domains: number
  total_volume_24h: number
  average_price: number
  price_change_24h: number
  market_sentiment: 'bullish' | 'bearish' | 'neutral'
  trending_keywords: string[]
  top_domains: Array<{
    domain: string
    price: number
    volume: number
  }>
}

export interface TLDInfo {
  tld: string
  category: 'gTLD' | 'ccTLD' | 'nTLD'
  popularity: number
  market_demand: number
  price_range: {
    min: number
    max: number
    currency: string
  }
  description: string
  registration_fee?: number
  renewal_fee?: number
  transfer_fee?: number
}

export interface Recommendation {
  domain: string
  action: 'buy' | 'sell' | 'hold'
  confidence: number
  reasoning: string
  expected_return: number
  risk_level: 'low' | 'medium' | 'high'
  price_target: number
}

export interface Portfolio {
  user_id: string
  total_value: number
  total_domains: number
  performance_24h: number
  performance_7d: number
  performance_30d: number
  domains: PortfolioDomain[]
}

export interface PortfolioDomain {
  domain: string
  purchase_price: number
  current_value: number
  performance: number
  score: number
  status: 'active' | 'sold' | 'pending'
  purchase_date: string
}

export interface User {
  id: string
  wallet_address: string
  risk_profile: 'conservative' | 'moderate' | 'aggressive'
  budget: number
  preferences: {
    categories: string[]
    min_score: number
    max_risk: 'low' | 'medium' | 'high'
  }
}

// API functions
export const domainAPI = {
  // Get domain score and valuation
  getScore: async (domain: string): Promise<DomainScore> => {
    const response = await api.get(`/api/score?domain=${encodeURIComponent(domain)}`)
    return response.data
  },

  // Get market trends
  getTrends: async (category?: string, limit = 10): Promise<MarketTrend[]> => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    params.append('limit', limit.toString())
    
    const response = await api.get(`/api/trends?${params.toString()}`)
    return response.data
  },

  // Get personalized recommendations
  getRecommendations: async (userId: string, riskProfile?: string): Promise<Recommendation[]> => {
    const params = new URLSearchParams({ user_id: userId })
    if (riskProfile) params.append('risk_profile', riskProfile)
    
    const response = await api.get(`/api/recommendations?${params.toString()}`)
    return response.data
  },

  // Get user portfolio
  getPortfolio: async (userId: string): Promise<Portfolio> => {
    const response = await api.get(`/api/portfolio/${userId}`)
    return response.data
  },

  // Update portfolio
  updatePortfolio: async (userId: string, domains: string[]): Promise<Portfolio> => {
    const response = await api.post('/api/portfolio', {
      user_id: userId,
      domains,
    })
    return response.data
  },

  // Execute trade
  executeTrade: async (data: {
    action: 'buy' | 'sell'
    domain: string
    wallet_address: string
    price: number
  }): Promise<{ success: boolean; transaction_hash?: string; error?: string }> => {
    const response = await api.post('/api/trade', data)
    return response.data
  },
}

export const domaAPI = {
  // Get domain info from Doma Protocol
  getDomainInfo: async (domain: string): Promise<any> => {
    const response = await api.get(`/api/doma/domain/${encodeURIComponent(domain)}`)
    return response.data
  },

  // Get TLD information and market data
  getTLDInfo: async (tld: string): Promise<any> => {
    const response = await api.get(`/api/doma/tld/${encodeURIComponent(tld)}`)
    return response.data
  },

  // Get all supported TLDs
  getSupportedTLDs: async (): Promise<any[]> => {
    const response = await api.get('/api/doma/tlds')
    return response.data
  },

  // Get TLDs by category
  getTLDsByCategory: async (category: 'gTLD' | 'ccTLD'): Promise<any[]> => {
    const response = await api.get(`/api/doma/tlds/category/${category}`)
    return response.data
  },

  // Get TLD market trends
  getTLDMarketTrends: async (tld?: string, limit = 20): Promise<any[]> => {
    const params = new URLSearchParams()
    if (tld) params.append('tld', tld)
    params.append('limit', limit.toString())
    
    const response = await api.get(`/api/doma/tlds/trends?${params.toString()}`)
    return response.data
  },

  // Get trending domains from Doma
  getTrendingDomains: async (limit = 20): Promise<any[]> => {
    const response = await api.get(`/api/doma/trending?limit=${limit}`)
    return response.data
  },

  // Buy domain on Doma Protocol
  buyDomain: async (domainId: string, walletAddress: string, price: number): Promise<any> => {
    const response = await api.post('/api/doma/buy', {
      domain_id: domainId,
      wallet_address: walletAddress,
      price,
    })
    return response.data
  },

  // Sell domain on Doma Protocol
  sellDomain: async (domainId: string, walletAddress: string, price: number): Promise<any> => {
    const response = await api.post('/api/doma/sell', {
      domain_id: domainId,
      wallet_address: walletAddress,
      price,
    })
    return response.data
  },

  // New Doma testnet endpoints
  getNetworkStatus: async (): Promise<any> => {
    const response = await api.get('/api/doma/network/status')
    return response.data
  },

  getDomainPrice: async (domain: string): Promise<any> => {
    const response = await api.get(`/api/doma/domain/${encodeURIComponent(domain)}/price`)
    return response.data
  },

  getMarketData: async (): Promise<any> => {
    const response = await api.get('/api/doma/market')
    return response.data
  },

  getCrossChainStatus: async (domain: string): Promise<any> => {
    const response = await api.get(`/api/doma/cross-chain/${encodeURIComponent(domain)}`)
    return response.data
  },

  getHealthStatus: async (): Promise<any> => {
    const response = await api.get('/api/doma/health')
    return response.data
  },

  executeTrade: async (data: {
    action: 'buy' | 'sell'
    domain: string
    wallet_address: string
    price: number
  }): Promise<any> => {
    const response = await api.post('/api/doma/trade', data)
    return response.data
  },

  // Events Poll API
  pollEvents: async (params?: { limit?: number; eventTypes?: string[]; finalizedOnly?: boolean }): Promise<any> => {
    const response = await api.get('/v1/poll', { params })
    return response.data
  },

  acknowledgeEvents: async (lastEventId: number): Promise<any> => {
    const response = await api.post(`/v1/poll/ack/${lastEventId}`)
    return response.data
  },

  resetEvents: async (eventId: number): Promise<any> => {
    const response = await api.post(`/v1/poll/reset/${eventId}`)
    return response.data
  },

  // Orderbook API
  createListing: async (data: {
    orderbook: string
    chainId: string
    parameters: any
    signature: string
  }): Promise<{ orderId: string }> => {
    const response = await api.post('/v1/orderbook/list', data)
    return response.data
  },

  createOffer: async (data: {
    orderbook: string
    chainId: string
    parameters: any
    signature: string
  }): Promise<{ orderId: string }> => {
    const response = await api.post('/v1/orderbook/offer', data)
    return response.data
  },

  getListingFulfillment: async (orderId: string, buyer: string): Promise<any> => {
    const response = await api.get(`/v1/orderbook/listing/${orderId}/${buyer}`)
    return response.data
  },

  getOfferFulfillment: async (orderId: string, fulfiller: string): Promise<any> => {
    const response = await api.get(`/v1/orderbook/offer/${orderId}/${fulfiller}`)
    return response.data
  },

  cancelListing: async (data: { orderId: string; signature: string }): Promise<{ orderId: string }> => {
    const response = await api.post('/v1/orderbook/listing/cancel', data)
    return response.data
  },

  cancelOffer: async (data: { orderId: string; signature: string }): Promise<{ orderId: string }> => {
    const response = await api.post('/v1/orderbook/offer/cancel', data)
    return response.data
  },

  getOrderbookFees: async (orderbook: string, chainId: string, contractAddress: string): Promise<any> => {
    const response = await api.get(`/v1/orderbook/fee/${orderbook}/${chainId}/${contractAddress}`)
    return response.data
  },

  getSupportedCurrencies: async (chainId: string, contractAddress: string, orderbook: string): Promise<any> => {
    const response = await api.get(`/v1/orderbook/currencies/${chainId}/${contractAddress}/${orderbook}`)
    return response.data
  },

  // Fractionalization API
  fractionalizeDomain: async (data: {
    tokenId: string
    fractionalTokenInfo: {
      name: string
      symbol: string
    }
    minimumBuyoutPrice: number
  }): Promise<any> => {
    const response = await api.post('/v1/fractionalization/fractionalize', data)
    return response.data
  },

  buyoutDomain: async (tokenId: string): Promise<any> => {
    const response = await api.post('/v1/fractionalization/buyout', { tokenId })
    return response.data
  },

  exchangeFractionalToken: async (data: {
    fractionalToken: string
    amount: number
  }): Promise<any> => {
    const response = await api.post('/v1/fractionalization/exchange', data)
    return response.data
  },

  getBuyoutPrice: async (tokenId: string): Promise<any> => {
    const response = await api.get(`/v1/fractionalization/buyout-price/${tokenId}`)
    return response.data
  },

  getFractionalizationInfo: async (tokenId: string): Promise<any> => {
    const response = await api.post('/v1/fractionalization/info', { tokenId })
    return response.data
  },

  // Smart Contracts API
  requestTokenization: async (data: {
    voucher: {
      names: Array<{
        sld: string
        tld: string
      }>
      nonce: number
      expiresAt: number
      ownerAddress: string
    }
    signature: string
  }): Promise<any> => {
    const response = await api.post('/v1/smart-contracts/tokenization', data)
    return response.data
  },
}

export const userAPI = {
  // Get user profile
  getProfile: async (userId: string): Promise<User> => {
    const response = await api.get(`/api/users/${userId}`)
    return response.data
  },

  // Update user profile
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/api/users/${userId}`, data)
    return response.data
  },

  // Authenticate with wallet
  authenticate: async (walletAddress: string, signature: string): Promise<{ token: string; user: User }> => {
    const response = await api.post('/api/auth/wallet', {
      wallet_address: walletAddress,
      signature,
    })
    return response.data
  },
}
