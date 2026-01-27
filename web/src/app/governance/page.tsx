import Navigation from '@/components/shared/Navigation';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';

export default function Governance() {
  return (
    <main className="min-h-screen">
      <Navigation />

      <div className="pt-32 pb-20">
        <div className="container-custom space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl font-display font-bold">
              <span className="text-gradient">Governance</span>
            </h1>
            <p className="text-xl text-text-secondary">
              Participate in protocol decisions and shape the future of RentFlow
            </p>
          </div>

          {/* Governance Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="space-y-3">
              <div className="text-text-muted text-sm font-medium">Your Voting Power</div>
              <div className="text-4xl font-bold text-gradient">2,450</div>
              <div className="text-text-muted text-sm">RENT tokens</div>
            </Card>

            <Card className="space-y-3">
              <div className="text-text-muted text-sm font-medium">Active Proposals</div>
              <div className="text-4xl font-bold text-gradient">8</div>
              <div className="text-accent-green text-sm">3 ending soon</div>
            </Card>

            <Card className="space-y-3">
              <div className="text-text-muted text-sm font-medium">Your Votes Cast</div>
              <div className="text-4xl font-bold text-gradient">12</div>
              <div className="text-text-muted text-sm">All time</div>
            </Card>

            <Card className="space-y-3">
              <div className="text-text-muted text-sm font-medium">Participation Rate</div>
              <div className="text-4xl font-bold text-gradient">87%</div>
              <div className="text-accent-green text-sm">Above average</div>
            </Card>
          </div>

          {/* Active Proposals */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Active Proposals</h2>
              <Button variant="primary">
                Create Proposal
              </Button>
            </div>

            <div className="space-y-4">
              {[
                {
                  id: 'RFP-042',
                  title: 'Reduce Platform Fees to 1.5%',
                  description: 'Proposal to reduce the platform fee from 2% to 1.5% to increase competitiveness and attract more users.',
                  status: 'Active',
                  votesFor: 12450,
                  votesAgainst: 3200,
                  timeLeft: '2 days',
                  quorum: 75,
                },
                {
                  id: 'RFP-041',
                  title: 'Implement Multi-Signature Wallet Support',
                  description: 'Add support for multi-signature wallets to enhance security for high-value property transactions.',
                  status: 'Active',
                  votesFor: 8900,
                  votesAgainst: 1100,
                  timeLeft: '5 days',
                  quorum: 82,
                },
                {
                  id: 'RFP-040',
                  title: 'Launch Referral Program',
                  description: 'Introduce a referral program offering 10% commission on referred property listings for the first year.',
                  status: 'Active',
                  votesFor: 15200,
                  votesAgainst: 4800,
                  timeLeft: '1 day',
                  quorum: 68,
                },
              ].map((proposal, i) => (
                <Card key={i} interactive className="space-y-6">
                  {/* Proposal Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-mono text-sm">{proposal.id}</span>
                        <span className="px-3 py-1 bg-accent-green/20 text-accent-green rounded-full text-xs font-semibold">
                          {proposal.status}
                        </span>
                        <span className="text-text-muted text-sm">
                          Ends in {proposal.timeLeft}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">{proposal.title}</h3>
                      <p className="text-text-secondary">{proposal.description}</p>
                    </div>
                  </div>

                  {/* Voting Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Voting Progress</span>
                      <span className="text-text-primary font-medium">{proposal.quorum}% Quorum</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative h-3 bg-background-tertiary rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full"
                        style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                      />
                    </div>

                    {/* Vote Counts */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-accent-green rounded-full" />
                        <span className="text-text-secondary">For:</span>
                        <span className="font-semibold text-accent-green">
                          {proposal.votesFor.toLocaleString()} ({Math.round((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100)}%)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-accent-orange rounded-full" />
                        <span className="text-text-secondary">Against:</span>
                        <span className="font-semibold text-accent-orange">
                          {proposal.votesAgainst.toLocaleString()} ({Math.round((proposal.votesAgainst / (proposal.votesFor + proposal.votesAgainst)) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <Button variant="primary" className="flex-1">
                      Vote For
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Vote Against
                    </Button>
                    <button className="px-6 py-3 text-text-secondary hover:text-primary transition-colors font-medium">
                      Details
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Past Proposals */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Recent Decisions</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: 'RFP-039', title: 'Increase Staking Rewards', result: 'Passed', votesFor: 85 },
                { id: 'RFP-038', title: 'Add NFT Property Deeds', result: 'Passed', votesFor: 92 },
                { id: 'RFP-037', title: 'Change Minimum Lease Term', result: 'Rejected', votesFor: 38 },
                { id: 'RFP-036', title: 'Treasury Diversification', result: 'Passed', votesFor: 78 },
              ].map((proposal, i) => (
                <Card key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-mono text-sm">{proposal.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        proposal.result === 'Passed' 
                          ? 'bg-accent-green/20 text-accent-green' 
                          : 'bg-accent-orange/20 text-accent-orange'
                      }`}>
                        {proposal.result}
                      </span>
                    </div>
                    <h4 className="font-semibold">{proposal.title}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">{proposal.votesFor}%</div>
                    <div className="text-xs text-text-muted">Voted For</div>
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
