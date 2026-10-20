import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getActiveCriteria, saveCriteria } from "../actions";

export default async function CriteriaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  await requireAdmin();
  const { error, done } = await searchParams;
  const criteria = await getActiveCriteria();
  return (
    <>
      <p><Link href="/admin">← 管理画面に戻る</Link></p>
      <div className="card">
        <h1>AI評価の基準</h1>
        <p className="muted">
          ここに書いた内容が、AIが商品を評価するときの基準になります。変更後の評価から反映されます。
        </p>
        {error && <div className="error">{error}</div>}
        {done && <div className="notice">保存しました。</div>}
        <form action={saveCriteria}>
          <textarea name="body" required minLength={10} maxLength={4000} style={{ minHeight: 260 }} defaultValue={criteria.body} />
          <div className="actions">
            <button className="btn gold" type="submit">保存する</button>
          </div>
        </form>
      </div>
    </>
  );
}
