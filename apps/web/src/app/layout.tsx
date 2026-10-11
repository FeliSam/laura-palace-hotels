import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/StoreProvider';
import { HOTEL_CONFIG } from '@hotel/config';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant'
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: `${HOTEL_CONFIG.brand.name} | Réservation Officielle Suites & Villas Privées`,
  description: HOTEL_CONFIG.brand.tagline
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased selection:bg-luxury-gold selection:text-black">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
