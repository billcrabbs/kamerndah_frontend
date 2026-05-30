// src/styles/theme.js

/**
 * KamerNdah Premium Theme Tokens
 * 
 * Palette inspired by Modern African Luxury:
 * - Emerald Green: Nature, trust, and growth (Cameroon's lush landscapes).
 * - Golden Sand: Value, sunshine, and premium quality.
 * - Deep Slate: Stability and sophistication.
 */

export const theme = {
  colors: {
    primary: {
      light: '#10b981', // Emerald 500
      DEFAULT: '#059669', // Emerald 600
      dark: '#047857', // Emerald 700
    },
    secondary: {
      light: '#fbbf24', // Amber 400
      DEFAULT: '#f59e0b', // Amber 500
      dark: '#d97706', // Amber 600
    },
    accent: {
      slate: '#1e293b', // Slate 800
      gold: '#d4af37', // Metallic Gold
    },
    background: {
      light: '#f8fafc', // Slate 50
      alt: '#ffffff',
    }
  },
  borderRadius: {
    premium: '1rem',
    button: '0.5rem',
  },
  animations: {
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  }
};
