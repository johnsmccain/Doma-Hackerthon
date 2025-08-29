'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { domainAPI } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface TradeModalProps {
  isOpen: boolean
  onClose: () => void
  action: 'buy' | 'sell'
  domain: string
  price: number
  walletAddress: string
}

export function TradeModal({ isOpen, onClose, action, domain, price, walletAddress }: TradeModalProps) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExecuteTrade = async () => {
    setIsExecuting(true)
    setError(null)
    
    try {
      const result = await domainAPI.executeTrade({
        action,
        domain,
        wallet_address: walletAddress,
        price: Math.round(price * 100) // Convert to cents
      })

      if (result.success) {
        setTransactionHash(result.transaction_hash)
        toast.success(`${action === 'buy' ? 'Purchase' : 'Sale'} initiated successfully!`)
      } else {
        throw new Error(result.error || 'Trade execution failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Trade execution failed'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleClose = () => {
    if (!isExecuting) {
      onClose()
      setTransactionHash(null)
      setError(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">
            {action === 'buy' ? 'Buy Domain' : 'Sell Domain'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isExecuting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!transactionHash && !error && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {action === 'buy' ? '💰' : '💸'}
                  </span>
                </div>
                <h3 className="text-lg font-medium mb-2">{domain}</h3>
                <p className="text-muted-foreground">
                  {action === 'buy' 
                    ? 'Are you sure you want to buy this domain?' 
                    : 'Are you sure you want to sell this domain?'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain</span>
                  <span className="font-medium">{domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">{formatCurrency(price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet</span>
                  <span className="font-medium text-sm">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                  onClick={handleExecuteTrade}
                  disabled={isExecuting}
                  className="w-full"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Confirm ${action === 'buy' ? 'Purchase' : 'Sale'}`
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={isExecuting}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}

          {/* Success State */}
          {transactionHash && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Transaction Successful!</h3>
                <p className="text-muted-foreground mb-4">
                  Your {action === 'buy' ? 'purchase' : 'sale'} has been initiated.
                </p>
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <p className="text-muted-foreground mb-1">Transaction Hash:</p>
                  <p className="font-mono text-xs break-all">{transactionHash}</p>
                </div>
              </div>
              <Button onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Transaction Failed</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
              </div>
              <div className="space-y-3">
                <Button onClick={handleExecuteTrade} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleClose} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
