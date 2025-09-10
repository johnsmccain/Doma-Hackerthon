'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { tldService } from '@/lib/tld-service'
import { TLDInfo } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function TLDExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<'gTLD' | 'ccTLD'>('gTLD')
  const [searchQuery, setSearchQuery] = useState('')
  const [tlds, setTlds] = useState<TLDInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadTLDs()
  }, [selectedCategory])

  const loadTLDs = () => {
    setLoading(true)
    const categoryTlds = tldService.getTLDsByCategory(selectedCategory)
    const tldInfos = categoryTlds.map(tld => tldService.getTLDInfo(tld)).filter(Boolean) as TLDInfo[]
    setTlds(tldInfos)
    setLoading(false)
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadTLDs()
      return
    }
    
    setLoading(true)
    const searchResults = tldService.searchTLDs(searchQuery, 20)
    setTlds(searchResults)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">TLD Explorer</h2>
          <p className="text-gray-400">Explore supported Top Level Domains</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Total Supported TLDs</div>
          <div className="text-2xl font-bold text-white">{tldService.getAllSupportedTLDs().length}</div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant={selectedCategory === 'gTLD' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('gTLD')}
          className="flex-1"
        >
          Generic TLDs ({tldService.getTLDsByCategory('gTLD').length})
        </Button>
        <Button
          variant={selectedCategory === 'ccTLD' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('ccTLD')}
          className="flex-1"
        >
          Country Code TLDs ({tldService.getTLDsByCategory('ccTLD').length})
        </Button>
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Search TLDs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            {selectedCategory === 'gTLD' ? 'Generic' : 'Country Code'} TLDs
            {searchQuery && ` - Search Results for "${searchQuery}"`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading TLDs...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tlds.slice(0, 30).map((tld) => (
                <div key={tld.tld} className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-white text-lg">.{tld.tld}</div>
                    <Badge variant={tld.category === 'gTLD' ? 'default' : 'secondary'}>
                      {tld.category}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-3">{tld.description}</div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Popularity:</span>
                      <span className="text-white font-medium">
                        {(tld.popularity * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Demand:</span>
                      <span className="text-green-400 font-medium">
                        {(tld.market_demand * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price Range:</span>
                      <span className="text-white font-medium">
                        {formatCurrency(tld.price_range.min)} - {formatCurrency(tld.price_range.max)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
