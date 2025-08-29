'use client'

import { MarketTrend } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface MarketTrendsProps {
  trends?: MarketTrend[]
  isLoading: boolean
}

export function MarketTrends({ trends, isLoading }: MarketTrendsProps) {
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
    </div>
  )
}
