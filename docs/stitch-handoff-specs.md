# Ondjilacommerce - Handoff Document (Premium Heritage System)

## 1. Design Tokens (CSS Variables)
```scss
:root {
  /* Colors */
  --ondjila-gold: #C8960C;
  --ondjila-gold-hover: #A87A09;
  --ondjila-gold-soft: #FDF3DC;
  --surface-main: #FFFFFF;
  --surface-sand: #F5F2EC;
  --surface-card: #FFFFFF;
  --surface-input: #F9F8F6;
  --text-primary: #1A1A1A;
  --text-secondary: #555555;
  --text-muted: #9E9E9E;
  --border-standard: #E8E4DC;
  
  /* Typography */
  --font-main: 'Inter', sans-serif;
  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;
  
  /* Spacing & Radii */
  --section-gap: 96px;
  --radius-card: 10px;
  --radius-input: 6px;
  --radius-cta: 0px;
  
  /* Shadows */
  --shadow-warm-rest: 0 2px 12px rgba(200, 150, 12, 0.06);
  --shadow-warm-hover: 0 6px 24px rgba(200, 150, 12, 0.12);
}
```

## 2. Micro-Animations Specification (Angular/SCSS)
- **Buttons (CTA):** Background transition from `--ondjila-gold` to `--ondjila-gold-hover` (180ms ease-in-out).
- **Product Cards:** `transform: translateY(-8px)` on hover with box-shadow transition. 'Add to Cart' button should use `translateY(0)` from `translateY(100%)` with opacity fade.
- **Nav Links:** Pseudo-element `:after` for the gold underline: `transform: scaleX(0)` to `scaleX(1)`, origin left.
- **Page Transitions:** Use `stagger` for section entry: `opacity: 0; transform: translateY(20px)` to `opacity: 1; transform: translateY(0)` (duration: 400ms).

## 3. Component Details
- **Logos:** Must be consistent wordmarks with the gold 'path' icon.
- **Images:** All product assets must have transparent or `--surface-input` backgrounds.
- **Prices:** Must always be in `--ondjila-gold`, weight 500.
