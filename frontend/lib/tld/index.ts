// TLD Module Index
// This file exports all TLD-related functionality for easy importing

export { tldService } from '../tld-service'
export { 
  SUPPORTED_GTLDS, 
  SUPPORTED_CC_TLDS, 
  ALL_SUPPORTED_TLDS,
  getTLDInfo,
  isTLDSupported,
  getTLDsByCategory,
  getPopularTLDs,
  getHighDemandTLDs,
  getTLDsByPriceRange
} from '../tld-config'
export { 
  SUPPORTED_TLD_LIST,
  getAllSupportedTLDs,
  getTLDsByCategory as getTLDsByCategoryFromList
} from '../tld-list'
export type { TLDInfo, TLDMarketData } from '../api'
