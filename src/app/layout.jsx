import { Outfit, Playfair_Display } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import ReduxProvider from '@/components/providers/ReduxProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { UIProvider } from '@/components/providers/UIProvider';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata = {
  title: 'KamerNdah — Verified Properties Across Cameroon',
  description: 'Find your dream home with 100% physically verified properties in Douala, Yaoundé, Buea, Bamenda, Bafoussam and more. Rent or buy with full confidence.',
  manifest: '/manifest.json',
  keywords: 'properties cameroon, real estate douala, apartments yaounde, houses for rent cameroon',
};

export const viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body className="antialiased bg-white text-foreground">
        <ReduxProvider>
          <AuthProvider>
            <UIProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="w-full flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </UIProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}