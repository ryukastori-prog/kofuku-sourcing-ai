-- 運営が付与できる追加のAI診断回数
ALTER TABLE "Company" ADD COLUMN "bonusEvals" INTEGER NOT NULL DEFAULT 0;
