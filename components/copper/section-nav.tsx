"use client";

import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV } from "@/components/copper/nav-links";
import { cn } from "@/lib/utils";

/** The id of the section in the middle of the screen, or null before any. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // jsdom and very old browsers have no IntersectionObserver.
    if (typeof IntersectionObserver === "undefined") return;
    const sections = NAV.map(({ href }) =>
      document.getElementById(href.slice(1)),
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      // A thin band across the middle of the screen.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    // The last section is too short to reach the middle band, so at the
    // bottom of the page it counts as the current one.
    const last = sections.at(-1);
    const atBottom = () => {
      const { scrollHeight } = document.documentElement;
      if (last && window.innerHeight + window.scrollY >= scrollHeight - 2)
        setActive(last.id);
    };
    window.addEventListener("scroll", atBottom, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", atBottom);
    };
  }, []);

  return active;
}

export function SectionNav() {
  const active = useActiveSection();

  return (
    <>
      <nav
        aria-label="Main"
        className="ml-auto hidden items-center gap-5 sm:flex md:gap-6"
      >
        {NAV.filter((item) => item.header).map(({ href, label }) => {
          const current = active === href.slice(1);
          return (
            <a
              key={href}
              href={href}
              aria-current={current ? "location" : undefined}
              className={cn(
                "hover:text-primary text-sm font-semibold whitespace-nowrap transition-colors md:text-base",
                current
                  ? "text-primary underline decoration-2 underline-offset-8"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
            className="ml-auto sm:hidden"
          >
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Jump to a section of the page
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="Menu" className="flex flex-col px-4">
            {NAV.map(({ href, label }) => (
              <SheetClose asChild key={href}>
                <a
                  href={href}
                  aria-current={
                    active === href.slice(1) ? "location" : undefined
                  }
                  className={cn(
                    "hover:text-primary border-b py-3 text-lg font-semibold transition-colors",
                    active === href.slice(1) && "text-primary",
                  )}
                >
                  {label}
                </a>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
