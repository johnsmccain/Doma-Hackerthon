'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Activity, 
  RefreshCw, 
  Globe, 
  Database, 
  Network, 
  Shield,
  Clock,
  Zap
} from 'lucide-react'
import { domaAPI } from '@/lib/api'
import { DOMA_CONFIG } from '@/lib/doma-config'

interface NetworkStatus {
  status: string
  network: string
  chain_id: number
  latest_block: number
  gas_price: string
  gas_price_gwei: string
  timestamp: string
}

interface HealthStatus {
  status: string
  checks: {
    rpc_connection: boolean
    api_endpoint: boolean
    subgraph_endpoint: boolean
    bridge_endpoint: boolean
  }
  timestamp: string
  version: string
  network: string
}

export function DomaNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null)
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStatus = async () => {
    setIsLoading(true)
    try {
      const [network, health] = await Promise.all([
        domaAPI.getNetworkStatus(),
        domaAPI.getHealthStatus()
      ])
      setNetworkStatus(network)
      setHealthStatus(health)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching Doma status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'healthy':
        return 'bg-green-500'
      case 'degraded':
        return 'bg-yellow-500'
      case 'disconnected':
      case 'unhealthy':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'connected':
      case 'healthy':
        return 'default'
      case 'degraded':
        return 'secondary'
      case 'disconnected':
      case 'unhealthy':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Globe className="w-6 h-6 mr-2 text-blue-500" />
            Doma Testnet Status
          </h2>
          <p className="text-muted-foreground">
            Real-time network status and health monitoring for the Doma Protocol testnet
          </p>
        </div>
        <Button
          onClick={fetchStatus}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Network Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Status</CardTitle>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(networkStatus?.status || 'unknown')}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkStatus?.status ? networkStatus.status.charAt(0).toUpperCase() + networkStatus.status.slice(1) : 'Unknown'}
            </div>
            <p className="text-xs text-muted-foreground">
              {networkStatus?.network || 'Doma Testnet'}
            </p>
          </CardContent>
        </Card>

        {/* Chain ID */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chain ID</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">
              {networkStatus?.chain_id || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {DOMA_CONFIG.TESTNET.NAME}
            </p>
          </CardContent>
        </Card>

        {/* Latest Block */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Block</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkStatus?.latest_block ? networkStatus.latest_block.toLocaleString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current block height
            </p>
          </CardContent>
        </Card>

        {/* Gas Price */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Price</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {networkStatus?.gas_price_gwei || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Gwei
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Network Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {networkStatus ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant={getStatusVariant(networkStatus.status)} className="ml-2">
                      {networkStatus.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Network:</span>
                    <span className="ml-2 font-medium">{networkStatus.network}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Chain ID:</span>
                    <span className="ml-2 font-mono">{networkStatus.chain_id}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Currency:</span>
                    <span className="ml-2 font-medium">{DOMA_CONFIG.TESTNET.CURRENCY}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Connection Info</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Latest Block:</span>
                      <span className="font-mono text-sm">{networkStatus.latest_block?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gas Price:</span>
                      <span className="font-mono text-sm">{networkStatus.gas_price_gwei} Gwei</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Updated:</span>
                      <span className="text-sm">{new Date(networkStatus.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No network data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Integration Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthStatus ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Status:</span>
                  <Badge variant={getStatusVariant(healthStatus.status)}>
                    {healthStatus.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground mb-2">Service Checks</div>
                  {Object.entries(healthStatus.checks).map(([service, status]) => (
                    <div key={service} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm font-medium capitalize">
                          {service.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <Badge variant={status ? 'default' : 'destructive'}>
                        {status ? 'OK' : 'Failed'}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">System Info</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Version:</span>
                      <span className="text-sm font-medium">{healthStatus.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Network:</span>
                      <span className="text-sm font-medium">{healthStatus.network}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Check:</span>
                      <span className="text-sm">{new Date(healthStatus.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No health data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Contract Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(DOMA_CONFIG.CONTRACTS.TESTNET).map(([contractName, contract]) => (
              <div key={contractName} className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-lg font-semibold capitalize mb-1">
                      {contractName.replace(/_/g, ' ')}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {contract.type}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {contract.description}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant="outline">
                      {contract.features.length} Features
                    </Badge>
                    {/* {contract.functions && (
                      <Badge variant="secondary">
                        {contract.functions.total} Functions
                      </Badge>
                    )} */}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-1">Contract Address</div>
                  <div className="font-mono text-sm break-all bg-background p-2 rounded border">
                    {contract.address}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {contract.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Function Categories */}
                {/* {contract.functions && contract.functions.categories && (
                  <div className="mt-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Function Categories
                    </div>
                    <div className="space-y-2">
                      {Object.entries(contract.functions.categories).map(([category, functions]) => (
                        <div key={category} className="bg-muted/10 p-3 rounded-lg">
                          <div className="text-sm font-medium text-foreground mb-2">
                            {category}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {functions.map((func, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-mono"
                              >
                                {func}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-center text-sm text-muted-foreground">
          <Clock className="w-4 h-4 inline mr-1" />
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  )
}
