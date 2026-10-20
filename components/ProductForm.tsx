import type { Product } from "@prisma/client";
import { CATEGORIES } from "@/lib/constants";
import { saveProduct } from "@/app/products/actions";

export default function ProductForm({ product, error }: { product?: Product; error?: string }) {
  return (
    <form action={saveProduct}>
      {error && <div className="error">{error}</div>}
      {product && <input type="hidden" name="id" value={product.id} />}

      <label>商品名</label>
      <input type="text" name="name" required maxLength={120} defaultValue={product?.name} />

      <label>英語名 <span className="hint">（任意）</span></label>
      <input type="text" name="nameEn" maxLength={120} defaultValue={product?.nameEn ?? ""} />

      <label>カテゴリ</label>
      <select name="category" defaultValue={product?.category ?? CATEGORIES[0]}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label>商品説明 <span className="hint">（特長・強み・使い方など）</span></label>
      <textarea name="description" required maxLength={4000} defaultValue={product?.description} />

      <label>仕様・サイズ・内容量 <span className="hint">（任意）</span></label>
      <textarea name="specs" maxLength={2000} defaultValue={product?.specs ?? ""} />

      <div className="row">
        <div>
          <label>卸価格（円） <span className="hint">（任意）</span></label>
          <input type="number" name="priceJpy" min={0} max={100000000} defaultValue={product?.priceJpy ?? ""} />
        </div>
        <div>
          <label>最小ロット（個） <span className="hint">（任意）</span></label>
          <input type="number" name="minOrderQty" min={0} max={100000000} defaultValue={product?.minOrderQty ?? ""} />
        </div>
      </div>
      <div className="row">
        <div>
          <label>納期（日） <span className="hint">（任意）</span></label>
          <input type="number" name="leadTimeDays" min={0} max={1000} defaultValue={product?.leadTimeDays ?? ""} />
        </div>
        <div>
          <label>画像URL <span className="hint">（任意）</span></label>
          <input type="url" name="imageUrl" maxLength={500} placeholder="https://" defaultValue={product?.imageUrl ?? ""} />
        </div>
      </div>

      <label className="check">
        <input type="checkbox" name="madeInJapan" defaultChecked={product?.madeInJapan ?? true} />
        日本製
      </label>

      <label>認証・規格 <span className="hint">（任意。例: JAS、有機、ISO、PSE など）</span></label>
      <input type="text" name="certifications" maxLength={300} defaultValue={product?.certifications ?? ""} />

      <label>輸出の実績・対応可否 <span className="hint">（任意）</span></label>
      <textarea name="exportExperience" maxLength={2000} defaultValue={product?.exportExperience ?? ""} />

      <label>販売したい国・地域 <span className="hint">（任意）</span></label>
      <input type="text" name="targetMarkets" maxLength={300} defaultValue={product?.targetMarkets ?? ""} />

      <div className="actions">
        <button className="btn gold" type="submit">{product ? "更新する" : "登録する"}</button>
      </div>
    </form>
  );
}
