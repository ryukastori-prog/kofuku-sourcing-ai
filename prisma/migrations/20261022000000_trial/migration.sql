-- 無料期間（登録から30日）と、会員が自分で実行したAI診断の区別
ALTER TABLE "Company" ADD COLUMN "trialEndsAt" TIMESTAMP(3);
UPDATE "Company" SET "trialEndsAt" = "createdAt" + INTERVAL '30 days';
ALTER TABLE "Company" ALTER COLUMN "trialEndsAt" SET NOT NULL;

ALTER TABLE "Evaluation" ADD COLUMN "byMember" BOOLEAN NOT NULL DEFAULT false;
