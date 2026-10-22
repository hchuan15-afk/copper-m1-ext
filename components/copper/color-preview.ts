import type { CSSProperties } from "react";
import type { ProductId } from "@/lib/copper/catalog";

// The catalog has one copper cutout per product, so other colors are a
// preview: brand-colored layers blended over the photo, shaped by the cutout.

type Layer = {
  color: string;
  blend: CSSProperties["mixBlendMode"];
  opacity: number;
};

// Copper finishes show the photo as is. Night Sky needs a hue layer plus a
// darkening layer; Desert Sand lightens. Values were tuned by eye.
export const TINTS: Record<string, Layer[]> = {
  "Polished Copper": [],
  "Brushed Copper": [],
  "Patina Teal": [{ color: "#4a8c82", blend: "color", opacity: 1 }],
  "Night Sky": [
    { color: "#1c2333", blend: "color", opacity: 1 },
    { color: "#1c2333", blend: "multiply", opacity: 0.55 },
  ],
  "Desert Sand": [{ color: "#efe3d0", blend: "screen", opacity: 0.8 }],
};

// Parts left untinted: Copper Home's display and its polished copper base
// ring (Product Bible §4.1), and Copper Notes' amber recording ring, which is
// a light rather than a finish, with the button inside it. Positions are
// fractions of the square cutout images.
const KEEP_COPPER: Record<ProductId, string[]> = {
  "copper-home": [
    "radial-gradient(ellipse 21% 11.8% at 49.4% 37.3%, transparent 98%, black 100%)",
    "linear-gradient(to bottom, black 73.5%, transparent 74.5%)",
  ],
  "copper-notes": [
    "radial-gradient(circle at 42.6% 52.3%, transparent 12%, black 12.5%)",
  ],
};

/** True when the color is shown as a tint rather than the real photo. */
export const isPreview = (color: string) => (TINTS[color] ?? []).length > 0;

/** Inline styles for each tint layer over a product's cutout. */
export function tintLayers(
  productId: ProductId,
  cutout: string,
  color: string,
): CSSProperties[] {
  const mask = [`url(${cutout})`, ...KEEP_COPPER[productId]].join(", ");
  return (TINTS[color] ?? []).map((layer) => ({
    backgroundColor: layer.color,
    mixBlendMode: layer.blend,
    opacity: layer.opacity,
    maskImage: mask,
    WebkitMaskImage: mask,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  }));
}
