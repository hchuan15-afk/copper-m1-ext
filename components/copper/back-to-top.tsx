"use client";

import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Shows once the reader has scrolled about a screen past the top.
const SHOW_AFTER_PX = 600;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <Button
      size="icon-lg"
      aria-label="Back to top"
      inert={!visible}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed right-4 bottom-4 z-40 rounded-full shadow-lg transition-opacity sm:right-6 sm:bottom-6",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ArrowUpIcon className="size-5" />
    </Button>
  );
}
