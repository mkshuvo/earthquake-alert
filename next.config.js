/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:51763/api/:path*',
      },
      {
        source: '/socket.io/:path*',
        destination: 'http://localhost:51763/socket.io/:path*',
      },
    ]
  },
}

module.exports = nextConfig
