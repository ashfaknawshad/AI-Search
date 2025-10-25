import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // When your repository contains multiple package-lock/yarn.lock files
  // Turbopack may infer the wrong workspace root. Setting `turbopack.root`
  // forces the correct project root for Turbopack's workspace scanning.
  turbopack: {
    // Use project-relative root. This file lives in the `nextjs-app` folder,
    // so `'.'` points to the correct app root and silences the warning.
    root: '.'
  }
};

export default nextConfig;
