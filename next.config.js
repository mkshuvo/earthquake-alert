/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backendHost = process.env.BACKEND_HOST || 'localhost';
    const backendPort = process.env.BACKEND_PORT || '51763';
    const url = `http://${backendHost}:${backendPort}`;
    console.log('Backend URL for rewrites:', url);

    return [
      {
        source: '/api/:path*',
        destination: `${url}/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${url}/socket.io/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
