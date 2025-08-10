# 🎨 Branding & Color System

This document explains how to customize the application's colors and branding for different customers.

## Current Brand Colors

The application uses four primary brand colors:

| Color | Hex | HSL | Usage |
|-------|-----|-----|-------|
| **Pink** | `#F36D8D` | `342 85% 69%` | Primary buttons, selected states |
| **Green** | `#D8E5A0` | `76 55% 76%` | Success states, secondary elements |
| **Orange** | `#FAB977` | `37 92% 73%` | Call-to-action, highlights |
| **Brown** | `#8E6114` | `37 75% 31%` | Accent colors, available for use |

## Background Gradient

The app features a very subtle gradient background inspired by Lovable.dev:
- Multiple overlapping linear and radial gradients
- Extremely low opacity (2-4%) for professional subtlety
- Combines diagonal linear gradients with soft radial ones
- Automatically adapts to dark mode with even lower opacity
- Creates depth without being distracting

## How to Change Branding

### 1. Update Brand Colors
Edit `/src/index.css` and modify these CSS custom properties:

```css
:root {
  --brand-pink: 342 85% 69%;        /* Your primary color */
  --brand-green: 76 55% 76%;        /* Your secondary color */  
  --brand-orange: 37 92% 73%;       /* Your highlight color */
  --brand-brown: 37 75% 31%;        /* Your accent color */
}
```

**Important**: Colors must be in HSL format without the `hsl()` wrapper.

### 2. Convert Hex to HSL
Use an online converter or this formula:
- `#F36D8D` → `342 85% 69%`
- `#D8E5A0` → `76 55% 76%`
- `#FAB977` → `37 92% 73%`
- `#8E6114` → `37 75% 31%`

### 3. Automatic Updates
Once you change the brand colors, these elements automatically update:
- ✅ Primary/secondary button colors
- ✅ Focus states and borders
- ✅ Background gradients
- ✅ All gradient combinations
- ✅ Dark mode variants

## Available Utility Classes

### Background Colors
```css
.bg-brand-pink    /* Solid pink background */
.bg-brand-green   /* Solid green background */
.bg-brand-orange  /* Solid orange background */
```

### Text Colors
```css
.text-brand-pink    /* Pink text */
.text-brand-green   /* Green text */
.text-brand-orange  /* Orange text */
```

### Border Colors
```css
.border-brand-pink    /* Pink border */
.border-brand-green   /* Green border */
.border-brand-orange  /* Orange border */
```

### Gradient Backgrounds
```css
.bg-gradient-mixed      /* All three colors combined */
.bg-gradient-primary    /* Pink to orange */
.bg-gradient-secondary  /* Orange to green */
.bg-gradient-soft       /* Subtle pink to green */
.bg-gradient-warm       /* Bold orange to pink */
```

## CSS Variables Available

### Brand Colors
- `--brand-pink`
- `--brand-green` 
- `--brand-orange`

### Gradients
- `--gradient-primary`
- `--gradient-secondary`
- `--gradient-mixed`
- `--gradient-soft`
- `--gradient-warm`
- `--bg-gradient` (background radial gradient)

## Example: Quick Rebrand

To rebrand for a new customer with blue/purple/teal colors:

```css
:root {
  --brand-pink: 260 85% 70%;     /* Purple */
  --brand-green: 180 55% 65%;    /* Teal */
  --brand-orange: 220 90% 75%;   /* Blue */
}
```

That's it! The entire app will automatically use the new color scheme.

## Dark Mode Support

All brand colors automatically work in dark mode with adjusted opacity levels in the background gradients for better readability.

## Best Practices

1. **Use HSL format** - Easier to adjust lightness/saturation
2. **Test in both light and dark modes**
3. **Maintain sufficient contrast** for accessibility
4. **Use the CSS variables** instead of hardcoded colors
5. **Keep gradients subtle** for professional appearance
