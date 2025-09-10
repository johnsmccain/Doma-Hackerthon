# TLD Integration System

This directory contains the complete TLD (Top Level Domain) integration system for the Doma Advisor platform.

## Overview

The TLD system provides comprehensive support for managing and analyzing top-level domains, including:
- **Generic TLDs (gTLDs)**: .com, .net, .org, .ai, .io, etc.
- **Country Code TLDs (ccTLDs)**: .us, .uk, .de, .ca, etc.
- **Market analysis**: Popularity, demand, and pricing data
- **Search and filtering**: Find TLDs by category, popularity, or price range

## File Structure

```
frontend/lib/tld/
├── README.md                 # This documentation
├── index.ts                  # Main export file
└── ../                       # Parent directory contains:
    ├── tld-config.ts         # TLD configuration with metadata
    ├── tld-list.ts           # Raw TLD data lists
    ├── tld-service.ts        # Main TLD service class
    └── api.ts                # API types and interfaces
```

## Core Components

### 1. TLD Service (`tld-service.ts`)

The main service class that provides:
- **Singleton pattern** for consistent state management
- **Caching** for performance optimization
- **Default data generation** for TLDs without market data
- **Search and filtering** capabilities

```typescript
import { tldService } from '@/lib/tld-service'

// Get all supported TLDs
const allTLDs = tldService.getAllSupportedTLDs()

// Get popular TLDs
const popularTLDs = tldService.getPopularTLDs(10)

// Search TLDs
const searchResults = tldService.searchTLDs('ai', 5)
```

### 2. TLD Configuration (`tld-config.ts`)

Contains detailed TLD information including:
- **Popularity scores** (0-1 scale)
- **Market demand** metrics
- **Price ranges** with currency
- **Descriptions** and categories

### 3. TLD List (`tld-list.ts`)

Raw data containing all supported TLDs:
- **gTLDs**: 200+ generic top-level domains
- **ccTLDs**: 50+ country code top-level domains

### 4. API Integration (`api.ts`)

TypeScript interfaces and API endpoints:
- **TLDInfo**: Complete TLD information
- **TLDMarketData**: Real-time market data
- **API functions**: Backend integration

## Usage Examples

### Basic TLD Operations

```typescript
import { tldService } from '@/lib/tld-service'

// Check if a TLD is supported
const isSupported = tldService.isTLDSupported('ai') // true

// Get TLD information
const tldInfo = tldService.getTLDInfo('com')
console.log(tldInfo.popularity) // 1.0
console.log(tldInfo.price_range.max) // 1000000

// Get TLDs by category
const gTLDs = tldService.getTLDsByCategory('gTLD')
const ccTLDs = tldService.getTLDsByCategory('ccTLD')
```

### Advanced Filtering

```typescript
// Get TLDs by price range
const affordableTLDs = tldService.getTLDsByPriceRange(10, 100)

// Get trending TLDs
const trendingTLDs = tldService.getTrendingTLDs(10)

// Search with custom criteria
const techTLDs = tldService.searchTLDs('tech', 20)
```

### Market Data Integration

```typescript
// Update market data for a TLD
tldService.updateTLDMarketData('ai', {
  total_volume_24h: 50000,
  market_sentiment: 'bullish',
  trending_keywords: ['artificial', 'intelligence']
})

// Get current market data
const marketData = tldService.getTLDMarketData('ai')
```

## Integration Points

### 1. Dashboard Components

The TLD system integrates with:
- **MarketTrends**: Displays TLD performance and sentiment
- **TLDExplorer**: Dedicated TLD exploration interface
- **DynamicDashboard**: Overview of TLD market data

### 2. API Endpoints

Backend integration through:
- `/api/doma/tlds` - Get all supported TLDs
- `/api/doma/tld/{tld}` - Get specific TLD information
- `/api/doma/tlds/trends` - Get TLD market trends

### 3. Utility Functions

Enhanced domain utilities:
- `validateTLD()` - Check if TLD is supported
- `getTLDCategory()` - Determine TLD category
- `extractTLD()` - Extract TLD from domain name

## Performance Features

- **Caching**: TLD data is cached for fast access
- **Lazy Loading**: Market data loaded on demand
- **Efficient Filtering**: Optimized search and filtering algorithms
- **Memory Management**: Singleton pattern prevents memory leaks

## Testing

Use the test script to verify integration:

```typescript
import { testTLDIntegration } from '@/lib/test-tld-integration'

// Run tests
testTLDIntegration()
```

Or in browser console:
```javascript
testTLDIntegration()
```

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live market data
- **Advanced Analytics**: Machine learning for TLD valuation
- **User Preferences**: Personalized TLD recommendations
- **Historical Data**: TLD performance over time
- **Cross-chain Support**: Multi-blockchain TLD integration

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are properly exported
2. **Service Not Found**: Check if TLD service is initialized
3. **Data Not Loading**: Verify API endpoints are accessible
4. **Performance Issues**: Check cache configuration and memory usage

### Debug Mode

Enable debug logging:
```typescript
// In browser console
localStorage.setItem('tld-debug', 'true')
```

## Support

For issues or questions about the TLD integration system:
1. Check the console for error messages
2. Run the test script to identify problems
3. Review the API documentation
4. Check network requests in browser dev tools
