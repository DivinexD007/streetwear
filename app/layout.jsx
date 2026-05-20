import { Playfair_Display, Barlow_Condensed } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
});

export const metadata = {
  title: 'VT — Underground Streetwear',
  description: 'Premium underground streetwear. Limited runs.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${barlow.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
