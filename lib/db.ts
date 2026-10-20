import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error("DATABASE_URL が設定されていません");
  // Neon の接続文字列に含まれる channel_binding は pg ドライバーで不要なため除去
  const url = new URL(raw);
  url.searchParams.delete("channel_binding");
  const adapter = new PrismaPg({ connectionString: url.toString(), max: 3 });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
