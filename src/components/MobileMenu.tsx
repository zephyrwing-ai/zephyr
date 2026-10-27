import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { getSection, ui, type Locale, type SectionId } from "@/config/site";
import type { NavGroup } from "@/lib/content";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  locale: Locale;
  groups: NavGroup[];
  currentPath: string;
  currentSection?: SectionId;
}

function normalizePath(path: string) {
  return path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
}

function ArticleNavigation({
  groups,
  currentPath,
  onNavigate,
}: {
  groups: NavGroup[];
  currentPath: string;
  onNavigate: () => void;
}) {
  return groups.map((group) => {
    const active = group.items.some((item) => normalizePath(item.href) === normalizePath(currentPath));
    const items = (
      <ul>
        {group.items.map((item) => {
          const current = normalizePath(item.href) === normalizePath(currentPath);
          return (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={onNavigate}
                aria-current={current ? "page" : undefined}
                className={`block rounded-lg px-3 py-2 text-sm leading-relaxed transition-colors focus-visible:outline-2 focus-visible:outline-ring ${current ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {item.label}
                {item.description && <span className="mt-1 block text-xs font-normal text-muted-foreground">{item.description}</span>}
              </a>
            </li>
          );
        })}
      </ul>
    );

    return group.collapsible ? (
      <details key={group.label} className="mobile-nav-disclosure mb-7 last:mb-0" open={active}>
        <summary>{group.label}</summary>
        {items}
      </details>
    ) : (
      <div key={group.label} className="mb-7 last:mb-0">
        {group.showLabel !== false && <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">{group.label}</p>}
        {items}
      </div>
    );
  });
}

export default function MobileMenu({ locale, groups, currentPath, currentSection }: MobileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const current = currentSection ? getSection(currentSection, locale) : undefined;
  const texts = ui[locale];

  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [menuOpen]);

  if (groups.length === 0) return null;

  return (
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full lg:hidden" aria-label={texts.openArticleNavigation}>
          <Menu className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(88vw,22rem)] gap-6">
        <SheetHeader>
          <SheetTitle>{current?.label ?? texts.articles}</SheetTitle>
          <SheetDescription className="sr-only">{texts.chooseArticle}</SheetDescription>
        </SheetHeader>
        <nav className="min-h-0 flex-1 overflow-y-auto px-4 pb-8" aria-label={texts.articleNavigation}>
          <ArticleNavigation groups={groups} currentPath={currentPath} onNavigate={() => setMenuOpen(false)} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
