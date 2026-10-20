export const CATEGORIES = [
  "食品・飲料",
  "日用品・生活雑貨",
  "化粧品・美容",
  "工芸・伝統品",
  "家電・ガジェット",
  "工業製品・部品",
  "衣料・ファッション",
  "その他",
] as const;

export const STATUS_LABEL: Record<string, string> = {
  SUBMITTED: "審査待ち",
  APPROVED: "採用",
  ON_HOLD: "保留",
  REJECTED: "見送り",
  EXPORTED: "HUB登録済み",
};

export const DEFAULT_CRITERIA = `海外バイヤー向けの輸出商材として、次の観点で評価してください。
1. 海外需要・市場性（日本製ならではの強み、競合との差別化）
2. 輸出のしやすさ（法規制・認証・賞味期限・サイズ・輸送リスク）
3. 取引条件の妥当性（価格・最小ロット・納期）
4. 供給元の輸出対応力（輸出経験・認証・体制）
5. 情報の充足度（商品情報が十分で、バイヤーに説明できるか）`;
