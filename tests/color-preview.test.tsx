// copper-m1-ext: product card swatches recolor the cutout as a labeled preview.
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  isPreview,
  tintLayers,
  TINTS,
} from "@/components/copper/color-preview";
import { ProductCard } from "@/components/copper/product-card";
import { cutoutAlt } from "@/components/copper/product-alt";
import { getProducts } from "@/lib/copper/catalog";

const home = getProducts().find((p) => p.id === "copper-home")!;
const notes = getProducts().find((p) => p.id === "copper-notes")!;

describe("Color tints", () => {
  it("has a tint, or the real photo, for every catalog color", () => {
    for (const product of getProducts())
      for (const color of product.colors) expect(TINTS).toHaveProperty([color]);
  });

  it("shows copper finishes as the real photo", () => {
    expect(isPreview("Polished Copper")).toBe(false);
    expect(isPreview("Brushed Copper")).toBe(false);
    expect(tintLayers("copper-home", home.cutout, "Polished Copper")).toEqual(
      [],
    );
  });

  it("shapes each tint by the cutout and keeps copper parts uncolored", () => {
    const [layer] = tintLayers("copper-home", home.cutout, "Patina Teal");
    expect(layer.maskImage).toContain(`url(${home.cutout})`);
    // The display and base ring are cut out of the tint.
    expect(layer.maskImage).toMatch(/radial-gradient.*linear-gradient/);
    expect(layer.maskComposite).toBe("intersect");
  });
});

describe("Product card colors", () => {
  it("starts on the first catalog color with the real photo", () => {
    render(<ProductCard product={home} />);
    expect(
      screen.getByRole("button", { name: home.colors[0] }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("img")).toHaveAttribute("alt", cutoutAlt(home));
    expect(screen.queryByText("Color preview")).not.toBeInTheDocument();
  });

  it("recolors the photo as a labeled preview when a swatch is clicked", () => {
    const { container } = render(<ProductCard product={notes} />);
    fireEvent.click(screen.getByRole("button", { name: "Night Sky" }));

    expect(screen.getByRole("button", { name: "Night Sky" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("button", { name: notes.colors[0] }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      `${cutoutAlt(notes)}, shown in Night Sky (color preview)`,
    );
    expect(screen.getByText("Color preview")).toBeInTheDocument();
    expect(container.querySelectorAll('[data-tint="Night Sky"]')).toHaveLength(
      TINTS["Night Sky"].length,
    );
  });

  it("goes back to the real photo for the copper finish", () => {
    const { container } = render(<ProductCard product={notes} />);
    const colors = screen.getByRole("list", { name: `${notes.name} colors` });
    fireEvent.click(
      within(colors).getByRole("button", { name: "Desert Sand" }),
    );
    fireEvent.click(
      within(colors).getByRole("button", { name: notes.colors[0] }),
    );
    expect(screen.getByRole("img")).toHaveAttribute("alt", cutoutAlt(notes));
    expect(container.querySelector("[data-tint]")).toBeNull();
    expect(screen.queryByText("Color preview")).not.toBeInTheDocument();
  });

  it("keeps the same cutout file for every color", () => {
    render(<ProductCard product={home} />);
    for (const color of home.colors) {
      fireEvent.click(screen.getByRole("button", { name: color }));
      expect(screen.getByRole("img").getAttribute("src")).toContain(
        encodeURIComponent(home.cutout),
      );
    }
  });
});
