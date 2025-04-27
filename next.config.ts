const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  assetPrefix: isProd ? "/tornelo-vega-diff/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
