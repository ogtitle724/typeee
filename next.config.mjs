/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
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
};

export default nextConfig;
