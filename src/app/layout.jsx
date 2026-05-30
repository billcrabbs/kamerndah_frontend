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
});

const playfair = Playfair_Display({
 subsets: ['latin'],
 variable: '--font-playfair',
 display: 'swap',
});

export const metadata = {
 title: 'KamerNdah - Verified Properties Across Cameroon',
 description: 'Find your dream home with verified properties in Douala, Yaoundé, Buea, Bamenda, Bafoussam and more.',
 manifest: '/manifest.json',
};

export const viewport = {
 themeColor: '#059669',
 width: 'device-width',
 initialScale: 1,
 maximumScale: 1,
};

export default function RootLayout({ children }) {
 return (
 <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
 <body className="antialiased selection:bg-primary selection:text-white bg-background">
 <ReduxProvider>
 <AuthProvider>
 <UIProvider>
 <div className="min-h-screen bg-background flex flex-col items-stretch">
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