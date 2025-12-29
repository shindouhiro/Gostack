/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        // 将 /api/v1/* 的请求代理到后端
        source: '/api/v1/:path*',
        destination: process.env.API_URL || 'http://localhost:8080/v1/:path*',
      },
    ]
  },
}

export default nextConfig
