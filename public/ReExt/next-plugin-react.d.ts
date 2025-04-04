import type { Configuration as WebpackConfig } from 'webpack';
import type { NextConfig } from 'next';

interface WebpackOptions {
  webpack: {
    DefinePlugin: new (definitions: Record<string, string>) => void;
  };
  [key: string]: any;
}

/**
 * ReExt Next.js plugin configuration
 * @param nextConfig - The Next.js configuration object
 * @returns Enhanced Next.js configuration with ReExt webpack setup
 */
declare function reextPlugin(nextConfig?: NextConfig): NextConfig & {
  webpack(config: WebpackConfig, options: WebpackOptions): WebpackConfig;
};

export default reextPlugin;