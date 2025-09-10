'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Star,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface CryptoPrice {
  price: number
  change: number
}

interface CryptoPrices {
  ETH: CryptoPrice
  MATIC: CryptoPrice
  OP: CryptoPrice
  ARB: CryptoPrice
  USDC: CryptoPrice
  USDT: CryptoPrice
}

interface MarketTrend {
  tld: string
  volume_24h: number
  price_change_24h: number
  trending_keywords: string[]
  market_sentiment: string
}

interface DomainScore {
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

interface PortfolioItem {
  domain: string
  purchase_price: number
  current_value: number
  change_24h: number
  score: number
  status: 'active' | 'pending' | 'sold'
}

export function DynamicDashboard() {
  const [selectedDomain, setSelectedDomain] = useState('example.eth')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch crypto prices
  const { data: cryptoPrices, isLoading: cryptoLoading, refetch: refetchCrypto } = useQuery({
    queryKey: ['crypto-prices'],
    queryFn: async (): Promise<CryptoPrices> => {
      const response = await api.get('/api/crypto-prices')
      return response.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000
  })

  // Fetch market trends
  const { data: marketTrends, isLoading: trendsLoading, refetch: refetchTrends } = useQuery({
    queryKey: ['market-trends'],
    queryFn: async (): Promise<MarketTrend[]> => {
      const response = await api.get('/api/trends')
      return response.data
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 50000
  })

  // Fetch Doma testnet status
  const { data: domaStatus, isLoading: domaLoading, refetch: refetchDoma } = useQuery({
    queryKey: ['doma-status'],
    queryFn: async () => {
      const response = await api.get('/api/doma/network/status')
      return response.data
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 50000
  })

  // Fetch Doma health status
  const { data: domaHealth, isLoading: healthLoading, refetch: refetchHealth } = useQuery({
    queryKey: ['doma-health'],
    queryFn: async () => {
      const response = await api.get('/api/doma/health')
      return response.data
    },
    refetchInterval: 120000, // Refetch every 2 minutes
    staleTime: 100000
  })

  // Fetch domain score
  const { data: domainScore, isLoading: scoreLoading, refetch: refetchScore } = useQuery({
    queryKey: ['domain-score', selectedDomain],
    queryFn: async (): Promise<DomainScore> => {
      const response = await api.get(`/api/score?domain=${selectedDomain}`)
      return response.data
    },
    enabled: !!selectedDomain
  })

  // Mock portfolio data (in real app, this would come from backend)
  const portfolioData: PortfolioItem[] = [
    {
      domain: 'crypto.eth',
      purchase_price: 2500,
      current_value: 3200,
      change_24h: 5.2,
      score: 85,
      status: 'active'
    },
    {
      domain: 'defi.crypto',
      purchase_price: 1800,
      current_value: 2100,
      change_24h: -2.1,
      score: 78,
      status: 'active'
    },
    {
      domain: 'nft.dao',
      purchase_price: 1200,
      current_value: 1350,
      change_24h: 8.7,
      score: 82,
      status: 'active'
    }
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([
        refetchCrypto(),
        refetchTrends(),
        refetchScore()
      ])
      toast.success('Data refreshed successfully!')
    } catch (error) {
      toast.error('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400 bg-green-400/10'
      case 'bearish': return 'text-red-400 bg-red-400/10'
      default: return 'text-yellow-400 bg-yellow-400/10'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />
      case 'bearish': return <TrendingDown className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const totalPortfolioValue = portfolioData.reduce((sum, item) => sum + item.current_value, 0)
  const totalPortfolioChange = portfolioData.reduce((sum, item) => sum + (item.current_value - item.purchase_price), 0)
  const portfolioChangePercentage = totalPortfolioChange / (totalPortfolioValue - totalPortfolioChange) * 100

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Real-time domain investment insights</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Portfolio Value */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Portfolio Value</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalPortfolioValue)}</p>
                <div className="flex items-center mt-1">
                  {portfolioChangePercentage >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${portfolioChangePercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercentage(portfolioChangePercentage)}
                  </span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        {/* ETH Price */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">ETH Price</p>
                <p className="text-2xl font-bold text-white">
                  {cryptoLoading ? '...' : formatCurrency(cryptoPrices?.ETH?.price || 0)}
                </p>
                <div className="flex items-center mt-1">
                  {cryptoPrices?.ETH?.change && cryptoPrices.ETH.change >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                  )}
                  <span className={`text-sm ${cryptoPrices?.ETH?.change && cryptoPrices.ETH.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {cryptoLoading ? '...' : formatPercentage(cryptoPrices?.ETH?.change || 0)}
                  </span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        {/* Active Domains */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Active Domains</p>
                <p className="text-2xl font-bold text-white">{portfolioData.length}</p>
                <p className="text-sm text-gray-400 mt-1">All performing well</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        {/* AI Score */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">AI Score</p>
                <p className="text-2xl font-bold text-white">
                  {scoreLoading ? '...' : `${domainScore?.score || 0}/100`}
                </p>
                <p className="text-sm text-gray-400 mt-1">Current domain</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Overview */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{item.domain}</h3>
                      <Badge className={getSentimentColor(item.change_24h >= 0 ? 'bullish' : 'bearish')}>
                        {item.change_24h >= 0 ? 'bullish' : 'bearish'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-400">
                        Value: {formatCurrency(item.current_value)}
                      </span>
                      <span className="text-sm text-gray-400">
                        Score: {item.score}/100
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center ${item.change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change_24h >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {formatPercentage(item.change_24h)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doma Testnet Status */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Doma Testnet Status
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href="/doma-testnet"
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                >
                  View Details →
                </a>
                <span className="text-purple-300">|</span>
                <a
                  href="/doma-testnet#events"
                  className="text-sm text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Events →
                </a>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {domaLoading || healthLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading status...</p>
                </div>
              ) : (
                <>
                  {/* Network Status */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${domaStatus?.status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
                      <span className="text-white font-medium">Network Status</span>
                    </div>
                    <Badge variant={domaStatus?.status === 'connected' ? 'default' : 'destructive'}>
                      {domaStatus?.status || 'Unknown'}
                    </Badge>
                  </div>

                  {/* Chain Information */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
                    <div>
                      <span className="text-gray-400 text-sm">Chain ID:</span>
                      <span className="ml-2 text-white font-mono">{domaStatus?.chain_id || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Latest Block:</span>
                      <span className="ml-2 text-white font-mono">{domaStatus?.latest_block?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Gas Price:</span>
                      <span className="ml-2 text-white font-mono">{domaStatus?.gas_price_gwei || 'N/A'} Gwei</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Currency:</span>
                      <span className="ml-2 text-white font-mono">{domaStatus?.currency || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Health Status */}
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">Integration Health</span>
                      <Badge variant={domaHealth?.status === 'healthy' ? 'default' : 'destructive'}>
                        {domaHealth?.status || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {domaHealth?.checks && Object.entries(domaHealth.checks).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-400' : 'bg-red-400'}`} />
                          <span className="text-gray-400">{key.replace(/_/g, ' ')}:</span>
                          <span className={value ? 'text-green-400' : 'text-red-400'}>
                            {value ? 'OK' : 'Failed'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Market Trends */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Market Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading trends...</p>
                </div>
              ) : (
                marketTrends?.slice(0, 5).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">.{trend.tld}</h3>
                        <Badge className={getSentimentColor(trend.market_sentiment)}>
                          {getSentimentIcon(trend.market_sentiment)}
                          <span className="ml-1">{trend.market_sentiment}</span>
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {trend.trending_keywords.slice(0, 3).map((keyword, i) => (
                          <span key={i} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center ${trend.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend.price_change_24h >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        {formatPercentage(trend.price_change_24h)}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Vol: {formatCurrency(trend.volume_24h)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domain Analysis Section */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Domain Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Analyze Domain
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    placeholder="Enter domain (e.g., example.eth)"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button
                    onClick={() => refetchScore()}
                    disabled={scoreLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {domainScore && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Overall Score</span>
                    <span className="text-2xl font-bold text-white">{domainScore.score}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Estimated Value</span>
                    <span className="text-lg font-semibold text-green-400">
                      {formatCurrency(domainScore.valuation)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {domainScore.reasoning}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Domain Traits</h3>
              {domainScore && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Length</span>
                    <span className="text-white">{domainScore.traits.length} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">TLD</span>
                    <span className="text-white">.{domainScore.traits.tld}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Keyword Value</span>
                    <span className="text-white">{(domainScore.traits.keyword_value * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rarity</span>
                    <span className="text-white">{(domainScore.traits.rarity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">On-chain Activity</span>
                    <span className="text-white">{(domainScore.traits.on_chain_activity * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
