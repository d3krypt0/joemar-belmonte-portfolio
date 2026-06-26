import type { NextConfig } from 'next'

// ponytail: 'unsafe-inline' on script/style is required because Next injects
// inline bootstrap scripts (no nonce in static export) and the app uses inline
// style={{}} throughout. CSP still restricts origins, framing, and base-uri.
// 'unsafe-eval' is needed only in dev (React dev build + Turbopack use eval);
// production never uses eval, so it is omitted there.
const scriptSrc =
  process.env.NODE_ENV === 'development'
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com"
    : "script-src 'self' 'unsafe-inline' https://assets.calendly.com"

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://calendly.com https://*.calendly.com",
  "frame-src https://calendly.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  'upgrade-insecure-requests',
].join('; ')

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lobehub/icons'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default config
