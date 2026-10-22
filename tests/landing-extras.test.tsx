// copper-m1-ext additions to the landing page: price switch, comparison table,
// quiz, FAQ, phone menu and back-to-top. Module 1's own criteria live in specs/.
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Compare } from "@/components/copper/compare";
import { Faq } from "@/components/copper/faq";
import { PlusPriceToggle } from "@/components/copper/plus-price-toggle";
import { Quiz, recommend } from "@/components/copper/quiz";
import { SiteHeader } from "@/components/copper/site-header";
import Home from "@/app/page";
import { formatUsd, getPlans, getProducts } from "@/lib/copper/catalog";

vi.mock("next-themes", () => ({ useTheme: () => ({ setTheme: vi.fn() }) }));

afterEach(() => {
  vi.doUnmock("@/lib/copper/catalog");
});

const plus = getPlans().find((p) => p.id === "copper-plus")!;

describe("Copper Plus Monthly/Yearly switch", () => {
  it("starts on Monthly with the catalog prices", () => {
    render(
      <PlusPriceToggle
        monthlyUsd={plus.monthlyUsd}
        annualUsd={plus.annualUsd}
      />,
    );
    expect(screen.getByRole("tab", { name: "Monthly" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(document.body).toHaveTextContent(formatUsd(plus.monthlyUsd));
    expect(document.body).toHaveTextContent(
      `or ${formatUsd(plus.annualUsd)}/year`,
    );
  });

  it("Yearly shows the annual price per month and the savings", () => {
    render(<PlusPriceToggle monthlyUsd={7.99} annualUsd={79} />);
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Yearly" }));
    expect(document.body).toHaveTextContent("$6.58/month");
    expect(document.body).toHaveTextContent("Billed $79 yearly");
    expect(document.body).toHaveTextContent("Save $16.88 a year");
  });

  it("follows other prices", () => {
    render(<PlusPriceToggle monthlyUsd={9.49} annualUsd={95} />);
    fireEvent.mouseDown(screen.getByRole("tab", { name: "Yearly" }));
    expect(document.body).toHaveTextContent("$7.92/month");
    expect(document.body).toHaveTextContent("Save $18.88 a year");
  });
});

describe("Comparison table", () => {
  it("lists both products with catalog prices and warranties", () => {
    render(<Compare />);
    const table = screen.getByRole("table");
    for (const product of getProducts()) {
      expect(
        within(table).getByRole("columnheader", { name: product.name }),
      ).toBeInTheDocument();
      expect(table).toHaveTextContent(formatUsd(product.priceUsd));
    }
    expect(table).toHaveTextContent("2 years");
    expect(table).toHaveTextContent("1 year");
  });
});

describe("Which Copper quiz", () => {
  const products = getProducts().map((p) => ({
    id: p.id,
    name: p.name,
    price: formatUsd(p.priceUsd),
  }));
  const answer = (label: string) =>
    fireEvent.click(screen.getByRole("button", { name: label }));

  it("recommends from the answers", () => {
    const pick = (home: number, notes: number) => ({ label: "", home, notes });
    expect(recommend([pick(2, 0), pick(1, 0), pick(0, 0)])).toEqual([
      "copper-home",
    ]);
    expect(recommend([pick(0, 2), pick(0, 0), pick(0, 1)])).toEqual([
      "copper-notes",
    ]);
    expect(recommend([pick(2, 2), pick(0, 0), pick(0, 0)])).toEqual([
      "copper-home",
      "copper-notes",
    ]);
  });

  it("walks through three questions and links to the match", () => {
    render(<Quiz products={products} />);
    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
    answer("In meetings and class");
    answer("Not really");
    answer("All the time");
    const link = screen.getByRole("link", { name: /\$129/ });
    expect(link).toHaveAttribute("href", "#copper-notes");
    fireEvent.click(screen.getByRole("button", { name: "Start over" }));
    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
  });

  it("Back returns to the previous question", () => {
    render(<Quiz products={products} />);
    answer("At home");
    expect(screen.getByText("Question 2 of 3")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText("Question 1 of 3")).toBeInTheDocument();
  });
});

describe("FAQ", () => {
  it("opens an answer when its question is clicked", () => {
    render(<Faq />);
    const question = screen.getByRole("button", { name: /warranty/i });
    expect(question).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/2-year warranty/)).toBeVisible();
  });

  it("types no prices and never says Copper never records", () => {
    const { container } = render(<Faq />);
    // Open every answer so all text is rendered.
    for (const button of screen.getAllByRole("button")) fireEvent.click(button);
    expect(container.textContent).not.toMatch(/\$\d/);
    expect(container.textContent).not.toMatch(/never\s+record/i);
  });
});

describe("Header", () => {
  it("has section links for wide screens and a menu button for phones", () => {
    render(<SiteHeader />);
    const header = screen.getByRole("banner");
    const hrefs = [...header.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(
      expect.arrayContaining(["#products", "#plus", "#privacy", "#faq"]),
    );
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = screen.getByRole("navigation", { name: "Menu" });
    expect(within(menu).getByRole("link", { name: "Compare" })).toHaveAttribute(
      "href",
      "#compare",
    );
  });
});

describe("Landing page with extras", () => {
  it("places the new sections between the required ones", () => {
    const { container } = render(<Home />);
    const order = [
      "hero",
      "products",
      "compare",
      "quiz",
      "showcase",
      "plus-pricing",
      "privacy-summary",
      "faq",
    ].map((id) => container.querySelector(`[data-testid="${id}"]`));
    expect(order.every(Boolean)).toBe(true);
    for (let i = 1; i < order.length; i++) {
      expect(
        order[i - 1]!.compareDocumentPosition(order[i]!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
    // At the top of the page the button exists but is hidden and inert.
    const backToTop = container.querySelector<HTMLElement>(
      'button[aria-label="Back to top"]',
    );
    expect(backToTop).toHaveAttribute("inert");
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    expect(backToTop).not.toHaveAttribute("inert");
  });
});
