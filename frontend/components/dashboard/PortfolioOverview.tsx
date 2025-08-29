'use client'

import { Portfolio } from '@/lib/api'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Globe } from 'lucide-react'

interface PortfolioOverviewProps {
  portfolio?: Portfolio
}

export function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  const totalValue = portfolio?.total_value || 0
  const performance24h = portfolio?.performance_24h || 0
  const totalDomains = portfolio?.total_domains || 0

  const stats = [
    {
      title: 'Total Value',
      value: formatCurrency(totalValue),
      change: performance24h,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Domains',
      value: totalDomains.toString(),
      change: 0,
      icon: Globe,
      color: 'text-blue-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.title} className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </div>
          {stat.change !== 0 && (
            <div className="flex items-center mt-2">
              {stat.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  stat.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatPercentage(stat.change)}
              </span>
              <span className="text-sm text-muted-foreground ml-1">from yesterday</span>
            </div>
          )}
        </div>
      ))}

      {/* Performance Chart Placeholder */}
      <div className="card p-6 md:col-span-2 lg:col-span-4">
        <h3 className="font-semibold mb-4">Portfolio Performance</h3>
        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">Performance chart coming soon</p>
        </div>
      </div>
    </div>
  )
}
