import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronRight,
  CreditCard,
  Mail,
  Shield,
  Sparkles,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Series } from "../backend";
import { ProductCard } from "../components/ProductCard";
import { useGetProducts } from "../hooks/useQueries";

const SKELETON_KEYS = [
  "sk-1",
  "sk-2",
  "sk-3",
  "sk-4",
  "sk-5",
  "sk-6",
  "sk-7",
  "sk-8",
];

interface HomeProps {
  onShopNow: () => void;
}

export function Home({ onShopNow }: HomeProps) {
  const { data: products, isLoading } = useGetProducts();
  const [filter, setFilter] = useState<"all" | Series>("all");

  const filtered = useMemo(() => {
    if (!products) return [];
    if (filter === "all") return products;
    return products.filter((p) => p.series === filter);
  }, [products, filter]);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, oklch(0.15 0.04 80 / 0.3) 0%, transparent 60%), linear-gradient(135deg, oklch(0.09 0 0) 0%, oklch(0.12 0.005 260) 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/3 blur-2xl" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-20 w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-xs font-body font-semibold uppercase tracking-[0.2em] text-gold">
                Premium Collection
              </span>
            </div>
            <h1 className="font-display font-extrabold leading-[1.05] text-5xl lg:text-6xl xl:text-7xl text-gradient-gold">
              PREMIUM
              <br />
              GOLDEN
              <br />
              CARDS
            </h1>
            <p className="text-muted-foreground font-body text-lg max-w-md leading-relaxed">
              Exclusive gold-plated trading cards featuring your favorite
              Pokémon and Naruto characters. Collector-grade quality, delivered
              cash on delivery.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                data-ocid="hero.primary_button"
                onClick={onShopNow}
                className="bg-gold text-background font-display font-bold uppercase tracking-wider px-8 py-3 text-sm hover:shadow-gold transition-shadow"
              >
                Shop Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                data-ocid="hero.secondary_button"
                variant="outline"
                onClick={onShopNow}
                className="border-gold/50 text-gold bg-transparent hover:bg-gold/10 font-display font-bold uppercase tracking-wider px-8 py-3 text-sm"
              >
                View Collection
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 mt-2">
              {[
                { icon: CreditCard, text: "Cash on Delivery" },
                { icon: Truck, text: "Paid Delivery - Gulariya" },
                { icon: Shield, text: "Authentic Cards" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Icon className="w-3.5 h-3.5 text-gold" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-3xl scale-110" />
              <img
                src="/assets/generated/pokemon-charizard-gold.dim_400x560.jpg"
                alt="Premium Charizard Gold Card"
                className="relative z-10 w-64 md:w-80 rounded-2xl shadow-gold"
                style={{ transform: "rotate(3deg)" }}
              />
              <div className="absolute -bottom-4 -right-4 w-48 opacity-50 z-0">
                <img
                  src="/assets/generated/naruto-uzumaki-gold.dim_400x560.jpg"
                  alt=""
                  className="w-full rounded-xl"
                  style={{ transform: "rotate(-5deg)" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="shop" className="py-20 max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <h2 className="font-display font-extrabold text-2xl uppercase tracking-widest text-gold">
            Featured Golden Cards
          </h2>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as "all" | Series)}
            data-ocid="product.tab"
          >
            <TabsList className="bg-surface border border-border">
              <TabsTrigger
                value="all"
                className="font-display font-semibold text-xs uppercase tracking-wider data-[state=active]:bg-gold data-[state=active]:text-background"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="pokemon"
                className="font-display font-semibold text-xs uppercase tracking-wider data-[state=active]:bg-gold data-[state=active]:text-background"
              >
                Pokémon
              </TabsTrigger>
              <TabsTrigger
                value="naruto"
                className="font-display font-semibold text-xs uppercase tracking-wider data-[state=active]:bg-gold data-[state=active]:text-background"
              >
                Naruto
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {isLoading ? (
          <div
            data-ocid="product.loading_state"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {SKELETON_KEYS.map((k) => (
              <div key={k} className="bg-surface rounded-lg overflow-hidden">
                <Skeleton className="aspect-[5/7] w-full bg-surface-2" />
                <div className="p-4 flex flex-col gap-2">
                  <Skeleton className="h-4 w-3/4 bg-surface-2" />
                  <Skeleton className="h-3 w-1/2 bg-surface-2" />
                  <Skeleton className="h-8 w-full mt-2 bg-surface-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            data-ocid="product.empty_state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 py-20 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-gold" />
            </div>
            <p className="text-muted-foreground font-body text-base">
              Mail me in{" "}
              <a
                href="mailto:princebhandari895@gmail.com"
                className="text-gold font-semibold hover:underline"
              >
                princebhandari895@gmail.com
              </a>{" "}
              to buy golden cards
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <ProductCard
                key={String(product.id)}
                product={product}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features Banner */}
      <section className="bg-surface border-y border-border py-10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: CreditCard,
                title: "Cash on Delivery",
                desc: "Pay when your cards arrive. No upfront payment needed.",
              },
              {
                icon: Truck,
                title: "Paid Delivery in Gulariya",
                desc: "Delivery available to Gulariya. Delivery fee applies.",
              },
              {
                icon: Shield,
                title: "100% Authentic",
                desc: "Each card is certified gold-plated and collector grade.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display font-bold text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
