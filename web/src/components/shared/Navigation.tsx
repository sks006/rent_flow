/**
 * Navigation Component
 * 
 * This is the top navigation bar that appears on every page.
 * It's "fixed" to the top of the screen, so it stays visible when you scroll.
 * 
 * Features:
 * - Logo that links to homepage
 * - Navigation links to different pages
 * - Connect Wallet button
 * - Glassmorphism effect (frosted glass look)
 */

import Link from 'next/link';

export default function Navigation() {
  return (
    // Main navigation container
    // - fixed: Stays at top when scrolling
    // - top-0 left-0 right-0: Stretches across entire width
    // - z-50: Appears above other elements (higher z-index = on top)
    // - glass-strong: Custom class for glassmorphism effect (defined in globals.css)
    // - border-b: Bottom border for separation
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
      <div className="container-custom">
        {/* Flex container for logo, links, and button */}
        {/* justify-between: Pushes items to edges with space between */}
        {/* items-center: Vertically centers items */}
        {/* h-20: Fixed height of 80px (20 * 4px) */}
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          {/* Link component from Next.js - navigates without page reload */}
          <Link href="/" className="flex items-center space-x-2 group">
            {/* Logo icon - gradient background with letter R */}
            {/* group-hover: Applies effect when parent (Link) is hovered */}
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:shadow-glow-md transition-all duration-300">
              <span className="text-2xl font-bold">R</span>
            </div>
            
            {/* Logo text with gradient effect */}
            {/* font-display: Uses Outfit font (defined in layout.tsx) */}
            {/* text-gradient: Custom class for gradient text (defined in globals.css) */}
            <span className="text-2xl font-display font-bold text-gradient">
              RentFlow
            </span>
          </Link>

          {/* Navigation Links */}
          {/* hidden md:flex: Hidden on mobile, visible on medium screens and up */}
          {/* space-x-8: 32px horizontal gap between links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Each link has hover effect that changes color */}
            {/* transition-colors: Smooth color change animation */}
            <Link 
              href="/dashboard" 
              className="text-text-secondary hover:text-primary transition-colors duration-300 font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/rent" 
              className="text-text-secondary hover:text-primary transition-colors duration-300 font-medium"
            >
              Rent
            </Link>
            <Link 
              href="/governance" 
              className="text-text-secondary hover:text-primary transition-colors duration-300 font-medium"
            >
              Governance
            </Link>
          </div>

          {/* Connect Wallet Button */}
          {/* btn-primary: Custom class for primary button style (defined in globals.css) */}
          {/* In the future, this will connect to a Solana wallet */}
          <button className="btn-primary">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}
