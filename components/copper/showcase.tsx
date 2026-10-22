import Image from "next/image";
import { getProducts } from "@/lib/copper/catalog";
import { cn } from "@/lib/utils";

// What each lifestyle photo shows, keyed by its catalog path. The photos
// themselves come from each product's `lifestyle` list.
const PHOTOS: Record<
  string,
  { alt: string; caption: string; width: number; height: number }
> = {
  "/assets/lifestyle/copper-home-desert-light.png": {
    alt: "Copper Home smart speaker on a stone kitchen counter at sunset, with saguaros and mountains through the window",
    caption:
      "Copper Home keeps an eye on the Arizona weather from the kitchen counter.",
    width: 1672,
    height: 941,
  },
  "/assets/lifestyle/copper-notes-golden-hour.png": {
    alt: "Copper Notes clipped to a shirt pocket, amber ring lit, while its wearer writes in a notebook at a café table",
    caption:
      "Clip on Copper Notes and turn a coffee-shop meeting into a summary and a to-do list.",
    width: 1536,
    height: 1024,
  },
  "/assets/lifestyle/copper-notes-stone-desk.png": {
    alt: "Copper Notes standing on a stone counter beside its round copper charging puck, amber ring glowing",
    caption:
      "The amber ring lights up whenever Copper Notes is recording, so everyone knows.",
    width: 1672,
    height: 941,
  },
};

export function Showcase() {
  const rows = getProducts().flatMap((product) =>
    product.lifestyle.map((src) => ({
      src,
      name: product.name,
      photo: PHOTOS[src] ?? {
        alt: `${product.name} in an Arizona setting`,
        caption: `${product.name}, the ${product.type} from Copper State Labs.`,
        width: 1600,
        height: 1000,
      },
    })),
  );

  return (
    <section
      id="showcase"
      data-testid="showcase"
      className="bg-secondary text-secondary-foreground scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="mb-12 max-w-2xl text-3xl font-extrabold sm:text-4xl">
          Made for Arizona life.
        </h2>

        <div className="flex flex-col gap-12 md:gap-20">
          {rows.map(({ src, name, photo }, i) => (
            <figure
              key={src}
              className="grid items-center gap-6 md:grid-cols-5 md:gap-12"
            >
              <Image
                src={src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 768px) 60vw, 100vw"
                className={cn(
                  "h-auto w-full rounded-2xl shadow-xl md:col-span-3",
                  i % 2 === 1 && "md:order-2",
                )}
              />
              <figcaption className="md:col-span-2">
                <h3 className="text-primary text-sm font-bold tracking-widest uppercase">
                  {name}
                </h3>
                <p className="font-heading mt-2 text-2xl leading-snug font-semibold">
                  {photo.caption}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
