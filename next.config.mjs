/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Directs Next.js to parse code using your custom build config file
    tsconfigPath: "tsconfig.build.json",
  },
};

export default nextConfig;
