import { Quiz } from "@/components/copper/quiz";
import { formatUsd, getProducts } from "@/lib/copper/catalog";

export function QuizSection() {
  const products = getProducts().map((p) => ({
    id: p.id,
    name: p.name,
    price: formatUsd(p.priceUsd),
  }));

  return (
    <section id="quiz" data-testid="quiz" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Which Copper is for you?
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Three quick questions. Nothing you pick leaves this page.
          </p>
        </div>
        <Quiz products={products} />
      </div>
    </section>
  );
}
