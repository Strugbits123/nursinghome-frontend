import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "script-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net 'unsafe-inline' 'unsafe-eval';",
          },
        ],
      },
    ];
  },
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
