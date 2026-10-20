/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "pg"],
  // Prisma(ドライバーアダプター方式)が実行時に読むWASMファイルを、Vercelの公開物に含める
  outputFileTracingIncludes: {
    "/": ["./node_modules/.prisma/client/**/*", "./node_modules/@prisma/client/**/*"],
    "/**/*": ["./node_modules/.prisma/client/**/*", "./node_modules/@prisma/client/**/*"],
  },
};

export default nextConfig;
