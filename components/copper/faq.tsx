import { ChevronDownIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Customer-facing 2026 facts from the Product Bible (§3, §4, §8 and §9).
// No prices here: those come from the catalog in the sections above.
const FAQS = [
  {
    question: "Is there a free trial of Copper Plus?",
    answer:
      "Yes. Every new Copper device comes with a 30-day free trial of Copper Plus.",
  },
  {
    question: "What's the warranty?",
    answer:
      "Copper Home has a 2-year warranty and Copper Notes has a 1-year warranty. It covers manufacturing defects, not heat damage from leaving a device in a vehicle.",
  },
  {
    question: "Can I return my device?",
    answer: "Yes. You have 30 days to return a Copper device.",
  },
  {
    question: "How long does Copper Notes' battery last?",
    answer:
      "Up to 12 hours of recording and 7 days on standby. It charges on its puck.",
  },
  {
    question: "Can I turn off the microphones on Copper Home?",
    answer:
      "Yes. Slide the mute switch on the back. A red privacy light on the front shows the microphones are off.",
  },
  {
    question: "How do I set up my Copper?",
    answer:
      "Open the Copper app and tap Add Device. Plug in Copper Home, or place Copper Notes on its charging puck and hold the center button for 3 seconds, then follow the prompts.",
  },
  {
    question: "Is it okay to record other people?",
    answer:
      "Follow your local recording-consent laws: some states require everyone in a conversation to agree. Copper Notes plays a chime and lights its amber ring when it starts recording.",
  },
];

export function Faq() {
  return (
    <section id="faq" data-testid="faq" className="scroll-mt-20">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h2 className="mb-8 text-3xl font-extrabold sm:text-4xl">
          Questions, answered.
        </h2>
        <ul className="divide-y border-y">
          {FAQS.map(({ question, answer }) => (
            <li key={question}>
              <Collapsible className="group">
                <CollapsibleTrigger className="hover:text-primary flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold transition-colors">
                  {question}
                  <ChevronDownIcon
                    aria-hidden
                    className="text-primary size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180"
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="text-muted-foreground pb-5 text-base">
                  {answer}
                </CollapsibleContent>
              </Collapsible>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
