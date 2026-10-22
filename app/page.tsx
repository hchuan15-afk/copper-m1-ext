import { BackToTop } from "@/components/copper/back-to-top";
import { Compare } from "@/components/copper/compare";
import { Faq } from "@/components/copper/faq";
import { Hero } from "@/components/copper/hero";
import { PlusPricing } from "@/components/copper/plus-pricing";
import { PrivacySummary } from "@/components/copper/privacy-summary";
import { Products } from "@/components/copper/products";
import { QuizSection } from "@/components/copper/quiz-section";
import { Showcase } from "@/components/copper/showcase";
import { SiteFooter } from "@/components/copper/site-footer";
import { SiteHeader } from "@/components/copper/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex w-full flex-1 flex-col">
        <Hero />
        <Products />
        <Compare />
        <QuizSection />
        <Showcase />
        <PlusPricing />
        <PrivacySummary />
        <Faq />
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
