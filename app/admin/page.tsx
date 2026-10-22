import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { STATUS_LABEL } from "@/lib/constants";

const FILTERS = ["ALL", "SUBMITTED", "APPROVED", "ON_HOLD", "REJECTED", "EXPORTED"] as const;

export default async function AdminHome({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const current = (FILTERS as readonly string[]).includes(status ?? "") ? status! : "ALL";
  const products = await db.product.findMany({
    where: current === "ALL" ? {} : { status: current as never },
    orderBy: { createdAt: "desc" },
    include: {
      company: { select: { companyName: true } },
      evaluations: { orderBy: { createdAt: "desc" }, take: 1, select: { score: true } },
    },
    take: 200,
  });
  return (
    <>
      <h1>管理画面</h1>
      <div className="actions" style={{ marginTop: 0, marginBottom: 16 }}>
        <Link className="btn ghost small" href="/admin/members">会員一覧</Link>
        <Link className="btn ghost small" href="/admin/criteria">AI評価の基準を編集</Link>
        <a className="btn ghost small" href="/admin/export">採用商品をCSVで書き出す</a>
      </div>
      <div className="filters">
        {FILTERS.map((f) => (
          <Link key={f} href={f === "ALL" ? "/admin" : `/admin?status=${f}`} className={current === f ? "on" : ""}>
            {f === "ALL" ? "すべて" : STATUS_LABEL[f]}
          </Link>
        ))}
      </div>
      <div className="card table-wrap">
        {products.length === 0 ? (
          <p className="muted">該当する商品はありません。</p>
        ) : (
          <table>
            <thead>
              <tr><th>商品名</th><th>会社</th><th>カテゴリ</th><th>AI評価</th><th>状態</th><th>登録日</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><Link href={`/admin/products/${p.id}`}>{p.name}</Link></td>
                  <td>{p.company.companyName}</td>
                  <td>{p.category}</td>
                  <td>{p.evaluations[0] ? `${p.evaluations[0].score}点` : "—"}</td>
                  <td><span className={`badge ${p.status}`}>{STATUS_LABEL[p.status]}</span></td>
                  <td>{p.createdAt.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
