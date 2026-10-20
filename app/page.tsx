import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function Home() {
  const user = await getUser();
  return (
    <>
      <section className="hero">
        <h1>日本の商品を、海外のバイヤーへ。</h1>
        <p>
          メーカー・販売会社の皆さまが商品を登録すると、海外販売に向いた商材かどうかを
          審査し、海外バイヤー向けの取引の場（KOFUKUTRADE HUB）に掲載する候補として選別します。
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
      </section>
      <div className="row">
        <div className="card"><strong>1. 会員登録</strong><p className="muted">会社情報を登録してログインします。</p></div>
        <div className="card"><strong>2. 商品を登録</strong><p className="muted">商品の特長・価格・ロット・納期などを入力します。</p></div>
        <div className="card"><strong>3. 審査・選別</strong><p className="muted">AIの評価をもとに、運営が採用・保留を判断します。</p></div>
        <div className="card"><strong>4. 海外バイヤーへ</strong><p className="muted">採用された商品は、KOFUKUTRADE HUBに掲載する候補になります。</p></div>
      </div>
    </>
  );
}
