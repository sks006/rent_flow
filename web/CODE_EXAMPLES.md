# Code Examples & Patterns Guide

This guide shows common code patterns used in the RentFlow frontend with simple explanations.

## Table of Contents

1. [Array Mapping](#array-mapping)
2. [Conditional Rendering](#conditional-rendering)
3. [Event Handlers](#event-handlers)
4. [Dynamic Styling](#dynamic-styling)
5. [Component Props](#component-props)
6. [Common Tailwind Patterns](#common-tailwind-patterns)

---

## Array Mapping

### What is it?
Converting an array of data into UI elements.

### Example from Dashboard

```tsx
// The data (array of objects)
const properties = [
  { name: 'Sunset Villa', rent: '$2,500', status: 'Occupied' },
  { name: 'Downtown Loft', rent: '$3,800', status: 'Occupied' },
  { name: 'Garden House', rent: '$2,200', status: 'Available' },
];

// Convert to UI using .map()
{properties.map((property, index) => (
  <Card key={index}>
    <h3>{property.name}</h3>
    <p>{property.rent}</p>
    <span>{property.status}</span>
  </Card>
))}
```

### Explanation
- `.map()` loops through each item in the array
- For each item, it creates a `<Card>` component
- `key={index}` helps React track which items changed
- `{property.name}` displays the property's name

### Why use it?
- Avoids repeating code
- Easy to add/remove items (just change the array)
- Keeps data separate from UI

---

## Conditional Rendering

### What is it?
Showing different UI based on conditions.

### Pattern 1: Ternary Operator (? :)

```tsx
// Show different badge based on status
{property.status === 'Occupied' ? (
  <span className="bg-green-500">Occupied</span>
) : (
  <span className="bg-orange-500">Available</span>
)}
```

**Reads as**: "If status is Occupied, show green badge, otherwise show orange badge"

### Pattern 2: Logical AND (&&)

```tsx
// Only show if condition is true
{isLoading && <Spinner />}
{error && <ErrorMessage />}
{user && <WelcomeMessage name={user.name} />}
```

**Reads as**: "If isLoading is true, show Spinner"

### Pattern 3: Multiple Conditions

```tsx
{status === 'Passed' ? (
  <span className="bg-green-500">Passed</span>
) : status === 'Rejected' ? (
  <span className="bg-red-500">Rejected</span>
) : (
  <span className="bg-yellow-500">Pending</span>
)}
```

---

## Event Handlers

### What is it?
Functions that run when users interact with the UI.

### Pattern 1: Inline Function

```tsx
// Simple action
<button onClick={() => console.log('Clicked!')}>
  Click Me
</button>

// With parameter
<button onClick={() => handleVote('for')}>
  Vote For
</button>
```

### Pattern 2: Named Function

```tsx
// Define function first
function handleSubmit() {
  console.log('Form submitted!');
  // More complex logic here...
}

// Use it
<button onClick={handleSubmit}>
  Submit
</button>
```

### Pattern 3: With Event Object

```tsx
// Access event details
function handleChange(event) {
  const value = event.target.value;
  console.log('User typed:', value);
}

<input onChange={handleChange} />
```

### Common Events
- `onClick` - When clicked
- `onChange` - When input value changes
- `onSubmit` - When form is submitted
- `onHover` - When mouse hovers over
- `onFocus` - When input is focused

---

## Dynamic Styling

### What is it?
Changing styles based on data or state.

### Pattern 1: Dynamic Width

```tsx
// Progress bar that changes width based on percentage
<div 
  className="bg-primary h-3 rounded-full"
  style={{ width: `${percentage}%` }}
/>

// Example: if percentage = 75, width becomes "75%"
```

### Pattern 2: Conditional Classes

```tsx
// Different classes based on condition
<div className={`
  px-3 py-1 rounded-full
  ${status === 'Passed' 
    ? 'bg-green-500 text-white' 
    : 'bg-red-500 text-white'
  }
`}>
  {status}
</div>
```

### Pattern 3: Multiple Conditions

```tsx
<div className={`
  card
  ${isActive && 'border-primary'}
  ${isHovered && 'scale-105'}
  ${isDisabled && 'opacity-50'}
`}>
  Content
</div>
```

### Pattern 4: Dynamic Background Color

```tsx
// From Governance page - different colors for different vote types
<div className={`w-2 h-2 rounded-full ${
  activity.type === 'success' ? 'bg-accent-green' :
  activity.type === 'warning' ? 'bg-accent-orange' :
  'bg-primary'
}`} />
```

---

## Component Props

### What is it?
Data passed from parent to child component.

### Example: Button Component

```tsx
// Parent component (using Button)
function MyPage() {
  return (
    <Button 
      variant="primary"
      size="lg"
      onClick={() => alert('Hi!')}
    >
      Click Me
    </Button>
  );
}

// Child component (Button definition)
function Button({ variant, size, onClick, children }) {
  return (
    <button 
      className={`btn-${variant} size-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### Props Explained
- `variant="primary"` → Button receives variant as "primary"
- `size="lg"` → Button receives size as "lg"
- `onClick={...}` → Button receives the function
- `children` → Button receives "Click Me" as children

### Default Props

```tsx
function Button({ 
  variant = 'primary',  // Default if not provided
  size = 'md',         // Default if not provided
  children 
}) {
  // If parent doesn't pass variant, it defaults to 'primary'
}
```

---

## Common Tailwind Patterns

### Layout Patterns

#### Centered Container
```tsx
<div className="max-w-7xl mx-auto px-4">
  {/* Content centered with max width */}
</div>
```

#### Flex Row (Horizontal)
```tsx
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>
```

#### Flex Column (Vertical)
```tsx
<div className="flex flex-col space-y-4">
  <div>Top</div>
  <div>Middle</div>
  <div>Bottom</div>
</div>
```

#### Grid Layout
```tsx
// 3 columns on desktop, 2 on tablet, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Spacing Patterns

```tsx
// Padding
p-4      → padding all sides (16px)
px-6     → padding horizontal (24px)
py-3     → padding vertical (12px)
pt-8     → padding top (32px)

// Margin
m-4      → margin all sides
mx-auto  → center horizontally
mt-8     → margin top

// Gap (for flex/grid)
gap-4    → 16px gap between items
space-x-4 → 16px horizontal gap
space-y-4 → 16px vertical gap
```

### Color Patterns

```tsx
// Background
bg-background        → Dark background
bg-primary          → Cyan background
bg-primary/20       → Cyan at 20% opacity

// Text
text-primary        → Cyan text
text-text-secondary → Muted white text
text-white          → Pure white

// Border
border              → 1px border
border-2            → 2px border
border-primary      → Cyan border
border-white/10     → White border at 10% opacity
```

### Responsive Patterns

```tsx
// Mobile first: small by default, larger on bigger screens
<div className="text-sm md:text-base lg:text-lg">
  {/* 14px mobile, 16px tablet, 18px desktop */}
</div>

// Hide on mobile, show on desktop
<div className="hidden md:block">
  Desktop only
</div>

// Show on mobile, hide on desktop
<div className="block md:hidden">
  Mobile only
</div>
```

### Hover & Transition Patterns

```tsx
// Smooth color transition
<button className="text-gray-500 hover:text-primary transition-colors duration-300">
  Hover me
</button>

// Scale on hover
<div className="hover:scale-105 transition-transform duration-300">
  I grow!
</div>

// Multiple hover effects
<div className="hover:shadow-lg hover:scale-105 transition-all duration-300">
  Shadow and scale
</div>
```

---

## Real Examples from RentFlow

### Example 1: Property Card (from Rent Page)

```tsx
// The data
const property = {
  name: 'Sunset Villa',
  location: 'Miami Beach, FL',
  rent: '$2,500',
  bedrooms: 2,
  bathrooms: 2,
  available: true
};

// The UI
<Card interactive>
  {/* Property Image */}
  <div className="relative">
    <div className="text-7xl text-center py-12 bg-gradient-to-br from-background-secondary to-background-tertiary rounded-xl">
      🏖️
    </div>
    
    {/* Availability Badge - Conditional Rendering */}
    {property.available ? (
      <div className="absolute top-4 right-4 px-3 py-1 bg-accent-green/90 rounded-full text-xs font-semibold">
        Available
      </div>
    ) : (
      <div className="absolute top-4 right-4 px-3 py-1 bg-text-muted/90 rounded-full text-xs font-semibold">
        Occupied
      </div>
    )}
  </div>

  {/* Property Details */}
  <div className="space-y-3">
    <h3 className="text-xl font-bold">{property.name}</h3>
    <p className="text-text-muted text-sm">{property.location}</p>
    
    {/* Stats */}
    <div className="flex items-center gap-4 text-sm">
      <span>{property.bedrooms} bed</span>
      <span>{property.bathrooms} bath</span>
    </div>
    
    {/* Price and Button */}
    <div className="flex items-center justify-between">
      <div className="text-3xl font-bold text-gradient">
        {property.rent}
      </div>
      <Button variant="primary" size="sm">
        View Details
      </Button>
    </div>
  </div>
</Card>
```

### Example 2: Voting Progress Bar (from Governance Page)

```tsx
// The data
const proposal = {
  votesFor: 12450,
  votesAgainst: 3200,
};

// Calculate percentage
const totalVotes = proposal.votesFor + proposal.votesAgainst;
const forPercentage = (proposal.votesFor / totalVotes) * 100;

// The UI
<div className="space-y-3">
  {/* Progress Bar Container */}
  <div className="relative h-3 bg-background-tertiary rounded-full overflow-hidden">
    {/* Progress Bar Fill - Dynamic Width */}
    <div 
      className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full"
      style={{ width: `${forPercentage}%` }}
    />
  </div>

  {/* Vote Counts */}
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-accent-green rounded-full" />
      <span>For: {proposal.votesFor.toLocaleString()}</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-accent-orange rounded-full" />
      <span>Against: {proposal.votesAgainst.toLocaleString()}</span>
    </div>
  </div>
</div>
```

### Example 3: Activity Feed (from Dashboard)

```tsx
// The data
const activities = [
  { action: 'Rent Payment', property: 'Sunset Villa', amount: '+$2,500', type: 'success' },
  { action: 'Maintenance', property: 'Downtown Loft', amount: 'Pending', type: 'warning' },
];

// The UI - Array Mapping + Conditional Styling
{activities.map((activity, i) => (
  <div key={i} className="flex items-center justify-between p-4 glass rounded-lg">
    {/* Left side */}
    <div className="flex items-center space-x-4">
      {/* Status indicator - Dynamic color */}
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
    
    {/* Right side - Dynamic color */}
    <div className={`font-semibold ${
      activity.type === 'success' ? 'text-accent-green' :
      activity.type === 'warning' ? 'text-accent-orange' :
      'text-text-primary'
    }`}>
      {activity.amount}
    </div>
  </div>
))}
```

---

## Practice Exercises

### Easy
1. Change the button colors in a component
2. Add a new property to the properties array
3. Change the text in the navigation

### Medium
4. Create a new stat card on the dashboard
5. Add a new filter option to the rent page
6. Change the color scheme of a feature card

### Hard
7. Create a new component with props
8. Add a new page with navigation link
9. Implement a search filter for properties

### Expert
10. Add state to track button clicks
11. Create a form with validation
12. Implement sorting for the properties list

---

## Quick Reference

### Common React Patterns
```tsx
// Map array to UI
{items.map(item => <div key={item.id}>{item.name}</div>)}

// Conditional rendering
{condition ? <ComponentA /> : <ComponentB />}
{condition && <Component />}

// Event handler
<button onClick={() => handleClick()}>Click</button>

// Props
<Component prop1="value" prop2={variable} />
```

### Common Tailwind Classes
```tsx
// Layout
flex, grid, container
items-center, justify-between
space-x-4, gap-6

// Sizing
w-full, h-screen, max-w-7xl
p-4, m-4, px-6, py-3

// Colors
bg-primary, text-white
border-primary, hover:bg-primary-light

// Effects
rounded-lg, shadow-lg
transition-all, duration-300
hover:scale-105
```

---

## Need Help?

If you're stuck:
1. Check the browser console for errors
2. Use `console.log()` to debug
3. Read the error message carefully
4. Check the documentation
5. Ask for help!

Happy coding! 🚀
