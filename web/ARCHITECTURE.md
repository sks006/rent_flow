# RentFlow Frontend Architecture Guide

This document explains the technical architecture and design decisions for junior developers.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Architecture Overview](#architecture-overview)
3. [Design Patterns](#design-patterns)
4. [File Organization](#file-organization)
5. [Data Flow](#data-flow)
6. [Performance Considerations](#performance-considerations)

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with routing, SSR, and optimization |
| **React** | 19.x | UI library for building components |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |

### Why These Technologies?

**Next.js**:
- ✅ Automatic routing based on file structure
- ✅ Built-in optimization (image optimization, code splitting)
- ✅ Server-side rendering for better SEO
- ✅ Fast refresh for instant feedback during development

**TypeScript**:
- ✅ Catches errors before runtime
- ✅ Better IDE autocomplete
- ✅ Self-documenting code with types
- ✅ Easier refactoring

**Tailwind CSS**:
- ✅ No need to write custom CSS
- ✅ Consistent design system
- ✅ Responsive design made easy
- ✅ Smaller bundle size (purges unused styles)

---

## Architecture Overview

### App Router (Next.js 13+)

We use Next.js App Router, which is the modern way to build Next.js apps.

```
app/
├── layout.tsx          # Root layout (wraps everything)
├── page.tsx            # Homepage route (/)
├── globals.css         # Global styles
├── dashboard/
│   └── page.tsx        # Dashboard route (/dashboard)
├── rent/
│   └── page.tsx        # Rent route (/rent)
└── governance/
    └── page.tsx        # Governance route (/governance)
```

**How it works**:
1. `layout.tsx` wraps all pages (contains Navigation, fonts, metadata)
2. Each `page.tsx` becomes a route
3. Nested folders create nested routes

### Component Architecture

```
components/
└── shared/              # Shared components used across pages
    ├── Navigation.tsx   # Top navigation bar
    ├── Button.tsx       # Reusable button
    └── Card.tsx         # Reusable card container
```

**Design Philosophy**:
- **Shared components** = Used in multiple places
- **Page-specific components** = Only used in one page (would go in that page's folder)
- **Keep components small** = Each component does one thing well

---

## Design Patterns

### 1. Component Composition

Build complex UIs by combining simple components.

```tsx
// Bad: One giant component
function Dashboard() {
  return (
    <div>
      {/* 500 lines of code... */}
    </div>
  );
}

// Good: Composed from smaller components
function Dashboard() {
  return (
    <main>
      <Navigation />
      <StatsGrid />
      <ActivityFeed />
      <QuickActions />
      <PropertiesGrid />
    </main>
  );
}
```

### 2. Props for Customization

Use props to make components flexible.

```tsx
// Flexible button that can be customized
<Button 
  variant="primary"    // Changes appearance
  size="lg"           // Changes size
  onClick={handleClick} // Custom behavior
>
  Click Me
</Button>
```

### 3. Separation of Concerns

Keep different responsibilities in different files.

```
✅ Good Structure:
- page.tsx          → Page layout and structure
- Component.tsx     → Reusable UI components
- globals.css       → Styling
- types.ts          → TypeScript types

❌ Bad Structure:
- everything.tsx    → Everything in one file
```

### 4. Mobile-First Responsive Design

Start with mobile, then add desktop styles.

```tsx
// Mobile first: starts small, grows on larger screens
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Grid: 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>
```

---

## File Organization

### Import Order Convention

Keep imports organized for readability:

```tsx
// 1. External libraries
import { useState } from 'react';
import Link from 'next/link';

// 2. Internal components
import Navigation from '@/components/shared/Navigation';
import Button from '@/components/shared/Button';

// 3. Types (if separate file)
import type { User } from '@/types/user';

// 4. Styles (if needed)
import './styles.css';
```

### File Naming Conventions

```
✅ Components: PascalCase
- Navigation.tsx
- Button.tsx
- Card.tsx

✅ Pages: lowercase
- page.tsx
- layout.tsx

✅ Utilities: camelCase
- formatDate.ts
- validateEmail.ts

✅ Types: PascalCase
- User.ts
- Property.ts
```

---

## Data Flow

### Current State: Static Data

Right now, we use **static data** (hardcoded arrays) for demonstration:

```tsx
// Example: Static property data
const properties = [
  { name: 'Sunset Villa', rent: '$2,500', status: 'Occupied' },
  { name: 'Downtown Loft', rent: '$3,800', status: 'Occupied' },
];

// Map over the array to create UI
{properties.map((property) => (
  <Card key={property.name}>
    <h3>{property.name}</h3>
    <p>{property.rent}</p>
  </Card>
))}
```

### Future State: Dynamic Data

When you connect to the blockchain, you'll replace static data with API calls:

```tsx
// Future: Fetch data from blockchain
import { useState, useEffect } from 'react';

function Dashboard() {
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    // Fetch from Solana blockchain
    async function fetchProperties() {
      const data = await fetchFromBlockchain();
      setProperties(data);
    }
    
    fetchProperties();
  }, []);
  
  return (
    <div>
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} />
      ))}
    </div>
  );
}
```

### State Management

For now, we don't need complex state management because:
- No user authentication yet
- No real-time data updates
- No complex data relationships

**When to add state management** (like Redux or Zustand):
- When you have wallet connection state
- When you need to share data across many components
- When you have complex user interactions

---

## Performance Considerations

### 1. Code Splitting

Next.js automatically splits code by page. Each page only loads the JavaScript it needs.

```
Homepage loads:
- page.tsx
- Navigation.tsx
- Button.tsx
- Card.tsx

Dashboard loads:
- dashboard/page.tsx
- Navigation.tsx
- Button.tsx
- Card.tsx
- (Homepage code is NOT loaded)
```

### 2. Image Optimization

When you add images, use Next.js Image component:

```tsx
// ❌ Regular img tag (no optimization)
<img src="/photo.jpg" alt="Photo" />

// ✅ Next.js Image (automatic optimization)
import Image from 'next/image';
<Image src="/photo.jpg" alt="Photo" width={500} height={300} />
```

### 3. CSS Optimization

Tailwind automatically removes unused CSS in production:

```
Development: ~3MB CSS
Production: ~10KB CSS (only what you use!)
```

### 4. Font Loading

We use Google Fonts with Next.js font optimization:

```tsx
// In layout.tsx
import { Inter, Outfit } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });
const outfit = Outfit({ subsets: ["latin"] });
```

This:
- Downloads fonts at build time
- Serves them from your domain (faster)
- Prevents layout shift while fonts load

---

## Design System Deep Dive

### Color System

Our colors are defined in `tailwind.config.ts`:

```typescript
colors: {
  background: {
    DEFAULT: '#0a0f1e',      // Main dark background
    secondary: '#0b1a31',    // Slightly lighter
    tertiary: '#1a2332',     // Even lighter
  },
  primary: {
    DEFAULT: '#00D4FF',      // Main cyan
    light: '#33DDFF',        // Lighter cyan
    dark: '#00A8CC',         // Darker cyan
  },
  // ... more colors
}
```

**Usage in components**:
```tsx
<div className="bg-background text-primary">
  {/* Uses #0a0f1e background and #00D4FF text */}
</div>
```

### Spacing Scale

Tailwind uses a consistent spacing scale:

```
1 = 0.25rem = 4px
2 = 0.5rem  = 8px
3 = 0.75rem = 12px
4 = 1rem    = 16px
6 = 1.5rem  = 24px
8 = 2rem    = 32px
```

**Examples**:
```tsx
<div className="p-4">     {/* 16px padding all sides */}
<div className="mt-8">    {/* 32px margin top */}
<div className="gap-6">   {/* 24px gap between items */}
```

### Typography Scale

```tsx
text-sm   → 0.875rem (14px)
text-base → 1rem (16px)
text-lg   → 1.125rem (18px)
text-xl   → 1.25rem (20px)
text-2xl  → 1.5rem (24px)
text-4xl  → 2.25rem (36px)
text-5xl  → 3rem (48px)
```

---

## Common Patterns Explained

### Pattern 1: Mapping Arrays to UI

**What it does**: Creates multiple UI elements from an array of data.

```tsx
// The data
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];

// Create UI from data
{items.map((item) => (
  <div key={item.id}>
    {item.name}
  </div>
))}

// Result:
// <div>Item 1</div>
// <div>Item 2</div>
// <div>Item 3</div>
```

**Why `key` is important**: React uses keys to track which items changed.

### Pattern 2: Conditional Rendering

**What it does**: Shows different UI based on conditions.

```tsx
// Show different badge based on status
{property.status === 'Occupied' ? (
  <span className="bg-green-500">Occupied</span>
) : (
  <span className="bg-orange-500">Available</span>
)}

// Or using &&
{isLoading && <Spinner />}
```

### Pattern 3: Event Handlers

**What it does**: Responds to user interactions.

```tsx
// Inline function
<button onClick={() => console.log('Clicked!')}>
  Click Me
</button>

// Named function (better for complex logic)
function handleClick() {
  console.log('Clicked!');
  // More logic here...
}

<button onClick={handleClick}>
  Click Me
</button>
```

### Pattern 4: Dynamic Styles

**What it does**: Changes styles based on data.

```tsx
// Dynamic width based on percentage
<div 
  className="bg-primary h-3 rounded-full"
  style={{ width: `${percentage}%` }}
/>

// Dynamic classes based on condition
<div className={`
  px-3 py-1 rounded-full text-xs
  ${status === 'Passed' 
    ? 'bg-green-500 text-white' 
    : 'bg-red-500 text-white'
  }
`}>
  {status}
</div>
```

---

## TypeScript Tips

### Interface vs Type

Both define shapes of objects, but interfaces are more common for React props:

```tsx
// ✅ Use interface for component props
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: ReactNode;
  onClick?: () => void;
}

// ✅ Use type for unions and complex types
type Status = 'active' | 'pending' | 'completed';
```

### Optional vs Required Props

```tsx
interface CardProps {
  title: string;           // Required
  description?: string;    // Optional (? makes it optional)
  onClick?: () => void;    // Optional function
}

// Usage
<Card title="Hello" />                           // ✅ Valid
<Card title="Hello" description="World" />       // ✅ Valid
<Card />                                         // ❌ Error: title required
```

### Children Type

```tsx
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;  // Can be text, elements, or components
}

function Container({ children }: ContainerProps) {
  return <div>{children}</div>;
}
```

---

## Next Steps for Development

### Phase 1: Current (Static UI) ✅
- [x] Design system setup
- [x] Component library
- [x] All pages with static data
- [x] Responsive design

### Phase 2: Wallet Integration
- [ ] Install Solana wallet adapter
- [ ] Add wallet connect button
- [ ] Show connected wallet address
- [ ] Handle wallet disconnection

### Phase 3: Blockchain Integration
- [ ] Connect to Rust smart contracts
- [ ] Fetch real property data
- [ ] Submit transactions
- [ ] Handle loading and error states

### Phase 4: Advanced Features
- [ ] Real-time updates
- [ ] Notifications
- [ ] Search and filtering
- [ ] User profiles

---

## Debugging Checklist

When something doesn't work:

1. **Check the browser console** (F12)
   - Look for red error messages
   - Read the error carefully

2. **Check the terminal** where `npm run dev` runs
   - TypeScript errors appear here
   - Build errors appear here

3. **Common errors and solutions**:

   ```
   Error: "Cannot find module '@/components/...'"
   Solution: Check tsconfig.json has paths configured
   
   Error: "className did not match"
   Solution: Restart dev server (Ctrl+C, then npm run dev)
   
   Error: "Hydration error"
   Solution: Make sure server and client render the same thing
   ```

4. **Use console.log()**:
   ```tsx
   console.log('My variable:', myVariable);
   console.log('Props:', props);
   ```

5. **Check file paths**:
   - Make sure imports use correct paths
   - Check file extensions (.tsx, .ts, .css)

---

## Resources for Learning

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs) - Best resource for Next.js
- [React Docs](https://react.dev) - Learn React fundamentals
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - All Tailwind classes
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Recommended Learning Path

1. **Week 1-2**: HTML, CSS, JavaScript basics
2. **Week 3-4**: React fundamentals (components, props, state)
3. **Week 5-6**: TypeScript basics
4. **Week 7-8**: Next.js and Tailwind CSS
5. **Week 9+**: Build projects!

### Practice Exercises

1. **Easy**: Change button colors in the design system
2. **Medium**: Add a new page with navigation link
3. **Hard**: Create a new component with props and TypeScript types
4. **Expert**: Integrate with a real API

---

## Glossary

**Component**: Reusable piece of UI (like a LEGO block)

**Props**: Data passed to a component (like function arguments)

**State**: Data that can change over time

**Hook**: Special React function (starts with `use`, like `useState`)

**JSX/TSX**: HTML-like syntax in JavaScript/TypeScript

**Tailwind**: CSS framework using utility classes

**Next.js**: React framework with routing and optimization

**TypeScript**: JavaScript with type checking

**SSR**: Server-Side Rendering (generates HTML on server)

**Hydration**: Making server-rendered HTML interactive

**Route**: URL path that shows a specific page

---

## Summary

You now understand:
- ✅ The technology stack and why we chose it
- ✅ How the architecture is organized
- ✅ Common design patterns we use
- ✅ How data flows through the app
- ✅ Performance optimizations
- ✅ TypeScript best practices
- ✅ How to debug issues

Keep this guide handy as you develop! 📚
