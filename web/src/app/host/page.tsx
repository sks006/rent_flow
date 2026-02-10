'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/common/Navbar'
import { useStore } from '@/store/useStore'
import { motion } from 'framer-motion'
import { 
  Link as LinkIcon,
  Shield,
  MapPin,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Upload,
  BadgeCheck,
  Building2,
  DollarSign,
  Users
} from 'lucide-react'

export default function HostPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  const {
    walletPublicKey,
    isConnected,
    mintProperty,
    isMinting,
    clearVerification,
    activeProperty,
    currentStep,
    isLoading: isVerifyingAirbnb,
    error: airbnbError,
    verifyProperty,
    setCurrentStep,
    resetAirbnbVerification
  } = useStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (airbnbError) {
      setError(airbnbError)
      setCurrentStep(2) // Move to result/error step
    }
  }, [airbnbError])

  const validateUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.includes('airbnb')
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid Airbnb URL')
      return
    }

    try {
      await verifyProperty(url)
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    }
  }

  const handleMint = async () => {
    if (!activeProperty || !activeProperty.verified) {
      setError('Property must be verified before tokenization')
      return
    }

    setCurrentStep(3) // Tokenizing step
    
    try {
      const result = await mintProperty(
        {
          url,
          ...activeProperty
        },
        walletPublicKey!.toString()
      )
      
      // Show success message with mint address
      alert(result + '\n\nRedirecting to Invest page...')
      
      // Reset form
      setUrl('')
      resetAirbnbVerification()
      
      // Navigate to invest page after a short delay
      setTimeout(() => {
        router.push('/invest')
      }, 1000)
      
    } catch (err: any) {
      setError(err.message || 'Tokenization failed')
      setCurrentStep(2) // Fallback to result step on error
    }
  }

  const handleReset = () => {
    setUrl('')
    resetAirbnbVerification()
    setError(null)
  }

  const exampleUrls = [
    'https://airbnb.com/rooms/12345678',
    'https://airbnb.co.uk/rooms/98765432',
    'https://airbnb.com/homes/55555555',
    'https://airbnb.com/plus/11111111'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tokenize Your <span className="text-gradient">Airbnb Property</span>
            </h1>
            <p className="text-xl text-gray-400">
              Paste any Airbnb URL. We'll verify it and create RWA tokens on Solana.
            </p>
          </motion.div>

          {/* Main Card */}
          <div className="glass-effect rounded-2xl p-6 md:p-8">
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-8">
              {['Input URL', 'Verify', 'Tokenize'].map((step, index) => {
                const currentStepIndex = currentStep - 1
                const isActive = index === currentStepIndex
                const isCompleted = index < currentStepIndex
                
                return (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted ? 'bg-green-500' :
                      isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                      'bg-gray-800'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm ${
                      isActive ? 'text-white font-semibold' : 'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Step 1: URL Input */}
            {currentStep === 1 && !isVerifyingAirbnb && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Airbnb Listing URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://airbnb.com/rooms/12345678"
                      className="flex-1 px-6 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!mounted || !isConnected}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!mounted || !isConnected || !url.trim()}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Verify Property
                    </button>
                  </div>
                  {mounted && !isConnected && (
                    <p className="text-yellow-500 text-sm mt-2">
                      Connect your wallet to start verification
                    </p>
                  )}
                </div>

                {/* Example URLs */}
                <div>
                  <p className="text-gray-400 text-sm mb-2">Try these example formats:</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleUrls.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setUrl(example)}
                        className="text-sm px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        {example.replace('https://', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wallet Status */}
                <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Wallet Status</div>
                      <div className="font-medium">
                        {mounted ? (isConnected ? 'Connected ✅' : 'Not Connected') : 'Loading...'}
                      </div>
                    </div>
                    {mounted && !isConnected && (
                      <p className="text-sm text-yellow-500">
                        Connect Phantom, Backpack, or any Solana wallet
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Verifying */}
            {isVerifyingAirbnb && currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
                <h3 className="text-xl font-bold mb-2">Verifying Property</h3>
                <p className="text-gray-400 mb-4">
                  Checking Airbnb verification badges and host credibility...
                </p>
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">URL Validation</span>
                    <span className="text-green-400">✓</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Identity Verification</span>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Location Verification</span>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Host Score Calculation</span>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Verification Result */}
            {currentStep === 2 && activeProperty && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Verification Status */}
                <div className={`p-6 rounded-xl ${
                  activeProperty.verified
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
                    : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {activeProperty.verified ? '✅ Property Verified' : '⚠️ Verification Required'}
                      </h3>
                      <p className="text-gray-300">
                        {activeProperty.verified
                          ? 'This property meets all verification requirements'
                          : 'This property needs additional verification steps'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{activeProperty.hostScore}/100</div>
                      <div className="text-sm text-gray-400">Host Score</div>
                    </div>
                  </div>
                </div>

                {/* Verification Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Badges */}
                  <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                    <h4 className="font-bold mb-4">Verification Badges</h4>
                    <div className="space-y-3">
                      {activeProperty.verification?.badges?.map((badge: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <BadgeCheck className="w-5 h-5 text-green-400 mr-2" />
                          <span className="capitalize">{badge} Verified</span>
                        </div>
                      ))}
                      {(!activeProperty.verification?.badges || activeProperty.verification.badges.length === 0) && (
                        <p className="text-gray-400">No verification badges found</p>
                      )}
                    </div>
                  </div>

                  {/* Issues & Requirements */}
                  <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                    <h4 className="font-bold mb-4">Requirements</h4>
                    <div className="space-y-2">
                      {activeProperty.issues?.map((issue: string, index: number) => (
                        <div key={index} className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{issue}</span>
                        </div>
                      ))}
                      {(!activeProperty.issues || activeProperty.issues.length === 0) && (
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          <span>All requirements met</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Try Another URL
                  </button>
                  <button
                    onClick={handleMint}
                    disabled={!activeProperty.verified}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      activeProperty.verified
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                        : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {activeProperty.verified ? '🚀 Tokenize Property' : 'Complete Verification First'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Tokenizing */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-6"></div>
                <h3 className="text-xl font-bold mb-2">Creating RWA Token</h3>
                <p className="text-gray-400 mb-4">
                  Minting property token on Solana blockchain...
                </p>
                <div className="space-y-3 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Initializing Transaction</span>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Creating Token Account</span>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Minting RWA Tokens</span>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Setting Up Metadata</span>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30"
              >
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-gray-300 mt-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </div>

          {/* Verification Requirements Info */}
          <div className="mt-8 glass-effect rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Verification Requirements</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="font-medium">Identity Verification</span>
                </div>
                <p className="text-sm text-gray-400">
                  Airbnb red checkmark badge next to host profile
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-green-400 mr-2" />
                  <span className="font-medium">Location Verification</span>
                </div>
                <p className="text-sm text-gray-400">
                  Verified location through Airbnb app photos/videos
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="font-medium">Quality Standards</span>
                </div>
                <p className="text-sm text-gray-400">
                  Minimum reviews and rating for investor protection
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
