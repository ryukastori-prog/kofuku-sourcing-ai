import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";

// CSVの数式インジェクション対策（= + - @ で始まる値の先頭に ' を付ける）
function cell(v: unknown) {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const products = await db.product.findMany({
    where: { status: { in: ["APPROVED", "EXPORTED"] } },
    orderBy: { createdAt: "asc" },
    include: {
      company: true,
      evaluations: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
  const header = [
    "product_id", "company_name", "company_email", "company_website",
    "name", "name_en", "category", "description", "specs", "price_jpy",
    "min_order_qty", "lead_time_days", "made_in_japan", "certifications",
    "export_experience", "target_markets", "image_url", "ai_score", "status",
  ];
  const lines = [header.map(cell).join(",")];
  for (const p of products) {
    lines.push(
      [
        p.id, p.company.companyName, p.company.email, p.company.website,
        p.name, p.nameEn, p.category, p.description, p.specs, p.priceJpy,
        p.minOrderQty, p.leadTimeDays, p.madeInJapan ? "true" : "false", p.certifications,
        p.exportExperience, p.targetMarkets, p.imageUrl, p.evaluations[0]?.score, p.status,
      ].map(cell).join(","),
    );
  }
  // Excelで文字化けしないようBOM付き
  const body = "﻿" + lines.join("\r\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="trade-hub-products.csv"',
    },
  });
}
