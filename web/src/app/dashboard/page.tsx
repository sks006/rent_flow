import Navigation from '@/components/shared/Navigation';
import Card from '@/components/shared/Card';

export default function Dashboard() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container-custom space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-bold">
              Dashboard
            </h1>
            <p className="text-xl text-text-secondary">
              Monitor your rental portfolio and track performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="space-y-3">
              <div className="text-text-muted text-sm font-medium">Total Properties</div>
              <div className="text-4xl font-bold text-gradient">12</div>
              <div className="text-accent-green text-sm">+2 this month</div>
            </Card>

            <Card className="space-y-3">
              <div className="text-text-muted text-sm font-medium">Monthly Revenue</div>
              <div className="text-4xl font-bold text-gradient">$45,200</div>
              <div className="text-accent-green text-sm">+12.5% from last month</div>
            </Card>

            <Card className="space-y-3">
              <div className="text-text-muted text-sm font-medium">Occupancy Rate</div>
              <div className="text-4xl font-bold text-gradient">94%</div>
              <div className="text-accent-green text-sm">+3% from last month</div>
            </Card>

            <Card className="space-y-3">
              <div className="text-text-muted text-sm font-medium">Active Tenants</div>
              <div className="text-4xl font-bold text-gradient">28</div>
              <div className="text-text-muted text-sm">Across all properties</div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recent Activity</h2>
                <button className="text-primary hover:text-primary-light text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { action: 'Rent Payment Received', property: 'Sunset Villa #203', amount: '+$2,500', time: '2 hours ago', type: 'success' },
                  { action: 'New Lease Signed', property: 'Ocean View Apt #12', amount: '$1,800/mo', time: '5 hours ago', type: 'info' },
                  { action: 'Maintenance Request', property: 'Downtown Loft #5', amount: 'Pending', time: '1 day ago', type: 'warning' },
                  { action: 'Rent Payment Received', property: 'Garden House #8', amount: '+$3,200', time: '2 days ago', type: 'success' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between p-4 glass rounded-lg hover:bg-surface-hover transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'success' ? 'bg-accent-green' :
                        activity.type === 'warning' ? 'bg-accent-orange' :
                        'bg-primary'
                      }`} />
                      <div>
                        <div className="font-medium">{activity.action}</div>
                        <div className="text-sm text-text-muted">{activity.property}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        activity.type === 'success' ? 'text-accent-green' :
                        activity.type === 'warning' ? 'text-accent-orange' :
                        'text-text-primary'
                      }`}>{activity.amount}</div>
                      <div className="text-sm text-text-muted">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="space-y-6">
              <h2 className="text-2xl font-bold">Quick Actions</h2>
              
              <div className="space-y-3">
                <button className="w-full p-4 glass rounded-lg hover:bg-surface-hover transition-all hover:border-primary/50 text-left group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow-sm transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Add Property</div>
                      <div className="text-sm text-text-muted">List a new rental</div>
                    </div>
                  </div>
                </button>

                <button className="w-full p-4 glass rounded-lg hover:bg-surface-hover transition-all hover:border-primary/50 text-left group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center group-hover:shadow-glow-sm transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Manage Tenants</div>
                      <div className="text-sm text-text-muted">View all tenants</div>
                    </div>
                  </div>
                </button>

                <button className="w-full p-4 glass rounded-lg hover:bg-surface-hover transition-all hover:border-primary/50 text-left group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow-sm transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Generate Report</div>
                      <div className="text-sm text-text-muted">Financial reports</div>
                    </div>
                  </div>
                </button>
              </div>
            </Card>
          </div>

          {/* Properties Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Your Properties</h2>
              <button className="text-primary hover:text-primary-light font-medium">
                View All →
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Sunset Villa #203', location: 'Miami Beach, FL', rent: '$2,500/mo', status: 'Occupied', image: '🏖️' },
                { name: 'Downtown Loft #5', location: 'New York, NY', rent: '$3,800/mo', status: 'Occupied', image: '🏙️' },
                { name: 'Garden House #8', location: 'Austin, TX', rent: '$2,200/mo', status: 'Available', image: '🏡' },
              ].map((property, i) => (
                <Card key={i} interactive className="space-y-4">
                  <div className="text-6xl text-center py-8 bg-gradient-to-br from-background-secondary to-background-tertiary rounded-lg">
                    {property.image}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{property.name}</h3>
                    <p className="text-text-muted text-sm">{property.location}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold text-gradient">{property.rent}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === 'Occupied' 
                          ? 'bg-accent-green/20 text-accent-green' 
                          : 'bg-accent-orange/20 text-accent-orange'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
