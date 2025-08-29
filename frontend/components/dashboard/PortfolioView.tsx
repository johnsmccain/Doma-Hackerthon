'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { domainAPI, Portfolio } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Activity } from 'lucide-react'

// Simple Card components since the UI library components might not exist
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card border border-border rounded-lg ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 pb-0">
    {children}
  </div>
)

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 pt-0">
    {children}
  </div>
)

const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border bg-background'
  }
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

interface PortfolioViewProps {
  walletAddress: string
}

export function PortfolioView({ walletAddress }: PortfolioViewProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)

  // Fetch portfolio data
  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: ['portfolio', walletAddress],
    queryFn: () => domainAPI.getPortfolio(walletAddress),
    enabled: !!walletAddress,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load portfolio data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!portfolio || portfolio.domains.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No domains found</h3>
          <p className="text-muted-foreground mb-4">
            You don't have any domains in your portfolio yet.
          </p>
          <Button onClick={() => window.location.href = '/recommendations'}>
            Browse Recommendations
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatCurrency(portfolio.total_value)}</p>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{portfolio.total_domains}</p>
              <p className="text-sm text-muted-foreground">Total Domains</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {portfolio.performance_24h > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <p className={`text-2xl font-bold ${
                  portfolio.performance_24h > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(portfolio.performance_24h)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">24h Change</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">7 Day Performance</span>
            </div>
            <p className={`text-lg font-bold mt-1 ${
              portfolio.performance_7d > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(portfolio.performance_7d)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">30 Day Performance</span>
            </div>
            <p className={`text-lg font-bold mt-1 ${
              portfolio.performance_30d > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatPercentage(portfolio.performance_30d)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Average Return</span>
            </div>
            <p className="text-lg font-bold mt-1 text-green-600">
              {formatPercentage(
                portfolio.domains.reduce((acc, domain) => acc + domain.performance, 0) / 
                portfolio.domains.length
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Domain List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio.domains.map((domain) => (
              <div
                key={domain.domain}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDomain === domain.domain
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedDomain(
                  selectedDomain === domain.domain ? null : domain.domain
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{domain.domain}</h3>
                      <Badge variant={domain.status === 'active' ? 'default' : 'secondary'}>
                        {domain.status}
                      </Badge>
                      <Badge variant="outline">
                        Score: {domain.score}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Purchase Price</p>
                        <p className="font-medium">{formatCurrency(domain.purchase_price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Value</p>
                        <p className="font-medium">{formatCurrency(domain.current_value)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Performance</p>
                        <div className="flex items-center gap-1">
                          {domain.performance > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <p className={`font-medium ${
                            domain.performance > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatPercentage(domain.performance)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedDomain === domain.domain && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Purchase Date</p>
                            <p className="font-medium">
                              {new Date(domain.purchase_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Profit/Loss</p>
                            <p className={`font-medium ${
                              domain.current_value > domain.purchase_price 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {formatCurrency(domain.current_value - domain.purchase_price)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Trade
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
