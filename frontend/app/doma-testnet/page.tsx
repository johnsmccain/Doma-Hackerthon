'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { DomaNetworkStatus } from '@/components/dashboard/DomaNetworkStatus'
import { ContractInteractions } from '@/components/dashboard/ContractInteractions'
import { EventsMonitor } from '@/components/dashboard/EventsMonitor'
import { OrderbookManager } from '@/components/dashboard/OrderbookManager'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Globe, 
  ExternalLink, 
  Network, 
  Shield, 
  Database,
  Info,
  AlertCircle
} from 'lucide-react'
import { DOMA_CONFIG } from '@/lib/doma-config'

function DomaTestnetPageContent() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if wallet is connected from URL params or localStorage
    const address = searchParams.get('address') || localStorage.getItem('walletAddress')
    if (address) {
      setWalletAddress(address)
      setIsConnected(true)
    }
  }, [searchParams])

  const handleWalletDisconnect = () => {
    setWalletAddress('')
    setIsConnected(false)
    localStorage.removeItem('walletAddress')
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Doma Testnet Access Required
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
              Please connect your wallet to view Doma testnet information and network status.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header walletAddress={walletAddress} onDisconnect={handleWalletDisconnect} />
          <main className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Globe className="w-8 h-8 mr-3 text-blue-500" />
                Doma Testnet
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time network status, contract information, and testnet integration
              </p>
            </div>

            {/* Testnet Overview */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Testnet Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {DOMA_CONFIG.TESTNET.CHAIN_ID}
                      </div>
                      <div className="text-sm text-muted-foreground">Chain ID</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {DOMA_CONFIG.TESTNET.CURRENCY}
                      </div>
                      <div className="text-sm text-muted-foreground">Currency</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Object.keys(DOMA_CONFIG.CONTRACTS.TESTNET).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Contracts</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {DOMA_CONFIG.SUPPORTED_NETWORKS[DOMA_CONFIG.TESTNET.CHAIN_ID]?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-muted-foreground">Network</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Quick Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <a
                      href={DOMA_CONFIG.TESTNET.BRIDGE}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Network className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-medium">Bridge</div>
                          <div className="text-sm text-muted-foreground">Cross-chain transfers</div>
                        </div>
                      </div>
                    </a>
                    
                    <a
                      href={DOMA_CONFIG.TESTNET.EXPLORER}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">Explorer</div>
                          <div className="text-sm text-muted-foreground">Block explorer</div>
                        </div>
                      </div>
                    </a>
                    
                    <a
                      href={DOMA_CONFIG.TESTNET.API}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 border rounded-lg hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <div>
                          <div className="font-medium">API</div>
                          <div className="text-sm text-muted-foreground">Developer API</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Network Status Component */}
            <DomaNetworkStatus />
            
            {/* Contract Interactions */}
            <div className="mt-8">
              <ContractInteractions 
                contractName="PROXY_DOMA_RECORD"
                contract={DOMA_CONFIG.CONTRACTS.TESTNET.PROXY_DOMA_RECORD}
              />
            </div>
            
            {/* Events Monitor */}
            <div id="events" className="mt-8">
              <EventsMonitor />
            </div>
            
            {/* Orderbook Manager */}
            <div id="orderbook" className="mt-8">
              <OrderbookManager />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function DomaTestnetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <DomaTestnetPageContent />
    </Suspense>
  )
}
