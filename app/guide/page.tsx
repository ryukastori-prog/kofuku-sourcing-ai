import Link from "next/link";
import { TRIAL_DAYS, TRIAL_EVAL_LIMIT } from "@/lib/trial";

export const metadata = { title: "ご利用ガイド | KOFUKU 仕入リサーチ" };

export default function Guide() {
  return (
    <div className="card doc">
      <h1>ご利用ガイド</h1>
      <p>
        KOFUKU 仕入リサーチは、日本の商品を海外へ販売したいメーカー・販売会社さまが商品を登録し、
        海外バイヤー向けの取引の場「KOFUKUTRADE HUB」に掲載する候補として選ばれるためのサービスです。
      </p>

      <h2>登録から掲載までの流れ</h2>
      <ol className="steps">
        <li><strong>会員登録</strong><br />会社名・担当者名・メールアドレス・パスワードを入力します。電話番号とWebサイトは任意です。</li>
        <li><strong>商品を登録</strong><br />商品名、カテゴリ、説明、価格、最小ロット、納期などを入力します。入力項目が多いほど、評価が正確になります。</li>
        <li><strong>AI診断</strong><br />商品ページの「AIで診断する」を押すと、点数（100点満点）、強み、不足している情報、相性の良い市場が表示されます。足りない情報を追記して、もう一度診断することもできます。</li>
        <li><strong>運営の審査</strong><br />運営が内容を確認し、「採用」「保留」「見送り」を決めます。コメントが付く場合は、商品ページに表示されます。</li>
        <li><strong>KOFUKUTRADE HUBへ</strong><br />採用された商品は、HUBに掲載する候補となります。掲載の際は、あらためて運営からご連絡します。</li>
      </ol>

      <h2>評価されやすい登録のコツ</h2>
      <ul>
        <li>賞味期限、内容量、サイズ・重量、保存方法（常温・冷蔵・冷凍）を書く</li>
        <li>認証・規格（有機JAS、HACCP、ISOなど）があれば入力する</li>
        <li>輸出の実績（国・数量・取引先の種類）があれば具体的に書く</li>
        <li>最小ロットと納期を、現実的な数字で入力する</li>
        <li>酒類は免許の種類、農林水産物は産地と、輸出に必要な証明の有無を書く</li>
      </ul>

      <h2>無料期間とAI診断の回数</h2>
      <ul>
        <li>登録から{TRIAL_DAYS}日間は無料でご利用いただけます。</li>
        <li>AI診断は、無料期間中、合計{TRIAL_EVAL_LIMIT}回まで使えます。診断に失敗した場合は、回数に数えません。</li>
        <li>無料期間が終わった後の内容は、運営からご案内します。商品の登録内容は、期間後も残ります。</li>
      </ul>

      <h2>退会について</h2>
      <p>
        <Link href="/account">アカウント</Link>ページから、ご自身でいつでも退会できます。
        退会すると、登録した会社情報・商品・AI診断の結果がすべて削除され、元に戻せません。
      </p>

      <h2>よくある質問</h2>
      <p><strong>AIの点数が低いと、掲載されませんか？</strong><br />
        点数は審査の参考情報です。最終的な判断は運営が行います。不足情報を追記すれば、点数は上がります。</p>
      <p><strong>登録した情報は誰に見られますか？</strong><br />
        運営が審査のために確認します。海外バイヤーに公開する場合は、事前にご連絡します。</p>
      <p><strong>HUBに載ったら費用はかかりますか？</strong><br />
        料金の内容は、決まり次第ご案内します。</p>

      <div className="actions">
        <Link className="btn gold" href="/register">無料で会員登録</Link>
      </div>
    </div>
  );
}
