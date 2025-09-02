'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/Button'
import { 
  Sun, 
  Moon, 
  LogOut, 
  User,
  ChevronDown
} from 'lucide-react'
import { truncateAddress } from '@/lib/utils'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface HeaderProps {
  walletAddress: string
  onDisconnect: () => void
}

export function Header({ walletAddress, onDisconnect }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleDisconnect = () => {
    onDisconnect()
    setShowUserMenu(false)
    toast.success('Wallet disconnected')
  }

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/DomaAdvisor.png" 
                alt="Doma Advisor Logo" 
                width={32} 
                height={32}
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-xl font-semibold">Doma Advisor</h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User menu */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:block">{truncateAddress(walletAddress)}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    Connected Wallet
                  </div>
                  <div className="px-3 py-1 text-sm font-mono">
                    {truncateAddress(walletAddress, 8)}
                  </div>
                  <div className="mt-2 border-t border-border pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={handleDisconnect}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  )
}
