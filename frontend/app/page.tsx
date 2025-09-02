'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { HybridWalletConnect } from '@/components/wallet/HybridWalletConnect'
import { RainbowKitConnect } from '@/components/wallet/RainbowKitConnect'
import { DynamicDashboard } from '@/components/dashboard/DynamicDashboard'
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Star, 
  Sparkles
} from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [useRainbowKit, setUseRainbowKit] = useState(true)

  useEffect(() => {
    // Check if wallet is already connected
    const savedAddress = localStorage.getItem('walletAddress')
    if (savedAddress) {
      setWalletAddress(savedAddress)
      setIsConnected(true)
    }

    // Check if RainbowKit is working
    const checkRainbowKit = () => {
      const connectButton = document.querySelector('[data-testid="connect-button"]')
      if (!connectButton) {
        setTimeout(() => {
          const connectButton = document.querySelector('[data-testid="connect-button"]')
          if (!connectButton) {
            setUseRainbowKit(false)
            console.log('RainbowKit not available, using fallback')
          }
        }, 3000)
      }
    }
    
    setTimeout(checkRainbowKit, 1000)
  }, [])

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
    setIsConnected(true)
    console.log('Wallet connected:', address)
  }

  const handleWalletDisconnect = () => {
    setWalletAddress('')
    setIsConnected(false)
    console.log('Wallet disconnected')
  }

  if (isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Header walletAddress={walletAddress} onDisconnect={handleWalletDisconnect} />
            <main className="p-6">
              <div className="max-w-7xl mx-auto">
                <DynamicDashboard />
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-2xl overflow-hidden">
              <Image 
                src="/DomaAdvisor.png" 
                alt="Doma Advisor Logo" 
                width={64} 
                height={64}
                className="w-16 h-16 object-contain"
              />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
              Doma Advisor
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-purple-300 text-lg font-medium">AI-Powered Domain Investment</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
          </div>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Revolutionize your domain investment strategy with cutting-edge AI insights, real-time market analysis, and seamless on-chain trading via the Doma Protocol.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">AI Recommendations</h3>
              <p className="text-gray-300 text-sm">Get intelligent buy/sell/hold suggestions powered by advanced machine learning</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Portfolio Management</h3>
              <p className="text-gray-300 text-sm">Track performance, manage risk, and optimize your domain portfolio</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">On-Chain Trading</h3>
              <p className="text-gray-300 text-sm">Execute trades directly on the Doma Protocol with instant settlement</p>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="space-y-6">
            {useRainbowKit ? (
              <RainbowKitConnect 
                onConnect={handleWalletConnect}
                onDisconnect={handleWalletDisconnect}
              />
            ) : (
              <HybridWalletConnect 
                onConnect={handleWalletConnect}
                onDisconnect={handleWalletDisconnect}
              />
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">$50M+</div>
              <div className="text-gray-400 text-sm">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-gray-400 text-sm">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">95%</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-400 text-sm">AI Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
