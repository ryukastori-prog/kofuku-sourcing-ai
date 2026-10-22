import Link from "next/link";
import { getUser } from "@/lib/auth";
import { TRIAL_DAYS, TRIAL_EVAL_LIMIT } from "@/lib/trial";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const user = await getUser();
  const { deleted } = await searchParams;
  return (
    <>
      {deleted && <div className="notice">退会が完了しました。登録した情報はすべて削除されました。</div>}
      <section className="hero">
        <h1>日本の商品を、海外のバイヤーへ。</h1>
        <p>
          酒類・食品・農林水産物をはじめ、日本のメーカー・販売会社の商品を登録すると、
          AIが輸出に向けた強みと不足情報を診断します。運営が審査し、海外バイヤー向けの
          取引の場「KOFUKUTRADE HUB」に掲載する候補として選びます。
        </p>
        <div className="actions" style={{ justifyContent: "center" }}>
          {user ? (
            <Link className="btn gold" href="/dashboard">商品一覧へ</Link>
          ) : (
            <>
              <Link className="btn gold" href="/register">無料で会員登録</Link>
              <Link className="btn ghost" href="/login">ログイン</Link>
            </>
          )}
        </div>
        <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>
          登録から{TRIAL_DAYS}日間は無料。AI診断は{TRIAL_EVAL_LIMIT}回まで使えます。
        </p>
      </section>

      <h2>ご利用の流れ</h2>
      <div className="row">
        <div className="card"><strong>1. 会員登録</strong><p className="muted">会社情報を登録してログインします。</p></div>
        <div className="card"><strong>2. 商品を登録</strong><p className="muted">特長・価格・ロット・納期・認証・輸出実績などを入力します。</p></div>
        <div className="card"><strong>3. AI診断・審査</strong><p className="muted">AIが不足情報を指摘します。運営が採用・保留を判断します。</p></div>
        <div className="card"><strong>4. 海外バイヤーへ</strong><p className="muted">採用された商品は、KOFUKUTRADE HUBに掲載する候補になります。</p></div>
      </div>

      <h2>こんな商品をお待ちしています</h2>
      <div className="cols3">
        <div className="card"><strong>酒類</strong><p className="muted">日本酒・焼酎・ウイスキー・ワインなど。製造・販売免許をお持ちの事業者さま。</p></div>
        <div className="card"><strong>食品・飲料</strong><p className="muted">加工食品・菓子・お茶・調味料など。賞味期限や衛生認証の情報があると評価されます。</p></div>
        <div className="card"><strong>農林水産物</strong><p className="muted">青果・米・水産物・畜産品など。産地や輸出の実績をお知らせください。</p></div>
      </div>
      <p className="muted">日用品・工芸品・雑貨などもご登録いただけます。</p>

      <h2>ご安心いただくために</h2>
      <div className="card">
        <ul className="tight">
          <li>登録の内容は、審査と海外バイヤーとのマッチングのためにのみ使います。</li>
          <li>退会はご自身で、いつでもできます。退会すると、登録した情報はすべて削除されます。</li>
          <li>AIの診断は参考情報です。採用・不採用の判断は、運営が行います。</li>
        </ul>
        <p className="muted" style={{ marginBottom: 0 }}>
          詳しくは<Link href="/guide">ご利用ガイド</Link>・<Link href="/privacy">プライバシーポリシー</Link>をご覧ください。
        </p>
      </div>
    </>
  );
}
