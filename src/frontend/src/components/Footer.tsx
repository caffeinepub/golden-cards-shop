import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";
import { useActor } from "../hooks/useActor";

function VisitorCounter() {
  const { actor } = useActor();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!actor) return;
    let cancelled = false;
    async function run() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const a = actor as any;
        await a.recordVisit();
        const c = await a.getVisitCount();
        if (!cancelled) setCount(Number(c));
      } catch {
        // silently ignore - never crash the page
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [actor]);

  if (count === null) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
      <span>{count.toLocaleString()} visitors</span>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  const shopLinks = [
    "All Cards",
    "Pok\u00e9mon Series",
    "Naruto Series",
    "New Arrivals",
    "Best Sellers",
  ];
  const supportLinks = [
    "FAQ",
    "Pickup Info",
    "Returns & Refunds",
    "Contact Us",
    "Track Order",
  ];
  const socialIcons = [
    { icon: SiInstagram, label: "Instagram" },
    { icon: SiX, label: "X / Twitter" },
    { icon: SiFacebook, label: "Facebook" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded gold-gradient flex items-center justify-center">
                <span className="font-display font-bold text-xs text-background">
                  GC
                </span>
              </div>
              <span className="font-display font-bold text-foreground">
                Golden Cards
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium gold-plated trading cards. Visit our seller and pay cash
              on pickup.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socialIcons.map(({ icon: Icon, label }) => (
                <button
                  type="button"
                  key={label}
                  aria-label={label}
                  className="p-2 rounded-md bg-surface-2 border border-border text-muted-foreground hover:text-gold hover:border-gold/50 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gold mb-4">
              Shop
            </h4>
            <ul className="flex flex-col gap-2">
              {shopLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gold mb-4">
              Support
            </h4>
            <ul className="flex flex-col gap-2">
              {supportLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-gold mb-4">
              Pickup
            </h4>
            <div className="flex flex-col gap-3">
              <div className="bg-surface-2 border border-border rounded-lg p-3">
                <p className="text-xs font-semibold text-foreground">
                  Cash on Pickup
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Visit our seller and pay cash when you arrive.
                </p>
              </div>
              <div className="bg-surface-2 border border-border rounded-lg p-3">
                <p className="text-xs font-semibold text-foreground">
                  Pricing: NPR 100 / card
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  10 cards = NPR 1,000. Nepalese Rupees only.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {year} Golden Cards. All rights reserved.
            </p>
            <VisitorCounter />
          </div>
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Built with ❤️ using caffeine.ai
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
