'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { domaAPI } from '@/lib/api'
import { DOMA_CONFIG } from '@/lib/doma-config'

interface DomaEvent {
  id: number
  name?: string
  tokenId?: string
  type: string
  uniqueId: string
  relayId?: string
  eventData: any
}

interface EventsResponse {
  events: DomaEvent[]
  lastId: number
  hasMoreEvents: boolean
}

export function EventsMonitor() {
  const [events, setEvents] = useState<DomaEvent[]>([])
  const [isPolling, setIsPolling] = useState(false)
  const [lastEventId, setLastEventId] = useState<number | null>(null)
  const [hasMoreEvents, setHasMoreEvents] = useState(false)
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([])
  const [pollingInterval, setPollingInterval] = useState(5000)
  const [error, setError] = useState<string | null>(null)
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null)

  // Get event type color
  const getEventTypeColor = (eventType: string) => {
    if (DOMA_CONFIG.EVENT_CATEGORIES.DOMAIN_MANAGEMENT.includes(eventType)) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    }
    if (DOMA_CONFIG.EVENT_CATEGORIES.TOKEN_OPERATIONS.includes(eventType)) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    }
    if (DOMA_CONFIG.EVENT_CATEGORIES.MARKETPLACE.includes(eventType)) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    }
    if (DOMA_CONFIG.EVENT_CATEGORIES.PAYMENTS.includes(eventType)) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    }
    if (DOMA_CONFIG.EVENT_CATEGORIES.COMMANDS.includes(eventType)) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }

  // Get event category
  const getEventCategory = (eventType: string) => {
    if (DOMA_CONFIG.EVENT_CATEGORIES.DOMAIN_MANAGEMENT.includes(eventType)) {
      return 'Domain Management'
    }
    if (DOMA_CONFIG.EVENT_CATEGORIES.TOKEN_OPERATIONS.includes(eventType)) {
      return 'Token Operations'
    }
    if (DOMA_CONFIG.EVENT_CATEGORIES.MARKETPLACE.includes(eventType)) {
      return 'Marketplace'
    }
    if (DOMA_CONFIG.EVENT_CATEGORIES.PAYMENTS.includes(eventType)) {
      return 'Payments'
    }
    if (DOMA_CONFIG.EVENT_CATEGORIES.COMMANDS.includes(eventType)) {
      return 'Commands'
    }
    return 'Other'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Doma Protocol Events Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Real-time monitoring of Doma Protocol blockchain events
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
