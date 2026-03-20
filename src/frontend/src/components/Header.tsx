import { Badge } from "@/components/ui/badge";
import { Heart, Settings, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";

interface HeaderProps {
  onCartOpen: () => void;
  activeSection: string;
  onNavClick: (section: string) => void;
}

export function Header({ onCartOpen, activeSection, onNavClick }: HeaderProps) {
  const { totalItems } = useCart();

  const navItems = [
    { id: "home", label: "HOME" },
    { id: "shop", label: "SHOP ALL" },
    { id: "pokemon", label: "POKEMON" },
    { id: "naruto", label: "NARUTO" },
  ];

  const goToAdmin = () => {
    window.location.href = "/admin";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => onNavClick("home")}
          data-ocid="nav.link"
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 rounded gold-gradient flex items-center justify-center shadow-gold-sm">
            <span className="font-display font-800 text-sm text-background">
              GC
            </span>
          </div>
          <span className="font-display font-bold text-lg text-gold hidden sm:block tracking-wide">
            GOLDEN CARDS
          </span>
        </button>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid="nav.link"
              onClick={() => onNavClick(item.id)}
              className={`relative px-4 py-2 text-xs font-body font-semibold tracking-widest uppercase transition-colors ${
                activeSection === item.id
                  ? "text-gold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 bg-gold rounded-full"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Utility Icons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="nav.link"
            onClick={goToAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gold border border-gold/40 rounded-md hover:bg-gold/10 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            Admin Panel
          </button>
          <button
            type="button"
            data-ocid="nav.link"
            className="p-2 text-muted-foreground hover:text-gold transition-colors rounded-md hover:bg-surface-2"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button
            type="button"
            data-ocid="cart.open_modal_button"
            onClick={onCartOpen}
            className="relative p-2 text-muted-foreground hover:text-gold transition-colors rounded-md hover:bg-surface-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-gold text-background text-[10px] font-bold border-0">
                {totalItems}
              </Badge>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
