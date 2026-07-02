import { Inter, Space_Grotesk } from 'next/font/google';
import '../index.css';
import '../sapio-visual.css';

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
  title: 'SapioMatch AI - Smart Academic Matching',
  description: 'AI-Powered Educational Recommendation Platform for Students and Working Professionals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* CSS Houdini Ring Particles PaintWorklet — Chrome/Edge native, polyfill for others */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(async function () {
  if (typeof CSS === 'undefined' || !CSS.paintWorklet) {
    try {
      await import('https://unpkg.com/css-paint-polyfill');
    } catch(e) { /* polyfill unavailable, dot-grid fallback stays active */ }
  }
  if (typeof CSS !== 'undefined' && CSS.paintWorklet) {
    CSS.paintWorklet.addModule(
      'https://unpkg.com/css-houdini-ringparticles/dist/ringparticles.js'
    ).catch(function() { /* ring particles unavailable, dot-grid fallback stays active */ });
  }
})();
`,
          }}
        />
        {/* Theme init — reads from localStorage before first paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var saved = localStorage.getItem('sapio_theme');
    if (saved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
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
