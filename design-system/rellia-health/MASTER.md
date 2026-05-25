# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Rellia Health
**Generated:** 2026-05-07 04:42:30
**Category:** Service Landing Page

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable / Tailwind |
|------|-----|-------------------------|
| Primary Teal | `#0D3540` | `rellia-teal` |
| Secondary Mint | `#9DD6D0` | `rellia-mint` |
| MintDark | `#1A5C56` | `rellia-mintDark` |
| Cream (Wash) | `#EEF2F2` | `rellia-cream` |
| GreyTeal (CTA Band) | `#C5D8D5` | `rellia-greyTeal` |

**Color Notes:** Deep teal trust + mint accent + soft cream backdrops

### Typography

- **Heading Font:** Host Grotesk
- **Body Font:** Urbanist
- **Mood:** geometric, modern, clean, premium, high contrast
- **Google Fonts:** [Host Grotesk + Urbanist](https://fonts.google.com/share?selection.family=Host+Grotesk:wght@300;400;500;600;700|Urbanist:wght@300;400;500;600;700)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@300;400;500;600;700&family=Urbanist:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Rellia CTA Primary Button */
.btn-primary {
  background: #0D3540; /* relli-teal */
  color: white;
  padding: 14px 32px;
  border-radius: 9999px; /* Pill */
  font-weight: 600;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.btn-primary:hover {
  background: #9DD6D0; /* relli-mint */
  color: #0D3540;
  transform: translateY(-2px);
}

/* Rellia CTA Secondary Button */
.btn-secondary {
  background: transparent;
  color: #0D3540;
  border: 1.5px solid #0D3540;
  padding: 14px 32px;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.btn-secondary:hover {
  background: #0D3540;
  color: white;
}
```

### Cards

```css
/* Glassmorphism/Bento Cards */
.card {
  background: rgba(238, 242, 242, 0.3); /* relli-cream with opacity */
  border: 1px solid rgba(238, 242, 242, 0.5);
  border-radius: 16px;
  padding: 24px;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.card:hover {
  border-color: rgba(157, 214, 208, 0.4); /* relli-mint border */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #0EA5E9;
  outline: none;
  box-shadow: 0 0 0 3px #0EA5E920;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Social Proof-Focused

**Keywords:** Testimonials prominent, client logos displayed, case studies sections, reviews/ratings, user avatars, success metrics, credibility markers

**Best For:** B2B SaaS, professional services, premium products, e-commerce conversion pages, established brands

**Key Effects:** Testimonial carousel animations, logo grid fade-in, stat counter animations (number count-up), review star ratings

### Page Pattern

**Pattern Name:** Minimal Single Column

- **Conversion Strategy:** Single CTA focus. Large typography. Lots of whitespace. No nav clutter. Mobile-first.
- **CTA Placement:** Center, large CTA button
- **Section Order:** 1. Hero headline, 2. Short description, 3. Benefit bullets (3 max), 4. CTA, 5. Footer

---

## Anti-Patterns (Do NOT Use)

- ❌ Complex navigation
- ❌ Hidden contact info

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
