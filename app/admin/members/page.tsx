import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { TRIAL_EVAL_LIMIT } from "@/lib/trial";
import { extendTrial } from "../actions";

const fmt = (d: Date) => d.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" });

export default async function Members({
  searchParams,
}: {
  searchParams: Promise<{ done?: string }>;
}) {
  await requireAdmin();
  const { done } = await searchParams;
  const companies = await db.company.findMany({
    where: { role: "MEMBER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
  const evals = await db.evaluation.findMany({
    where: { byMember: true },
    select: { product: { select: { companyId: true } } },
  });
  const used = new Map<string, number>();
  for (const e of evals) used.set(e.product.companyId, (used.get(e.product.companyId) ?? 0) + 1);
  const now = Date.now();

  return (
    <>
      <p><Link href="/admin">← 管理画面に戻る</Link></p>
      <div className="card table-wrap">
        <h1>会員一覧</h1>
        {done && <div className="notice">更新しました。</div>}
        {companies.length === 0 ? (
          <p className="muted">会員はまだいません。</p>
        ) : (
          <table>
            <thead>
              <tr><th>会社</th><th>登録日</th><th>商品</th><th>無料期間</th><th>AI診断</th><th>操作</th></tr>
            </thead>
            <tbody>
              {companies.map((c) => {
                const u = used.get(c.id) ?? 0;
                const limit = TRIAL_EVAL_LIMIT + c.bonusEvals;
                const active = c.trialEndsAt.getTime() > now;
                return (
                  <tr key={c.id}>
                    <td>{c.companyName}<br /><span className="muted" style={{ fontSize: 12 }}>{c.contactName} ／ {c.email}</span></td>
                    <td>{fmt(c.createdAt)}</td>
                    <td>{c._count.products}件</td>
                    <td>{fmt(c.trialEndsAt)}<br /><span className="badge" style={active ? undefined : { background: "#fbe1de", color: "#b3261e" }}>{active ? "無料期間中" : "期間終了"}</span></td>
                    <td>{u} / {limit}回</td>
                    <td>
                      <form action={extendTrial} style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="btn small ghost" name="kind" value="days" type="submit">+30日</button>
                        <button className="btn small ghost" name="kind" value="evals" type="submit">+5回</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
