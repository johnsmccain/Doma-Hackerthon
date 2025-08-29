'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { domainAPI } from '@/lib/api'
import { PortfolioOverview } from './PortfolioOverview'
import { RecommendationsList } from './RecommendationsList'
import { MarketTrends } from './MarketTrends'
import { DomainSearch } from './DomainSearch'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { TradeModal } from '@/components/trade/TradeModal'

interface DashboardProps {
  walletAddress: string
}

export function Dashboard({ walletAddress }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'trends'>('overview')
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean
    action: 'buy' | 'sell'
    domain: string
    price: number
  } | null>(null)

  // Fetch portfolio data
  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio', walletAddress],
    queryFn: () => domainAPI.getPortfolio(walletAddress),
    enabled: !!walletAddress,
  })

  // Fetch recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['recommendations', walletAddress],
    queryFn: () => domainAPI.getRecommendations(walletAddress),
    enabled: !!walletAddress,
  })

  // Fetch market trends
  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['trends'],
    queryFn: () => domainAPI.getTrends(),
  })

  if (portfolioLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your domain portfolio today.
          </p>
        </div>
        <DomainSearch />
      </div>

      {/* Portfolio Overview Card */}
      <PortfolioOverview portfolio={portfolio} />

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'recommendations', label: 'Recommendations' },
            { id: 'trends', label: 'Market Trends' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Portfolio Stats */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Portfolio Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value</span>
                  <span className="font-medium">
                    ${portfolio?.total_value?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Domains</span>
                  <span className="font-medium">{portfolio?.total_domains || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Change</span>
                  <span className={`font-medium ${
                    (portfolio?.performance_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {portfolio?.performance_24h?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {portfolio?.domains?.slice(0, 3).map((domain) => (
                  <div key={domain.domain} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{domain.domain}</span>
                    <span className={`text-xs ${
                      domain.performance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {domain.performance >= 0 ? '+' : ''}{domain.performance.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  className="w-full btn-primary py-2 px-4 rounded"
                  onClick={() => setTradeModal({
                    isOpen: true,
                    action: 'buy',
                    domain: 'example.eth',
                    price: 1000
                  })}
                >
                  Buy Domain
                </button>
                <button 
                  className="w-full btn-secondary py-2 px-4 rounded"
                  onClick={() => setTradeModal({
                    isOpen: true,
                    action: 'sell',
                    domain: 'example.eth',
                    price: 1000
                  })}
                >
                  Sell Domain
                </button>
                <button className="w-full btn-secondary py-2 px-4 rounded">
                  View Portfolio
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsList 
            recommendations={recommendations} 
            isLoading={recommendationsLoading}
            walletAddress={walletAddress}
          />
        )}

        {activeTab === 'trends' && (
          <MarketTrends 
            trends={trends} 
            isLoading={trendsLoading} 
          />
        )}
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
