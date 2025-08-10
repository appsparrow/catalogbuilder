// Brand color presets for easy customer customization

export interface BrandPreset {
  name: string;
  description: string;
  colors: {
    pink: string;    // Primary color (HSL format without hsl())
    green: string;   // Secondary color  
    orange: string;  // Accent color
    brown: string;   // Dark accent color
  };
}

export const brandPresets: BrandPreset[] = [
  {
    name: "Default",
    description: "Original brand colors",
    colors: {
      pink: "342 85% 69%",    // #F36D8D
      green: "76 55% 76%",    // #D8E5A0  
      orange: "37 92% 73%",   // #FAB977
      brown: "37 75% 31%"     //rgb(79, 19, 36)
    }
  },
  {
    name: "Ocean Blue",
    description: "Professional blue theme",
    colors: {
      pink: "220 85% 70%",    // Blue
      green: "180 55% 65%",   // Teal
      orange: "200 90% 75%",  // Light blue
      brown: "210 60% 35%"    // Navy blue
    }
  },
  {
    name: "Purple Haze",
    description: "Creative purple theme", 
    colors: {
      pink: "280 85% 70%",    // Purple
      green: "120 55% 65%",   // Green
      orange: "260 90% 75%",  // Lavender
      brown: "270 70% 40%"    // Deep purple
    }
  },
  {
    name: "Sunset",
    description: "Warm sunset colors",
    colors: {
      pink: "350 85% 70%",    // Hot pink
      green: "60 55% 65%",    // Yellow-green
      orange: "25 90% 75%",   // Orange-red
      brown: "15 80% 45%"     // Deep orange
    }
  },
  {
    name: "Forest",
    description: "Natural green theme",
    colors: {
      pink: "140 65% 55%",    // Forest green
      green: "100 55% 70%",   // Light green
      orange: "80 80% 65%",   // Yellow-green
      brown: "120 70% 30%"    // Dark forest green
    }
  }
];

/**
 * Apply a brand preset to the CSS custom properties
 */
export function applyBrandPreset(preset: BrandPreset) {
  const root = document.documentElement;
  
  root.style.setProperty('--brand-pink', preset.colors.pink);
  root.style.setProperty('--brand-green', preset.colors.green);
  root.style.setProperty('--brand-orange', preset.colors.orange);
  root.style.setProperty('--brand-brown', preset.colors.brown);
  
  // Update background gradient with new colors - subtle like Lovable.dev
  const bgGradient = [
    `linear-gradient(135deg, hsla(${preset.colors.pink}, 0.03) 0%, transparent 30%)`,
    `linear-gradient(225deg, hsla(${preset.colors.green}, 0.04) 0%, transparent 40%)`,
    `linear-gradient(315deg, hsla(${preset.colors.orange}, 0.02) 0%, transparent 35%)`,
    `radial-gradient(ellipse at 10% 20%, hsla(${preset.colors.brown}, 0.02) 0%, transparent 60%)`,
    `radial-gradient(ellipse at 90% 80%, hsla(${preset.colors.pink}, 0.025) 0%, transparent 70%)`
  ].join(', ');
  
  root.style.setProperty('--bg-gradient', bgGradient);
  
  console.log(`✅ Applied brand preset: ${preset.name}`);
}

/**
 * Get the current brand colors from CSS custom properties
 */
export function getCurrentBrandColors() {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  
  return {
    pink: style.getPropertyValue('--brand-pink').trim(),
    green: style.getPropertyValue('--brand-green').trim(),
    orange: style.getPropertyValue('--brand-orange').trim(),
    brown: style.getPropertyValue('--brand-brown').trim()
  };
}
