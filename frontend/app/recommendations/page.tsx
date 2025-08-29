'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { RecommendationsList } from '@/components/dashboard/RecommendationsList'

export default function RecommendationsPage() {
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
              Recommendations Access Required
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
              Please connect your wallet to view personalized domain recommendations.
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
              <h1 className="text-3xl font-bold text-foreground">Recommendations</h1>
              <p className="text-muted-foreground mt-2">
                AI-powered domain investment recommendations tailored to your profile
              </p>
            </div>
            <RecommendationsList walletAddress={walletAddress} isLoading={false} />
          </main>
        </div>
      </div>
    </div>
  )
}
