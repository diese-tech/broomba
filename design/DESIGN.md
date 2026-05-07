---
name: Broomba Core
colors:
  surface: '#fbf8fe'
  surface-dim: '#dcd9de'
  surface-bright: '#fbf8fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f8'
  surface-container: '#f0edf2'
  surface-container-high: '#eae7ed'
  surface-container-highest: '#e4e1e7'
  on-surface: '#1b1b1f'
  on-surface-variant: '#484456'
  inverse-surface: '#303034'
  inverse-on-surface: '#f3f0f5'
  outline: '#797488'
  outline-variant: '#cac3d9'
  surface-tint: '#642ef5'
  primary: '#550ee7'
  on-primary: '#ffffff'
  primary-container: '#6e3dff'
  on-primary-container: '#ece4ff'
  inverse-primary: '#cbbeff'
  secondary: '#006c44'
  on-secondary: '#ffffff'
  secondary-container: '#25fea8'
  on-secondary-container: '#007147'
  tertiary: '#7c4000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a05400'
  on-tertiary-container: '#ffe3d0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e7deff'
  primary-fixed-dim: '#cbbeff'
  on-primary-fixed: '#1e0061'
  on-primary-fixed-variant: '#4b00d4'
  secondary-fixed: '#50ffaf'
  secondary-fixed-dim: '#00e293'
  on-secondary-fixed: '#002111'
  on-secondary-fixed-variant: '#005232'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb77f'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6f3900'
  background: '#fbf8fe'
  on-background: '#1b1b1f'
  surface-variant: '#e4e1e7'
typography:
  h1:
    fontFamily: Syne
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Syne
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.5'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  margin-mobile: 20px
  gutter-mobile: 16px
---

## Brand & Style

This design system is built on "Vibe-Heavy Realism"—a design language that bridges the gap between high-end modern tech and the chaotic energy of digital youth culture. It avoids the sterile, "optimized" look of traditional productivity apps in favor of a personality-forward aesthetic that feels alive and self-aware.

The visual direction combines **High-Contrast Boldness** with elements of **Tactile Softness**. It uses saturated colors and massive typography to command attention, while employing soft shadows and deep roundedness to maintain an approachable, "squishy" physical presence. The tone is "slightly judgy but ultimately supportive," reflected through expressive status badges and a layout that prioritizes thumb-friendly interaction over information density.

## Colors

The color palette centers on **Slightly Judgy Purple**, a sophisticated yet loud violet that acts as the primary brand anchor. 

- **Primary (Slightly Judgy Purple):** Used for main actions, active states, and brand-heavy UI elements.
- **Success (Vibrant Mint):** Reserved for "Clean" status, completion rewards, and positive reinforcement.
- **Warning/Mess (Warning Orange & Electric Red):** A sliding scale of urgency. Orange represents "Starting to look like a landfill," while Electric Red signifies "Immediate intervention required."
- **Backgrounds:** Clean, off-white surfaces provide high legibility, often enhanced with very subtle linear gradients (e.g., Purple to Transparent at 5% opacity) to create a sense of depth and modern "glow."

## Typography

Typography in this design system is a dual-engine setup. **Syne** is used for all display and heading levels, leveraging its unique, expressive letterforms to inject humor and "vibe" into the interface. Headings should be set with tight tracking and aggressive weights.

**Inter** handles all functional data. It is chosen for its exceptional readability on mobile screens, ensuring that even when the app is being "judgy," the information remains clear. Body text should maintain generous line heights to ensure a relaxed, non-clinical reading experience.

## Layout & Spacing

The design system utilizes a **Fluid Grid** model optimized for one-handed mobile use. The layout is driven by a 20px outer margin "Safe Zone" to prevent accidental touches near screen edges.

Content is organized into vertical stacks with generous breathing room. Spacing follows an 8px rhythmic scale, but emphasizes the "MD" (24px) unit as the standard separator for card elements and sections. Large touch targets are mandatory, with no interactive element falling below a 48px height/width footprint.

## Elevation & Depth

Depth is conveyed through **Soft Tinted Shadows** and **Tonal Layering**. Unlike traditional gray shadows, this design system uses shadows tinted with the primary purple (e.g., `#6E3DFF` at 12% opacity) to keep the UI looking "saturated" rather than muddy.

Elements use "Physical Stacking":
- **Level 0 (Floor):** Base background with a subtle radial gradient.
- **Level 1 (Cards):** White surfaces with a large blur-radius shadow (20px-30px) and low opacity.
- **Level 2 (Modals/Overlays):** Glassmorphic surfaces with a 15px backdrop blur and a thin, semi-transparent white border to simulate light hitting the edge of a plastic-like material.

## Shapes

The shape language is unapologetically **Hyper-Rounded**. Borrowing from "Toy-ish" design trends, the system uses large corner radii (24px for cards, pill-shaped for buttons) to communicate playfulness and safety. 

Containers should never feel "sharp." Even small elements like checkboxes or input fields use a minimum radius of 12px. The goal is a "pill-heavy" interface where every corner feels soft to the touch, reinforcing the energetic and approachable brand personality.

## Components

- **Buttons:** Large, pill-shaped, and high-contrast. The primary button uses a subtle "squish" animation on press (scale 0.96) and a vibrant drop shadow that matches its background color.
- **Expressive Badges:** Status indicators (e.g., "Clean-ish," "Bro...") are oversized with bold Syne typography. They use high-saturation backgrounds and are often slightly rotated (2-3 degrees) to feel less like a tool and more like a sticker.
- **Input Fields:** Large 56px height fields with a light purple tint (`#F3EFFF`) background. Borders are only used on focus, appearing as a thick 2px 'Slightly Judgy Purple' stroke.
- **Cards:** All cards feature a 24px corner radius. They should be treated as floating objects with generous internal padding (24px).
- **Mess Meters:** Custom progress bars with "chunky" segments. As the bar fills, the color shifts from Mint to Electric Red, accompanied by illustrative icons (e.g., a sparkling diamond vs. a literal trash fire).
- **Playful Icons:** Use "thick-stroke" illustrative icons (2px minimum weight) with rounded caps and joins. Icons should be semi-abstract and characterful.