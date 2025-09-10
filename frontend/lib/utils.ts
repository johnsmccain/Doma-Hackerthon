import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | undefined | null, currency = "USD"): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "$0.00"
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) {
    return "0.00%"
  }
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
}

export function formatDomain(domain: string): string {
  return domain.toLowerCase().trim()
}

export function getDomainScoreColor(score: number): string {
  if (score >= 80) return "domain-score-high"
  if (score >= 60) return "domain-score-medium"
  return "domain-score-low"
}

export function getDomainScoreLabel(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Good"
  if (score >= 40) return "Fair"
  return "Poor"
}

export function truncateAddress(address: string, length = 6): string {
  if (!address) return ""
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d)
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/
  return domainRegex.test(domain)
}

export function extractTLD(domain: string): string {
  const parts = domain.split(".")
  return parts[parts.length - 1] || ""
}

export function validateTLD(tld: string): boolean {
  // Import the TLD service to check if TLD is supported
  try {
    // Dynamic import to avoid circular dependencies
    const { tldService } = require('./tld-service')
    return tldService.isTLDSupported(tld)
  } catch {
    // Fallback to basic validation if service is not available
    return /^[a-z]{2,}$/i.test(tld)
  }
}

export function getTLDCategory(tld: string): 'gTLD' | 'ccTLD' | 'nTLD' | 'unknown' {
  try {
    const { tldService } = require('./tld-service')
    const tldInfo = tldService.getTLDInfo(tld)
    return tldInfo?.category || 'unknown'
  } catch {
    // Fallback logic
    const { SUPPORTED_TLD_LIST } = require('./tld-list')
    if (SUPPORTED_TLD_LIST.gTLDs.includes(tld.toLowerCase())) return 'gTLD'
    if (SUPPORTED_TLD_LIST.ccTLDs.includes(tld.toLowerCase())) return 'ccTLD'
    return 'unknown'
  }
}

export function extractName(domain: string): string {
  const parts = domain.split(".")
  return parts.slice(0, -1).join(".")
}
