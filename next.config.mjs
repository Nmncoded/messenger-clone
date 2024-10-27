/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript during build
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    swcPlugins: [["next-superjson-plugin", {}]],
  },
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "lh3.googleusercontent.com",
    //   },
    // ],
    domains: ["lh3.googleusercontent.com","avatars.githubusercontent.com","res.cloudinary.com","images.unsplash.com"],
  },
};

export default nextConfig;
