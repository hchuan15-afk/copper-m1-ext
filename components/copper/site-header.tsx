import Link from "next/link";
import { Logo } from "@/components/copper/logo";
import { ModeToggle } from "@/components/copper/mode-toggle";
import { SectionNav } from "@/components/copper/section-nav";

export function SiteHeader() {
  return (
    <header
      data-testid="site-header"
      className="bg-background/90 sticky top-0 z-50 border-b backdrop-blur"
    >
      {/* Phones get a menu button; wider screens show the links. */}
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:gap-4">
        <Link href="/" aria-label="Copper State Labs home" className="shrink-0">
          <Logo className="w-36 sm:w-44" />
        </Link>
        <SectionNav />
        <ModeToggle />
      </div>
    </header>
  );
}
