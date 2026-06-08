"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-context";

/** Password field with a show/hide (eye) toggle. */
export function PasswordInput({
  name,
  required,
  placeholder = "••••••••",
  className,
}: {
  name: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  const { t } = useI18n();
  return (
    <div className={cn("relative", className)}>
      <input
        name={name}
        type={show ? "text" : "password"}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-line bg-white pl-4 pr-11 text-sm outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? t("common.hidePassword") : t("common.showPassword")}
        tabIndex={-1}
        className="absolute end-3 top-1/2 -translate-y-1/2 text-ink-soft transition-colors hover:text-ink"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
