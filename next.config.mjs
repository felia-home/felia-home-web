/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "admin.felia-home.co.jp" },
      { protocol: "https", hostname: "img.hs.aws.multi-use.net" },
      { protocol: "http", hostname: "49.212.210.97" },
    ],
  },
};

export default nextConfig;
