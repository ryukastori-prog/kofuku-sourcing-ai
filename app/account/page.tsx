import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getTrialInfo } from "@/lib/trial";
import { deleteAccount } from "./actions";

export default async function Account({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { error } = await searchParams;
  const trial = await getTrialInfo(user);
  const count = await db.product.count({ where: { companyId: user.id } });
  return (
    <>
      <div className="card">
        <h1>アカウント</h1>
        <table>
          <tbody>
            <tr><th>会社名</th><td>{user.companyName}</td></tr>
            <tr><th>担当者</th><td>{user.contactName}</td></tr>
            <tr><th>メールアドレス</th><td>{user.email}</td></tr>
            <tr><th>登録商品</th><td>{count}件</td></tr>
            {!trial.unlimited && (
              <tr>
                <th>無料期間</th>
                <td>
                  {trial.endsAt.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}まで
                  （AI診断の残り {trial.remaining}回）
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>退会（データの削除）</h2>
        {user.role === "ADMIN" ? (
          <p className="muted">運営アカウントは、ここから退会できません。</p>
        ) : (
          <>
            <p className="muted">
              退会すると、会社情報・登録した商品（{count}件）・AI診断の結果がすべて削除されます。
              この操作は元に戻せません。
            </p>
            {error && <div className="error">{error}</div>}
            <form action={deleteAccount}>
              <label>確認のため、パスワードを入力してください</label>
              <input type="password" name="password" required autoComplete="current-password" />
              <label className="check">
                <input type="checkbox" name="confirm" value="yes" required />
                すべてのデータが削除されることを理解しました
              </label>
              <div className="actions">
                <button className="btn danger" type="submit">退会してデータを削除する</button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
