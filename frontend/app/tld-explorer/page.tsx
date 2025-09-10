'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import TLDExplorer from '@/components/dashboard/TLDExplorer'
import { useState, useEffect } from 'react'

export default function TLDExplorerPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')

  useEffect(() => {
    // Check if wallet is already connected
    const savedAddress = localStorage.getItem('walletAddress')
    if (savedAddress) {
      setWalletAddress(savedAddress)
      setIsConnected(true)
    }
  }, [])

  const handleWalletDisconnect = () => {
    setWalletAddress('')
    setIsConnected(false)
    console.log('Wallet disconnected')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Header walletAddress={walletAddress} onDisconnect={handleWalletDisconnect} />
          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              <TLDExplorer />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
