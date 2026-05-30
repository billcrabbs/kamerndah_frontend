export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'KamerNdah',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Verified Properties Across Cameroon',
  support: {
    phone: process.env.NEXT_PUBLIC_SUPPORT_PHONE,
    email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  },
};