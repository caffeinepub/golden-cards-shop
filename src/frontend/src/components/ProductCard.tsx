import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Banknote, Mail, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product, Series } from "../backend";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/imageMap";

const SELLER_EMAIL = "princebhandari895@gmail.com";

interface ProductCardProps {
  product: Product;
  index: number;
}

function formatPrice(price: bigint): string {
  return `NPR ${Number(price)}`;
}

function getSeriesLabel(series: Series): string {
  if (series === "pokemon") return "Pokémon";
  if (series === "naruto") return "Naruto";
  return String(series);
}

function getSeriesColor(series: Series): string {
  if (series === "pokemon")
    return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
  if (series === "naruto")
    return "bg-orange-500/20 text-orange-300 border-orange-500/30";
  return "";
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const imageSrc = getProductImage(product.name);
  const [showBuyPopup, setShowBuyPopup] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: formatPrice(product.price),
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        data-ocid={`product.item.${index + 1}`}
        className="group bg-surface rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-gold flex flex-col"
      >
        <div className="relative overflow-hidden aspect-[5/7]">
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge
            className={`absolute top-2 left-2 text-[11px] font-semibold border ${getSeriesColor(product.series)}`}
          >
            {getSeriesLabel(product.series)}
          </Badge>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <h3 className="font-display font-bold text-foreground text-base leading-tight">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-gold font-bold text-lg font-display">
              {formatPrice(product.price)}
            </span>
            <span className="text-[11px] bg-gold/10 text-gold border border-gold/30 rounded px-2 py-0.5 font-semibold">
              10 cards = NPR 1,000
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Banknote className="w-3 h-3 text-green-400" />
              <span>Pay Cash on Pickup</span>
            </div>
          </div>

          <Button
            data-ocid={`product.buy_button.${index + 1}`}
            onClick={() => setShowBuyPopup(true)}
            className="w-full gold-gradient text-background font-display font-bold uppercase tracking-wider transition-colors text-sm"
          >
            Buy Now
          </Button>

          <Button
            data-ocid={`product.button.${index + 1}`}
            onClick={handleAddToCart}
            variant="outline"
            className="w-full font-display font-bold uppercase tracking-wider text-sm border-border"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </motion.div>

      {/* Buy Now Popup */}
      <AnimatePresence>
        {showBuyPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBuyPopup(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card border border-gold/40 rounded-xl shadow-gold w-full max-w-sm p-6 flex flex-col items-center gap-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowBuyPopup(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
                  style={{ position: "absolute" }}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-gold" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-xl text-foreground">
                    Want to Buy?
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2">
                    Message me to place your order for{" "}
                    <span className="text-foreground font-semibold">
                      {product.name}
                    </span>
                    .
                  </p>
                </div>

                <div className="bg-surface-2 border border-border rounded-lg px-5 py-4 w-full">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Contact Seller
                  </p>
                  <a
                    href={`mailto:${SELLER_EMAIL}?subject=Buying ${encodeURIComponent(product.name)}`}
                    className="text-gold font-bold text-base underline underline-offset-2 break-all"
                  >
                    {SELLER_EMAIL}
                  </a>
                </div>

                <p className="text-xs text-muted-foreground">
                  Pay cash when you pick up your card from the seller.
                </p>

                <a
                  href={`mailto:${SELLER_EMAIL}?subject=Buying ${encodeURIComponent(product.name)}`}
                  className="w-full"
                >
                  <Button className="w-full gold-gradient text-background font-display font-bold uppercase tracking-wider">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email to Buy
                  </Button>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
