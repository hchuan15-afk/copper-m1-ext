import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUsd, getProducts, type ProductId } from "@/lib/copper/catalog";

// Facts the catalog doesn't hold, from Product Bible §3 (2026 policy).
const DETAILS: Record<
  ProductId,
  { bestFor: string; battery: string; warranty: string }
> = {
  "copper-home": {
    bestFor: "Households, families, retirees and snowbirds",
    battery: "Plug-in (no battery)",
    warranty: "2 years",
  },
  "copper-notes": {
    bestFor: "Students, professionals and anyone in lots of meetings",
    battery: "12 hours of recording, 7 days standby",
    warranty: "1 year",
  },
};

export function Compare() {
  const products = getProducts();
  const rows: { label: string; cells: React.ReactNode[] }[] = [
    { label: "What it is", cells: products.map((p) => p.type) },
    {
      label: "Price",
      cells: products.map((p) => (
        <span key={p.id} className="text-primary font-bold">
          {formatUsd(p.priceUsd)}
        </span>
      )),
    },
    {
      label: "Best for",
      cells: products.map((p) => DETAILS[p.id].bestFor),
    },
    {
      label: "Features",
      cells: products.map((p) => p.features.map((f) => f.name).join(", ")),
    },
    { label: "Colors", cells: products.map((p) => p.colors.join(", ")) },
    { label: "Battery", cells: products.map((p) => DETAILS[p.id].battery) },
    { label: "Warranty", cells: products.map((p) => DETAILS[p.id].warranty) },
  ];

  return (
    <section
      id="compare"
      data-testid="compare"
      className="bg-secondary text-secondary-foreground scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="mb-8 max-w-2xl text-3xl font-extrabold sm:text-4xl">
          Side by side.
        </h2>

        <div className="bg-card text-card-foreground rounded-xl ring-1 ring-foreground/10">
          <Table className="min-w-xl text-base">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">
                  <span className="sr-only">Detail</span>
                </TableHead>
                {products.map((p) => (
                  <TableHead
                    key={p.id}
                    scope="col"
                    className="font-heading text-lg font-extrabold"
                  >
                    {p.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ label, cells }) => (
                <TableRow key={label}>
                  <TableHead
                    scope="row"
                    className="text-muted-foreground font-semibold"
                  >
                    {label}
                  </TableHead>
                  {cells.map((cell, i) => (
                    <TableCell
                      key={products[i].id}
                      className="whitespace-normal"
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
