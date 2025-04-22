import type { NextConfig } from "next";
// import { env } from "process";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  async redirects() {
    return [
      {
        source: "/test",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
