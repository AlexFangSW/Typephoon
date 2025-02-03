import type { NextConfig } from "next";
// import { env } from "process";


const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  // rewrites: async () => [
  //   {
  //     source: '/api/v1/:path*',
  //     destination: `${env.BACKEND_URL}/api/v1/:path*`,
  //   }
  // ]
};

export default nextConfig;
