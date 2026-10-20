# KOFUKU 仕入リサーチ

日本のメーカー・販売会社が会員登録して商品を登録し、運営が海外向けの商材として選別するためのWebアプリです。
採用した商品は、海外バイヤー向けの「KOFUKUTRADE HUB」に掲載する候補になります（HUBとの連携は今後）。

## 機能（MVP）

- 会員登録・ログイン（メール＋パスワード）
- 商品の登録・編集・削除（会員）
- 管理画面：商品一覧、AIによる評価、採用／保留／見送りの審査、会員へのコメント
- AI評価の基準を管理画面から編集（変更後の評価から反映）
- 採用商品のCSV書き出し（HUBへの取り込み用）

## 技術構成

Next.js 15 (App Router) / Prisma 6 + PostgreSQL（Neon）/ Anthropic API / Vercel

## 環境変数

`.env.example` を参照してください。Vercelの Environment Variables に設定します。

| 名前 | 内容 |
| --- | --- |
| `DATABASE_URL` | Neonの接続文字列（Connection pooling オフ） |
| `AUTH_SECRET` | ログイン用の署名キー（32文字以上のランダム文字列） |
| `ADMIN_EMAILS` | 管理者にするメールアドレス（カンマ区切り） |
| `ANTHROPIC_API_KEY` | AI評価用のAPIキー（未設定ならAI評価だけ使えない） |
| `AI_MODEL` | 任意。モデル名（省略時 `claude-sonnet-5-5`） |

## デプロイ

Vercelのビルドコマンドは `npm run build`（`prisma generate && prisma migrate deploy && next build`）です。
データベースの表は、デプロイ時に自動で作られます。

## 管理者になるには

`ADMIN_EMAILS` に入れたメールアドレスで会員登録（またはログイン）すると、管理者になります。

## 今後

- KOFUKUTRADE HUBとの連携（CSV → API）
- 評価基準のバージョン管理、会員への通知メール
