import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreProvider } from '@/components/StoreProvider';
import { HOTEL_CONFIG } from '@hotel/config';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

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
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased selection:bg-luxury-gold selection:text-white">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
