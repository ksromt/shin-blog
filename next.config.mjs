/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
  // Output configuration for better compatibility
  // output: 'standalone', // 注释掉这行以使用标准部署
}

export default nextConfig
