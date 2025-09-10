// Test script to verify TLD integration
// Run this in the browser console to test functionality

export function testTLDIntegration() {
  console.log('🧪 Testing TLD Integration...')
  
  try {
    // Test TLD Service
    const { tldService } = require('./tld-service')
    console.log('✅ TLD Service imported successfully')
    
    // Test basic functionality
    const allTLDs = tldService.getAllSupportedTLDs()
    console.log(`✅ Total supported TLDs: ${allTLDs.length}`)
    
    const popularTLDs = tldService.getPopularTLDs(5)
    console.log('✅ Popular TLDs:', popularTLDs.map((t: any) => `.${t.tld}`))
    
    const highDemandTLDs = tldService.getHighDemandTLDs(5)
    console.log('✅ High Demand TLDs:', highDemandTLDs.map((t: any) => `.${t.tld}`))
    
    // Test TLD info
    const comInfo = tldService.getTLDInfo('com')
    console.log('✅ .com TLD info:', comInfo)
    
    // Test category filtering
    const gTLDs = tldService.getTLDsByCategory('gTLD')
    const ccTLDs = tldService.getTLDsByCategory('ccTLD')
    console.log(`✅ gTLDs: ${gTLDs.length}, ccTLDs: ${ccTLDs.length}`)
    
    // Test search
    const searchResults = tldService.searchTLDs('ai', 5)
    console.log('✅ Search results for "ai":', searchResults.map((t: any) => `.${t.tld}`))
    
    // Test TLD list
    const { SUPPORTED_TLD_LIST } = require('./tld-list')
    console.log('✅ TLD List imported:', {
      gTLDs: SUPPORTED_TLD_LIST.gTLDs.length,
      ccTLDs: SUPPORTED_TLD_LIST.ccTLDs.length
    })
    
    // Test TLD config
    const { ALL_SUPPORTED_TLDS } = require('./tld-config')
    console.log('✅ TLD Config imported:', ALL_SUPPORTED_TLDS.length)
    
    console.log('🎉 All TLD integration tests passed!')
    return true
    
  } catch (error) {
    console.error('❌ TLD integration test failed:', error)
    return false
  }
}

// Auto-run test if this file is imported
if (typeof window !== 'undefined') {
  // Browser environment
  ;(window as any).testTLDIntegration = testTLDIntegration
  console.log('🔧 TLD Integration test available. Run: testTLDIntegration()')
}
