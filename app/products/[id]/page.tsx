import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL } from "@/lib/constants";
import ProductForm from "@/components/ProductForm";
import { deleteProduct } from "../actions";

export default async function EditProduct({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { error } = await searchParams;
  const product = await db.product.findFirst({ where: { id, companyId: user.id } });
  if (!product) notFound();
  const locked = product.status === "EXPORTED";
  return (
    <>
      <div className="card">
        <h1>{product.name}</h1>
        <p>
          状態: <span className={`badge ${product.status}`}>{STATUS_LABEL[product.status]}</span>
        </p>
        {product.adminNote && (
          <p className="muted">運営からのコメント: {product.adminNote}</p>
        )}
        {!locked && (
          <p className="muted">内容を更新すると、あらためて審査待ちになります。</p>
        )}
      </div>
      {locked ? (
        <div className="card muted">HUB登録済みの商品は、ここから編集できません。変更したい場合は運営へご連絡ください。</div>
      ) : (
        <>
          <div className="card">
            <ProductForm product={product} error={error} />
          </div>
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <button className="btn danger small" type="submit">この商品を削除する</button>
          </form>
        </>
      )}
    </>
  );
}
