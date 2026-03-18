import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  themeColor: '#1E5631',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://chelseamuslimcommunity.org.uk'),
  title: {
    template: '%s | Chelsea Muslim Community',
    default: 'Chelsea Muslim Community — SW10 London',
  },
  description: 'Chelsea Muslim Community (CMC) is a mosque and Islamic community centre serving Chelsea, Fulham, and West London from the heart of SW10. Daily prayers, Quran education, community welfare, and more.',
  keywords: ['mosque', 'chelsea', 'london', 'islamic', 'muslim', 'prayer', 'SW10', 'community', 'quran'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://chelseamuslimcommunity.org.uk',
    siteName: 'Chelsea Muslim Community',
    title: 'Chelsea Muslim Community — SW10 London',
    description: 'A mosque and Islamic community centre in the heart of Chelsea, West London.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Chelsea Muslim Community' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chelsea Muslim Community',
    description: 'A mosque and Islamic community centre in Chelsea, West London.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Navbar />
        <main id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
