"use client";

import type { OrderStatus } from "@/lib/types";
import { STATUS_META } from "@/lib/order-status";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-context";

export function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const { t } = useI18n();
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.className,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {t(`status.${status}`)}
    </span>
  );
}
