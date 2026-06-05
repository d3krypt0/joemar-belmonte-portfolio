import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Syne } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Joemar Belmonte — AI Automation Specialist',
  description:
    "Chat with Joemar's AI avatar to learn about his projects, skills, and how he can automate your business with n8n, Make.com, and custom AI workflows.",
  openGraph: {
    title: 'Joemar Belmonte — AI Automation Specialist',
    description:
      'Ask me anything about AI automation, n8n, Make.com, or how I can help your business run on autopilot.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joemar Belmonte — AI Automation Specialist',
    description: 'Interactive AI portfolio. Ask me anything.',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
