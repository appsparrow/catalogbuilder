// Utility functions for generating promo links

export interface PromoLink {
  code: string;
  url: string;
  description: string;
  discount: string;
}

// Predefined promo codes and their details
export const PROMO_CODES = {
  'WELCOME10': {
    description: 'Welcome Discount',
    discount: '10% off first payment',
    valid: true
  },
  'SAVE20': {
    description: 'First Month Discount', 
    discount: '20% off first payment',
    valid: true
  },
  'EARLYBIRD': {
    description: 'Early Bird Special',
    discount: '$5 off first payment',
    valid: true
  },
  'TEST50': {
    description: 'Test Discount',
    discount: '50% off first payment',
    valid: true
  }
};

// Generate promo link for a given code
export function generatePromoLink(code: string, baseUrl: string = 'https://your-domain.com'): PromoLink {
  const promoDetails = PROMO_CODES[code as keyof typeof PROMO_CODES];
  
  if (!promoDetails) {
    throw new Error(`Invalid promo code: ${code}`);
  }

  return {
    code: code.toUpperCase(),
    url: `${baseUrl}/promo?code=${code.toUpperCase()}`,
    description: promoDetails.description,
    discount: promoDetails.discount
  };
}

// Generate multiple promo links
export function generatePromoLinks(codes: string[], baseUrl: string = 'https://your-domain.com'): PromoLink[] {
  return codes.map(code => generatePromoLink(code, baseUrl));
}

// Validate promo code
export function isValidPromoCode(code: string): boolean {
  return code.toUpperCase() in PROMO_CODES;
}

// Get promo code details
export function getPromoCodeDetails(code: string) {
  return PROMO_CODES[code.toUpperCase() as keyof typeof PROMO_CODES];
}
