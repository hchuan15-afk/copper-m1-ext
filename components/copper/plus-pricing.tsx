import { CheckIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatMemory,
  formatNotesHours,
  formatUsd,
  getPlans,
  type Plan,
} from "@/lib/copper/catalog";
import { cn } from "@/lib/utils";

// How much a year of monthly payments costs beyond the annual price, rounded to cents.
const yearlySavings = (plan: Plan) =>
  Math.round((plan.monthlyUsd * 12 - plan.annualUsd) * 100) / 100;

// The annual price spread over 12 months, rounded to cents.
const annualPerMonth = (plan: Plan) =>
  Math.round((plan.annualUsd / 12) * 100) / 100;

export function PlusPricing() {
  const plans = getPlans();

  return (
    <section
      id="plus"
      data-testid="plus-pricing"
      className="scroll-mt-28 sm:scroll-mt-20"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Refine your answers.
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            Every Copper works out of the box. Copper Plus adds the smartest
            answers and the longest memory for everyone in the house.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const paid = plan.monthlyUsd > 0;
            const savings = yearlySavings(plan);
            const rows = [
              { label: "Memory kept", value: formatMemory(plan.memoryDays) },
              {
                label: "Notes recording",
                value: formatNotesHours(plan.notesHoursPerMonth),
              },
            ];

            return (
              <Card
                key={plan.id}
                data-plan={plan.id}
                className={cn("gap-6", paid && "ring-primary ring-2")}
              >
                <CardHeader className="gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="font-heading text-2xl font-extrabold">
                      <h3>{plan.name}</h3>
                    </CardTitle>
                    {paid && <Badge>Refine your answers</Badge>}
                  </div>
                  {paid ? (
                    <div>
                      <p>
                        <span className="text-primary font-heading text-4xl font-extrabold">
                          {formatUsd(plan.monthlyUsd)}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </p>
                      <CardDescription className="mt-1 text-base">
                        or {formatUsd(annualPerMonth(plan))}/month, billed{" "}
                        {formatUsd(plan.annualUsd)} yearly
                        {savings > 0 && (
                          <> &middot; Save {formatUsd(savings)} a year</>
                        )}
                      </CardDescription>
                    </div>
                  ) : (
                    <div>
                      <p className="font-heading text-4xl font-extrabold">
                        {formatUsd(plan.monthlyUsd)}
                      </p>
                      <CardDescription className="mt-1 text-base">
                        Included with your device
                      </CardDescription>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <dl className="divide-y border-t text-base">
                    {rows.map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-4 py-3"
                      >
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="font-semibold">{value}</dd>
                      </div>
                    ))}
                    <div className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-muted-foreground">Refined answers</dt>
                      <dd className="flex items-center gap-1.5 font-semibold">
                        {plan.refinedAnswers ? (
                          <>
                            <CheckIcon
                              aria-hidden
                              className="text-accent size-5"
                            />
                            Included
                          </>
                        ) : (
                          <>
                            <XIcon
                              aria-hidden
                              className="text-muted-foreground size-5"
                            />
                            Not included
                          </>
                        )}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-center">
          Every new Copper device comes with a 30-day free trial of Copper Plus,
          and one subscription covers every Copper device in your home.
        </p>
      </div>
    </section>
  );
}
