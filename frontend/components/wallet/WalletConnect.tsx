'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Wallet, AlertCircle, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

interface WalletConnectProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.')
      }

      const address = accounts[0]
      
      // Check if we're on the correct network (Ethereum mainnet or testnet)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      
      // For Doma Protocol, we might need a specific network
      // For now, we'll accept mainnet (1) and common testnets
      const supportedNetworks = ['0x1', '0x5', '0xaa36a7', '0x89', '0xa'] // Mainnet, Goerli, Sepolia, Polygon, Optimism
      
      if (!supportedNetworks.includes(chainId)) {
        toast.error('Please switch to a supported network (Ethereum, Polygon, or Optimism)')
        // Optionally, prompt user to switch networks
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }], // Switch to Ethereum mainnet
          })
        } catch (switchError) {
          console.error('Failed to switch network:', switchError)
        }
      }

      // Store the connected address
      localStorage.setItem('walletAddress', address)
      setIsConnected(true)
      onConnect(address)
      
      toast.success('Wallet connected successfully!')
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', handleChainChanged)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    localStorage.removeItem('walletAddress')
    setIsConnected(false)
    onDisconnect()
    
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
    
    toast.success('Wallet disconnected')
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet()
    } else {
      // User switched accounts
      const newAddress = accounts[0]
      localStorage.setItem('walletAddress', newAddress)
      onConnect(newAddress)
      toast.success('Account switched successfully!')
    }
  }

  const handleChainChanged = (chainId: string) => {
    // Reload the page when chain changes
    window.location.reload()
  }

  useEffect(() => {
    // Check if wallet is already connected
    const savedAddress = localStorage.getItem('walletAddress')
    if (savedAddress && window.ethereum) {
      // Verify the account is still connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.includes(savedAddress)) {
            setIsConnected(true)
            onConnect(savedAddress)
          } else {
            localStorage.removeItem('walletAddress')
          }
        })
        .catch(() => {
          localStorage.removeItem('walletAddress')
        })
    }
  }, [onConnect])

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full max-w-sm h-12 text-lg font-semibold"
        >
          <Wallet className="w-5 h-5 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-green-800 dark:text-green-200 font-medium">
                Wallet Connected
              </span>
            </div>
          </div>
          <Button
            onClick={disconnectWallet}
            variant="outline"
            className="w-full max-w-sm"
          >
            Disconnect Wallet
          </Button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-sm">
        <Shield className="w-4 h-4 inline mr-1" />
        Your wallet connection is secure and encrypted
      </div>
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
      isMetaMask?: boolean
    }
  }
}
