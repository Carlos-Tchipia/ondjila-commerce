---
name: Premium Heritage
colors:
  surface: '#fff8f2'
  surface-dim: '#e3d9cb'
  surface-bright: '#fff8f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdf2e4'
  surface-container: '#f7ecde'
  surface-container-high: '#f1e7d8'
  surface-container-highest: '#ebe1d3'
  on-surface: '#201b12'
  on-surface-variant: '#4f4634'
  inverse-surface: '#353026'
  inverse-on-surface: '#faefe1'
  outline: '#817662'
  outline-variant: '#d3c5ae'
  surface-tint: '#795900'
  primary: '#795900'
  on-primary: '#ffffff'
  primary-container: '#c8960c'
  on-primary-container: '#463200'
  inverse-primary: '#f5be3c'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#fec658'
  on-secondary-container: '#735200'
  tertiary: '#1c5ead'
  on-tertiary: '#ffffff'
  tertiary-container: '#699ff2'
  on-tertiary-container: '#00356b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdfa0'
  primary-fixed-dim: '#f5be3c'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#ffdea6'
  secondary-fixed-dim: '#f5be50'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#d6e3ff'
  tertiary-fixed-dim: '#a8c8ff'
  on-tertiary-fixed: '#001b3d'
  on-tertiary-fixed-variant: '#00468a'
  background: '#fff8f2'
  on-background: '#201b12'
  surface-variant: '#ebe1d3'
typography:
  hero-title:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  section-title:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-main:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.7'
    letterSpacing: 0em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  price-display:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  container_max: 1440px
  gutter: 24px
---

## Brand & Style

This design system is built on the philosophy of "Warm Minimalism." It bridges the gap between high-tech precision and cultural resonance, drawing inspiration from the vast landscapes of Angola and the editorial refinement of premium global brands. The aesthetic is defined by surgical precision in layout, a restrained but impactful use of color, and a sense of "quiet luxury."

The visual language communicates authority and sophistication through generous whitespace and a strictly controlled typographic hierarchy. By avoiding unnecessary decoration, the design system allows the products and the "Ondjila Gold" signature to take center stage, creating an environment that feels both high-end and deeply rooted.

## Colors

The palette is anchored by "Ondjila Gold," used exclusively for calls to action, price points, and critical focus states. This primary color represents the "soul" of the brand—a nod to heritage and value. 

Neutral surfaces are divided into three tiers:
1.  **Pure White (#FFFFFF):** Used for the primary canvas and product cards to ensure maximum clarity and a modern, airy feel.
2.  **Light Sand (#F5F2EC):** Used for large section backgrounds to provide warmth and separate content without the harshness of high-contrast dividers.
3.  **Input/Card Surface (#F9F8F6):** A subtle off-white used to define interactive zones like form fields, ensuring they are visible but integrated.

Text follows a strict grayscale to maintain readability and premium feel, while semantic colors are reserved for functional feedback only.

## Typography

This design system utilizes **Inter** exclusively to achieve a technical yet accessible look. The hierarchy is characterized by significant contrast in scale rather than weight, as the maximum weight is capped at 500 to maintain a delicate, high-end feel.

- **Hero Titles** use a light 300 weight to evoke an editorial, high-fashion vibe.
- **Body Copy** is optimized for long-form reading with a generous 1.7 line height.
- **Labels** are treated as navigational signposts, using uppercase styling and wide tracking to distinguish them from content.
- **Prices** are highlighted using the primary gold at a 500 weight to ensure they are the secondary focal point after the product imagery.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model within a 1440px container. It utilizes a 12-column structure with 24px gutters. The defining characteristic of this design system is its "whitespace-first" approach.

Spacing units are built on a 4px base scale, but implementation should favor the larger end of the spectrum (`lg` and `xl`) for vertical section padding to create a sense of breathing room. Elements should feel "hung" in space rather than crowded. Use the `xl` (80px) unit for margins between major sections to emphasize the premium, unhurried nature of the shopping experience.

## Elevation & Depth

Hierarchy is established primarily through **Tonal Layering** and **Ambient Shadows**.

- **Shadows:** A signature gold-tinted shadow `(0 2px 12px rgba(200,150,12,0.06))` is applied to product cards and floating menus. This creates a soft "glow" effect that feels more premium and organic than standard black shadows.
- **Layers:** White elements placed on the Light Sand (`#F5F2EC`) background serve as the primary method of defining content blocks.
- **Outlines:** Low-contrast borders (`#E8E4DC`) are used for structural definition in inputs and dividers, ensuring the UI remains grounded without feeling heavy or industrial.

## Shapes

The shape language is a deliberate mix of geometric extremes:
- **Buttons:** 0px radius (Sharp). This conveys architectural stability and high-fashion minimalism.
- **Inputs & Badges:** 6px radius (Soft). A subtle curve that provides a hint of approachability and modern software conventions.
- **Product Cards:** 10px radius (Rounded). The most generous curve is reserved for items the user "collects" or interacts with, making the product catalog feel tactile and friendly.

This variation in corner treatment creates a sophisticated visual rhythm that prevents the UI from appearing too "out of the box."

## Components

### Buttons
- **Primary:** Solid `#C8960C`, white text, 0px border radius, no shadow. Hover state shifts to `#A87A09`.
- **Secondary:** Transparent with a 1px border of `#C8960C` or `#E8E4DC`, using 0px radius.
- **Padding:** Vertical 16px, Horizontal 32px to ensure a substantial "hit area."

### Input Fields
- **Surface:** `#F9F8F6` background with a 1px `#E8E4DC` border.
- **Radius:** 6px.
- **Focus:** Border transitions to `#C8960C`.

### Cards
- **Background:** Pure White (`#FFFFFF`).
- **Shadow:** Signature gold-tinted shadow.
- **Radius:** 10px.
- **Content:** Product image should occupy the top 75% of the card, with minimal text (Title, Price) at the bottom.

### Icons
- **Style:** Thin stroke (1px to 1.5px).
- **Color:** Base color is `#555555`. On hover or active state, icons transition to `#C8960C`.

### Navigation & Headers
- **Header:** Sticky with a subtle white-to-transparent gradient or solid white with a 1px bottom border.
- **Links:** Labels (uppercase, tracked) with a gold underline effect on hover.
