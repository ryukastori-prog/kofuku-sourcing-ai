"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession, isAdminEmail } from "@/lib/auth";
import { trialEndDate } from "@/lib/trial";

const RegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(10, "パスワードは10文字以上にしてください").max(100),
  companyName: z.string().trim().min(1, "会社名を入力してください").max(100),
  contactName: z.string().trim().min(1, "担当者名を入力してください").max(100),
  phone: z.string().trim().max(40).optional(),
  website: z.string().trim().max(200).optional(),
});

function back(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function register(formData: FormData) {
  const parsed = RegisterSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    companyName: formData.get("companyName"),
    contactName: formData.get("contactName"),
    phone: formData.get("phone") || undefined,
    website: formData.get("website") || undefined,
  });
  if (!parsed.success) back("/register", parsed.error.issues[0].message);
  const d = parsed.data;

  const exists = await db.company.findUnique({ where: { email: d.email } });
  if (exists) back("/register", "このメールアドレスはすでに登録されています");

  const company = await db.company.create({
    data: {
      email: d.email,
      passwordHash: await bcrypt.hash(d.password, 12),
      companyName: d.companyName,
      contactName: d.contactName,
      phone: d.phone,
      website: d.website,
      role: isAdminEmail(d.email) ? "ADMIN" : "MEMBER",
      trialEndsAt: trialEndDate(),
    },
  });
  await createSession(company.id);
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const company = await db.company.findUnique({ where: { email } });
  // メールの有無が分からないよう、同じメッセージにする
  const ok = company ? await bcrypt.compare(password, company.passwordHash) : false;
  if (!company || !ok) back("/login", "メールアドレスまたはパスワードが違います");

  if (isAdminEmail(company.email) && company.role !== "ADMIN") {
    await db.company.update({ where: { id: company.id }, data: { role: "ADMIN" } });
  }
  await createSession(company.id);
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
