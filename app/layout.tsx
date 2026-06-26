import type { Metadata } from 'next'
import { GeistMono } from 'geist/font/mono'
import { Inter_Tight } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import ErrorBoundary from '@/components/ErrorBoundary'

const cabinetGrotesk = localFont({
  variable: '--font-display',
  display: 'swap',
  src: [
    { path: '../fonts/CabinetGrotesk-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/CabinetGrotesk-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/CabinetGrotesk-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/CabinetGrotesk-Extrabold.woff2', weight: '800', style: 'normal' },
  ],
})

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://joemar-belmonte-portfolio.vercel.app'),
  title: 'Joemar Belmonte - AI Automation Specialist',
  description:
    "Chat with Joemar's AI avatar to learn about his projects, skills, and how he can automate your business with n8n, Make.com, and custom AI workflows.",
  openGraph: {
    title: 'Joemar Belmonte - AI Automation Specialist',
    description:
      'Ask me anything about AI automation, n8n, Make.com, or how I can help your business run on autopilot.',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/avatar.png', width: 400, height: 400, alt: 'Joemar Belmonte - AI Automation Specialist' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joemar Belmonte - AI Automation Specialist',
    description: 'Interactive AI portfolio. Ask me anything.',
    images: ['/avatar.png'],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cabinetGrotesk.variable} ${interTight.variable} ${GeistMono.variable}`}
    >
      <head>
        {/* Set theme before first paint to avoid a light-mode flash for dark-mode visitors. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'light'}catch(e){document.documentElement.dataset.theme='light'}",
          }}
        />
      </head>
      <body><ErrorBoundary>{children}</ErrorBoundary></body>
    </html>
  )
}
