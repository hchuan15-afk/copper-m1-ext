import { Logo } from "@/components/copper/logo";
import { NAV as ALL_NAV } from "@/components/copper/nav-links";

const NAV = ALL_NAV.filter((item) => item.header);

// Night Sky in both themes, so the brand hex is used instead of a theme class.
export function SiteFooter() {
  return (
    <footer data-testid="site-footer" className="bg-[#1c2333] text-[#efe3d0]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-3">
          <Logo onDark className="w-44" />
          <p className="font-heading text-lg font-semibold">
            From raw ideas to refined answers.
          </p>
          <p className="text-sm opacity-70">
            Copper State Labs · Tempe, Arizona
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="hover:text-primary font-semibold transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
      <p className="mx-auto max-w-6xl border-t border-[#efe3d0]/15 px-4 py-6 text-sm opacity-70">
        Fictional — for educational use.
      </p>
    </footer>
  );
}
