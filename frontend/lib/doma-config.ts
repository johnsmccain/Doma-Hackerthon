// Doma Testnet Configuration
export const DOMA_CONFIG = {
  // Network Configuration
  TESTNET: {
    RPC_URL: 'https://rpc-testnet.doma.xyz',
    CHAIN_ID: 97476,
    CURRENCY: 'ETH',
    BRIDGE: 'https://bridge-testnet.doma.xyz',
    EXPLORER: 'https://explorer-testnet.doma.xyz',
    API: 'https://api-testnet.doma.xyz',
    SUBGRAPH: 'https://api-testnet.doma.xyz/graphql',
    NAME: 'Doma Testnet'
  },

  // Contract Addresses and Information
  CONTRACTS: {
    TESTNET: {
      DOMA_RECORD: {
        address: '0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8',
        type: 'Diamond Pattern',
        description: 'Main Doma Record contract using EIP-2535 Diamond pattern for upgradeable functionality',
        features: ['Upgradeable', 'Diamond Pattern', 'Facet Management']
      },
      CROSS_CHAIN_GATEWAY: {
        address: '0xCE1476C791ff195e462632bf9Eb22f3d3cA07388',
        type: 'Proxy Contract',
        description: 'Cross-chain gateway for domain transfers between networks',
        features: ['Upgradeable', 'Cross-chain', 'Bridge Integration']
      },
      FORWARDER: {
        address: '0xf17beC16794e018E2F0453a1282c3DA3d121f410',
        type: 'Proxy Contract',
        description: 'Transaction forwarder for gasless transactions',
        features: ['Upgradeable', 'Gasless', 'Meta-transactions']
      },
      OWNERSHIP_TOKEN: {
        address: '0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f',
        type: 'Proxy Contract',
        description: 'ERC-721 ownership tokens representing domain ownership',
        features: ['Upgradeable', 'NFT Standard', 'Domain Ownership']
      },
      PROXY_DOMA_RECORD: {
        address: '0xb1508299A01c02aC3B70c7A8B0B07105aaB29E99',
        type: 'Implementation Proxy',
        description: 'Full-featured Doma Record implementation with domain management, cross-chain bridging, and tokenization',
        features: [
          'Domain Tokenization',
          'Cross-chain Bridging', 
          'Ownership Management',
          'Fee Management',
          'Role-based Access Control',
          'Price Feed Integration',
          'Voucher System',
          'Multi-chain Support'
        ],
        functions: {
          total: 67,
          categories: {
            'Domain Management': ['requestTokenization', 'mintOwnershipTokens', 'detokenize', 'renew'],
            'Cross-chain': ['bridge', 'executeMessage', 'addSupportedTargetChain'],
            'Ownership': ['claimOwnership', 'tokenTransfer', 'changeLockStatus'],
            'Administration': ['setFee', 'setTreasury', 'setPriceFeed', 'grantRole'],
            'View Functions': ['feesUSDCents', 'getCurrentNonce', 'isTargetChainSupported']
          }
        }
      }
    },
    SEPOLIA: {
      OWNERSHIP_TOKEN: '0x9A374915648f1352827fFbf0A7bB5752b6995eB7',
      PROXY_DOMA_RECORD: '0xD9A0E86AACf2B01013728fcCa9F00093B9b4F3Ff',
      CROSS_CHAIN_GATEWAY: '0xEC67EfB227218CCc3c7032a6507339E7B4D623Ad'
    },
    BASE_SEPOLIA: {
      OWNERSHIP_TOKEN: '0x2f45DfC5f4c9473fa72aBdFbd223d0979B265046',
      PROXY_DOMA_RECORD: '0xa40aA710F0C77DF3De6CEe7493d1FfF3715D59Da',
      CROSS_CHAIN_GATEWAY: '0xC721925DF8268B1d4a1673D481eB446B3EDaAAdE'
    },
    SHIBARIUM: {
      OWNERSHIP_TOKEN: '0x55460792B2e3eDEbdF28f6C8766B7778Db7092A9',
      PROXY_DOMA_RECORD: '0x8420729D9eBb5a30dBa8CEe1392F56bfc03b1F5',
      CROSS_CHAIN_GATEWAY: '0x79e70acd155bFA071E57cA6a2f507d87d0e7B7f9'
    },
    APECHAIN: {
      OWNERSHIP_TOKEN: '0x63b7749B3b79B974904E0c684Ee589191fd807b4',
      PROXY_DOMA_RECORD: '0x797293E811f9C5eFa1973004B581E46d1787F929',
      CROSS_CHAIN_GATEWAY: '0xa483D7d32D7f5f2bd430CA9e61db275Eda72Fd23'
    }
  },

  // Supported Networks
  SUPPORTED_NETWORKS: {
    97476: {
      name: 'Doma Testnet',
      rpc: 'https://rpc-testnet.doma.xyz',
      explorer: 'https://explorer-testnet.doma.xyz',
      currency: 'ETH',
      contracts: 'TESTNET'
    },
    11155111: {
      name: 'Sepolia',
      rpc: 'https://sepolia.infura.io/v3/your-project-id',
      explorer: 'https://sepolia.etherscan.io',
      currency: 'ETH',
      contracts: 'SEPOLIA'
    },
    84532: {
      name: 'Base Sepolia',
      rpc: 'https://sepolia.base.org',
      explorer: 'https://sepolia.basescan.org',
      currency: 'ETH',
      contracts: 'BASE_SEPOLIA'
    }
  } as Record<number, {
    name: string
    rpc: string
    explorer: string
    currency: string
    contracts: string
  }>,

  // API Endpoints
  API_ENDPOINTS: {
    DOMAIN_INFO: '/api/doma/domain',
    DOMAIN_PRICE: '/api/doma/domain',
    MARKET_DATA: '/api/doma/market',
    TRENDING_DOMAINS: '/api/doma/trending',
    NETWORK_STATUS: '/api/doma/network/status',
    CROSS_CHAIN_STATUS: '/api/doma/cross-chain',
    HEALTH: '/api/doma/health',
    TRADE: '/api/doma/trade',
    // Events Poll API endpoints
    EVENTS_POLL: '/v1/poll',
    EVENTS_ACK: '/v1/poll/ack/{lastEventId}',
    EVENTS_RESET: '/v1/poll/reset/{eventId}',
    // Orderbook API endpoints
    ORDERBOOK_CREATE_LISTING: '/v1/orderbook/list',
    ORDERBOOK_CREATE_OFFER: '/v1/orderbook/offer',
    ORDERBOOK_GET_LISTING: '/v1/orderbook/listing/{orderId}/{buyer}',
    ORDERBOOK_GET_OFFER: '/v1/orderbook/offer/{orderId}/{fulfiller}',
    ORDERBOOK_CANCEL_LISTING: '/v1/orderbook/listing/cancel',
    ORDERBOOK_CANCEL_OFFER: '/v1/orderbook/offer/cancel',
    ORDERBOOK_GET_FEES: '/v1/orderbook/fee/{orderbook}/{chainId}/{contractAddress}',
    ORDERBOOK_GET_CURRENCIES: '/v1/orderbook/currencies/{chainId}/{contractAddress}/{orderbook}',
    // Fractionalization API endpoints
    FRACTIONALIZATION_FRACTIONALIZE: '/v1/fractionalization/fractionalize',
    FRACTIONALIZATION_BUYOUT: '/v1/fractionalization/buyout',
    FRACTIONALIZATION_EXCHANGE: '/v1/fractionalization/exchange',
    FRACTIONALIZATION_GET_BUYOUT_PRICE: '/v1/fractionalization/buyout-price/{tokenId}',
    FRACTIONALIZATION_GET_INFO: '/v1/fractionalization/info/{tokenId}',
    // Smart Contracts API endpoints
    SMART_CONTRACTS_TOKENIZATION: '/v1/smart-contracts/tokenization',
    SMART_CONTRACTS_CLAIM_OWNERSHIP: '/v1/smart-contracts/claim-ownership',
    SMART_CONTRACTS_BRIDGE: '/v1/smart-contracts/bridge',
    SMART_CONTRACTS_DETOKENIZE: '/v1/smart-contracts/detokenize',
    SMART_CONTRACTS_TOKEN_INFO: '/v1/smart-contracts/token/{tokenId}',
    SMART_CONTRACTS_EXPIRATION: '/v1/smart-contracts/token/{tokenId}/expiration',
    SMART_CONTRACTS_REGISTRAR: '/v1/smart-contracts/token/{tokenId}/registrar',
    SMART_CONTRACTS_TRANSFER_LOCK: '/v1/smart-contracts/token/{tokenId}/transfer-lock'
  },

  // Default Values
  DEFAULTS: {
    GAS_LIMIT: 300000,
    GAS_PRICE: '20', // Gwei
    MAX_PRICE: 100, // ETH
    MIN_PRICE: 0.001, // ETH
    TIMEOUT: 30000, // ms
    RETRY_ATTEMPTS: 3
  },

  // Error Messages
  ERRORS: {
    NETWORK_NOT_SUPPORTED: 'Network not supported. Please switch to a supported network.',
    INSUFFICIENT_BALANCE: 'Insufficient balance to complete this transaction.',
    DOMAIN_NOT_AVAILABLE: 'Domain is not available for purchase.',
    TRANSACTION_FAILED: 'Transaction failed. Please try again.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    INVALID_DOMAIN: 'Invalid domain format.',
    PRICE_TOO_HIGH: 'Price exceeds maximum allowed value.',
    PRICE_TOO_LOW: 'Price is below minimum allowed value.'
  },

  // Success Messages
  SUCCESS: {
    DOMAIN_PURCHASED: 'Domain purchased successfully!',
    DOMAIN_SOLD: 'Domain sold successfully!',
    TRANSACTION_COMPLETED: 'Transaction completed successfully!',
    DOMAIN_REGISTERED: 'Domain registered successfully!',
    TRANSFER_COMPLETED: 'Domain transfer completed successfully!'
  },

  // Event Types
  EVENT_TYPES: {
    NAME_TOKENIZATION_REQUESTED: 'NAME_TOKENIZATION_REQUESTED',
    NAME_TOKENIZATION_REJECTED: 'NAME_TOKENIZATION_REJECTED',
    NAME_TOKENIZED: 'NAME_TOKENIZED',
    NAME_UPDATED: 'NAME_UPDATED',
    NAME_RENEWED: 'NAME_RENEWED',
    NAME_CLAIMED: 'NAME_CLAIMED',
    NAME_CLAIM_REQUESTED: 'NAME_CLAIM_REQUESTED',
    NAME_CLAIM_REJECTED: 'NAME_CLAIM_REJECTED',
    NAME_CLAIM_APPROVED: 'NAME_CLAIM_APPROVED',
    NAME_DETOKENIZED: 'NAME_DETOKENIZED',
    NAME_TOKEN_MINTED: 'NAME_TOKEN_MINTED',
    NAME_TOKEN_TRANSFERRED: 'NAME_TOKEN_TRANSFERRED',
    NAME_TOKEN_RENEWED: 'NAME_TOKEN_RENEWED',
    NAME_TOKEN_BURNED: 'NAME_TOKEN_BURNED',
    NAME_TOKEN_APPROVED_FOR_ALL: 'NAME_TOKEN_APPROVED_FOR_ALL',
    NAME_TOKEN_TRANSFER_APPROVED: 'NAME_TOKEN_TRANSFER_APPROVED',
    NAME_TOKEN_TRANSFER_APPROVAL_REVOKED: 'NAME_TOKEN_TRANSFER_APPROVAL_REVOKED',
    NAME_TOKEN_LOCK_STATUS_CHANGED: 'NAME_TOKEN_LOCK_STATUS_CHANGED',
    PAYMENT_FULFILLED: 'PAYMENT_FULFILLED',
    NAME_TOKEN_LISTED: 'NAME_TOKEN_LISTED',
    NAME_TOKEN_OFFER_RECEIVED: 'NAME_TOKEN_OFFER_RECEIVED',
    NAME_TOKEN_LISTING_CANCELLED: 'NAME_TOKEN_LISTING_CANCELLED',
    NAME_TOKEN_OFFER_CANCELLED: 'NAME_TOKEN_OFFER_CANCELLED',
    NAME_TOKEN_PURCHASED: 'NAME_TOKEN_PURCHASED',
    COMMAND_CREATED: 'COMMAND_CREATED',
    COMMAND_SUCCEEDED: 'COMMAND_SUCCEEDED',
    COMMAND_FAILED: 'COMMAND_FAILED',
    COMMAND_UPDATED: 'COMMAND_UPDATED'
  },

  // Event Categories
  EVENT_CATEGORIES: {
    DOMAIN_MANAGEMENT: [
      'NAME_TOKENIZATION_REQUESTED', 'NAME_TOKENIZATION_REJECTED', 'NAME_TOKENIZED',
      'NAME_UPDATED', 'NAME_RENEWED', 'NAME_CLAIMED', 'NAME_CLAIM_REQUESTED',
      'NAME_CLAIM_REJECTED', 'NAME_CLAIM_APPROVED', 'NAME_DETOKENIZED'
    ],
    TOKEN_OPERATIONS: [
      'NAME_TOKEN_MINTED', 'NAME_TOKEN_TRANSFERRED', 'NAME_TOKEN_RENEWED',
      'NAME_TOKEN_BURNED', 'NAME_TOKEN_APPROVED_FOR_ALL', 'NAME_TOKEN_TRANSFER_APPROVED',
      'NAME_TOKEN_TRANSFER_APPROVAL_REVOKED', 'NAME_TOKEN_LOCK_STATUS_CHANGED'
    ],
    MARKETPLACE: [
      'NAME_TOKEN_LISTED', 'NAME_TOKEN_OFFER_RECEIVED', 'NAME_TOKEN_LISTING_CANCELLED',
      'NAME_TOKEN_OFFER_CANCELLED', 'NAME_TOKEN_PURCHASED'
    ],
    PAYMENTS: ['PAYMENT_FULFILLED'],
    COMMANDS: ['COMMAND_CREATED', 'COMMAND_SUCCEEDED', 'COMMAND_FAILED', 'COMMAND_UPDATED']
  },

  // Orderbook Configuration
  ORDERBOOK: {
    SUPPORTED_ORDERBOOKS: ['DOMA', 'OPENSEA'],
    ORDER_TYPES: {
      0: 'FULL_OPEN',
      1: 'PARTIAL_OPEN',
      2: 'FULL_RESTRICTED',
      3: 'PARTIAL_RESTRICTED'
    },
    ORDER_TYPE_LABELS: {
      0: 'Full Open',
      1: 'Partial Open', 
      2: 'Full Restricted',
      3: 'Partial Restricted'
    },
    DEFAULT_ZONE: '0x004C00500000aD104D7DBd00e3ae0A5C00560C00',
    DEFAULT_CONDUIT_KEY: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000'
  },

  // Fractionalization Configuration
  FRACTIONALIZATION: {
    SUPPORTED_CHAINS: ['DOMA', 'BASE', 'SOLANA'],
    TOKEN_STANDARDS: {
      DOMAIN_NFT: 'ERC-721',
      FRACTIONAL_TOKEN: 'ERC-20',
      BRIDGED_TOKEN: 'ERC-20'
    },
    BUYOUT_FORMULA: {
      DESCRIPTION: 'Price_buyout = Max(MBP, FDMC)',
      MBP: 'Minimum Buyout Price (USDC)',
      FDMC: 'Fully Diluted Market Cap = TotalSupply × Price_per_token'
    },
    REDEMPTION_FORMULA: {
      DESCRIPTION: 'Price_per_token = Price_buyout / TotalSupply',
      EXPLANATION: 'After buyout, fractional tokens can be redeemed for USDC'
    },
    PROTOCOL_FEE: 'Small percentage held by Doma Fractionalization contract',
    LAUNCHPAD: 'Doma-approved launchpad for token distribution'
  },

  // Smart Contracts API Configuration
  SMART_CONTRACTS: {
    CORE_CONTRACTS: {
      DOMA_RECORD: {
        DESCRIPTION: 'Main contract that holds domain information and issues Name Tokens',
        ROLE: 'Coordination point for cross-chain operations',
        API: 'Registrar-facing API for domain management operations'
      },
      DOMA_FORWARDER: {
        DESCRIPTION: 'EIP-2771 Trusted Forwarder for meta transactions',
        ROLE: 'Relays meta transactions from Registrar to Doma Record contract',
        OPTIONAL: true
      },
      DOMA_GATEWAY: {
        DESCRIPTION: 'ERC-7786 Gateway Source for cross-chain messaging',
        ROLE: 'Allows sending messages to contracts on other chains',
        DEPLOYMENT: 'Each supported chain'
      },
      PROXY_DOMA_RECORD: {
        DESCRIPTION: 'Supporting contract for user-contract communication',
        ROLE: 'Abstracts Doma Chain from end-users',
        FUNCTIONS: 'Core domain-management operations (claiming, bridging)'
      },
      OWNERSHIP_TOKEN: {
        DESCRIPTION: 'ERC-721 NFT contract with domain-specific modifications',
        FEATURES: ['Expiration support', 'Compliance operations', 'Registrar control']
      }
    },
    EVM_FUNCTIONS: {
      REQUEST_TOKENIZATION: {
        DESCRIPTION: 'Request tokenization of given names',
        REQUIREMENTS: ['Voucher signed by sponsoring Registrar', 'EIP-712 standard', 'Protocol fees'],
        PARAMETERS: ['TokenizationVoucher', 'signature']
      },
      CLAIM_OWNERSHIP: {
        DESCRIPTION: 'Claim domain ownership using Ownership token',
        REQUIREMENTS: ['Proof of contacts voucher', 'Valid Ownership token', 'Protocol fees'],
        PARAMETERS: ['tokenId', 'isSynthetic', 'proofOfContactsVoucher', 'signature']
      },
      BRIDGE: {
        DESCRIPTION: 'Move token to another supported chain',
        REQUIREMENTS: ['Source chain only', 'Protocol fees'],
        PARAMETERS: ['tokenId', 'isSynthetic', 'targetChainId', 'targetOwnerAddress']
      },
      DETOKENIZE: {
        DESCRIPTION: 'Request domain detokenization',
        REQUIREMENTS: ['Ownership token', 'Domain ownership claimed', 'No fees required'],
        PARAMETERS: ['tokenId', 'isSynthetic']
      }
    },
    OWNERSHIP_TOKEN_FEATURES: {
      EXPIRATION: 'expirationOf(id) - Returns expiration date for token',
      REGISTRAR: 'registrarOf(id) - Returns registrar IANA ID for token',
      TRANSFER_LOCK: 'lockStatusOf(id) - Returns transfer lock status',
      ROYALTIES: 'ERC-2981 standard for royalties information',
      COMPLIANCE: 'Registrar can burn/lock tokens for compliance reasons'
    },
    SOLANA_INTEGRATION: {
      SRS_PROGRAM: 'Solana Records Service program integration',
      PERMISSIONED_CLASS: 'Doma Protocol owns Permissioned Class on SRS',
      TOKEN_STANDARD: 'Token 22 (SPL Token-2022) as underlying NFT standard',
      COMPLIANCE: 'SRS Program retains full control over minted NFTs',
      PROXY_PDA: 'Proxy Doma Record PDA as Class Authority'
    }
  }
}

// Helper functions
export const getNetworkConfig = (chainId: number) => {
  return DOMA_CONFIG.SUPPORTED_NETWORKS[chainId] || null
}

export const getContractAddresses = (chainId: number) => {
  const network = getNetworkConfig(chainId)
  if (!network) return null
  
  const contractType = network.contracts as keyof typeof DOMA_CONFIG.CONTRACTS
  const contracts = DOMA_CONFIG.CONTRACTS[contractType]
  
  if (!contracts) return null
  
  // Convert to simple address mapping for backward compatibility
  const addressMap: Record<string, string> = {}
  Object.entries(contracts).forEach(([key, contract]) => {
    if (typeof contract === 'string') {
      addressMap[key] = contract
    } else {
      addressMap[key] = contract.address
    }
  })
  
  return addressMap
}

export const getContractInfo = (chainId: number, contractName: string) => {
  const network = getNetworkConfig(chainId)
  if (!network) return null
  
  const contractType = network.contracts as keyof typeof DOMA_CONFIG.CONTRACTS
  const contracts = DOMA_CONFIG.CONTRACTS[contractType]
  
  if (!contracts || !contracts[contractName as keyof typeof contracts]) return null
  
  const contract = contracts[contractName as keyof typeof contracts]
  if (typeof contract === 'string') {
    return { address: contract, type: 'Legacy', description: 'Contract address', features: [] }
  }
  
  return contract
}

export const isNetworkSupported = (chainId: number) => {
  return chainId in DOMA_CONFIG.SUPPORTED_NETWORKS
}

export const getNetworkName = (chainId: number) => {
  const network = getNetworkConfig(chainId)
  return network?.name || 'Unknown Network'
}

export const formatPrice = (price: number, currency: string = 'ETH') => {
  if (currency === 'ETH') {
    return `${price.toFixed(4)} ETH`
  }
  return `${price} ${currency}`
}

export const formatAddress = (address: string) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const validateDomain = (domain: string) => {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return domainRegex.test(domain)
}

export const getDomainTLD = (domain: string) => {
  const parts = domain.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : ''
}

export const getDomainName = (domain: string) => {
  const parts = domain.split('.')
  return parts[0] || domain
}
