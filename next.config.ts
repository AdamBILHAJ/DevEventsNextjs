import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*experimental: {
    // This tells the dev server to trust requests from your local machine/tools
    allowedDevOrigins: ["localhost:3000", "http://localhost:3000"]
  } as any,*/
  /* config options here */
  experimental: {
    serverExternalPackages: ['jsdom'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            }
        ]
    },
  cacheComponents:true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,  
};
export default nextConfig;
