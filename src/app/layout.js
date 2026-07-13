import { Inter, Space_Grotesk } from 'next/font/google';
import '../index.css';
import '../learnova-visual.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: 'Learnova AI - Smart Academic Matching',
  description: 'AI-Powered Educational Recommendation Platform for Students and Working Professionals.',
  openGraph: {
    title: 'Learnova AI - Smart Academic Matching',
    description: 'Find your best-fit university programs using our verified AI matchmaking engine.',
    url: 'https://my-repository-delta-bay.vercel.app',
    siteName: 'Learnova AI',
    images: [
      {
        url: 'https://my-repository-delta-bay.vercel.app/imports/guide_step1_wide.png',
        width: 1200,
        height: 630,
        alt: 'Learnova AI Match Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learnova AI - Smart Academic Matching',
    description: 'Find your best-fit university programs using our verified AI matchmaking engine.',
    images: ['https://my-repository-delta-bay.vercel.app/imports/guide_step1_wide.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>

        {/* Theme init — force light theme for three-color base design */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('learnova_theme', 'light');
  } catch(e) {}
})();
`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
