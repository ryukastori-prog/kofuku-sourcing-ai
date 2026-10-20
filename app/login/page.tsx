import Link from "next/link";
import { login } from "../actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h1>ログイン</h1>
      {error && <div className="error">{error}</div>}
      <form action={login}>
        <label>メールアドレス</label>
        <input type="email" name="email" required autoComplete="email" />
        <label>パスワード</label>
        <input type="password" name="password" required autoComplete="current-password" />
        <div className="actions">
          <button className="btn" type="submit">ログイン</button>
          <Link href="/register">会員登録はこちら</Link>
        </div>
      </form>
    </div>
  );
}
