import { GlassWater, CupSoda, Factory, Filter, Wrench } from "lucide-react";
import type { CategoryIcon as IconName } from "@/lib/types";

const MAP = {
  kitchen: GlassWater,
  fountain: CupSoda,
  industrial: Factory,
  cartridge: Filter,
  parts: Wrench,
} as const;

export function CategoryIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const Icon = MAP[name] ?? Filter;
  return <Icon className={className} />;
}
