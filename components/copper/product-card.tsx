"use client";

import Image from "next/image";
import { useState } from "react";
import { isPreview, tintLayers } from "@/components/copper/color-preview";
import { cutoutAlt } from "@/components/copper/product-alt";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatUsd, type Product } from "@/lib/copper/catalog";
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

/** A product card whose color swatches recolor the cutout as a preview. */
export function ProductCard({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]);
  const preview = isPreview(color);

  return (
    <Card
      data-testid="product-card"
      id={product.id}
      data-product={product.id}
      className="scroll-mt-20 gap-6 pt-0"
    >
      <div className="bg-secondary relative flex justify-center px-10 py-8">
        <div className="relative isolate w-full max-w-64 drop-shadow-xl">
          <Image
            src={product.cutout}
            alt={
              preview
                ? `${cutoutAlt(product)}, shown in ${color} (color preview)`
                : cutoutAlt(product)
            }
            width={CUTOUT_SIZE}
            height={CUTOUT_SIZE}
            sizes="(min-width: 768px) 30vw, 70vw"
            className="h-auto w-full"
          />
          {tintLayers(product.id, product.cutout, color).map((style, i) => (
            <div
              key={`${color}-${i}`}
              aria-hidden
              data-tint={color}
              style={style}
              className="animate-in fade-in pointer-events-none absolute inset-0 duration-300"
            />
          ))}
        </div>
        {preview && (
          <p className="bg-background/85 text-muted-foreground absolute right-3 bottom-3 rounded-full px-2.5 py-0.5 text-xs font-semibold">
            Color preview
          </p>
        )}
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
          className="mt-auto flex flex-wrap gap-x-2 gap-y-1 border-t pt-3"
        >
          {product.colors.map((option) => {
            const selected = option === color;
            return (
              <li key={option}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setColor(option)}
                  className={cn(
                    "focus-visible:ring-ring/50 flex items-center gap-2 rounded-full px-2 py-1 text-sm transition-colors outline-none focus-visible:ring-[3px]",
                    selected
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "ring-offset-card size-5 rounded-full transition-shadow",
                      selected
                        ? "ring-primary ring-2 ring-offset-2"
                        : "ring-foreground/30 ring-1",
                      SWATCHES[option],
                    )}
                  />
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
