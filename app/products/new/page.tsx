import { requireUser } from "@/lib/auth";
import ProductForm from "@/components/ProductForm";

export default async function NewProduct({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;
  return (
    <div className="card">
      <h1>商品を登録する</h1>
      <ProductForm error={error} />
    </div>
  );
}
