'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/common/Navbar'
import { useStore } from '@/store/useStore'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Building2,
  Users,
  DollarSign,
  Filter,
  Search,
  ChevronRight,
  Star,
  MapPin,
  Bed,
  Bath,
  Wifi,
  Waves,
  Car,
  Utensils,
  Mountain,
  Leaf,
  Sparkles
} from 'lucide-react'

export default function InvestPage() {
  const {
    properties,
    featuredProperties,
    isFetching,
    fetchProperties,
    selectedProperty,
    setSelectedProperty,
    investInProperty,
    isInvesting,
    walletPublicKey,
    isConnected
  } = useStore()

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    verifiedOnly: true,
    minYield: 0,
    maxYield: 15,
    location: '',
    propertyType: 'all'
  })
  const [investAmount, setInvestAmount] = useState(1000)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchProperties()
  }, [])

  const handleInvest = async (propertyId: string) => {
    if (!isConnected || !walletPublicKey) {
      alert('Please connect your wallet first')
      return
    }

    const shares = Math.floor(investAmount / (properties.find(p => p.id === propertyId)?.tokenInfo?.pricePerShare || 1))
    
    try {
      const result = await investInProperty(propertyId, shares, walletPublicKey.toString())
      alert(result)
    } catch (error: any) {
      alert(`Investment failed: ${error.message}`)
    }
  }

  const filteredProperties = properties.filter(property => {
    if (filters.verifiedOnly && !property.verification.isVerified) return false
    if (property.tokenInfo && property.tokenInfo.yieldRate < filters.minYield) return false
    if (property.tokenInfo && property.tokenInfo.yieldRate > filters.maxYield) return false
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.propertyType !== 'all' && property.tokenInfo && filters.propertyType !== 'any') {
      // Type filtering logic here
    }
    if (search && !property.title.toLowerCase().includes(search.toLowerCase()) && 
        !property.location.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const stats = [
    { icon: <DollarSign />, label: 'Total Value', value: '$2.4M', change: '+12.5%' },
    { icon: <TrendingUp />, label: 'Avg Yield', value: '8.2%', change: '+0.8%' },
    { icon: <Building2 />, label: 'Properties', value: properties.length.toString(), change: '+3' },
    { icon: <Users />, label: 'Investors', value: '1,234', change: '+42' },
  ]

  const amenitiesIcons = {
    wifi: <Wifi className="w-4 h-4" />,
    pool: <Waves className="w-4 h-4" />,
    parking: <Car className="w-4 h-4" />,
    kitchen: <Utensils className="w-4 h-4" />,
    beach: <Waves className="w-4 h-4" />,
    mountain: <Mountain className="w-4 h-4" />,
    city: <Building2 className="w-4 h-4" />,
    garden: <Leaf className="w-4 h-4" />,
  }

  const locationIcons: { [key: string]: React.ReactNode } = {
    'bali': <Sparkles className="w-4 h-4 text-yellow-400" />,
    'new york': <Building2 className="w-4 h-4 text-blue-400" />,
    'tokyo': <Sparkles className="w-4 h-4 text-pink-400" />,
    'paris': <Sparkles className="w-4 h-4 text-purple-400" />,
    'sydney': <Waves className="w-4 h-4 text-cyan-400" />,
    'berlin': <Building2 className="w-4 h-4 text-gray-400" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Invest in Tokenized Real Estate</h1>
          <p className="text-gray-400">Browse and invest in verified Airbnb properties</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <div className="text-blue-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-sm px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                  <span className="text-green-400">{stat.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search properties by location or name..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filters.propertyType}
                onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="villa">Villas</option>
                <option value="apartment">Apartments</option>
                <option value="house">Houses</option>
                <option value="hotel">Hotels</option>
              </select>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl bg-gray-800/50 border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-colors"
            >
              {/* Property Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative">
                <div className="absolute top-4 left-4 flex gap-2">
                  {property.verification.isVerified ? (
                    <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                      <span className="text-sm font-medium text-green-400">Verified</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 backdrop-blur-sm">
                      <span className="text-sm font-medium text-yellow-400">Unverified</span>
                    </div>
                  )}
                  {/* Show "New" badge for recently minted properties */}
                  {property.tokenInfo && new Date(property.createdAt).getTime() > Date.now() - 3600000 && (
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
                      <span className="text-sm font-medium text-blue-400">🆕 New</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{property.title}</h3>
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </div>
                    </div>
                    {property.tokenInfo && (
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">
                          {property.tokenInfo.yieldRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-400">APY</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{property.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-gray-400">
                      {property.reviewCount} reviews
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    ${property.pricePerNight}<span className="text-gray-400 text-sm">/night</span>
                  </div>
                </div>

                {/* Token Info */}
                {property.tokenInfo && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Share Price</div>
                        <div className="font-bold">${property.tokenInfo.pricePerShare.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Available</div>
                        <div className="font-bold">
                          {property.tokenInfo.availableShares}/{property.tokenInfo.totalShares}
                        </div>
                      </div>
                    </div>

                    {/* Mint Address Display */}
                    <div className="mb-4 p-2 bg-gray-900/50 rounded-lg border border-gray-700/50">
                      <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Mint Address</div>
                      <div className="text-[11px] font-mono text-blue-400 truncate">
                        {property.tokenInfo.mint.toString()}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Funding Progress</span>
                        <span className="font-semibold">
                          {((1 - property.tokenInfo.availableShares / property.tokenInfo.totalShares) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(1 - property.tokenInfo.availableShares / property.tokenInfo.totalShares) * 100}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Investment Input */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Investment Amount (USD)
                        </label>
                        <input
                          type="number"
                          value={investAmount}
                          onChange={(e) => setInvestAmount(parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="100"
                        />
                      </div>
                      <button
                        onClick={() => handleInvest(property.id)}
                        disabled={!mounted || isInvesting || !isConnected}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20"
                      >
                        {isInvesting ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                            Purchasing Shares...
                          </span>
                        ) : (
                          `Invest $${investAmount?.toLocaleString()}`
                        )}
                      </button>
                      <p className="text-sm text-gray-400 text-center">
                        ≈ {Math.floor(investAmount / property.tokenInfo.pricePerShare)} shares
                      </p>
                    </div>
                  </>
                )}

                {/* View Details */}
                {!property.tokenInfo && (
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="w-full py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    View Details
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && !isFetching && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearch('')
                setFilters({
                  verifiedOnly: true,
                  minYield: 0,
                  maxYield: 15,
                  location: '',
                  propertyType: 'all'
                })
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Loading State */}
        {isFetching && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-400">Loading properties...</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to List Your Property?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Tokenize your Airbnb property and start earning from rental income today
          </p>
          <a
            href="/host"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all"
          >
            Start Tokenizing
            <ChevronRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </main>
    </div>
  )
}
