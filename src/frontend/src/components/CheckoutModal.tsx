import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Mail, MapPin, Package, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useCreateOrder } from "../hooks/useQueries";
import { getProductImage } from "../utils/imageMap";

const SELLER_EMAIL = "princebhandari895@gmail.com";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatPrice(price: bigint): string {
  return `NPR ${Number(price)}`;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [orderId, setOrderId] = useState<bigint | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const id = await createOrder.mutateAsync({
        customerName: form.name,
        phone: form.phone,
        address: "Visit seller in person",
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: BigInt(i.quantity),
        })),
        total: totalPrice,
      });
      setOrderId(id);
      clearCart();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClose = () => {
    setOrderId(null);
    setForm({ name: "", phone: "" });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            data-ocid="checkout.modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-card border border-border rounded-xl shadow-gold w-full max-w-lg max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gold" />
                  <h2 className="font-display font-bold text-lg">
                    {orderId ? "Order Confirmed!" : "Checkout"}
                  </h2>
                </div>
                <button
                  type="button"
                  data-ocid="checkout.close_button"
                  onClick={handleClose}
                  className="p-1.5 rounded-md hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {orderId ? (
                <div
                  data-ocid="checkout.success_state"
                  className="p-8 flex flex-col items-center gap-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-400" />
                  </motion.div>
                  <h3 className="font-display font-bold text-xl text-foreground">
                    Order Reserved!
                  </h3>
                  <p className="text-muted-foreground">
                    Show this order ID to the seller and pay cash when you
                    visit.
                  </p>
                  <div className="bg-surface-2 border border-border rounded-lg px-6 py-4 mt-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Order ID
                    </p>
                    <p className="text-gold font-display font-bold text-2xl mt-1">
                      #{String(orderId).padStart(6, "0")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>Questions? Email: </span>
                    <a
                      href={`mailto:${SELLER_EMAIL}`}
                      className="text-gold underline underline-offset-2"
                    >
                      {SELLER_EMAIL}
                    </a>
                  </div>
                  <Button
                    data-ocid="checkout.confirm_button"
                    onClick={handleClose}
                    className="mt-2 bg-gold text-background font-display font-bold uppercase tracking-wider"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-6 flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Order Summary
                    </h3>
                    <div className="flex flex-col gap-2">
                      {items.map((item) => (
                        <div
                          key={String(item.product.id)}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={getProductImage(item.product.name)}
                            alt={item.product.name}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-gold font-bold text-sm">
                            {formatPrice(
                              item.product.price * BigInt(item.quantity),
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        Total (Pay on Pickup)
                      </span>
                      <span className="text-gold font-display font-bold text-lg">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Pickup note */}
                  <div className="flex items-start gap-2 bg-surface-2 border border-border rounded-lg p-3">
                    <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground font-semibold">
                        Pick up in person from our seller.
                      </span>{" "}
                      Pay cash on arrival.
                    </p>
                  </div>

                  {/* Contact email */}
                  <div className="flex items-center gap-2 bg-surface-2 border border-border rounded-lg p-3">
                    <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Questions? Contact:{" "}
                      <a
                        href={`mailto:${SELLER_EMAIL}`}
                        className="text-gold underline underline-offset-2"
                      >
                        {SELLER_EMAIL}
                      </a>
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <Label
                        htmlFor="checkout-name"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="checkout-name"
                        data-ocid="checkout.input"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className="mt-1.5 bg-input border-border"
                      />
                      {errors.name && (
                        <p
                          data-ocid="checkout.error_state"
                          className="text-xs text-destructive mt-1"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="checkout-phone"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="checkout-phone"
                        data-ocid="checkout.input"
                        placeholder="+977 98XXXXXXXX"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="mt-1.5 bg-input border-border"
                      />
                      {errors.phone && (
                        <p
                          data-ocid="checkout.error_state"
                          className="text-xs text-destructive mt-1"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    data-ocid="checkout.submit_button"
                    onClick={handleSubmit}
                    disabled={createOrder.isPending}
                    className="w-full gold-gradient text-background font-display font-bold uppercase tracking-wider py-3 text-sm"
                  >
                    {createOrder.isPending
                      ? "Reserving Order..."
                      : "Reserve Order (Pay on Pickup)"}
                  </Button>

                  {createOrder.isError && (
                    <p
                      data-ocid="checkout.error_state"
                      className="text-xs text-destructive text-center"
                    >
                      Failed to place order. Please try again.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
