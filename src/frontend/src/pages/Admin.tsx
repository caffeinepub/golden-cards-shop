import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogIn, LogOut, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { Status } from "../backend";
import type { Order } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetOrders, useUpdateOrderStatus } from "../hooks/useQueries";

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

const STATUS_COLORS: Record<Status, string> = {
  [Status.pending]: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  [Status.processing]: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  [Status.shipped]: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  [Status.delivered]: "bg-green-500/20 text-green-300 border-green-500/30",
};

function formatPrice(cents: bigint): string {
  return `NPR ${(Number(cents) / 100).toFixed(0)}`;
}

function OrderRow({ order, index }: { order: Order; index: number }) {
  const updateStatus = useUpdateOrderStatus();

  return (
    <TableRow
      data-ocid={`orders.row.${index + 1}`}
      className="border-border hover:bg-surface-2 transition-colors"
    >
      <TableCell className="font-mono text-sm text-muted-foreground">
        #{String(order.id).padStart(6, "0")}
      </TableCell>
      <TableCell className="font-medium">{order.customerName}</TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {order.phone}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
        {order.address}
      </TableCell>
      <TableCell className="text-sm">{order.items.length} item(s)</TableCell>
      <TableCell className="text-gold font-bold">
        {formatPrice(order.total)}
      </TableCell>
      <TableCell>
        <Select
          value={order.status}
          onValueChange={(val) =>
            updateStatus.mutate({ orderId: order.id, status: val as Status })
          }
        >
          <SelectTrigger
            data-ocid={`orders.select.${index + 1}`}
            className={`w-36 text-xs border ${STATUS_COLORS[order.status]} bg-transparent`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {Object.values(Status).map((s) => (
              <SelectItem key={s} value={s} className="text-xs capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}

export function Admin() {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: orders, isLoading: ordersLoading, refetch } = useGetOrders();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded gold-gradient flex items-center justify-center">
              <span className="font-display font-bold text-xs text-background">
                GC
              </span>
            </div>
            <span className="font-display font-bold text-lg text-gold">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <span className="text-xs text-muted-foreground font-mono">
                {identity?.getPrincipal().toString().slice(0, 12)}...
              </span>
            )}
            {isAuthenticated ? (
              <Button
                data-ocid="admin.secondary_button"
                variant="outline"
                onClick={clear}
                className="border-border text-muted-foreground hover:text-foreground text-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Logout
              </Button>
            ) : (
              <Button
                data-ocid="admin.primary_button"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-gold text-background font-display font-bold text-sm uppercase tracking-wider"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-3xl text-gradient-gold mb-2">
                Admin Access Required
              </h1>
              <p className="text-muted-foreground max-w-sm">
                Log in with your identity to access the order management
                dashboard.
              </p>
            </div>
            <Button
              data-ocid="admin.primary_button"
              onClick={login}
              disabled={isLoggingIn}
              className="bg-gold text-background font-display font-bold uppercase tracking-wider px-8 py-3"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoggingIn ? "Connecting..." : "Login to Admin"}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <h1 className="font-display font-extrabold text-2xl uppercase tracking-widest text-gold">
                Order Management
              </h1>
              <Button
                data-ocid="admin.secondary_button"
                variant="outline"
                onClick={() => refetch()}
                className="border-border text-muted-foreground hover:text-foreground text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Refresh
              </Button>
            </div>

            {ordersLoading ? (
              <div
                data-ocid="admin.loading_state"
                className="flex flex-col gap-2"
              >
                {SKELETON_KEYS.map((k) => (
                  <Skeleton key={k} className="h-12 w-full bg-surface" />
                ))}
              </div>
            ) : !orders || orders.length === 0 ? (
              <div
                data-ocid="orders.empty_state"
                className="text-center py-20 text-muted-foreground"
              >
                <p className="text-lg">No orders yet.</p>
              </div>
            ) : (
              <div className="bg-surface rounded-lg border border-border overflow-hidden">
                <Table data-ocid="orders.table">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        Order ID
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        Customer
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        Phone
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        Address
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        Items
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        Total
                      </TableHead>
                      <TableHead className="text-muted-foreground text-xs uppercase tracking-wider">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, i) => (
                      <OrderRow
                        key={String(order.id)}
                        order={order}
                        index={i}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
