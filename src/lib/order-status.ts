import type { OrderStatus } from "./types";

export const STATUS_META: Record<
  OrderStatus,
  { label: string; className: string; dot: string }
> = {
  pending: {
    label: "En attente",
    className: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmée",
    className: "bg-brand-100 text-brand-700",
    dot: "bg-brand-500",
  },
  installed: {
    label: "Installée",
    className: "bg-teal-100 text-teal-700",
    dot: "bg-teal-500",
  },
  shipped: {
    label: "Expédiée",
    className: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
  delivered: {
    label: "Livrée",
    className: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  returned: {
    label: "Retournée",
    className: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
  cancelled: {
    label: "Annulée",
    className: "bg-rose-100 text-rose-700",
    dot: "bg-rose-500",
  },
};

export const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "confirmed",
  "installed",
  "shipped",
  "delivered",
  "returned",
  "cancelled",
];
