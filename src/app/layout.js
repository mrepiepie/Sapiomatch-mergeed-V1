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
