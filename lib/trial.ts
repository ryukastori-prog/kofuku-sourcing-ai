import { db } from "./db";

export const TRIAL_DAYS = 30;
export const TRIAL_EVAL_LIMIT = 5;

export function trialEndDate(from = new Date()) {
  return new Date(from.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
}

export type TrialInfo = {
  unlimited: boolean; // 運営アカウントは制限なし
  active: boolean;
  endsAt: Date;
  used: number;
  remaining: number;
  canEvaluate: boolean;
  reason?: string;
};

export async function getTrialInfo(user: {
  id: string;
  role: "MEMBER" | "ADMIN";
  trialEndsAt: Date;
}): Promise<TrialInfo> {
  const used = await db.evaluation.count({
    where: { byMember: true, product: { companyId: user.id } },
  });
  const active = user.trialEndsAt.getTime() > Date.now();
  const remaining = Math.max(0, TRIAL_EVAL_LIMIT - used);
  if (user.role === "ADMIN") {
    return { unlimited: true, active, endsAt: user.trialEndsAt, used, remaining, canEvaluate: true };
  }
  let reason: string | undefined;
  if (!active) reason = "無料期間が終了しました。引き続きご利用いただく方法は、運営からご案内します。";
  else if (remaining <= 0) reason = `無料期間中のAI診断は${TRIAL_EVAL_LIMIT}回までです。上限に達しました。`;
  return { unlimited: false, active, endsAt: user.trialEndsAt, used, remaining, canEvaluate: !reason, reason };
}
