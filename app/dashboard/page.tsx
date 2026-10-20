import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL } from "@/lib/constants";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireUser();
  const { saved } = await searchParams;
  const products = await db.product.findMany({
    where: { companyId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <h1>登録した商品</h1>
      {saved && <div className="notice">保存しました。</div>}
      <div className="actions" style={{ marginTop: 0, marginBottom: 16 }}>
        <Link className="btn gold" href="/products/new">商品を登録する</Link>
      </div>
      <div className="card table-wrap">
        {products.length === 0 ? (
          <p className="muted">まだ商品がありません。「商品を登録する」から追加してください。</p>
        ) : (
          <table>
            <thead>
              <tr><th>商品名</th><th>カテゴリ</th><th>状態</th><th>登録日</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td><Link href={`/products/${p.id}`}>{p.name}</Link></td>
                  <td>{p.category}</td>
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
