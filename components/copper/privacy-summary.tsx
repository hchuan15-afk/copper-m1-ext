import { ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import { getPrivacySummary } from "@/lib/copper/catalog";

const MASCOT_SIZE = 1254;

// The official privacy facts come from the catalog (Product Bible §8). Older
// documents with different claims are deliberately not used here.
export function PrivacySummary() {
  const privacy = getPrivacySummary();

  return (
    <section
      id="privacy"
      data-testid="privacy-summary"
      className="bg-accent text-accent-foreground scroll-mt-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-[1fr_2fr] md:gap-16 md:py-24">
        <Image
          src="/assets/brand/copper-mascot.png"
          alt="Copper the robot mascot in a yellow hard hat, waving and holding a checklist"
          width={MASCOT_SIZE}
          height={MASCOT_SIZE}
          sizes="(min-width: 768px) 30vw, 50vw"
          className="mx-auto h-auto w-1/2 max-w-xs drop-shadow-2xl md:w-full"
        />

        <div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Your privacy, in plain words.
          </h2>
          <p className="mt-3 text-lg font-semibold">
            How Copper handles recordings under our {privacy.policy} privacy
            policy.
          </p>

          <ul className="mt-8 flex flex-col gap-4 text-base sm:text-lg">
            {privacy.points.map((point) => (
              <li key={point} className="flex gap-3">
                <ShieldCheckIcon
                  aria-hidden
                  className="mt-0.5 size-6 shrink-0"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <p className="border-accent-foreground/20 mt-8 border-t pt-6">
            <strong>Recording others?</strong> Some states require everyone in a
            conversation to agree. Copper Notes plays a chime and lights its
            amber ring when it starts recording.
          </p>
        </div>
      </div>
    </section>
  );
}
