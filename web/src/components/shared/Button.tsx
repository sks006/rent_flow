/**
 * Button Component
 * 
 * A reusable button component with multiple variants and sizes.
 * This is a "controlled component" - the parent decides how it looks and behaves.
 * 
 * Usage Examples:
 * <Button variant="primary">Click Me</Button>
 * <Button variant="secondary" size="lg">Large Button</Button>
 * <Button variant="outline" onClick={() => alert('Hi!')}>Alert</Button>
 * 
 * @param children - The text or elements inside the button
 * @param variant - Visual style: 'primary' (gradient), 'secondary' (glass), 'outline' (border only)
 * @param size - Button size: 'sm' (small), 'md' (medium), 'lg' (large)
 * @param onClick - Function to call when button is clicked
 * @param className - Additional CSS classes to add
 * @param disabled - If true, button can't be clicked
 */

import { ReactNode } from 'react';

// TypeScript interface - defines what props this component accepts
// This helps catch errors and provides autocomplete in your editor
interface ButtonProps {
  children: ReactNode;              // Can be text, elements, or other components
  variant?: 'primary' | 'secondary' | 'outline';  // ? means optional
  size?: 'sm' | 'md' | 'lg';       // Limited to these 3 options
  onClick?: () => void;             // Optional function with no parameters
  className?: string;               // Additional custom classes
  disabled?: boolean;               // Optional boolean (true/false)
}

export default function Button({
  children,
  variant = 'primary',    // Default value if not provided
  size = 'md',           // Default value if not provided
  onClick,
  className = '',        // Default to empty string
  disabled = false,      // Default to false
}: ButtonProps) {
  
  // Base styles applied to all buttons
  // These classes are always present regardless of variant or size
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles - different looks for different purposes
  // This is an object where keys are variant names and values are CSS classes
  const variants = {
    primary: 'btn-primary',      // Gradient background (defined in globals.css)
    secondary: 'btn-secondary',  // Glass effect (defined in globals.css)
    outline: 'btn-outline',      // Border only (defined in globals.css)
  };

  // Size styles - different padding and text sizes
  const sizes = {
    sm: 'px-4 py-2 text-sm',    // Small: 16px horizontal, 8px vertical padding
    md: 'px-6 py-3 text-base',  // Medium: 24px horizontal, 12px vertical padding
    lg: 'px-8 py-4 text-lg',    // Large: 32px horizontal, 16px vertical padding
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      // Combine all the classes together
      // Template literal (backticks) lets us insert variables into strings
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
