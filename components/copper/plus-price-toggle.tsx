"use client";

import { useState } from "react";
import { CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatUsd } from "@/lib/copper/catalog";

type Billing = "monthly" | "yearly";

const cents = (amount: number) => Math.round(amount * 100) / 100;

/** Copper Plus price with a Monthly/Yearly switch. Values come from the catalog. */
export function PlusPriceToggle({
  monthlyUsd,
  annualUsd,
}: {
  monthlyUsd: number;
  annualUsd: number;
}) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const perMonth = cents(annualUsd / 12);
  const savings = cents(monthlyUsd * 12 - annualUsd);
  const yearly = billing === "yearly";

  return (
    <div className="flex flex-col gap-3">
      <Tabs
        value={billing}
        onValueChange={(value) => setBilling(value as Billing)}
      >
        <TabsList aria-label="Billing period" className="bg-secondary">
          <TabsTrigger value="monthly" className="px-3">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="yearly" className="px-3">
            Yearly
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div aria-live="polite">
        <p>
          <span className="text-primary font-heading text-4xl font-extrabold">
            {formatUsd(yearly ? perMonth : monthlyUsd)}
          </span>
          <span className="text-muted-foreground">/month</span>
        </p>
        <CardDescription className="mt-1 text-base">
          {yearly ? (
            <>
              Billed {formatUsd(annualUsd)} yearly
              {savings > 0 && <> &middot; Save {formatUsd(savings)} a year</>}
            </>
          ) : (
            <>Billed monthly, or {formatUsd(annualUsd)}/year</>
          )}
        </CardDescription>
      </div>
    </div>
  );
}
