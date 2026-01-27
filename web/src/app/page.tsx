import Navigation from '@/components/shared/Navigation';
import Button from '@/components/shared/Button';
import Card from '@/components/shared/Card';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 animated-gradient opacity-50" />
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
              <span className="text-sm text-text-secondary">Built on Solana</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-tight">
              Decentralized Rental
              <br />
              <span className="text-gradient">Made Simple</span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto">
              RentFlow is an open-source rental protocol built on Solana. 
              Manage properties, collect rent, and govern your community—all on-chain.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button variant="primary" size="lg">
                Launch App
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-gradient">$2.5M+</div>
                <div className="text-sm text-text-muted">Total Value Locked</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-gradient">1,200+</div>
                <div className="text-sm text-text-muted">Active Properties</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-gradient">5,000+</div>
                <div className="text-sm text-text-muted">Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Why Choose <span className="text-gradient">RentFlow</span>
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Experience the future of rental management with transparent, secure, and efficient on-chain solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <Card interactive className="space-y-4">
              <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Secure & Trustless</h3>
              <p className="text-text-secondary">
                All transactions are secured by Solana's blockchain. No intermediaries, no trust required.
              </p>
            </Card>

            {/* Feature Card 2 */}
            <Card interactive className="space-y-4">
              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Lightning Fast</h3>
              <p className="text-text-secondary">
                Powered by Solana's high-performance blockchain for instant rent payments and transfers.
              </p>
            </Card>

            {/* Feature Card 3 */}
            <Card interactive className="space-y-4">
              <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Community Governed</h3>
              <p className="text-text-secondary">
                Participate in governance decisions and shape the future of the protocol.
              </p>
            </Card>

            {/* Feature Card 4 */}
            <Card interactive className="space-y-4">
              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Transparent Analytics</h3>
              <p className="text-text-secondary">
                Track all rental metrics, payments, and performance data in real-time.
              </p>
            </Card>

            {/* Feature Card 5 */}
            <Card interactive className="space-y-4">
              <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Low Fees</h3>
              <p className="text-text-secondary">
                Enjoy minimal transaction costs thanks to Solana's efficient architecture.
              </p>
            </Card>

            {/* Feature Card 6 */}
            <Card interactive className="space-y-4">
              <div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Open Source</h3>
              <p className="text-text-secondary">
                Fully open-source and audited. Build on top of RentFlow with our developer tools.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container-custom">
          <Card glow className="text-center space-y-6 p-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Join thousands of users managing their rentals on-chain with RentFlow
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button variant="primary" size="lg">
                Launch App
              </Button>
              <Button variant="secondary" size="lg">
                Read Documentation
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">R</span>
              </div>
              <span className="text-xl font-display font-bold text-gradient">RentFlow</span>
            </div>
            <div className="text-text-muted text-sm">
              © 2026 RentFlow. Built on Solana.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
