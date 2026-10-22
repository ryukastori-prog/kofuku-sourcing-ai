import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { REJECTED_RETENTION_DAYS } from "@/lib/constants";

// Vercel Cron から毎日呼ばれる。CRON_SECRET が未設定のときは、常に拒否する。
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const before = new Date(Date.now() - REJECTED_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const res = await db.product.deleteMany({
    where: { status: "REJECTED", updatedAt: { lt: before } },
  });
  return NextResponse.json({ deletedRejectedProducts: res.count });
}
