"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { destroySession, requireUser } from "@/lib/auth";

export async function deleteAccount(formData: FormData) {
  const user = await requireUser();
  const fail = (m: string): never => redirect(`/account?error=${encodeURIComponent(m)}`);

  if (user.role === "ADMIN") fail("運営アカウントは、ここから退会できません");
  if (formData.get("confirm") !== "yes") fail("確認のチェックを入れてください");

  const company = await db.company.findUnique({ where: { id: user.id } });
  if (!company) redirect("/");
  const ok = await bcrypt.compare(String(formData.get("password") ?? ""), company.passwordHash);
  if (!ok) fail("パスワードが違います");

  // 商品・AI診断の結果は、外部キーの連動削除でまとめて消える
  await db.company.delete({ where: { id: user.id } });
  await destroySession();
  redirect("/?deleted=1");
}
