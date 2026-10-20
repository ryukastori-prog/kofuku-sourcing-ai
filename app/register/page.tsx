import { register } from "../actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="card" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h1>会員登録</h1>
      {error && <div className="error">{error}</div>}
      <form action={register}>
        <label>会社名</label>
        <input type="text" name="companyName" required maxLength={100} />
        <label>ご担当者名</label>
        <input type="text" name="contactName" required maxLength={100} />
        <label>メールアドレス</label>
        <input type="email" name="email" required autoComplete="email" />
        <label>パスワード <span className="hint">（10文字以上）</span></label>
        <input type="password" name="password" required minLength={10} autoComplete="new-password" />
        <label>電話番号 <span className="hint">（任意）</span></label>
        <input type="text" name="phone" maxLength={40} />
        <label>Webサイト <span className="hint">（任意）</span></label>
        <input type="url" name="website" maxLength={200} placeholder="https://" />
        <div className="actions">
          <button className="btn gold" type="submit">登録する</button>
        </div>
      </form>
    </div>
  );
}
