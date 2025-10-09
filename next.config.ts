import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "static.wixstatic.com",
      "s3-alpha-sig.figma.com",
      "i.ytimg.com",
      "maps.googleapis.com",
      "lh3.googleusercontent.com",
    ],
  },
  webpack(config) {
    // Add SVG support with @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
