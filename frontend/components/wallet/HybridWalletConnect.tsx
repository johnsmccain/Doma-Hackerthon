'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Wallet, Shield, Sparkles, CheckCircle, AlertCircle, Download, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface HybridWalletConnectProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export function HybridWalletConnect({ onConnect, onDisconnect }: HybridWalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [hasMetaMask, setHasMetaMask] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [useRainbowKit, setUseRainbowKit] = useState(true)
  const [rainbowKitReady, setRainbowKitReady] = useState(false)

  useEffect(() => {
    // Check if MetaMask is available
    const checkMetaMask = () => {
      const hasEthereum = typeof window !== 'undefined' && window.ethereum
      setHasMetaMask(!!hasEthereum)
      console.log('MetaMask available:', hasEthereum)
    }
    
    checkMetaMask()
  }, [])

  useEffect(() => {
    // Check if RainbowKit is working
    const checkRainbowKit = () => {
      const connectButton = document.querySelector('[data-testid="connect-button"]')
      if (connectButton) {
        setRainbowKitReady(true)
        console.log('RainbowKit ConnectButton found')
      } else {
        console.log('RainbowKit ConnectButton not found, will use fallback')
        setTimeout(() => {
          const connectButton = document.querySelector('[data-testid="connect-button"]')
          if (!connectButton) {
            setUseRainbowKit(false)
            console.log('Switching to fallback wallet connection')
          }
        }, 3000) // Wait 3 seconds before giving up on RainbowKit
      }
    }
    
    if (useRainbowKit) {
      setTimeout(checkRainbowKit, 1000)
    }
  }, [useRainbowKit])

  const connectWallet = async () => {
    console.log('Attempting to connect wallet...')
    setIsConnecting(true)
    setError(null)

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.')
      }

      console.log('MetaMask found, requesting accounts...')

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      console.log('Accounts received:', accounts)

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please connect your wallet.')
      }

      const address = accounts[0]
      console.log('Selected address:', address)
      
      // Store the connected address
      localStorage.setItem('walletAddress', address)
      setWalletAddress(address)
      setIsConnected(true)
      onConnect(address)
      
      toast.success('Wallet connected successfully!')
      console.log('Wallet connected successfully')
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', handleChainChanged)

    } catch (err) {
      console.error('Wallet connection error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsConnecting(false)
    }
  }

  const connectDemoMode = () => {
    console.log('Activating demo mode...')
    const demoAddress = '0x1234567890abcdef1234567890abcdef12345678'
    localStorage.setItem('walletAddress', demoAddress)
    localStorage.setItem('demoMode', 'true')
    setWalletAddress(demoAddress)
    setIsConnected(true)
    setIsDemoMode(true)
    onConnect(demoAddress)
    toast.success('Demo mode activated! You can explore the platform without a real wallet.')
    console.log('Demo mode activated')
  }

  const disconnectWallet = () => {
    console.log('Disconnecting wallet...')
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('demoMode')
    setWalletAddress('')
    setIsConnected(false)
    setIsDemoMode(false)
    onDisconnect()
    
    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
    
    toast.success('Wallet disconnected')
    console.log('Wallet disconnected')
  }

  const handleAccountsChanged = (accounts: string[]) => {
    console.log('Accounts changed:', accounts)
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet()
    } else {
      // User switched accounts
      const newAddress = accounts[0]
      localStorage.setItem('walletAddress', newAddress)
      setWalletAddress(newAddress)
      onConnect(newAddress)
      toast.success('Account switched successfully!')
    }
  }

  const handleChainChanged = (chainId: string) => {
    console.log('Chain changed:', chainId)
    // Reload the page when chain changes
    window.location.reload()
  }

  const installMetaMask = () => {
    console.log('Opening MetaMask download page...')
    window.open('https://metamask.io/download/', '_blank')
  }

  useEffect(() => {
    // Check if wallet is already connected
    const savedAddress = localStorage.getItem('walletAddress')
    const demoMode = localStorage.getItem('demoMode')
    
    console.log('Checking saved wallet state:', { savedAddress, demoMode })
    
    if (savedAddress) {
      if (demoMode === 'true') {
        console.log('Restoring demo mode...')
        setWalletAddress(savedAddress)
        setIsConnected(true)
        setIsDemoMode(true)
        onConnect(savedAddress)
      } else if (window.ethereum) {
        // Verify the account is still connected
        window.ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            console.log('Current accounts:', accounts)
            if (accounts.includes(savedAddress)) {
              console.log('Restoring wallet connection...')
              setWalletAddress(savedAddress)
              setIsConnected(true)
              onConnect(savedAddress)
            } else {
              console.log('Saved address not found in current accounts')
              localStorage.removeItem('walletAddress')
            }
          })
          .catch((err) => {
            console.error('Error checking accounts:', err)
            localStorage.removeItem('walletAddress')
          })
      }
    }
  }, [onConnect])

  if (isConnected && walletAddress) {
    return (
      <div className="space-y-4">
        <div className={`backdrop-blur-sm border rounded-xl p-4 ${
          isDemoMode 
            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30' 
            : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              isDemoMode ? 'bg-yellow-400' : 'bg-green-400'
            }`}></div>
            <CheckCircle className={`w-5 h-5 ${
              isDemoMode ? 'text-yellow-400' : 'text-green-400'
            }`} />
            <span className={`font-medium ${
              isDemoMode ? 'text-yellow-300' : 'text-green-300'
            }`}>
              {isDemoMode ? 'Demo Mode Active' : 'Wallet Connected Successfully'}
            </span>
          </div>
          <p className={`text-sm mt-2 ${
            isDemoMode ? 'text-yellow-200' : 'text-green-200'
          }`}>
            Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </p>
          {isDemoMode && (
            <p className="text-yellow-200 text-sm mt-2">
              You're in demo mode. Install MetaMask for real transactions.
            </p>
          )}
        </div>
        
        <Button
          onClick={disconnectWallet}
          variant="outline"
          className="w-full max-w-sm h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
        >
          {isDemoMode ? 'Exit Demo Mode' : 'Disconnect Wallet'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {useRainbowKit && !rainbowKitReady && (
          <div className="text-center">
            <div className="text-gray-400 text-sm mb-2">Loading RainbowKit...</div>
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {!useRainbowKit && hasMetaMask && (
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="relative w-full max-w-sm h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            {isConnecting ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Wallet className="w-6 h-6" />
                  <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                </div>
                <span>Connect MetaMask</span>
              </div>
            )}
          </Button>
        )}

        {!useRainbowKit && !hasMetaMask && (
          <div className="space-y-3">
            <Button
              onClick={installMetaMask}
              className="relative w-full max-w-sm h-14 text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <Download className="w-6 h-6" />
                <span>Install MetaMask</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </Button>
          </div>
        )}
        
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">or</div>
          <Button
            onClick={connectDemoMode}
            variant="outline"
            className="w-full max-w-sm h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Try Demo Mode</span>
            </div>
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-3 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg p-4">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}

      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Secure & Encrypted</span>
        </div>
        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>Instant Connection</span>
        </div>
      </div>

      {!useRainbowKit && (
        <div className="text-center text-xs text-gray-500">
          Using MetaMask connection
        </div>
      )}
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

