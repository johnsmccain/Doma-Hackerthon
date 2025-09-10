'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Search, ExternalLink, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { domainAPI, domaAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export function DomainSearch() {
  const [domain, setDomain] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!domain.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    setIsSearching(true)
    setError(null)
    setSearchResult(null)

    try {
      // Search for domain availability and get comprehensive info from Doma Protocol
      const [domainScore, domainInfo, domainPrice, crossChainStatus] = await Promise.all([
        domainAPI.getScore(domain),
        domaAPI.getDomainInfo(domain),
        domaAPI.getDomainPrice(domain),
        domaAPI.getCrossChainStatus(domain)
      ])

      const result = {
        domain: domain,
        score: domainScore,
        info: domainInfo,
        price: domainPrice,
        crossChain: crossChainStatus,
        isAvailable: domainInfo.is_available || domainInfo.status === 'available',
        owner: domainInfo.owner,
        timestamp: new Date().toISOString()
      }

      setSearchResult(result)
      toast.success('Domain search completed!')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search domain'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search domains (e.g., crypto.eth)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Search Results */}
      {searchResult && (
        <div className="mt-4 card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{searchResult.domain}</h3>
            <div className="flex items-center space-x-2">
              {searchResult.isAvailable ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Available</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Taken</span>
                </div>
              )}
            </div>
          </div>

          {/* Domain Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Domain Score</span>
              <span className={`font-semibold ${getScoreColor(searchResult.score.score)}`}>
                {searchResult.score.score}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  searchResult.score.score >= 80 ? 'bg-green-500' :
                  searchResult.score.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${searchResult.score.score}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground">
              {getScoreLabel(searchResult.score.score)} - {searchResult.score.reasoning}
            </p>
          </div>

          {/* Domain Info */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Valuation</span>
              <span className="font-medium">{formatCurrency(searchResult.score.valuation / 100)}</span>
            </div>
            
            {/* Doma Testnet Pricing */}
            {searchResult.price && (
              <div className="space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-xs font-medium text-blue-700 dark:text-blue-300">Doma Testnet Pricing</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price (ETH)</span>
                  <span className="font-medium">{searchResult.price.price_eth || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price (USD)</span>
                  <span className="font-medium">{formatCurrency(searchResult.price.price_usd || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pricing Model</span>
                  <span className="font-medium text-xs">{searchResult.price.pricing_model || 'N/A'}</span>
                </div>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">TLD</span>
              <span className="font-medium">{searchResult.score.traits.tld}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Length</span>
              <span className="font-medium">{searchResult.score.traits.length} chars</span>
            </div>

            {/* Cross-Chain Status */}
            {searchResult.crossChain && (
              <div className="space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-xs font-medium text-green-700 dark:text-green-300">Cross-Chain Status</div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Enabled</span>
                  <span className="font-medium">{searchResult.crossChain.cross_chain_enabled ? 'Yes' : 'No'}</span>
                </div>
                {searchResult.crossChain.supported_chains && (
                  <div className="text-xs text-muted-foreground">
                    Supported: {searchResult.crossChain.supported_chains.map((chain: any) => chain.name).join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            {searchResult.isAvailable ? (
              <Button className="flex-1" size="sm">
                Register Domain
              </Button>
            ) : (
              <Button className="flex-1" size="sm" variant="outline">
                Make Offer
              </Button>
            )}
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}
