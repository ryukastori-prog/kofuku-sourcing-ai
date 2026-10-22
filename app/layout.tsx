import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getUser } from "@/lib/auth";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "KOFUKU 仕入リサーチ",
  description: "日本のメーカー・販売会社が商品を登録し、海外向けの商材として選別するためのサービス",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html lang="ja">
      <body>
        <header className="header">
          <div className="header-inner">
            <Link href="/" className="brand">
              KOFUKU <span>仕入リサーチ</span>
            </Link>
            <nav className="nav">
              {user ? (
                <>
                  <span>{user.companyName}</span>
                  <Link href="/dashboard">商品一覧</Link>
                  <Link href="/account">アカウント</Link>
                  {user.role === "ADMIN" && <Link href="/admin">管理画面</Link>}
                  <form action={logout}>
                    <button type="submit">ログアウト</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login">ログイン</Link>
                  <Link href="/register">会員登録</Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <Link href="/guide">ご利用ガイド</Link>
          <Link href="/terms">利用規約</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
          <a href="https://kofukutrading.com/contact-us/" target="_blank" rel="noopener noreferrer">お問い合わせ</a>
          <span>© 宏福商事合同会社</span>
        </footer>
      </body>
    </html>
  );
}
