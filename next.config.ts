import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tijori-bucket-vga.s3.me-central-1.amazonaws.com",
        pathname: "/**",
      },
      // (Optional) If you ever serve images from API domain
      {
        protocol: "https",
        hostname: "tijori-api.vkapsprojects.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
