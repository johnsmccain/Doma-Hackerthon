'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Wallet, Shield, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface RainbowKitConnectProps {
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export function RainbowKitConnect({ onConnect, onDisconnect }: RainbowKitConnectProps) {
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const [isRainbowKitReady, setIsRainbowKitReady] = useState(false)

  useEffect(() => {
    // Check if RainbowKit is ready
    const checkRainbowKit = () => {
      const connectButton = document.querySelector('[data-testid="connect-button"]')
      if (connectButton) {
        setIsRainbowKitReady(true)
        console.log('RainbowKit ConnectButton found')
      } else {
        console.log('RainbowKit ConnectButton not found, retrying...')
        setTimeout(checkRainbowKit, 500)
      }
    }
    
    // Start checking after a short delay
    setTimeout(checkRainbowKit, 1000)
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      console.log('RainbowKit wallet connected:', address)
      localStorage.setItem('walletAddress', address)
      onConnect(address)
      toast.success('Wallet connected successfully!')
    }
  }, [isConnected, address, onConnect])

  const handleDisconnect = () => {
    console.log('Disconnecting RainbowKit wallet...')
    disconnect()
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('demoMode')
    onDisconnect()
    toast.success('Wallet disconnected')
  }

  // Check for existing connection on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress')
    const demoMode = localStorage.getItem('demoMode')
    
    if (demoMode === 'true' && savedAddress) {
      // Restore demo mode
      onConnect(savedAddress)
      toast.success('Demo mode restored!')
    }
  }, [onConnect])

  if (isConnected && address) {
    return (
      <div className="space-y-4">
        <div className="backdrop-blur-sm border rounded-xl p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full animate-pulse bg-green-400"></div>
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-medium text-green-300">
              Wallet Connected Successfully
            </span>
          </div>
          <p className="text-green-200 text-sm mt-2">
            Address: {address.slice(0, 6)}...{address.slice(-4)}
          </p>
        </div>
        
        <div className="flex flex-col space-y-3">
          <div className="flex justify-center">
            <ConnectButton 
              chainStatus="icon"
              showBalance={true}
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          </div>
          
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full max-w-sm h-12 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
          >
            Disconnect Wallet
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* RainbowKit Connect Button */}
        <div className="flex justify-center">
          <ConnectButton 
            chainStatus="icon"
            showBalance={true}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'full',
            }}
          />
        </div>
        
        {/* Demo Mode Option */}
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">or</div>
          <Button
            onClick={() => {
              const demoAddress = '0x1234567890abcdef1234567890abcdef12345678'
              localStorage.setItem('walletAddress', demoAddress)
              localStorage.setItem('demoMode', 'true')
              onConnect(demoAddress)
              toast.success('Demo mode activated! You can explore the platform without a real wallet.')
            }}
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

      {/* Trust Indicators */}
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Secure & Encrypted</span>
        </div>
        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4" />
          <span>Multiple Wallets</span>
        </div>
      </div>

      {/* Debug info */}
      {!isRainbowKitReady && (
        <div className="text-center text-xs text-gray-500">
          Loading RainbowKit...
        </div>
      )}
    </div>
  )
}
