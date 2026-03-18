import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../utils/imageMap";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

function formatPrice(price: bigint): string {
  return `NPR ${Number(price)}`;
}

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            data-ocid="cart.sheet"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="font-display font-bold text-lg text-foreground">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({totalItems} items)
                  </span>
                )}
              </div>
              <button
                type="button"
                data-ocid="cart.close_button"
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            {items.length === 0 ? (
              <div
                data-ocid="cart.empty_state"
                className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8"
              >
                <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-foreground font-semibold">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add some golden cards to get started!
                  </p>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                  {items.map((item, idx) => (
                    <motion.div
                      key={String(item.product.id)}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      data-ocid={`cart.item.${idx + 1}`}
                      className="flex gap-3 bg-surface-2 rounded-lg p-3"
                    >
                      <img
                        src={getProductImage(item.product.name)}
                        alt={item.product.name}
                        className="w-16 h-[90px] object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-gold font-bold text-sm mt-0.5">
                          {formatPrice(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            data-ocid={`cart.secondary_button.${idx + 1}`}
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-primary hover:text-gold transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-bold w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            data-ocid={`cart.secondary_button.${idx + 1}`}
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded border border-border flex items-center justify-center hover:border-primary hover:text-gold transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        data-ocid={`cart.delete_button.${idx + 1}`}
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border flex flex-col gap-3">
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">
                    Total
                  </span>
                  <span className="text-gold font-display font-bold text-xl">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Button
                  data-ocid="cart.primary_button"
                  onClick={() => {
                    onClose();
                    onCheckout();
                  }}
                  className="w-full gold-gradient text-background font-display font-bold uppercase tracking-wider py-3 text-sm"
                >
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
