/**
 * Card Component
 * 
 * A container component with glassmorphism effect (frosted glass look).
 * Used throughout the app to group related content.
 * 
 * Usage Examples:
 * <Card>Basic card content</Card>
 * <Card interactive>Grows on hover</Card>
 * <Card glow>Has cyan glow effect</Card>
 * 
 * @param children - The content to display inside the card
 * @param interactive - If true, card grows slightly on hover (good for clickable cards)
 * @param className - Additional CSS classes to customize the card
 * @param glow - If true, adds a cyan glow effect around the card
 */

import { ReactNode } from 'react';

// TypeScript interface - defines the shape of props
interface CardProps {
  children: ReactNode;      // Required: content inside the card
  interactive?: boolean;    // Optional: makes card interactive
  className?: string;       // Optional: additional styles
  glow?: boolean;          // Optional: adds glow effect
}

export default function Card({
  children,
  interactive = false,    // Default to false (not interactive)
  className = '',        // Default to empty string
  glow = false,         // Default to false (no glow)
}: CardProps) {
  
  // Choose the base class based on whether it's interactive
  // Ternary operator: condition ? valueIfTrue : valueIfFalse
  const baseClass = interactive ? 'card-interactive' : 'card';
  
  // Add glow class if glow prop is true
  const glowClass = glow ? 'glow-primary' : '';

  return (
    // Combine all classes: base + glow + any custom classes
    // Template literal lets us insert variables into the string
    <div className={`${baseClass} ${glowClass} ${className}`}>
      {children}
    </div>
  );
}
