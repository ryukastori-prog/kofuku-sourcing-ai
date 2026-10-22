"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { AI_MODEL, evaluateProduct } from "@/lib/ai";
import { getActiveCriteria } from "@/lib/criteria";
import { getTrialInfo } from "@/lib/trial";
import { CATEGORIES } from "@/lib/constants";

const optText = (max: number) =>
  z.string().trim().max(max).transform((v) => (v === "" ? null : v)).nullable();
const optInt = (max: number) =>
  z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .pipe(z.number().int().min(0).max(max).nullable());

const ProductSchema = z.object({
  name: z.string().trim().min(1, "商品名を入力してください").max(120),
  nameEn: optText(120),
  category: z.enum(CATEGORIES, { message: "カテゴリを選んでください" }),
  description: z.string().trim().min(1, "商品説明を入力してください").max(4000),
  specs: optText(2000),
  priceJpy: optInt(100_000_000),
  minOrderQty: optInt(100_000_000),
  leadTimeDays: optInt(1000),
  imageUrl: optText(500).refine((v) => v === null || /^https?:\/\//.test(v), "画像URLは https:// から始まる形式で入力してください"),
  certifications: optText(300),
  exportExperience: optText(2000),
  targetMarkets: optText(300),
});

function str(fd: FormData, key: string) {
  return String(fd.get(key) ?? "");
}

export async function saveProduct(formData: FormData) {
  const user = await requireUser();
  const id = str(formData, "id");
  const errPath = id ? `/products/${id}` : "/products/new";

  const parsed = ProductSchema.safeParse({
    name: str(formData, "name"),
    nameEn: str(formData, "nameEn"),
    category: str(formData, "category"),
    description: str(formData, "description"),
    specs: str(formData, "specs"),
    priceJpy: str(formData, "priceJpy"),
    minOrderQty: str(formData, "minOrderQty"),
    leadTimeDays: str(formData, "leadTimeDays"),
    imageUrl: str(formData, "imageUrl"),
    certifications: str(formData, "certifications"),
    exportExperience: str(formData, "exportExperience"),
    targetMarkets: str(formData, "targetMarkets"),
  });
  if (!parsed.success) {
    redirect(`${errPath}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }
  const data = { ...parsed.data, madeInJapan: formData.get("madeInJapan") === "on" };

  if (id) {
    const own = await db.product.findFirst({ where: { id, companyId: user.id } });
    if (!own) redirect("/dashboard");
    if (own.status === "EXPORTED") {
      redirect(`${errPath}?error=${encodeURIComponent("HUB登録済みの商品は編集できません")}`);
    }
    // 内容を変えたら審査待ちに戻す
    await db.product.update({ where: { id }, data: { ...data, status: "SUBMITTED" } });
  } else {
    await db.product.create({ data: { ...data, companyId: user.id } });
  }
  redirect("/dashboard?saved=1");
}

export async function deleteProduct(formData: FormData) {
  const user = await requireUser();
  const id = str(formData, "id");
  await db.product.deleteMany({ where: { id, companyId: user.id, status: { not: "EXPORTED" } } });
  redirect("/dashboard");
}

export async function selfEvaluate(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const path = `/products/${id}`;
  const product = await db.product.findFirst({ where: { id, companyId: user.id } });
  if (!product) redirect("/dashboard");

  const trial = await getTrialInfo(user);
  if (!trial.canEvaluate) {
    redirect(`${path}?error=${encodeURIComponent(trial.reason ?? "AI診断を実行できません")}`);
  }
  try {
    const criteria = await getActiveCriteria();
    const result = await evaluateProduct(product, criteria.body);
    await db.evaluation.create({
      data: { productId: id, criteriaId: criteria.id, model: AI_MODEL, byMember: true, ...result },
    });
  } catch {
    // 内部のエラー内容は会員には見せない
    redirect(`${path}?error=${encodeURIComponent("AI診断に失敗しました。時間をおいてもう一度お試しください（回数は消費されません）")}`);
  }
  revalidatePath(path);
  redirect(`${path}?done=1`);
}
