import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         {
  //           key: "Content-Security-Policy",
  //           value: `
  //             default-src 'self';
  //             script-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://maps.googleapis.com https://maps.gstatic.com 'unsafe-inline' 'unsafe-eval';
  //             connect-src 'self' https://maps.googleapis.com https://maps.gstatic.com https://app.carenav.io;
  //             img-src 'self' data: blob: https://maps.googleapis.com https://lh3.googleusercontent.com https://static.wixstatic.com https://i.ytimg.com https://s3-alpha-sig.figma.com;
  //             style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  //             font-src 'self' https://fonts.gstatic.com;
  //           `.replace(/\s{2,}/g, " "), // remove extra spaces
  //         },
  //       ],
  //     },
  //   ];
  // },

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
    // ✅ Add SVG support with @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
