import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { Admin } from "./pages/Admin";
import { Home } from "./pages/Home";

function useRouterPath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);
  return path;
}

export default function App() {
  const path = useRouterPath();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const isAdmin = path === "/admin";

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    const targetId = section === "home" ? "home" : "shop";
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  if (isAdmin) {
    return (
      <CartProvider>
        <Admin />
        <Toaster />
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header
          onCartOpen={() => setCartOpen(true)}
          activeSection={activeSection}
          onNavClick={handleNavClick}
        />
        <div className="flex-1">
          <Home onShopNow={() => handleNavClick("shop")} />
        </div>
        <Footer />
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={() => setCheckoutOpen(true)}
        />
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
        />
      </div>
      <Toaster />
    </CartProvider>
  );
}
