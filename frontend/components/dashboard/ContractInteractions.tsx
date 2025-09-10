'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Code, 
  Eye, 
  Copy,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { DOMA_CONFIG } from '@/lib/doma-config'

interface ContractFunction {
  name: string
  type: string
  inputs?: Array<{
    name: string
    type: string
    internalType: string
  }>
  outputs?: Array<{
    name: string
    type: string
    internalType: string
  }>
  stateMutability: string
}

interface ContractInteractionsProps {
  contractName: string
  contract: any
}

export function ContractInteractions({ contractName, contract }: ContractInteractionsProps) {
  const [copiedFunction, setCopiedFunction] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const copyFunctionName = (functionName: string) => {
    navigator.clipboard.writeText(functionName)
    setCopiedFunction(functionName)
    setTimeout(() => setCopiedFunction(null), 2000)
  }

  const getFunctionIcon = (functionName: string) => {
    if (functionName.startsWith('get') || functionName.startsWith('is') || functionName.startsWith('has')) {
      return <Eye className="w-4 h-4 text-blue-500" />
    }
    if (functionName.startsWith('set') || functionName.startsWith('add') || functionName.startsWith('remove')) {
      return <Code className="w-4 h-4 text-green-500" />
    }
    return <Code className="w-4 h-4 text-purple-500" />
  }

  const getFunctionBadgeVariant = (functionName: string) => {
    if (functionName.startsWith('get') || functionName.startsWith('is') || functionName.startsWith('has')) {
      return 'secondary' as const
    }
    if (functionName.startsWith('set') || functionName.startsWith('add') || functionName.startsWith('remove')) {
      return 'default' as const
    }
    return 'outline' as const
  }

  if (!contract.functions) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Contract Functions
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          {contract.functions.total} functions available across {Object.keys(contract.functions.categories).length} categories
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(contract.functions.categories).map(([category, functions]) => {
            const functionList = functions as string[]
            return (
            <div key={category} className="border rounded-lg">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">{category}</span>
                  <Badge variant="outline">{functionList.length} functions</Badge>
                </div>
                <div className="text-muted-foreground">
                  {expandedCategories.has(category) ? '−' : '+'}
                </div>
              </button>
              
              {expandedCategories.has(category) && (
                <div className="border-t p-4 bg-muted/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {functionList.map((functionName, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-background rounded-lg border hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          {getFunctionIcon(functionName)}
                          <span className="font-mono text-sm">{functionName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getFunctionBadgeVariant(functionName)}>
                            {functionName.startsWith('get') || functionName.startsWith('is') || functionName.startsWith('has') 
                              ? 'View' 
                              : functionName.startsWith('set') || functionName.startsWith('add') || functionName.startsWith('remove')
                              ? 'Admin'
                              : 'Action'
                            }
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyFunctionName(functionName)}
                            className="h-6 w-6 p-0"
                          >
                            {copiedFunction === functionName ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        </div>

        {/* Contract Statistics */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {contract.functions.total}
              </div>
              <div className="text-sm text-muted-foreground">Total Functions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.keys(contract.functions.categories).length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {contract.features.length}
              </div>
              <div className="text-sm text-muted-foreground">Features</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {contract.type}
              </div>
              <div className="text-sm text-muted-foreground">Contract Type</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
