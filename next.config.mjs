/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dymvz3pmd/image/upload/**', // This matches your Cloudinary account ID
      },
    ],
  },
};

export default nextConfig;