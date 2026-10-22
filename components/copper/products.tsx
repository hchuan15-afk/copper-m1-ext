import Image from "next/image";
import { cutoutAlt } from "@/components/copper/product-alt";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatUsd, getProducts } from "@/lib/copper/catalog";
import { cn } from "@/lib/utils";

const CUTOUT_SIZE = 1254;

// Catalog color names → brand swatches. Desert Sand and Night Sky use the
// brand hex because the theme's secondary and foreground flip in dark mode.
const SWATCHES: Record<string, string> = {
  "Polished Copper": "bg-primary",
  "Brushed Copper": "bg-primary",
  "Patina Teal": "bg-accent",
  "Desert Sand": "bg-[#efe3d0]",
  "Night Sky": "bg-[#1c2333]",
};

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
            <Card
              key={product.id}
              data-testid="product-card"
              id={product.id}
              data-product={product.id}
              className="scroll-mt-20 gap-6 pt-0"
            >
              <div className="bg-secondary flex justify-center px-10 py-8">
                <Image
                  src={product.cutout}
                  alt={cutoutAlt(product)}
                  width={CUTOUT_SIZE}
                  height={CUTOUT_SIZE}
                  sizes="(min-width: 768px) 30vw, 70vw"
                  className="h-auto w-full max-w-64 drop-shadow-xl"
                />
              </div>

              <CardHeader className="grid-cols-[1fr_auto] items-end gap-x-4">
                <div>
                  <CardTitle className="font-heading text-2xl font-extrabold">
                    <h3>{product.name}</h3>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {product.type}
                  </CardDescription>
                </div>
                <p className="text-primary font-heading text-3xl font-extrabold">
                  {formatUsd(product.priceUsd)}
                </p>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-6">
                <ul className="flex flex-col gap-3 text-base">
                  {product.features.map((feature) => (
                    <li key={feature.name}>
                      <span className="font-semibold">{feature.name}.</span>{" "}
                      <span className="text-muted-foreground">
                        {feature.description}
                      </span>
                    </li>
                  ))}
                </ul>

                <ul
                  aria-label={`${product.name} colors`}
                  className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t pt-4"
                >
                  {product.colors.map((color) => (
                    <li
                      key={color}
                      className="text-muted-foreground flex items-center gap-2 text-sm"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "ring-foreground/30 size-4 rounded-full ring-1",
                          SWATCHES[color],
                        )}
                      />
                      {color}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
