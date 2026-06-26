import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "loud-guests-roll.loca.lt",
    "khaki-rabbits-sink.loca.lt",
    "*.loca.lt",
  ],
  async rewrites() {
    return [
      {
        source: "/pt/projetos",
        destination: "/pt/projects",
      },
      {
        source: "/pt/projetos/:slug",
        destination: "/pt/projects/:slug",
      },
      {
        source: "/pt/sobre",
        destination: "/pt/about",
      },
      {
        source: "/pt/contato",
        destination: "/pt/contact",
      },
    ];
  },
};

export default nextConfig;
