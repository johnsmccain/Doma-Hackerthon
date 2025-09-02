'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Settings, User, Shield, Bell, Palette } from 'lucide-react'

function SettingsPageContent() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [riskProfile, setRiskProfile] = useState('moderate')
  const [budget, setBudget] = useState(10000)
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

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log('Saving settings:', { riskProfile, budget })
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Settings Access Required
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md">
              Please connect your wallet to access your settings.
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
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your account preferences and investment profile
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Settings */}
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Profile Settings</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Wallet Address</label>
                    <input
                      type="text"
                      value={walletAddress}
                      disabled
                      className="w-full p-2 border border-border rounded-lg bg-muted text-muted-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Risk Profile</label>
                    <select
                      value={riskProfile}
                      onChange={(e) => setRiskProfile(e.target.value)}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                    >
                      <option value="conservative">Conservative</option>
                      <option value="moderate">Moderate</option>
                      <option value="aggressive">Aggressive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Investment Budget</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full p-2 border border-border rounded-lg bg-background"
                      placeholder="Enter your budget"
                    />
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Security Settings</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Session Management</h4>
                      <p className="text-sm text-muted-foreground">Manage active sessions</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Bell className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Price Alerts</h4>
                      <p className="text-sm text-muted-foreground">Get notified of price changes</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Market Updates</h4>
                      <p className="text-sm text-muted-foreground">Receive market analysis</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Portfolio Reports</h4>
                      <p className="text-sm text-muted-foreground">Weekly portfolio summaries</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>

              {/* Appearance Settings */}
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Palette className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Appearance</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <select className="w-full p-2 border border-border rounded-lg bg-background">
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <select className="w-full p-2 border border-border rounded-lg bg-background">
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                      <option value="gbp">GBP</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SettingsPageContent />
    </Suspense>
  )
}
