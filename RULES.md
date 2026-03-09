# Application Rules & Aesthetics Guide

This document enforces the design, color scheme, and architectural patterns established in the project (specifically starting from the `select-store` layout). All future components and pages MUST adhere to these guidelines to ensure a premium, modern, cohesive look.

## 1. Core Aesthetics
- **Premium Design**: The UI must feel state-of-the-art and visually stunning at first glance. Generic/plain styling is unacceptable.
- **Glassmorphism & Depth**: Leverage soft shadows (`box-shadow`), semi-transparent overlays, and gradients to create depth.
- **Micro-interactions**: Components should feel "alive" when interacted with. Add `transform: translateY(-px)` and elevated box shadows on hover. Use smooth transitions (`transition: all 0.3s ease` or custom cubic-bezier).
- **Responsive Geometry**: Utilize CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(...))`) to build flexible layouts that snap gracefully on any screen size. Use border-radius extensively (`8px` for buttons/small cards, `16px` to `24px` for larger structural cards).

## 2. Color Palette & Theming
Strictly adhere to this defined sophisticated color scheme instead of generic CSS colors (like 'red' or 'green'):

### Backgrounds & Surfaces
- App Background: `#f8fafc` (Slate 50)
- Card/Surface Background: `#ffffff` (White)
- Hover Surfaces (Subtle): `#f1f5f9` (Slate 100)
- Deeper Borders/Dividers: `#e2e8f0` (Slate 200) to `#cbd5e1` (Slate 300)

### Typography
- Primary Headings/Dark Text: `#0f172a` (Slate 900) or `#1e293b` (Slate 800)
- Muted/Body Text: `#64748b` (Slate 500)
- Subtle Icons/Placeholder: `#94a3b8` (Slate 400) or `#475569` (Slate 600)

### Gradient Highlights
- Use linear gradients for major text headlines:
  `background: linear-gradient(135deg, #0f172a 0%, #334155 100%);`
  `-webkit-background-clip: text;`
  `-webkit-text-fill-color: transparent;`

### Status & Semantic Colors
- **Success / Open / Active**: 
  - Text: `#15803d` (Green 700)
  - Icon/Accent: `#22c55e` (Green 500)
  - Background/Badge: `#dcfce7` (Green 100) or `#f0fdf4` (Green 50)
- **Danger / Closed / Error**: 
  - Text: `#b91c1c` (Red 700)
  - Background/Badge: `#fee2e2` (Red 100)
- **Brand Accents (e.g. Ration/Blue theme)**: 
  - Text/Border: `#3b82f6` (Blue 500)
  - Background: `#eff6ff` (Blue 50)

## 3. Typography
- **Primary Font**: `'Inter', system-ui, -apple-system, sans-serif`
- Headings must be bold (`font-weight: 700`) and visually prominent.
- Standard body text should have good readability (`line-height: 1.5`).
- Small badges/statuses should be explicitly bold (`font-weight: 600`), occasionally uppercase with slight letter-spacing.

## 4. Icons
- **Do not download raw SVG/PNG files into the public directory for UI icons**.
- **Rule**: Implement icons as inline standard React `<svg>` components (using the Lucide icon set parameters). This ensures:
  - Better loading performance (no network requests).
  - Perfect color inheritance via `stroke="currentColor"`.
  - Scalability without loss of crispness.
- Set standard parameters for icons (e.g., `size={24}`, `strokeWidth="2"`, `strokeLinecap="round"`, `strokeLinejoin="round"`).

## 5. CSS Styling Strategy
- **Vanilla SCSS**: Use standard `SCSS` files paired alongside `.jsx` components (e.g., `page.scss` and `page.jsx`).
- **No Inline Styles**: Keep `.jsx` files pristine. Avoid `style={{...}}`.
- **Component Specificity**: Nest SCSS under a primary wrapper class representing the component/page (e.g., `.my-component-container { ... }`) to avoid global style pollution.
- Add animation keyframes natively (e.g., `@keyframes fadeIn`) and apply them onto dynamic container nodes explicitly (`animation: fadeIn 0.4s ease-out forwards;`).
