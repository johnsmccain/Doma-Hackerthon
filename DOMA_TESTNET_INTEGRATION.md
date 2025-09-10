# Doma Testnet Integration

This document describes the integration of the Doma Protocol testnet into the Doma Advisor platform.

## Overview

The Doma Advisor platform now integrates with the actual Doma Protocol testnet, providing real blockchain data and domain trading capabilities instead of simulated data.

## Testnet Configuration

### Network Details
- **Chain ID**: 97476
- **Currency**: ETH
- **RPC Server**: https://rpc-testnet.doma.xyz
- **Bridge**: https://bridge-testnet.doma.xyz
- **Explorer**: https://explorer-testnet.doma.xyz
- **API**: https://api-testnet.doma.xyz
- **Subgraph**: https://api-testnet.doma.xyz/graphql

### Contract Addresses

#### Doma Testnet
- **Doma Record**: `0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8`
- **Cross Chain Gateway**: `0xCE1476C791ff195e462632bf9Eb22f3d3cA07388`
- **Forwarder**: `0xf17beC16794e018E2F0453a1282c3DA3d121f410`
- **Ownership Token**: `0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f`
- **Proxy Doma Record**: `0xb1508299A01c02aC3B70c7A8B0B07105aaB29E99`

#### Sepolia Testnet
- **Ownership Token**: `0x9A374915648f1352827fFbf0A7bB5752b6995eB7`
- **Proxy Doma Record**: `0xD9A0E86AACf2B01013728fcCa9F00093B9b4F3Ff`
- **Cross Chain Gateway**: `0xEC67EfB227218CCc3c7032a6507339E7B4D623Ad`

#### Base Sepolia Testnet
- **Ownership Token**: `0x2f45DfC5f4c9473fa72aBdFbd223d0979B265046`
- **Proxy Doma Record**: `0xa40aA710F0C77DF3De6CEe7493d1FfF3715D59Da`
- **Cross Chain Gateway**: `0xC721925DF8268B1d4a1673D481eB446B3EDaAAdE`

#### Shibarium (Puppynet) Testnet
- **Ownership Token**: `0x55460792B2e3eDEbdF28f6C8766B7778Db7092A9`
- **Proxy Doma Record**: `0x8420729D9eBb5a30dBa8CEe1392F56bfc03b1F5`
- **Cross Chain Gateway**: `0x79e70acd155bFA071E57cA6a2f507d87d0e7B7f9`

#### Apechain Testnet
- **Ownership Token**: `0x63b7749B3b79B974904E0c684Ee589191fd807b4`
- **Proxy Doma Record**: `0x797293E811f9C5eFa1973004B581E46d1787F929`
- **Cross Chain Gateway**: `0xa483D7d32D7f5f2bd430CA9e61db275Eda72Fd23`

## Backend Integration

### New API Endpoints

#### Network Status
```http
GET /api/doma/network/status
```
Returns the current network status, including connection health, latest block, and gas prices.

#### Domain Information
```http
GET /api/doma/domain/{domain}
```
Retrieves real domain information from the Doma testnet.

#### Domain Pricing
```http
GET /api/doma/domain/{domain}/price
```
Gets domain pricing information from the Doma testnet.

#### Market Data
```http
GET /api/doma/market
```
Retrieves real market data including total domains, volume, and trending information.

#### Cross-Chain Status
```http
GET /api/doma/cross-chain/{domain}
```
Gets cross-chain status for a domain across supported networks.

#### Health Check
```http
GET /api/doma/health
```
Returns the overall health status of the Doma integration.

#### Execute Trade
```http
POST /api/doma/trade
```
Executes domain trades on the Doma testnet.

### Doma Integration Service

The `DomaIntegrationService` class provides:

- **Real-time blockchain connection** to Doma testnet
- **Domain information retrieval** from on-chain data
- **Market data aggregation** from multiple sources
- **Cross-chain functionality** across supported networks
- **Trade execution simulation** (ready for production deployment)
- **Health monitoring** of all integration points

## Frontend Integration

### Configuration

The frontend includes a comprehensive configuration file (`lib/doma-config.ts`) that provides:

- Network configurations for all supported testnets
- Contract addresses for each network
- API endpoint mappings
- Default values and error messages
- Helper functions for domain validation and formatting

### New API Functions

The frontend API client now includes:

- `getNetworkStatus()` - Get current network status
- `getDomainPrice()` - Get domain pricing
- `getMarketData()` - Get market statistics
- `getCrossChainStatus()` - Get cross-chain information
- `getHealthStatus()` - Get integration health
- `executeTrade()` - Execute domain trades

### Wallet Integration

The platform supports wallet connections to:

- Doma Testnet (Chain ID: 97476)
- Sepolia Testnet (Chain ID: 11155111)
- Base Sepolia Testnet (Chain ID: 84532)

## Environment Configuration

### Backend (.env)
```bash
# Doma Protocol Testnet Configuration
DOMA_TESTNET_RPC_URL=https://rpc-testnet.doma.xyz
DOMA_TESTNET_CHAIN_ID=97476
DOMA_TESTNET_CURRENCY=ETH
DOMA_TESTNET_BRIDGE=https://bridge-testnet.doma.xyz
DOMA_TESTNET_EXPLORER=https://explorer-testnet.doma.xyz
DOMA_TESTNET_API=https://api-testnet.doma.xyz
DOMA_TESTNET_SUBGRAPH=https://api-testnet.doma.xyz/graphql

# Contract Addresses
DOMA_TESTNET_DOMA_RECORD=0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8
DOMA_TESTNET_CROSS_CHAIN_GATEWAY=0xCE1476C791ff195e462632bf9Eb22f3d3cA07388
DOMA_TESTNET_FORWARDER=0xf17beC16794e018E2F0453a1282c3DA3d121f410
DOMA_TESTNET_OWNERSHIP_TOKEN=0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f
DOMA_TESTNET_PROXY_DOMA_RECORD=0xb1508299A01c02aC3B70c7A8B0B07105aaB29E99

# Additional testnet configurations...
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DOMA_RPC_URL=https://rpc-testnet.doma.xyz
NEXT_PUBLIC_DOMA_CHAIN_ID=97476
NEXT_PUBLIC_DOMA_CURRENCY=ETH
NEXT_PUBLIC_DOMA_BRIDGE=https://bridge-testnet.doma.xyz
NEXT_PUBLIC_DOMA_EXPLORER=https://explorer-testnet.doma.xyz
NEXT_PUBLIC_DOMA_API=https://api-testnet.doma.xyz
NEXT_PUBLIC_DOMA_SUBGRAPH=https://api-testnet.doma.xyz/graphql
```

## Features

### Real Data Integration
- **Live cryptocurrency prices** from CoinGecko API
- **Real domain scoring** using algorithmic analysis
- **Dynamic portfolio valuation** based on current market conditions
- **Market trend analysis** with real-time data

### Cross-Chain Support
- **Multi-network domain trading** across supported testnets
- **Bridge functionality** for cross-chain transfers
- **Unified interface** for all supported networks

### Advanced Domain Features
- **Domain availability checking** from on-chain data
- **Pricing algorithms** based on domain characteristics
- **Trending domain discovery** from market activity
- **Cross-chain domain status** tracking

## Usage Examples

### Check Network Status
```typescript
import { domaAPI } from '@/lib/api'

const networkStatus = await domaAPI.getNetworkStatus()
console.log('Network:', networkStatus.network)
console.log('Latest Block:', networkStatus.latest_block)
console.log('Gas Price:', networkStatus.gas_price_gwei, 'Gwei')
```

### Get Domain Information
```typescript
const domainInfo = await domaAPI.getDomainInfo('example.eth')
console.log('Owner:', domainInfo.owner)
console.log('Status:', domainInfo.status)
console.log('Records:', domainInfo.records)
```

### Execute a Trade
```typescript
const tradeResult = await domaAPI.executeTrade({
  action: 'buy',
  domain: 'example.eth',
  wallet_address: '0x...',
  price: 0.1
})

if (tradeResult.success) {
  console.log('Transaction Hash:', tradeResult.transaction_hash)
  console.log('Gas Estimate:', tradeResult.gas_estimate)
}
```

## Testing

### Testnet Faucets
- **Doma Testnet**: Use the bridge at https://bridge-testnet.doma.xyz
- **Sepolia**: Use Sepolia faucets for test ETH
- **Base Sepolia**: Use Base Sepolia faucets

### Test Domains
- `.eth` domains on Doma testnet
- `.crypto` domains on supported networks
- `.nft` and `.dao` domains for testing

## Security Considerations

- **Never use real private keys** on testnets
- **Test with small amounts** only
- **Verify contract addresses** before transactions
- **Use dedicated testnet wallets** for development

## Troubleshooting

### Common Issues

1. **RPC Connection Failed**
   - Check if the testnet is operational
   - Verify the RPC URL is correct
   - Check network connectivity

2. **Contract Interaction Errors**
   - Verify contract addresses are correct
   - Check if contracts are deployed on the testnet
   - Ensure sufficient testnet ETH for gas

3. **API Endpoint Errors**
   - Check if the Doma API is accessible
   - Verify API endpoint URLs
   - Check rate limiting

### Debug Mode

Enable debug logging by setting the log level to DEBUG in the backend configuration.

## Future Enhancements

- **Mainnet integration** when available
- **Additional network support** (Polygon, Arbitrum, etc.)
- **Advanced cross-chain features** (atomic swaps, etc.)
- **Real-time notifications** for domain events
- **Advanced analytics** and reporting

## Support

For issues related to:
- **Doma Protocol**: Contact the Doma team
- **Platform Integration**: Check the platform documentation
- **Testnet Access**: Use the official Doma testnet resources

## Links

- [Doma Protocol Documentation](https://docs.doma.xyz)
- [Testnet Bridge](https://bridge-testnet.doma.xyz)
- [Testnet Explorer](https://explorer-testnet.doma.xyz)
- [Testnet API](https://api-testnet.doma.xyz)
- [GitHub Repository](https://github.com/doma-protocol)
