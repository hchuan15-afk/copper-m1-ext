import { ProductCard } from "@/components/copper/product-card";
import { getProducts } from "@/lib/copper/catalog";

export function Products() {
  const products = getProducts();

  return (
    <section
      id="products"
      data-testid="products"
      className="bg-background scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Two devices, one Copper.
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            One runs your home, one rides along to meetings and lectures. Pick
            the Copper that fits your day, or bring home both.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
