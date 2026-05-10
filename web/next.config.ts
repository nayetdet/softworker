import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: new URL('..', import.meta.url).pathname,
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': new URL('./src', import.meta.url).pathname,
      '@template': new URL('../template', import.meta.url).pathname,
      '@docs': new URL('../docs', import.meta.url).pathname,
    }
    config.module.rules.push({
      resourceQuery: /raw/,
      type: 'asset/source',
    })

    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''};
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              img-src 'self' blob: data:;
              font-src 'self' https://fonts.gstatic.com;
              object-src 'none';
              base-uri 'self';
              frame-src 'none';
              form-action 'self';
              frame-ancestors 'none';
              upgrade-insecure-requests;
            `
              .replace(/\s{2,}/g, ' ')
              .trim(),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(); battery=(); geolocation=(); microphone=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
