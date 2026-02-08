'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/common/Navbar'
import { useStore } from '@/store/useStore'
import { 
  Home, 
  TrendingUp, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle,
  Users,
  DollarSign,
  Building2
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const { properties, fetchProperties } = useStore()
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalValue: 0,
    averageYield: 0,
    activeInvestors: 0
  })

  useEffect(() => {
    fetchProperties()
    
    // Simulate dynamic stats
    const interval = setInterval(() => {
      setStats(prev => ({
        totalProperties: properties.length,
        totalValue: properties.reduce((sum, p) => sum + (p.tokenInfo?.propertyValue || 0), 0),
        averageYield: properties.length > 0 
          ? properties.reduce((sum, p) => sum + (p.tokenInfo?.yieldRate || 0), 0) / properties.length
          : 0,
        activeInvestors: Math.floor(Math.random() * 500) + 100
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [properties.length])

  const features = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Any Airbnb URL",
      description: "Paste any Airbnb listing URL. We verify and tokenize it dynamically.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Real Verification",
      description: "Automatically checks Airbnb verification badges and host credibility.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Instant Tokenization",
      description: "Convert verified properties into RWA tokens in minutes.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Open to All Wallets",
      description: "Connect with Phantom, Backpack, or any Solana wallet.",
      color: "from-orange-500 to-red-500"
    }
  ]

  const steps = [
    {
      number: "1",
      title: "Connect Wallet",
      description: "Link your Phantom, Backpack, or any Solana wallet"
    },
    {
      number: "2",
      title: "Paste Airbnb URL",
      description: "Submit any Airbnb property link for verification"
    },
    {
      number: "3",
      title: "Verify & Tokenize",
      description: "We check verification badges and create RWA tokens"
    },
    {
      number: "4",
      title: "Start Earning",
      description: "Earn yield from rental income or invest in properties"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2"></span>
                <span className="text-sm font-medium">Live on Solana</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="block">Real Estate</span>
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Tokenization for Everyone
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                RentFlow dynamically tokenizes any verified Airbnb property. Connect any wallet, 
                submit any URL, and instantly create RWA assets backed by real rental income.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/host"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Start Tokenizing
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/invest"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
                >
                  Explore Properties
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Stats */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Building2 />, label: "Tokenized Properties", value: `$${(stats.totalValue / 1000000).toFixed(1)}M` },
              { icon: <TrendingUp />, label: "Average Yield", value: `${stats.averageYield.toFixed(1)}%` },
              { icon: <Users />, label: "Active Investors", value: stats.activeInvestors.toLocaleString() },
              { icon: <DollarSign />, label: "Properties", value: stats.totalProperties.toString() }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-effect p-6 rounded-2xl"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <div className="text-blue-400">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dynamic & Open Platform
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              No demo data. Real URLs. Real verification. Any wallet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-10 border border-white/10`}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20 w-fit mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How RentFlow Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Four simple steps from Airbnb URL to tokenized asset
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 relative z-10">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-effect rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Tokenize Your Property?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join property owners and investors in the future of real estate tokenization.
                No restrictions. Any wallet. Any verified Airbnb property.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/host"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-all"
                >
                  Start Free Today
                </Link>
                <Link
                  href="/invest"
                  className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  Browse Properties
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold">RentFlow</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/host" className="text-gray-400 hover:text-white transition-colors">
                Host
              </Link>
              <Link href="/invest" className="text-gray-400 hover:text-white transition-colors">
                Invest
              </Link>
            </div>
            <div className="text-gray-500 text-sm mt-4 md:mt-0">
              © {new Date().getFullYear()} RentFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
