import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: {
    "/": ["./data/question-bank/question-bank.json"],
    "/exam": ["./data/question-bank/question-bank.json"],
    "/exams": ["./data/question-bank/question-bank.json"],
    "/practice": ["./data/question-bank/question-bank.json"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
