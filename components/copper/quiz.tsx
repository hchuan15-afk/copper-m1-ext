"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ProductId } from "@/lib/copper/catalog";
import { cn } from "@/lib/utils";

export type QuizProduct = { id: ProductId; name: string; price: string };

type Choice = { label: string; home: number; notes: number };

// Each answer leans toward Copper Home, Copper Notes, or both.
const QUESTIONS: { question: string; choices: Choice[] }[] = [
  {
    question: "Where do you want Copper's help most?",
    choices: [
      { label: "At home", home: 2, notes: 0 },
      { label: "In meetings and class", home: 0, notes: 2 },
      { label: "Both", home: 2, notes: 2 },
    ],
  },
  {
    question:
      "Would you like a voice to run your lights, thermostat or sprinklers?",
    choices: [
      { label: "Yes, please", home: 1, notes: 0 },
      { label: "Not really", home: 0, notes: 0 },
    ],
  },
  {
    question: "Do you sit through meetings or lectures you'd like summarized?",
    choices: [
      { label: "All the time", home: 0, notes: 1 },
      { label: "Rarely", home: 0, notes: 0 },
    ],
  },
];

/** Picks Copper Home, Copper Notes, or both from the answers' scores. */
export function recommend(answers: Choice[]): ProductId[] {
  const home = answers.reduce((sum, a) => sum + a.home, 0);
  const notes = answers.reduce((sum, a) => sum + a.notes, 0);
  if (home >= 2 && notes >= 2) return ["copper-home", "copper-notes"];
  if (notes > home) return ["copper-notes"];
  return ["copper-home"];
}

export function Quiz({ products }: { products: QuizProduct[] }) {
  const [answers, setAnswers] = useState<Choice[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;
  const picks = done
    ? products.filter((p) => recommend(answers).includes(p.id))
    : [];

  return (
    <div className="bg-card text-card-foreground mx-auto max-w-2xl rounded-xl p-6 ring-1 ring-foreground/10 sm:p-8">
      {!done ? (
        <div>
          <p className="text-muted-foreground text-sm font-semibold">
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <h3 className="font-heading mt-2 text-2xl font-extrabold">
            {QUESTIONS[step].question}
          </h3>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {QUESTIONS[step].choices.map((choice) => (
              <Button
                key={choice.label}
                variant="outline"
                size="lg"
                className="justify-center text-base"
                onClick={() => setAnswers([...answers, choice])}
              >
                {choice.label}
              </Button>
            ))}
          </div>
          {step > 0 && (
            <Button
              variant="link"
              className="mt-4 px-0"
              onClick={() => setAnswers(answers.slice(0, -1))}
            >
              Back
            </Button>
          )}
        </div>
      ) : (
        <div aria-live="polite">
          <p className="text-muted-foreground text-sm font-semibold">
            Your match
          </p>
          <h3 className="font-heading mt-2 text-2xl font-extrabold">
            {picks.map((p) => p.name).join(" and ")}
          </h3>
          <ul
            className={cn(
              "mt-6 grid gap-3",
              picks.length > 1 && "sm:grid-cols-2",
            )}
          >
            {picks.map((p) => (
              <li
                key={p.id}
                className="bg-secondary text-secondary-foreground flex items-center justify-between gap-3 rounded-lg p-4"
              >
                <span className="font-semibold">{p.name}</span>
                <a
                  href={`#${p.id}`}
                  className="text-primary font-bold hover:underline"
                >
                  {p.price} →
                </a>
              </li>
            ))}
          </ul>
          <Button
            variant="link"
            className="mt-4 px-0"
            onClick={() => setAnswers([])}
          >
            Start over
          </Button>
        </div>
      )}
    </div>
  );
}
