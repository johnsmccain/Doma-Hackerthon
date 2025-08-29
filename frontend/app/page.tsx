'use client'

import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { WalletConnect } from '@/components/wallet/WalletConnect'

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')

  useEffect(() => {
    // Check if wallet is already connected
    const address = localStorage.getItem('walletAddress')
    if (address) {
      setWalletAddress(address)
      setIsConnected(true)
    }
  }, [])

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
    setIsConnected(true)
    localStorage.setItem('walletAddress', address)
  }

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
              Welcome to Doma Advisor
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
              Connect your wallet to access AI-powered domain investment recommendations and portfolio management.
            </p>
            <WalletConnect 
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
            />
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
            <Dashboard walletAddress={walletAddress} />
          </main>
        </div>
      </div>
    </div>
  )
}
