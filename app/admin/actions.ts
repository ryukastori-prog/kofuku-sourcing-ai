"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AI_MODEL, evaluateProduct } from "@/lib/ai";
import { DEFAULT_CRITERIA } from "@/lib/constants";
import { getActiveCriteria } from "@/lib/criteria";

export async function runEvaluation(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const product = await db.product.findUnique({ where: { id } });
  if (!product) redirect("/admin");
  const path = `/admin/products/${id}`;
  try {
    const criteria = await getActiveCriteria();
    const result = await evaluateProduct(product, criteria.body);
    await db.evaluation.create({
      data: { productId: id, criteriaId: criteria.id, model: AI_MODEL, ...result },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI評価に失敗しました";
    redirect(`${path}?error=${encodeURIComponent(msg)}`);
  }
  revalidatePath(path);
  redirect(`${path}?done=1`);
}

const STATUSES = ["SUBMITTED", "APPROVED", "ON_HOLD", "REJECTED"] as const;

export async function updateReview(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("adminNote") ?? "").trim().slice(0, 1000);
  if (!(STATUSES as readonly string[]).includes(status)) redirect(`/admin/products/${id}`);
  const current = await db.product.findUnique({ where: { id } });
  if (!current) redirect("/admin");
  // HUB登録済みの商品は、ここでは状態を変えない
  if (current.status !== "EXPORTED") {
    await db.product.update({
      where: { id },
      data: { status: status as (typeof STATUSES)[number], adminNote: note || null },
    });
  }
  redirect(`/admin/products/${id}?done=1`);
}

export async function saveCriteria(formData: FormData) {
  await requireAdmin();
  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 10 || body.length > 4000) {
    redirect(`/admin/criteria?error=${encodeURIComponent("基準は10〜4000文字で入力してください")}`);
  }
  await db.$transaction([
    db.criteria.updateMany({ where: { active: true }, data: { active: false } }),
    db.criteria.create({ data: { body, active: true } }),
  ]);
  redirect("/admin/criteria?done=1");
}

export async function resetCriteriaToDefault() {
  await requireAdmin();
  await db.$transaction([
    db.criteria.updateMany({ where: { active: true }, data: { active: false } }),
    db.criteria.create({ data: { body: DEFAULT_CRITERIA, active: true } }),
  ]);
  redirect("/admin/criteria?done=1");
}

export async function extendTrial(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const kind = String(formData.get("kind") ?? "");
  const c = await db.company.findUnique({ where: { id } });
  if (!c || c.role !== "MEMBER") redirect("/admin/members");
  if (kind === "days") {
    const base = Math.max(Date.now(), c.trialEndsAt.getTime());
    await db.company.update({ where: { id }, data: { trialEndsAt: new Date(base + 30 * 24 * 60 * 60 * 1000) } });
  } else if (kind === "evals") {
    await db.company.update({ where: { id }, data: { bonusEvals: { increment: 5 } } });
  }
  redirect("/admin/members?done=1");
}
