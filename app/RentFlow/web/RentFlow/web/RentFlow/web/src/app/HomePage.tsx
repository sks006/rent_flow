import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Zap, Users, TrendingUp } from 'lucide-react'
import WalletButton from '../components/wallet/WalletButton'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Tokenization',
      description: 'Tokenize Airbnb bookings as NFTs with verified ownership and revenue streams.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Instant Liquidity',
      description: 'Access up to 80% LTV instantly by collateralizing your booking NFTs.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Profit Sharing',
      description: 'Lock funds in cycles (1-12 months) and earn fees from booking revenues.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Governance',
      description: 'Participate in platform governance with RF tokens and vote on fee structures.',
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="gradient-text">Tokenize</span> Your Airbnb Bookings
          <br />
          <span className="text-white">Access <span className="gradient-text">Instant Liquidity</span></span>
        </h1>
        <p className="text-xl text-white/70 max-w-3xl mx-auto mb-10">
          Transform future rental income into present-day capital. Securely tokenize Airbnb bookings,
          access instant financing, and participate in profit-sharing cycles—all on Solana.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/rent-flow" className="btn-primary flex items-center gap-2">
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
          <WalletButton />
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold mb-12 text-center">Why Choose RentFlow?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card hover:scale-105 transition-transform duration-300">
              <div className="p-3 rounded-lg bg-solana-purple/20 w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="gradient-border p-8 rounded-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-solana-purple/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect & Tokenize</h3>
            <p className="text-white/60">Connect your wallet and tokenize Airbnb bookings as NFTs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-solana-green/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Collateralize & Borrow</h3>
            <p className="text-white/60">Use NFTs as collateral to access instant liquidity (up to 80% LTV)</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-solana-blue/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn & Govern</h3>
            <p className="text-white/60">Lock funds in profit-sharing cycles and participate in governance</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/70 mb-6">
            Join the future of real estate financing. Connect your wallet and start tokenizing today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/rent-flow" className="btn-primary">
              Launch App
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
