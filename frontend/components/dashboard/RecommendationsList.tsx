'use client'

import { useState } from 'react'
import { Recommendation } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react'
import { TradeModal } from '@/components/trade/TradeModal'

interface RecommendationsListProps {
  recommendations?: Recommendation[]
  isLoading: boolean
  walletAddress?: string
}

export function RecommendationsList({ recommendations, isLoading, walletAddress }: RecommendationsListProps) {
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean
    action: 'buy' | 'sell'
    domain: string
    price: number
  } | null>(null)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No recommendations available yet.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Complete your profile to get personalized recommendations.
        </p>
      </div>
    )
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'sell':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'hold':
        return <Minus className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'text-green-600 bg-green-50 dark:bg-green-950'
      case 'sell':
        return 'text-red-600 bg-red-50 dark:bg-red-950'
      case 'hold':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
      default:
        return ''
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Recommendations</h3>
        <Button variant="outline" size="sm">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.map((recommendation) => (
          <div key={recommendation.domain} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getActionIcon(recommendation.action)}
                <h4 className="font-semibold">{recommendation.domain}</h4>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${getActionColor(
                  recommendation.action
                )}`}
              >
                {recommendation.action}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-medium">{recommendation.confidence}%</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expected Return</span>
                <span
                  className={`font-medium ${
                    recommendation.expected_return >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatPercentage(recommendation.expected_return)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Risk Level</span>
                <span className={`font-medium capitalize ${getRiskColor(recommendation.risk_level)}`}>
                  {recommendation.risk_level}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price Target</span>
                <span className="font-medium">{formatCurrency(recommendation.price_target)}</span>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </div>

              <div className="flex space-x-2 pt-3">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setTradeModal({
                    isOpen: true,
                    action: recommendation.action as 'buy' | 'sell',
                    domain: recommendation.domain,
                    price: recommendation.price_target / 100 // Convert from cents
                  })}
                  disabled={!walletAddress}
                >
                  {recommendation.action === 'buy' ? 'Buy Now' : 'Execute'}
                </Button>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trade Modal */}
      {tradeModal && walletAddress && (
        <TradeModal
          isOpen={tradeModal.isOpen}
          onClose={() => setTradeModal(null)}
          action={tradeModal.action}
          domain={tradeModal.domain}
          price={tradeModal.price}
          walletAddress={walletAddress}
        />
      )}
    </div>
  )
}
