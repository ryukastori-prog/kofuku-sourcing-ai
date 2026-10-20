import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { STATUS_LABEL } from "@/lib/constants";
import { runEvaluation, updateReview } from "../../actions";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <tr>
      <th style={{ width: 140 }}>{label}</th>
      <td style={{ whiteSpace: "pre-wrap" }}>{value}</td>
    </tr>
  );
}

export default async function AdminProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error, done } = await searchParams;
  const p = await db.product.findUnique({
    where: { id },
    include: {
      company: true,
      evaluations: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  if (!p) notFound();
  const latest = p.evaluations[0];

  return (
    <>
      <p><Link href="/admin">← 一覧に戻る</Link></p>
      {error && <div className="error">{error}</div>}
      {done && <div className="notice">保存しました。</div>}

      <div className="card">
        <h1>{p.name}</h1>
        <p><span className={`badge ${p.status}`}>{STATUS_LABEL[p.status]}</span></p>
        <table>
          <tbody>
            <Row label="会社" value={`${p.company.companyName}（${p.company.contactName}）`} />
            <Row label="連絡先" value={p.company.email} />
            <Row label="Webサイト" value={p.company.website} />
            <Row label="英語名" value={p.nameEn} />
            <Row label="カテゴリ" value={p.category} />
            <Row label="説明" value={p.description} />
            <Row label="仕様" value={p.specs} />
            <Row label="卸価格" value={p.priceJpy != null ? `${p.priceJpy.toLocaleString()}円` : null} />
            <Row label="最小ロット" value={p.minOrderQty != null ? `${p.minOrderQty.toLocaleString()}個` : null} />
            <Row label="納期" value={p.leadTimeDays != null ? `${p.leadTimeDays}日` : null} />
            <Row label="日本製" value={p.madeInJapan ? "はい" : "いいえ"} />
            <Row label="認証・規格" value={p.certifications} />
            <Row label="輸出の実績" value={p.exportExperience} />
            <Row label="希望市場" value={p.targetMarkets} />
            <Row label="画像URL" value={p.imageUrl} />
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>AI評価</h2>
        {latest ? (
          <>
            <div className="score">{latest.score}<span className="muted" style={{ fontSize: 16 }}> / 100</span></div>
            <p>{latest.summary}</p>
            <strong>強み</strong>
            <ul className="tight">{latest.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <p />
            <strong>懸念点・不足情報</strong>
            <ul className="tight">{latest.risks.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <p />
            <strong>相性の良さそうな市場</strong>
            <ul className="tight">{latest.suggestedMarkets.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <p className="muted" style={{ fontSize: 12 }}>
              {latest.createdAt.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })} ／ {latest.model}
              ／ AIの評価は参考情報です。最終判断は運営が行ってください。
            </p>
          </>
        ) : (
          <p className="muted">まだ評価していません。</p>
        )}
        <form action={runEvaluation}>
          <input type="hidden" name="id" value={p.id} />
          <button className="btn small" type="submit">{latest ? "もう一度AIで評価する" : "AIで評価する"}</button>
        </form>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>審査</h2>
        {p.status === "EXPORTED" ? (
          <p className="muted">HUB登録済みです。</p>
        ) : (
          <form action={updateReview}>
            <input type="hidden" name="id" value={p.id} />
            <label>状態</label>
            <select name="status" defaultValue={p.status}>
              <option value="SUBMITTED">審査待ち</option>
              <option value="APPROVED">採用</option>
              <option value="ON_HOLD">保留</option>
              <option value="REJECTED">見送り</option>
            </select>
            <label>会員へのコメント <span className="hint">（会員にも表示されます）</span></label>
            <textarea name="adminNote" maxLength={1000} defaultValue={p.adminNote ?? ""} />
            <div className="actions">
              <button className="btn gold" type="submit">保存する</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
