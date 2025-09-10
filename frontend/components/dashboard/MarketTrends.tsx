'use client'

import { useState, useEffect } from 'react'
import { MarketTrend } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, Activity, RefreshCw, Globe, Database } from 'lucide-react'
import { domaAPI } from '@/lib/api'
import { DOMA_CONFIG } from '@/lib/doma-config'
import { tldService } from '@/lib/tld-service'

interface MarketTrendsProps {
  trends?: MarketTrend[]
  isLoading: boolean
}

interface DomaMarketData {
  total_domains: number
  total_volume_24h: number
  total_sales_24h: number
  average_price: number
  top_selling_tlds: string[]
  trending_domains: Array<{
    domain: string
    price: number
    volume: number
  }>
  source: string
  timestamp: string
}

export function MarketTrends({ trends, isLoading }: MarketTrendsProps) {
  const [domaMarketData, setDomaMarketData] = useState<DomaMarketData | null>(null)
  const [domaLoading, setDomaLoading] = useState(false)

  useEffect(() => {
    const fetchDomaMarketData = async () => {
      setDomaLoading(true)
      try {
        const data = await domaAPI.getMarketData()
        setDomaMarketData(data)
      } catch (error) {
        console.error('Error fetching Doma market data:', error)
      } finally {
        setDomaLoading(false)
      }
    }

    fetchDomaMarketData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!trends || trends.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No market trends available.</p>
      </div>
    )
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'bearish':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'neutral':
        return <Activity className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'text-green-600 bg-green-50 dark:bg-green-950'
      case 'bearish':
        return 'text-red-600 bg-red-50 dark:bg-red-950'
      case 'neutral':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Market Trends</h3>
        <p className="text-sm text-muted-foreground">
          Top performing TLDs and trending keywords in the last 24 hours.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Trending TLDs */}
        <div className="card p-6">
          <h4 className="font-semibold mb-4">Trending TLDs</h4>
          <div className="space-y-4">
            {trends.slice(0, 5).map((trend) => (
              <div key={trend.tld} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">.{trend.tld}</span>
                  </div>
                  <div>
                    <div className="font-medium">.{trend.tld}</div>
                    <div className="text-sm text-muted-foreground">
                      Vol: {formatCurrency(trend.volume_24h)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-medium ${
                      trend.price_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatPercentage(trend.price_change_24h)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getSentimentIcon(trend.market_sentiment)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Sentiment */}
        <div className="card p-6">
          <h4 className="font-semibold mb-4">Market Sentiment</h4>
          <div className="space-y-4">
            {trends.map((trend) => (
              <div key={trend.tld} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center space-x-2">
                  {getSentimentIcon(trend.market_sentiment)}
                  <span className="font-medium">.{trend.tld}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(
                    trend.market_sentiment
                  )}`}
                >
                  {trend.market_sentiment}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Keywords */}
      <div className="card p-6">
        <h4 className="font-semibold mb-4">Trending Keywords</h4>
        <div className="grid gap-2 md:grid-cols-3">
          {trends.slice(0, 6).map((trend) =>
            trend.trending_keywords.slice(0, 2).map((keyword, index) => (
              <div
                key={`${trend.tld}-${keyword}-${index}`}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20"
              >
                <span className="font-medium">{keyword}</span>
                <span className="text-sm text-muted-foreground">.{trend.tld}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Market Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {trends.filter(t => t.market_sentiment === 'bullish').length}
          </div>
          <div className="text-sm text-muted-foreground">Bullish TLDs</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {trends.filter(t => t.market_sentiment === 'bearish').length}
          </div>
          <div className="text-sm text-muted-foreground">Bearish TLDs</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {trends.filter(t => t.market_sentiment === 'neutral').length}
          </div>
          <div className="text-sm text-muted-foreground">Neutral TLDs</div>
        </div>
      </div>

      {/* TLD Service Information */}
      <div className="card p-6">
        <h4 className="font-semibold mb-4">TLD Service Information</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h5 className="font-medium text-sm text-muted-foreground">Popular TLDs</h5>
            <div className="space-y-2">
              {tldService.getPopularTLDs(5).map((tld) => (
                <div key={tld.tld} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                  <span className="font-medium">.{tld.tld}</span>
                  <span className="text-sm text-muted-foreground">
                    {(tld.popularity * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-medium text-sm text-muted-foreground">High Demand TLDs</h5>
            <div className="space-y-2">
              {tldService.getHighDemandTLDs(5).map((tld) => (
                <div key={tld.tld} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                  <span className="font-medium">.{tld.tld}</span>
                  <span className="text-sm text-muted-foreground">
                    {(tld.market_demand * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Total Supported TLDs: <span className="font-medium text-foreground">{tldService.getAllSupportedTLDs().length}</span>
          </div>
        </div>
      </div>

      {/* Doma Testnet Market Data */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-500" />
            Doma Testnet Market Data
          </h4>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-muted/20 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        {domaLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : domaMarketData ? (
          <div className="space-y-6">
            {/* Market Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {domaMarketData.total_domains?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Total Domains</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(domaMarketData.total_volume_24h || 0)}
                </div>
                <div className="text-sm text-muted-foreground">24h Volume</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {domaMarketData.total_sales_24h || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">24h Sales</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(domaMarketData.average_price || 0)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Price</div>
              </div>
            </div>

            {/* Top Selling TLDs */}
            <div>
              <h5 className="font-medium mb-3">Top Selling TLDs</h5>
              <div className="flex flex-wrap gap-2">
                {domaMarketData.top_selling_tlds?.map((tld, index) => (
                  <span
                    key={tld}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    .{tld}
                  </span>
                ))}
              </div>
            </div>

            {/* Trending Domains */}
            <div>
              <h5 className="font-medium mb-3">Trending Domains</h5>
              <div className="grid gap-3 md:grid-cols-2">
                {domaMarketData.trending_domains?.slice(0, 6).map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{domain.domain}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(domain.price)}</div>
                      <div className="text-sm text-muted-foreground">
                        Vol: {formatCurrency(domain.volume)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Source */}
            <div className="text-xs text-muted-foreground text-center pt-4 border-t">
              Data source: {domaMarketData.source} • Last updated: {new Date(domaMarketData.timestamp).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No Doma testnet data available</p>
          </div>
        )}
      </div>
    </div>
  )
}
