# 🎨 Hospital Finance Dashboard - Design System

## Overview
A comprehensive design system built with CSS custom properties for consistent theming across light and dark modes.

## Color System

### Purple Brand Palette

#### Light Mode
- `--color-purple-50: #faf5ff` - Lightest backgrounds, subtle accents
- `--color-purple-100: #f3e8ff` - Very light hover states, disabled elements
- `--color-purple-200: #e9d5ff` - Light borders, dividers
- `--color-purple-300: #d8b4fe` - Secondary text, icons
- `--color-purple-400: #c084fc` - Interactive elements
- `--color-purple-500: #a855f7` - Primary actions, focus states
- `--color-purple-600: #9333ea` - Hover states
- `--color-purple-700: #7c3aed` - Pressed states
- `--color-purple-800: #6b21a8` - High contrast text
- `--color-purple-900: #581c87` - Maximum contrast

#### Dark Mode
- `--color-purple-50: #1e1b4b` - Darkest backgrounds
- `--color-purple-100: #581c87` - Very dark subtle elements
- `--color-purple-200: #6b21a8` - Dark borders, dividers
- `--color-purple-300: #7c3aed` - Secondary text
- `--color-purple-400: #8b5cf6` - Interactive elements
- `--color-purple-500: #a855f7` - Primary actions
- `--color-purple-600: #7c3aed` - Hover states
- `--color-purple-700: #8b5cf6` - Active states
- `--color-purple-800: #a855f7` - High contrast
- `--color-purple-900: #c084fc` - Maximum contrast

## Semantic Tokens

### Brand Colors
- `--brand-primary: var(--color-purple-500)` - Primary brand color
- `--brand-secondary: var(--color-purple-600)` - Secondary brand color
- `--brand-accent: var(--color-purple-400)` - Accent color

### Functional Colors
- `--color-success: var(--color-purple-500)` - Success states
- `--color-warning: var(--color-purple-400)` - Warning states
- `--color-error: var(--color-purple-600)` - Error states
- `--color-info: var(--color-purple-300)` - Informational states

### Text Colors
- `--text-primary: #ffffff` - High contrast text
- `--text-secondary: rgba(255, 255, 255, 0.8)` - Medium contrast
- `--text-tertiary: rgba(255, 255, 255, 0.6)` - Low contrast
- `--text-disabled: rgba(255, 255, 255, 0.4)` - Disabled text

### Surface Colors
- `--surface-primary: rgba(255, 255, 255, 0.25)` - Primary glass surfaces
- `--surface-secondary: rgba(255, 255, 255, 0.15)` - Secondary surfaces
- `--surface-tertiary: rgba(255, 255, 255, 0.08)` - Subtle surfaces
- `--surface-elevated: rgba(255, 255, 255, 0.35)` - Elevated surfaces

### Border Colors
- `--border-primary: rgba(255, 255, 255, 0.3)` - Primary borders
- `--border-secondary: rgba(255, 255, 255, 0.2)` - Secondary borders
- `--border-subtle: rgba(255, 255, 255, 0.1)` - Subtle borders
- `--border-focus: var(--color-purple-400)` - Focus indicators

## Spacing System

### Space Scale
- `--space-0: 0`
- `--space-1: 0.25rem` (4px)
- `--space-2: 0.5rem` (8px)
- `--space-3: 0.75rem` (12px)
- `--space-4: 1rem` (16px)
- `--space-5: 1.25rem` (20px)
- `--space-6: 1.5rem` (24px)
- `--space-8: 2rem` (32px)
- `--space-10: 2.5rem` (40px)
- `--space-12: 3rem` (48px)
- `--space-16: 4rem` (64px)
- `--space-20: 5rem` (80px)
- `--space-24: 6rem` (96px)

## Typography System

### Font Sizes
- `--text-xs: 0.75rem` (12px)
- `--text-sm: 0.875rem` (14px)
- `--text-base: 1rem` (16px)
- `--text-lg: 1.125rem` (18px)
- `--text-xl: 1.25rem` (20px)
- `--text-2xl: 1.5rem` (24px)
- `--text-3xl: 1.875rem` (30px)
- `--text-4xl: 2.25rem` (36px)
- `--text-5xl: 3rem` (48px)

### Line Heights
- `--leading-none: 1`
- `--leading-tight: 1.25`
- `--leading-snug: 1.375`
- `--leading-normal: 1.5`
- `--leading-relaxed: 1.625`
- `--leading-loose: 2`

## Border Radius System
- `--radius-none: 0`
- `--radius-sm: 0.125rem` (2px)
- `--radius-base: 0.25rem` (4px)
- `--radius-md: 0.375rem` (6px)
- `--radius-lg: 0.5rem` (8px)
- `--radius-xl: 0.75rem` (12px)
- `--radius-2xl: 1rem` (16px)
- `--radius-3xl: 1.5rem` (24px)
- `--radius-full: 9999px`

## Component Classes

### Cards
- `.glass-card` - Primary glassmorphism card
- `.glass-card-elevated` - Elevated card with stronger shadow
- `.glass-card-subtle` - Subtle card with minimal shadow

### Buttons
- `.btn-base` - Base button styling
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-ghost` - Ghost/outline button
- `.btn-danger` - Destructive action button

### Interactive States
- `.interactive` - Base interactive element
- `.interactive:hover` - Hover state
- `.interactive:active` - Active/pressed state
- `.interactive:focus-visible` - Focus state

### Typography Utilities
- `.text-primary` - Primary text color
- `.text-secondary` - Secondary text color
- `.text-tertiary` - Tertiary text color
- `.text-disabled` - Disabled text color

### Background Utilities
- `.bg-surface-primary` - Primary surface background
- `.bg-surface-secondary` - Secondary surface background
- `.bg-surface-tertiary` - Tertiary surface background
- `.bg-surface-elevated` - Elevated surface background

### Border Utilities
- `.border-primary` - Primary border color
- `.border-secondary` - Secondary border color
- `.border-subtle` - Subtle border color
- `.border-focus` - Focus border color

### Spacing Utilities
- `.space-system-xs` - Extra small gap (8px)
- `.space-system-sm` - Small gap (12px)
- `.space-system-md` - Medium gap (16px)
- `.space-system-lg` - Large gap (24px)
- `.space-system-xl` - Extra large gap (32px)

## Usage Examples

### Button
```tsx
<button className="btn-base btn-primary btn-md">
  Primary Action
</button>
```

### Card
```tsx
<div className="glass-card interactive" style={{ padding: 'var(--space-6)' }}>
  <h3 className="text-primary" style={{ fontSize: 'var(--text-lg)' }}>
    Card Title
  </h3>
  <p className="text-secondary" style={{ fontSize: 'var(--text-base)' }}>
    Card content
  </p>
</div>
```

### Spacing
```tsx
<div style={{ 
  padding: 'var(--space-6)', 
  marginBottom: 'var(--space-8)',
  gap: 'var(--space-4)'
}}>
  Content
</div>
```

## Accessibility

### Contrast Ratios
- All color combinations meet WCAG AA standards
- Focus states provide clear visual feedback
- Dark mode optimized for reduced eye strain

### Interactive Elements
- Minimum touch target size: 44px
- Clear focus indicators
- Proper ARIA labeling
- Keyboard navigation support

## Browser Support
- Modern browsers with CSS custom property support
- Graceful fallbacks for older browsers
- Hardware-accelerated animations
