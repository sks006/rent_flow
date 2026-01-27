# RentFlow Frontend Documentation

Welcome to the RentFlow frontend! This guide will help you understand how the application works, even if you're new to web development.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Design System](#design-system)
4. [Components Explained](#components-explained)
5. [Pages Explained](#pages-explained)
6. [Styling Guide](#styling-guide)
7. [Common Tasks](#common-tasks)

---

## Getting Started

### What You Need

- **Node.js** (version 18 or higher) - JavaScript runtime
- **npm** - Package manager (comes with Node.js)
- A code editor like VS Code

### Installation

1. Navigate to the web directory:
   ```bash
   cd /home/sabiar/rentflow/rent_flow/web
   ```

2. Install dependencies (only needed once):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to: `http://localhost:3000`

### What is Next.js?

Next.js is a React framework that makes building web applications easier. Think of it as a toolkit that handles:
- **Routing** - Automatically creates pages based on your file structure
- **Performance** - Makes your site load faster
- **SEO** - Helps search engines find your site

---

## Project Structure

Here's how the files are organized:

```
web/
├── src/                          # All your source code lives here
│   ├── app/                      # Pages and layouts (Next.js App Router)
│   │   ├── page.tsx             # Homepage (/)
│   │   ├── layout.tsx           # Root layout (wraps all pages)
│   │   ├── globals.css          # Global styles
│   │   ├── dashboard/           
│   │   │   └── page.tsx         # Dashboard page (/dashboard)
│   │   ├── rent/
│   │   │   └── page.tsx         # Rent page (/rent)
│   │   └── governance/
│   │       └── page.tsx         # Governance page (/governance)
│   │
│   └── components/               # Reusable UI components
│       └── shared/
│           ├── Navigation.tsx   # Top navigation bar
│           ├── Button.tsx       # Reusable button component
│           └── Card.tsx         # Reusable card component
│
├── public/                       # Static files (images, fonts, etc.)
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Project dependencies and scripts
```

### How Next.js Routing Works

Next.js uses **file-based routing**. This means:
- `app/page.tsx` → becomes `/` (homepage)
- `app/dashboard/page.tsx` → becomes `/dashboard`
- `app/rent/page.tsx` → becomes `/rent`

No need to manually configure routes! 🎉

---

## Design System

### Color Palette

We use a dark theme inspired by Kamino (a DeFi platform). Here are the main colors:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Background | `#0a0f1e` | Main background |
| Background Secondary | `#0b1a31` | Secondary backgrounds |
| Primary (Cyan) | `#00D4FF` | Buttons, links, highlights |
| Accent Purple | `#9945FF` | Secondary accents |
| Accent Green | `#14F195` | Success states |
| Accent Orange | `#FF6B35` | Warning states |

### Typography

- **Display Font**: Outfit - Used for big headings
- **Body Font**: Inter - Used for regular text

### Key Design Concepts

#### 1. Glassmorphism
A frosted glass effect that makes elements look modern and premium.

```tsx
// In Tailwind, use the .glass class
<div className="glass">
  This has a frosted glass effect!
</div>
```

#### 2. Gradients
Smooth color transitions that add visual interest.

```tsx
// Text gradient
<h1 className="text-gradient">Gradient Text</h1>

// Background gradient
<button className="bg-gradient-primary">Click Me</button>
```

#### 3. Animations
Smooth movements that make the UI feel alive.

```tsx
// Hover effects
<div className="hover:scale-105 transition-all">
  I grow when you hover!
</div>
```

---

## Components Explained

### What is a Component?

A component is a reusable piece of UI. Think of it like a LEGO block - you can use it multiple times in different places.

### Navigation Component

**Location**: `src/components/shared/Navigation.tsx`

**What it does**: Shows the top navigation bar on every page.

**Key parts**:
```tsx
export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      {/* Logo */}
      <Link href="/">RentFlow</Link>
      
      {/* Navigation Links */}
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/rent">Rent</Link>
      <Link href="/governance">Governance</Link>
      
      {/* Connect Wallet Button */}
      <button>Connect Wallet</button>
    </nav>
  );
}
```

**CSS Classes Explained**:
- `fixed` - Stays at the top when you scroll
- `top-0 left-0 right-0` - Stretches across the entire width
- `z-50` - Appears above other elements
- `glass-strong` - Applies the glassmorphism effect

### Button Component

**Location**: `src/components/shared/Button.tsx`

**What it does**: Creates consistent, reusable buttons.

**How to use it**:
```tsx
// Primary button (gradient background)
<Button variant="primary">Click Me</Button>

// Secondary button (glass effect)
<Button variant="secondary">Cancel</Button>

// Outline button (just a border)
<Button variant="outline">Learn More</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

**Props Explained**:
- `variant` - Changes the button style (primary/secondary/outline)
- `size` - Changes the button size (sm/md/lg)
- `onClick` - Function to run when clicked
- `disabled` - Makes the button unclickable

### Card Component

**Location**: `src/components/shared/Card.tsx`

**What it does**: Creates a container with glassmorphism effect.

**How to use it**:
```tsx
// Basic card
<Card>
  <h3>Title</h3>
  <p>Content goes here</p>
</Card>

// Interactive card (grows on hover)
<Card interactive>
  <p>I grow when you hover over me!</p>
</Card>

// Card with glow effect
<Card glow>
  <p>I have a cyan glow!</p>
</Card>
```

---

## Pages Explained

### Homepage (`app/page.tsx`)

**Purpose**: The landing page that visitors see first.

**Main sections**:

1. **Hero Section** - Big title and call-to-action buttons
   ```tsx
   <h1>Decentralized Rental Made Simple</h1>
   <Button>Launch App</Button>
   ```

2. **Stats Section** - Shows key metrics (TVL, Properties, Users)
   ```tsx
   <div className="text-4xl font-bold text-gradient">$2.5M+</div>
   <div className="text-sm">Total Value Locked</div>
   ```

3. **Features Section** - Grid of 6 feature cards
   ```tsx
   <Card interactive>
     <h3>Secure & Trustless</h3>
     <p>All transactions secured by blockchain</p>
   </Card>
   ```

4. **CTA Section** - Final call-to-action before footer

### Dashboard Page (`app/dashboard/page.tsx`)

**Purpose**: Shows property management overview.

**Main sections**:

1. **Stats Grid** - 4 metric cards
   - Total Properties
   - Monthly Revenue
   - Occupancy Rate
   - Active Tenants

2. **Recent Activity** - Timeline of recent events
   ```tsx
   {activities.map((activity) => (
     <div key={activity.id}>
       <div>{activity.action}</div>
       <div>{activity.amount}</div>
     </div>
   ))}
   ```

3. **Quick Actions** - Buttons for common tasks
   - Add Property
   - Manage Tenants
   - Generate Report

4. **Properties Grid** - Shows your properties

### Rent Page (`app/rent/page.tsx`)

**Purpose**: Browse and rent properties.

**Main sections**:

1. **Filters** - Search by location, price, type
   ```tsx
   <select>
     <option>All Locations</option>
     <option>Miami Beach, FL</option>
   </select>
   ```

2. **Property Listings** - Grid of available properties
   - Property image (emoji placeholder)
   - Details (bedrooms, bathrooms, sqft)
   - Price and availability
   - View Details button

### Governance Page (`app/governance/page.tsx`)

**Purpose**: Vote on protocol proposals.

**Main sections**:

1. **Governance Stats** - Your voting power and participation

2. **Active Proposals** - Proposals you can vote on
   ```tsx
   <Card>
     <h3>{proposal.title}</h3>
     <p>{proposal.description}</p>
     
     {/* Progress bar */}
     <div className="bg-gradient-primary" 
          style={{ width: `${votePercentage}%` }} />
     
     {/* Voting buttons */}
     <Button>Vote For</Button>
     <Button>Vote Against</Button>
   </Card>
   ```

3. **Recent Decisions** - Past proposal results

---

## Styling Guide

### Tailwind CSS Basics

Tailwind uses **utility classes** - small, single-purpose classes you combine together.

#### Spacing
```tsx
// Padding
<div className="p-4">Padding on all sides</div>
<div className="px-6 py-3">Padding: 6 horizontal, 3 vertical</div>

// Margin
<div className="m-4">Margin on all sides</div>
<div className="mt-8">Margin top only</div>
```

#### Layout
```tsx
// Flexbox
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

// Grid
<div className="grid grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

#### Colors
```tsx
// Background
<div className="bg-background">Dark background</div>
<div className="bg-primary">Cyan background</div>

// Text
<div className="text-primary">Cyan text</div>
<div className="text-text-secondary">Muted text</div>
```

#### Responsive Design
```tsx
// Mobile first approach
<div className="text-sm md:text-base lg:text-lg">
  {/* Small on mobile, medium on tablet, large on desktop */}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### Custom Classes

We've created custom classes in `globals.css`:

```css
/* Glassmorphism */
.glass - Light glass effect
.glass-strong - Strong glass effect

/* Buttons */
.btn-primary - Gradient button
.btn-secondary - Glass button
.btn-outline - Outline button

/* Cards */
.card - Basic card
.card-interactive - Card that grows on hover

/* Text */
.text-gradient - Gradient text effect
.text-gradient-accent - Accent gradient text

/* Effects */
.glow-primary - Cyan glow
.animated-gradient - Animated background
```

---

## Common Tasks

### Adding a New Page

1. Create a new folder in `src/app/`:
   ```bash
   mkdir src/app/my-new-page
   ```

2. Create `page.tsx` inside:
   ```tsx
   import Navigation from '@/components/shared/Navigation';
   
   export default function MyNewPage() {
     return (
       <main className="min-h-screen">
         <Navigation />
         <div className="container-custom pt-32">
           <h1 className="text-5xl font-bold">My New Page</h1>
         </div>
       </main>
     );
   }
   ```

3. Access it at: `http://localhost:3000/my-new-page`

### Creating a New Component

1. Create a new file in `src/components/shared/`:
   ```tsx
   // src/components/shared/MyComponent.tsx
   
   interface MyComponentProps {
     title: string;
     description: string;
   }
   
   export default function MyComponent({ title, description }: MyComponentProps) {
     return (
       <div className="card">
         <h3 className="text-xl font-bold">{title}</h3>
         <p className="text-text-secondary">{description}</p>
       </div>
     );
   }
   ```

2. Use it in a page:
   ```tsx
   import MyComponent from '@/components/shared/MyComponent';
   
   <MyComponent 
     title="Hello" 
     description="This is my component!" 
   />
   ```

### Adding a New Color

1. Open `tailwind.config.ts`

2. Add your color to the `colors` section:
   ```ts
   colors: {
     // ... existing colors
     myColor: '#FF5733',
   }
   ```

3. Use it in your components:
   ```tsx
   <div className="bg-myColor text-white">
     Custom color!
   </div>
   ```

### Debugging Tips

1. **Check the browser console** (F12) for errors
2. **Use console.log()** to see what's happening:
   ```tsx
   console.log('My variable:', myVariable);
   ```
3. **Check the terminal** where `npm run dev` is running for build errors
4. **Use React DevTools** browser extension to inspect components

---

## Key Concepts for Beginners

### What is TypeScript?

TypeScript is JavaScript with **types**. Types help catch errors before you run the code.

```tsx
// JavaScript (no types)
function add(a, b) {
  return a + b;
}

// TypeScript (with types)
function add(a: number, b: number): number {
  return a + b;
}
```

### What is JSX/TSX?

JSX (or TSX for TypeScript) lets you write HTML-like code in JavaScript:

```tsx
// This looks like HTML but it's actually JavaScript!
const element = (
  <div className="card">
    <h1>Hello World</h1>
  </div>
);
```

### What are Props?

Props are how you pass data to components:

```tsx
// Parent component
<Button variant="primary" size="lg">
  Click Me
</Button>

// Button component receives these as props
function Button({ variant, size, children }) {
  // variant = "primary"
  // size = "lg"
  // children = "Click Me"
}
```

### What is State?

State is data that can change over time. When state changes, the component re-renders.

```tsx
import { useState } from 'react';

function Counter() {
  // count is the state, setCount updates it
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

---

## Need Help?

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

## Summary

You now know:
- ✅ How to start the development server
- ✅ How the project is structured
- ✅ How components work
- ✅ How to use Tailwind CSS
- ✅ How to add new pages and components
- ✅ Key React and TypeScript concepts

Happy coding! 🚀
