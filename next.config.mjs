/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.AWS_S3_BUCKET_DOMAIN,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: process.env.GOOGLE_USER_DOMAIN,
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
