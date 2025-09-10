'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  ShoppingCart, 
  Tag, 
  DollarSign, 
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { domaAPI } from '@/lib/api'
import { DOMA_CONFIG } from '@/lib/doma-config'

interface OrderbookListing {
  orderId: string
  orderbook: string
  chainId: string
  parameters: any
  signature: string
  status: 'active' | 'cancelled' | 'fulfilled'
  createdAt: string
}

interface OrderbookOffer {
  orderId: string
  orderbook: string
  chainId: string
  parameters: any
  signature: string
  status: 'active' | 'cancelled' | 'fulfilled'
  createdAt: string
}

export function OrderbookManager() {
  const [activeTab, setActiveTab] = useState<'listings' | 'offers' | 'create' | 'buy'>('listings')
  const [listings, setListings] = useState<OrderbookListing[]>([])
  const [offers, setOffers] = useState<OrderbookOffer[]>([])
  const [selectedOrderbook, setSelectedOrderbook] = useState('DOMA')
  const [selectedChainId, setSelectedChainId] = useState('97476:0x1')
  const [contractAddress, setContractAddress] = useState('')
  const [fees, setFees] = useState<any>(null)
  const [currencies, setCurrencies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    setListings([
      {
        orderId: '0x1234567890abcdef',
        orderbook: 'DOMA',
        chainId: '97476:0x1',
        parameters: {
          offerer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          offer: [{ itemType: 2, token: '0x1234', identifierOrCriteria: '1', startAmount: '1', endAmount: '1' }],
          consideration: [{ itemType: 0, token: '0x0000000000000000000000000000000000000000', identifierOrCriteria: '0', startAmount: '1000000000000000000', endAmount: '1000000000000000000', recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' }],
          startTime: Math.floor(Date.now() / 1000).toString(),
          endTime: (Math.floor(Date.now() / 1000) + 86400).toString(),
          orderType: 0
        },
        signature: '0x...',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ])

    setOffers([
      {
        orderId: '0xfedcba0987654321',
        orderbook: 'OPENSEA',
        chainId: '97476:0x1',
        parameters: {
          offerer: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          offer: [{ itemType: 0, token: '0x0000000000000000000000000000000000000000', identifierOrCriteria: '0', startAmount: '800000000000000000', endAmount: '800000000000000000' }],
          consideration: [{ itemType: 2, token: '0x1234', identifierOrCriteria: '1', startAmount: '1', endAmount: '1', recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6' }],
          startTime: Math.floor(Date.now() / 1000).toString(),
          endTime: (Math.floor(Date.now() / 1000) + 86400).toString(),
          orderType: 0
        },
        signature: '0x...',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ])
  }, [])

  const getOrderTypeLabel = (orderType: number) => {
    return DOMA_CONFIG.ORDERBOOK.ORDER_TYPE_LABELS[orderType as keyof typeof DOMA_CONFIG.ORDERBOOK.ORDER_TYPE_LABELS] || 'Unknown'
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default' as const
      case 'cancelled': return 'destructive' as const
      case 'fulfilled': return 'secondary' as const
      default: return 'outline' as const
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Orderbook Manager
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Manage Doma Protocol marketplace listings and offers
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'listings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('listings')}
              className="flex-1"
            >
              <Tag className="w-4 h-4 mr-2" />
              Listings ({listings.length})
            </Button>
            <Button
              variant={activeTab === 'offers' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('offers')}
              className="flex-1"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Offers ({offers.length})
            </Button>
            <Button
              variant={activeTab === 'buy' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('buy')}
              className="flex-1"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Domains
            </Button>
            <Button
              variant={activeTab === 'create' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('create')}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {activeTab === 'listings' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Listings</span>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedOrderbook}
                  onChange={(e) => setSelectedOrderbook(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  {DOMA_CONFIG.ORDERBOOK.SUPPORTED_ORDERBOOKS.map(orderbook => (
                    <option key={orderbook} value={orderbook}>{orderbook}</option>
                  ))}
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {listings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active listings found.
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.orderId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusBadgeVariant(listing.status)}>
                          {listing.status}
                        </Badge>
                        <Badge variant="outline">
                          {listing.orderbook}
                        </Badge>
                        <Badge variant="secondary">
                          {getOrderTypeLabel(listing.parameters.orderType)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Order ID:</span>
                        <div className="font-mono text-xs break-all mt-1">
                          {listing.orderId}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Chain:</span>
                        <div className="font-mono text-xs mt-1">{listing.chainId}</div>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>
                        <div className="text-xs mt-1">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'offers' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Offers</span>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedOrderbook}
                  onChange={(e) => setSelectedOrderbook(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  {DOMA_CONFIG.ORDERBOOK.SUPPORTED_ORDERBOOKS.map(orderbook => (
                    <option key={orderbook} value={orderbook}>{orderbook}</option>
                  ))}
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {offers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No active offers found.
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.orderId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge variant={getStatusBadgeVariant(offer.status)}>
                          {offer.status}
                        </Badge>
                        <Badge variant="outline">
                          {offer.orderbook}
                        </Badge>
                        <Badge variant="secondary">
                          {getOrderTypeLabel(offer.parameters.orderType)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Order ID:</span>
                        <div className="font-mono text-xs break-all mt-1">
                          {offer.orderId}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Chain:</span>
                        <div className="font-mono text-xs mt-1">{offer.chainId}</div>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>
                        <div className="text-xs mt-1">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'buy' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Buy Domains</span>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedOrderbook}
                  onChange={(e) => setSelectedOrderbook(e.target.value)}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  {DOMA_CONFIG.ORDERBOOK.SUPPORTED_ORDERBOOKS.map(orderbook => (
                    <option key={orderbook} value={orderbook}>{orderbook}</option>
                  ))}
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listings.map((listing) => (
                <div key={listing.orderId} className="p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        {listing.orderbook}
                      </Badge>
                      <Badge variant="secondary">
                        {getOrderTypeLabel(listing.parameters.orderType)}
                      </Badge>
                      <span className="text-lg font-semibold">
                        {listing.parameters.consideration?.[0]?.startAmount ? 
                          `${(parseInt(listing.parameters.consideration[0].startAmount) / 1e18).toFixed(4)} ETH` : 
                          'Price TBD'
                        }
                      </span>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => {
                        // Handle purchase logic here
                        console.log('Purchasing domain with order:', listing.orderId)
                      }}
                    >
                      Buy Now
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Domain:</span>
                      <div className="font-mono text-xs mt-1">
                        {listing.parameters.offer?.[0]?.identifierOrCriteria || 'Unknown Domain'}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Seller:</span>
                      <div className="font-mono text-xs mt-1">
                        {listing.parameters.offerer}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Listing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Create Listing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Orderbook</label>
                <select
                  value={selectedOrderbook}
                  onChange={(e) => setSelectedOrderbook(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                >
                  {DOMA_CONFIG.ORDERBOOK.SUPPORTED_ORDERBOOKS.map(orderbook => (
                    <option key={orderbook} value={orderbook}>{orderbook}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Chain ID</label>
                <input
                  type="text"
                  value={selectedChainId}
                  onChange={(e) => setSelectedChainId(e.target.value)}
                  placeholder="97476:0x1"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Contract Address</label>
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={async () => {
                    if (!contractAddress) return
                    try {
                      setLoading(true)
                      setError(null)
                      const response = await domaAPI.getOrderbookFees(selectedOrderbook, selectedChainId, contractAddress)
                      setFees(response.marketplaceFees)
                    } catch (err: any) {
                      setError(err.message || 'Failed to fetch fees')
                    } finally {
                      setLoading(false)
                    }
                  }} 
                  disabled={loading || !contractAddress}
                >
                  Get Fees
                </Button>
                <Button 
                  onClick={async () => {
                    if (!contractAddress) return
                    try {
                      setLoading(true)
                      setError(null)
                      const response = await domaAPI.getSupportedCurrencies(selectedChainId, contractAddress, selectedOrderbook)
                      setCurrencies(response.currencies)
                    } catch (err: any) {
                      setError(err.message || 'Failed to fetch currencies')
                    } finally {
                      setLoading(false)
                    }
                  }} 
                  disabled={loading || !contractAddress}
                >
                  Get Currencies
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fees & Currencies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-4 mr-2" />
                Fees & Currencies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {fees && (
                <div>
                  <div className="text-sm font-medium mb-2">Marketplace Fees</div>
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    {JSON.stringify(fees, null, 2)}
                  </pre>
                </div>
              )}
              
              {currencies.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">Supported Currencies</div>
                  <div className="space-y-2">
                    {currencies.map((currency, index) => (
                      <div key={index} className="text-sm p-2 bg-muted rounded">
                        {JSON.stringify(currency)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {!fees && !currencies.length && (
                <div className="text-center py-8 text-muted-foreground">
                  Select an orderbook and contract address, then fetch fees and currencies.
                </div>
              )}
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
