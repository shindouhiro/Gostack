/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // 将 /api/v1/* 的请求代理到后端
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/v1/:path*',
      },
    ]
  },
}

export default nextConfig
