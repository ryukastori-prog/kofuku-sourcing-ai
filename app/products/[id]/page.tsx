import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL } from "@/lib/constants";
import ProductForm from "@/components/ProductForm";
import { deleteProduct, selfEvaluate } from "../actions";
import { getTrialInfo } from "@/lib/trial";

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { error, done } = await searchParams;
  const product = await db.product.findFirst({ where: { id, companyId: user.id } });
  if (!product) notFound();
  const locked = product.status === "EXPORTED";
  const trial = await getTrialInfo(user);
  const latest = await db.evaluation.findFirst({
    where: { productId: product.id, byMember: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <div className="card">
        <h1>{product.name}</h1>
        <p>
          状態: <span className={`badge ${product.status}`}>{STATUS_LABEL[product.status]}</span>
        </p>
        {product.adminNote && (
          <p className="muted">運営からのコメント: {product.adminNote}</p>
        )}
        {!locked && (
          <p className="muted">内容を更新すると、あらためて審査待ちになります。</p>
        )}
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>AI診断</h2>
        <p className="muted">
          商品情報をAIが診断し、輸出に向けた強みと不足情報をお知らせします（参考情報です）。
          {trial.unlimited
            ? " 運営アカウントは回数の制限はありません。"
            : ` 無料期間は${trial.endsAt.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}まで、残り${trial.remaining}回です。`}
        </p>
        {done && <div className="notice">診断しました。</div>}
        {error && <div className="error">{error}</div>}
        {latest ? (
          <>
            <div className="score">{latest.score}<span className="muted" style={{ fontSize: 16 }}> / 100</span></div>
            <p>{latest.summary}</p>
            <strong>強み</strong>
            <ul className="tight">{latest.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <p />
            <strong>不足している情報・懸念点</strong>
            <ul className="tight">{latest.risks.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <p />
            <strong>相性の良さそうな市場</strong>
            <ul className="tight">{latest.suggestedMarkets.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <p className="muted" style={{ fontSize: 12 }}>
              {latest.createdAt.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })} に診断。
              情報を追加してから診断し直すと、結果が良くなることがあります。
            </p>
          </>
        ) : (
          <p className="muted">まだ診断していません。</p>
        )}
        {!locked && (
          trial.canEvaluate ? (
            <form action={selfEvaluate}>
              <input type="hidden" name="id" value={product.id} />
              <button className="btn small" type="submit">{latest ? "もう一度AIで診断する" : "AIで診断する"}</button>
            </form>
          ) : (
            <p className="muted">{trial.reason}</p>
          )
        )}
      </div>
      {locked ? (
        <div className="card muted">HUB登録済みの商品は、ここから編集できません。変更したい場合は運営へご連絡ください。</div>
      ) : (
        <>
          <div className="card">
            <ProductForm product={product} error={error} />
          </div>
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <button className="btn danger small" type="submit">この商品を削除する</button>
          </form>
        </>
      )}
    </>
  );
}
