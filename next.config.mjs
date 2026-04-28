/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "admin.felia-home.co.jp" },
      { protocol: "https", hostname: "felia-home.co.jp" },
      { protocol: "https", hostname: "img.hs.aws.multi-use.net" },
      { protocol: "http",  hostname: "49.212.210.97" },
      { protocol: "http",  hostname: "localhost" },
      { protocol: "https", hostname: "pub-893cf744fd3d496f9ceeeedf86b3c3dc.r2.dev" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
