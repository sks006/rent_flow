import Navigation from '@/components/shared/Navigation';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';

export default function Rent() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container-custom space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-bold">
              Rent <span className="text-gradient">Properties</span>
            </h1>
            <p className="text-xl text-text-secondary">
              Browse available properties and find your perfect rental
            </p>
          </div>

          {/* Filters */}
          <Card className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Location</label>
                <select className="w-full glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>All Locations</option>
                  <option>Miami Beach, FL</option>
                  <option>New York, NY</option>
                  <option>Austin, TX</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Price Range</label>
                <select className="w-full glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Any Price</option>
                  <option>$0 - $2,000</option>
                  <option>$2,000 - $4,000</option>
                  <option>$4,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Property Type</label>
                <select className="w-full glass px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>All Types</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Condo</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="primary" className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </Card>

          {/* Properties Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                name: 'Sunset Villa #203', 
                location: 'Miami Beach, FL', 
                rent: '$2,500', 
                bedrooms: 2, 
                bathrooms: 2, 
                sqft: '1,200',
                image: '🏖️',
                available: true 
              },
              { 
                name: 'Ocean View Apartment', 
                location: 'Santa Monica, CA', 
                rent: '$3,200', 
                bedrooms: 3, 
                bathrooms: 2, 
                sqft: '1,500',
                image: '🌊',
                available: true 
              },
              { 
                name: 'Downtown Loft #5', 
                location: 'New York, NY', 
                rent: '$3,800', 
                bedrooms: 1, 
                bathrooms: 1, 
                sqft: '900',
                image: '🏙️',
                available: false 
              },
              { 
                name: 'Garden House #8', 
                location: 'Austin, TX', 
                rent: '$2,200', 
                bedrooms: 3, 
                bathrooms: 2.5, 
                sqft: '1,800',
                image: '🏡',
                available: true 
              },
              { 
                name: 'Modern Studio', 
                location: 'San Francisco, CA', 
                rent: '$2,800', 
                bedrooms: 1, 
                bathrooms: 1, 
                sqft: '650',
                image: '🌉',
                available: true 
              },
              { 
                name: 'Lakeside Retreat', 
                location: 'Seattle, WA', 
                rent: '$3,500', 
                bedrooms: 4, 
                bathrooms: 3, 
                sqft: '2,200',
                image: '🏞️',
                available: true 
              },
            ].map((property, i) => (
              <Card key={i} interactive className="space-y-4">
                {/* Property Image */}
                <div className="relative">
                  <div className="text-7xl text-center py-12 bg-gradient-to-br from-background-secondary to-background-tertiary rounded-xl">
                    {property.image}
                  </div>
                  {property.available ? (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-accent-green/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                      Available
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-text-muted/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                      Occupied
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold">{property.name}</h3>
                    <p className="text-text-muted text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {property.location}
                    </p>
                  </div>

                  {/* Property Stats */}
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {property.bedrooms} bed
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      {property.bathrooms} bath
                    </span>
                    <span>{property.sqft} sqft</span>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div>
                      <div className="text-3xl font-bold text-gradient">{property.rent}</div>
                      <div className="text-xs text-text-muted">per month</div>
                    </div>
                    <Button 
                      variant={property.available ? "primary" : "secondary"} 
                      size="sm"
                      disabled={!property.available}
                    >
                      {property.available ? 'View Details' : 'Unavailable'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-8">
            <Button variant="outline" size="lg">
              Load More Properties
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
