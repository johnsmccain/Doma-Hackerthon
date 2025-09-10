'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Scissors, 
  DollarSign, 
  RefreshCw, 
  Plus,
  Eye,
  Calculator,
  TrendingUp,
  Info
} from 'lucide-react'
import { domaAPI } from '@/lib/api'
import { DOMA_CONFIG } from '@/lib/doma-config'

interface FractionalizedDomain {
  tokenId: string
  domainName: string
  fractionalTokenAddress: string
  fractionalTokenInfo: {
    name: string
    symbol: string
  }
  minimumBuyoutPrice: number
  currentBuyoutPrice: number
  totalSupply: number
  tokenizationVersion: number
  status: 'fractionalized' | 'bought_out' | 'redeemable'
  owner: string
}

export function FractionalizationManager() {
  const [activeTab, setActiveTab] = useState<'fractionalize' | 'buyout' | 'exchange' | 'info'>('fractionalize')
  const [fractionalizedDomains, setFractionalizedDomains] = useState<FractionalizedDomain[]>([])
  const [selectedTokenId, setSelectedTokenId] = useState('')
  const [fractionalTokenName, setFractionalTokenName] = useState('')
  const [fractionalTokenSymbol, setFractionalTokenSymbol] = useState('')
  const [minimumBuyoutPrice, setMinimumBuyoutPrice] = useState('')
  const [exchangeAmount, setExchangeAmount] = useState('')
  const [buyoutPrice, setBuyoutPrice] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    setFractionalizedDomains([
      {
        tokenId: '1',
        domainName: 'crypto.eth',
        fractionalTokenAddress: '0x1234567890abcdef',
        fractionalTokenInfo: {
          name: 'Crypto Domain Fractional Token',
          symbol: 'CRYPTO'
        },
        minimumBuyoutPrice: 10000, // 10,000 USDC
        currentBuyoutPrice: 12500, // 12,500 USDC
        totalSupply: 1000000, // 1M tokens
        tokenizationVersion: 1,
        status: 'fractionalized',
        owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
      },
      {
        tokenId: '2',
        domainName: 'defi.dao',
        fractionalTokenAddress: '0xfedcba0987654321',
        fractionalTokenInfo: {
          name: 'DeFi Domain Fractional Token',
          symbol: 'DEFI'
        },
        minimumBuyoutPrice: 15000, // 15,000 USDC
        currentBuyoutPrice: 18000, // 18,000 USDC
        totalSupply: 2000000, // 2M tokens
        tokenizationVersion: 1,
        status: 'fractionalized',
        owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
      }
    ])
  }, [])

  const handleFractionalize = async () => {
    if (!selectedTokenId || !fractionalTokenName || !fractionalTokenSymbol || !minimumBuyoutPrice) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await domaAPI.fractionalizeDomain({
        tokenId: selectedTokenId,
        fractionalTokenInfo: {
          name: fractionalTokenName,
          symbol: fractionalTokenSymbol
        },
        minimumBuyoutPrice: parseFloat(minimumBuyoutPrice)
      })

      console.log('Domain fractionalized:', response)
      // Reset form
      setSelectedTokenId('')
      setFractionalTokenName('')
      setFractionalTokenSymbol('')
      setMinimumBuyoutPrice('')
      
    } catch (err: any) {
      setError(err.message || 'Failed to fractionalize domain')
    } finally {
      setLoading(false)
    }
  }

  const handleBuyout = async (tokenId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await domaAPI.buyoutDomain(tokenId)
      console.log('Domain bought out:', response)
      
      // Update local state
      setFractionalizedDomains(prev => 
        prev.map(domain => 
          domain.tokenId === tokenId 
            ? { ...domain, status: 'bought_out' as const }
            : domain
        )
      )
      
    } catch (err: any) {
      setError(err.message || 'Failed to buyout domain')
    } finally {
      setLoading(false)
    }
  }

  const handleExchange = async (fractionalToken: string, amount: number) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await domaAPI.exchangeFractionalToken({
        fractionalToken,
        amount
      })
      
      console.log('Fractional tokens exchanged:', response)
      
    } catch (err: any) {
      setError(err.message || 'Failed to exchange fractional tokens')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'fractionalized': return 'default' as const
      case 'bought_out': return 'destructive' as const
      case 'redeemable': return 'secondary' as const
      default: return 'outline' as const
    }
  }

  const calculateTokenPrice = (buyoutPrice: number, totalSupply: number) => {
    return buyoutPrice / totalSupply
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scissors className="w-5 h-5 mr-2" />
            Domain Fractionalization Manager
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Convert domain NFTs into fungible tokens, buy out domains, and exchange fractional tokens
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'fractionalize' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('fractionalize')}
              className="flex-1"
            >
              <Scissors className="w-4 h-4 mr-2" />
              Fractionalize
            </Button>
            <Button
              variant={activeTab === 'buyout' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('buyout')}
              className="flex-1"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Buy Out
            </Button>
            <Button
              variant={activeTab === 'exchange' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('exchange')}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Exchange
            </Button>
            <Button
              variant={activeTab === 'info' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('info')}
              className="flex-1"
            >
              <Info className="w-4 h-4 mr-2" />
              Info
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === 'fractionalize' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scissors className="w-5 h-5 mr-2" />
              Fractionalize Domain NFT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Domain Token ID</label>
                <input
                  type="text"
                  value={selectedTokenId}
                  onChange={(e) => setSelectedTokenId(e.target.value)}
                  placeholder="Enter token ID"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Minimum Buyout Price (USDC)</label>
                <input
                  type="number"
                  value={minimumBuyoutPrice}
                  onChange={(e) => setMinimumBuyoutPrice(e.target.value)}
                  placeholder="10000"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Fractional Token Name</label>
                <input
                  type="text"
                  value={fractionalTokenName}
                  onChange={(e) => setFractionalTokenName(e.target.value)}
                  placeholder="Domain Fractional Token"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Fractional Token Symbol</label>
                <input
                  type="text"
                  value={fractionalTokenSymbol}
                  onChange={(e) => setFractionalTokenSymbol(e.target.value)}
                  placeholder="DOMAIN"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleFractionalize}
              disabled={loading || !selectedTokenId || !fractionalTokenName || !fractionalTokenSymbol || !minimumBuyoutPrice}
              className="w-full"
            >
              {loading ? 'Fractionalizing...' : 'Fractionalize Domain'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'buyout' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Buy Out Fractionalized Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fractionalizedDomains.filter(domain => domain.status === 'fractionalized').map((domain) => (
                <div key={domain.tokenId} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusBadgeVariant(domain.status)}>
                        {domain.status}
                      </Badge>
                      <span className="text-lg font-semibold">{domain.domainName}</span>
                      <Badge variant="outline">
                        {domain.fractionalTokenInfo.symbol}
                      </Badge>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleBuyout(domain.tokenId)}
                      disabled={loading}
                    >
                      Buy Out
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Current Buyout Price:</span>
                      <div className="text-lg font-semibold text-green-600">
                        ${domain.currentBuyoutPrice.toLocaleString()} USDC
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Minimum Price:</span>
                      <div className="text-sm">
                        ${domain.minimumBuyoutPrice.toLocaleString()} USDC
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Total Supply:</span>
                      <div className="text-sm">
                        {domain.totalSupply.toLocaleString()} tokens
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'exchange' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Exchange Fractional Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fractionalizedDomains.filter(domain => domain.status === 'bought_out').map((domain) => (
                <div key={domain.tokenId} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant={getStatusBadgeVariant(domain.status)}>
                        {domain.status}
                      </Badge>
                      <span className="text-lg font-semibold">{domain.domainName}</span>
                      <Badge variant="outline">
                        {domain.fractionalTokenInfo.symbol}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium">Buyout Price:</span>
                      <div className="text-lg font-semibold text-green-600">
                        ${domain.currentBuyoutPrice.toLocaleString()} USDC
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Token Price:</span>
                      <div className="text-lg font-semibold text-blue-600">
                        ${calculateTokenPrice(domain.currentBuyoutPrice, domain.totalSupply).toFixed(6)} USDC
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={exchangeAmount}
                      onChange={(e) => setExchangeAmount(e.target.value)}
                      placeholder="Amount of tokens to exchange"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button 
                      onClick={() => handleExchange(domain.fractionalTokenAddress, parseFloat(exchangeAmount))}
                      disabled={loading || !exchangeAmount}
                    >
                      Exchange for USDC
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buyout Formula */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Buyout Price Formula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    {DOMA_CONFIG.FRACTIONALIZATION.BUYOUT_FORMULA.DESCRIPTION}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>MBP:</strong> {DOMA_CONFIG.FRACTIONALIZATION.BUYOUT_FORMULA.MBP}</div>
                  <div><strong>FDMC:</strong> {DOMA_CONFIG.FRACTIONALIZATION.BUYOUT_FORMULA.FDMC}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Redemption Formula */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Token Redemption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200">
                    {DOMA_CONFIG.FRACTIONALIZATION.REDEMPTION_FORMULA.DESCRIPTION}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {DOMA_CONFIG.FRACTIONALIZATION.REDEMPTION_FORMULA.EXPLANATION}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
