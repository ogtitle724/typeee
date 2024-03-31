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
    ],
  },
};

export default nextConfig;
