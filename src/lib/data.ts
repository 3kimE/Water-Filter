import type { Product as PRow, Order as ORow } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  Order,
  OrderItem,
  OrderStatus,
  Product,
  Spec,
  ProductVariant,
} from "@/lib/types";

/* ---------- mappers (DB row -> app type) ---------- */

function toProduct(row: PRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categorySlug: row.categorySlug,
    shortDescription: row.shortDescription,
    description: row.description,
    price: row.price,
    oldPrice: row.oldPrice ?? undefined,
    rating: row.rating,
    reviewCount: row.reviewCount,
    stages: row.stages ?? undefined,
    capacity: row.capacity ?? undefined,
    warranty: row.warranty ?? undefined,
    badges: row.badges,
    inStock: row.inStock,
    stock: row.stock,
    bestSeller: row.bestSeller,
    hue: row.hue,
    images: row.images,
    features: row.features,
    specs: (row.specs as unknown as Spec[]) ?? [],
    variants: (row.variants as unknown as ProductVariant[] | null) ?? undefined,
    reviews: [],
  };
}

function toOrder(row: ORow): Order {
  return {
    id: row.id,
    customerName: row.customerName,
    phone: row.phone,
    city: row.city,
    address: row.address,
    note: row.note ?? undefined,
    items: (row.items as unknown as OrderItem[]) ?? [],
    total: row.total,
    status: row.status as OrderStatus,
    confirmationNote: row.confirmationNote ?? undefined,
    source: (row.source as "web" | "phone") ?? "web",
    confirmedAt: row.confirmedAt?.toISOString(),
    installDate: row.installDate?.toISOString(),
    assignedTo: row.assignedTo ?? undefined,
    completedAt: row.completedAt?.toISOString(),
    photoUrl: row.photoUrl ?? undefined,
    installStage: (row.installStage as "enroute" | "arrived" | null) ?? undefined,
    kind: (row.kind as "install" | "maintenance") ?? "install",
    parentOrderId: row.parentOrderId ?? undefined,
    lastOutcome: (row.lastOutcome as Order["lastOutcome"]) ?? undefined,
    callAttempts: row.callAttempts ?? 0,
    warrantyMonths: row.warrantyMonths ?? 24,
    maintenanceMonths: row.maintenanceMonths ?? 6,
    nextMaintenanceAt: row.nextMaintenanceAt?.toISOString(),
    lastMaintenanceAt: row.lastMaintenanceAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

/** Adds `months` to a date and returns a new Date. */
function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}

/* ---------- product reads ---------- */

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? toProduct(row) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { categorySlug: slug },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const best = await prisma.product.findMany({
    where: { bestSeller: true },
    take: limit,
  });
  if (best.length > 0) return best.map(toProduct);
  const any = await prisma.product.findMany({ take: limit, orderBy: { createdAt: "desc" } });
  return any.map(toProduct);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { categorySlug: product.categorySlug, id: { not: product.id } },
    take: limit,
  });
  return rows.map(toProduct);
}

/* ---------- order reads ---------- */

export async function getOrders(status?: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const row = await prisma.order.findUnique({ where: { id } });
  return row ? toOrder(row) : null;
}

// "installed" is the field-service done state — it must count as a sale, otherwise
// completing a job would DECREASE revenue.
const SALE_STATUSES = ["confirmed", "shipped", "delivered", "installed"];

export async function getDashboardStats() {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start7 = new Date(startToday);
  start7.setDate(start7.getDate() - 6);
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [total, products, paid, grouped, weekOrders, ordersThisMonth, ordersLastMonth] =
    await Promise.all([
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.findMany({
        where: { status: { in: SALE_STATUSES } },
        select: { total: true },
      }),
      prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.order.findMany({
        where: { createdAt: { gte: start7 }, status: { in: SALE_STATUSES } },
        select: { createdAt: true, total: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: startThisMonth } } }),
      prisma.order.count({
        where: { createdAt: { gte: startLastMonth, lt: startThisMonth } },
      }),
    ]);

  const byStatus: Record<string, number> = {};
  for (const g of grouped) byStatus[g.status] = g._count._all;

  // Real revenue per day for the last 7 days
  const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const trend7d = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start7);
    d.setDate(d.getDate() + i);
    return { label: DAY_LABELS[d.getDay()], revenue: 0 };
  });
  for (const o of weekOrders) {
    const d = new Date(o.createdAt);
    const day0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const idx = Math.round((day0.getTime() - start7.getTime()) / 86_400_000);
    if (idx >= 0 && idx < 7) trend7d[idx].revenue += o.total;
  }

  // Real month-over-month change in order count (null when no prior month to compare)
  const ordersMoMPct =
    ordersLastMonth > 0
      ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100)
      : null;

  return {
    total,
    pending: byStatus["pending"] ?? 0,
    products,
    revenue: paid.reduce((s, o) => s + o.total, 0),
    byStatus,
    trend7d,
    ordersThisMonth,
    ordersMoMPct,
  };
}

/* ---------- dashboard cards ---------- */

export type LowStockItem = { id: string; name: string; categorySlug: string; stock: number };

/** Products still on sale whose stock has dropped to/below the threshold. */
export async function getLowStockProducts(threshold = 5, limit = 6): Promise<LowStockItem[]> {
  return prisma.product.findMany({
    where: { inStock: true, stock: { lte: threshold } },
    orderBy: { stock: "asc" },
    take: limit,
    select: { id: true, name: true, categorySlug: true, stock: true },
  });
}

export type TopSeller = { name: string; units: number };

/** Best-selling products by units sold — real install orders only (no maintenance, no cancelled/returned). */
export async function getTopSellers(limit = 5): Promise<TopSeller[]> {
  const orders = await prisma.order.findMany({
    where: { kind: "install", status: { notIn: ["cancelled", "returned"] } },
    select: { items: true },
  });
  const tally = new Map<string, number>();
  for (const o of orders) {
    const items = (o.items as unknown as OrderItem[]) ?? [];
    for (const it of items) {
      if (!it?.name) continue;
      tally.set(it.name, (tally.get(it.name) ?? 0) + (it.qty ?? 0));
    }
  }
  return [...tally.entries()]
    .map(([name, units]) => ({ name, units }))
    .sort((a, b) => b.units - a.units)
    .slice(0, limit);
}

/* ---------- contact messages ---------- */

export type ContactMessageDTO = {
  id: string;
  name: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export async function createContactMessage(data: {
  name: string;
  phone: string;
  message: string;
}): Promise<ContactMessageDTO> {
  const m = await prisma.contactMessage.create({ data });
  return {
    id: m.id,
    name: m.name,
    phone: m.phone,
    message: m.message,
    read: m.read,
    createdAt: m.createdAt.toISOString(),
  };
}

export async function getMessages(): Promise<ContactMessageDTO[]> {
  const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((m) => ({
    id: m.id,
    name: m.name,
    phone: m.phone,
    message: m.message,
    read: m.read,
    createdAt: m.createdAt.toISOString(),
  }));
}

export async function markMessageRead(id: string) {
  return prisma.contactMessage.update({ where: { id }, data: { read: true } });
}

/* ---------- admin notifications ---------- */

export type AdminNotifications = {
  pendingCount: number;
  lowStockCount: number;
  unreadMessagesCount: number;
  maintenanceDueCount: number;
  pendingOrders: { id: string; customerName: string; total: number; createdAt: string }[];
  lowStock: { id: string; name: string; stock: number }[];
  messages: { id: string; name: string; message: string; createdAt: string }[];
  maintenance: { id: string; name: string; dueAt: string }[];
};

export async function getAdminNotifications(): Promise<AdminNotifications> {
  const dueLimit = new Date();
  dueLimit.setDate(dueLimit.getDate() + 14);
  const [pendingCount, pending, low, unreadMessagesCount, msgs, maintCount, maint] =
    await Promise.all([
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.findMany({ where: { status: "pending" }, orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.product.findMany({ where: { inStock: true, stock: { lte: 5 } }, orderBy: { stock: "asc" }, take: 8 }),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.contactMessage.findMany({ where: { read: false }, orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.order.count({
        where: { status: "installed", kind: "install", nextMaintenanceAt: { lte: dueLimit } },
      }),
      prisma.order.findMany({
        where: { status: "installed", kind: "install", nextMaintenanceAt: { lte: dueLimit } },
        orderBy: { nextMaintenanceAt: "asc" },
        take: 8,
      }),
    ]);
  return {
    pendingCount,
    lowStockCount: low.length,
    unreadMessagesCount,
    maintenanceDueCount: maintCount,
    pendingOrders: pending.map((o) => ({
      id: o.id,
      customerName: o.customerName,
      total: o.total,
      createdAt: o.createdAt.toISOString(),
    })),
    lowStock: low.map((p) => ({ id: p.id, name: p.name, stock: p.stock })),
    messages: msgs.map((m) => ({
      id: m.id,
      name: m.name,
      message: m.message,
      createdAt: m.createdAt.toISOString(),
    })),
    maintenance: maint.map((o) => ({
      id: o.id,
      name: o.customerName,
      dueAt: o.nextMaintenanceAt ? o.nextMaintenanceAt.toISOString() : "",
    })),
  };
}

/* ---------- product writes ---------- */

export type ProductInput = {
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  stages?: number | null;
  capacity?: string | null;
  warranty?: string | null;
  badges: string[];
  inStock: boolean;
  stock: number;
  bestSeller?: boolean;
  hue: number;
  images: string[];
  features: string[];
  specs: Spec[];
};

function toData(input: ProductInput) {
  return {
    slug: input.slug,
    name: input.name,
    categorySlug: input.categorySlug,
    shortDescription: input.shortDescription,
    description: input.description,
    price: input.price,
    oldPrice: input.oldPrice ?? null,
    stages: input.stages ?? null,
    capacity: input.capacity ?? null,
    warranty: input.warranty ?? null,
    badges: input.badges,
    inStock: input.inStock,
    stock: input.stock,
    bestSeller: input.bestSeller ?? false,
    hue: input.hue,
    images: input.images,
    features: input.features,
    specs: input.specs as unknown as object,
  };
}

export async function createProduct(input: ProductInput) {
  return prisma.product.create({ data: toData(input) });
}

export async function updateProduct(id: string, input: ProductInput) {
  return prisma.product.update({ where: { id }, data: toData(input) });
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } });
}

/* ---------- order writes ---------- */

function pickVariantDelta(variantsJson: unknown, label?: string): number {
  if (!label || !variantsJson) return 0;
  const arr = variantsJson as ProductVariant[];
  if (!Array.isArray(arr)) return 0;
  return arr.find((v) => v.label === label)?.priceDelta ?? 0;
}

/**
 * Creates an order. Prices, delivery and total are recomputed SERVER-SIDE
 * from the database — the client's numbers are never trusted. Validates
 * input, generates a collision-proof id, and decrements stock.
 */
export async function createOrder(data: {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
  items: { productId: string; qty: number; variantLabel?: string }[];
  source?: "web" | "phone";
}): Promise<Order> {
  // validation
  const name = (data.customerName ?? "").trim();
  const phone = (data.phone ?? "").replace(/\s/g, "");
  const city = (data.city ?? "").trim();
  const address = (data.address ?? "").trim();
  if (name.length < 3 || name.length > 60) throw new Error("INVALID_NAME");
  if (!/^0[5-7]\d{8}$/.test(phone)) throw new Error("INVALID_PHONE");
  if (city.length < 2) throw new Error("INVALID_CITY");
  if (address.length < 6) throw new Error("INVALID_ADDRESS");
  if (!Array.isArray(data.items) || data.items.length === 0 || data.items.length > 50)
    throw new Error("INVALID_ITEMS");

  // recompute from DB (never trust client prices/total)
  const ids = [...new Set(data.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const orderItems: OrderItem[] = [];
  let subtotal = 0;
  for (const it of data.items) {
    const p = byId.get(it.productId);
    if (!p) throw new Error("PRODUCT_NOT_FOUND");
    const qty = Math.max(1, Math.min(99, Math.floor(Number(it.qty) || 1)));
    const unit = p.price + pickVariantDelta(p.variants, it.variantLabel);
    subtotal += unit * qty;
    orderItems.push({
      name: p.name,
      qty,
      price: unit,
      variantLabel: it.variantLabel,
      productId: p.id,
    });
  }

  const settings = await getSettings();
  const delivery = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const total = subtotal + delivery;

  // aggregate quantity per product (handles the same product appearing twice)
  const qtyByProduct = new Map<string, number>();
  for (const it of orderItems) {
    if (it.productId)
      qtyByProduct.set(it.productId, (qtyByProduct.get(it.productId) ?? 0) + it.qty);
  }

  // ATOMIC: guard stock (prevents overselling/negative stock), reserve a
  // collision-proof id, and create the order — all in one transaction.
  const row = await prisma.$transaction(async (tx) => {
    // Ensure the order-number sequence exists in the SAME session as nextval
    // (safe with pooled/PgBouncer connections).
    await tx.$executeRawUnsafe(`CREATE SEQUENCE IF NOT EXISTS order_seq START 1`);
    for (const [pid, qty] of qtyByProduct) {
      const res = await tx.product.updateMany({
        where: { id: pid, stock: { gte: qty } },
        data: { stock: { decrement: qty } },
      });
      if (res.count !== 1) throw new Error("OUT_OF_STOCK");
    }
    const seqRows = await tx.$queryRawUnsafe<{ n: number }[]>(
      `SELECT nextval('order_seq')::int AS n`,
    );
    if (!seqRows?.[0]) throw new Error("ID_GENERATION_FAILED");
    const id = "FM-" + (2000 + seqRows[0].n);
    return tx.order.create({
      data: {
        id,
        customerName: name,
        phone,
        city,
        address,
        note: data.note?.trim() || null,
        items: orderItems as unknown as object,
        total,
        status: "pending",
        source: data.source === "phone" ? "phone" : "web",
      },
    });
  });

  return toOrder(row);
}

const STOCK_RELEASING = new Set(["cancelled", "returned"]);

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  confirmationNote?: string,
) {
  const noteData = confirmationNote !== undefined ? { confirmationNote } : {};
  const current = await prisma.order.findUnique({ where: { id } });

  // Restore stock when an install order is cancelled/returned (it reserved stock at creation).
  const restore =
    current &&
    current.kind === "install" &&
    STOCK_RELEASING.has(status) &&
    !STOCK_RELEASING.has(current.status);

  if (!restore) {
    return prisma.order.update({ where: { id }, data: { status, ...noteData } });
  }

  const items = (current!.items as unknown as OrderItem[]) ?? [];
  const qtyByProduct = new Map<string, number>();
  for (const it of items) {
    if (it.productId) qtyByProduct.set(it.productId, (qtyByProduct.get(it.productId) ?? 0) + it.qty);
  }
  return prisma.$transaction(async (tx) => {
    for (const [pid, qty] of qtyByProduct) {
      await tx.product.updateMany({ where: { id: pid }, data: { stock: { increment: qty } } });
    }
    return tx.order.update({ where: { id }, data: { status, ...noteData } });
  });
}

/* ---------- confirmation + installation flow ---------- */

/** Orders awaiting a confirmation call (newest first). */
export async function getOrdersToConfirm(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toOrder);
}

/**
 * Confirmateur confirms an order: records the call, schedules the install,
 * and assigns it to the plombier. Returns the updated order.
 */
export async function confirmOrder(
  id: string,
  data: { installDate: Date; assignedTo: string | null; note?: string },
): Promise<Order> {
  // Atomic: only a still-pending order can be confirmed (can't re-confirm a
  // cancelled/installed order, even under a double-submit race).
  const upd = await prisma.order.updateMany({
    where: { id, status: "pending" },
    data: {
      status: "confirmed",
      confirmedAt: new Date(),
      installDate: data.installDate,
      assignedTo: data.assignedTo,
      lastOutcome: "confirmed",
      ...(data.note !== undefined ? { confirmationNote: data.note } : {}),
    },
  });
  if (upd.count !== 1) throw new Error("NOT_PENDING");
  const row = await prisma.order.findUnique({ where: { id } });
  return toOrder(row!);
}

/** Installations assigned to a given plombier (by email) still to do, upcoming first. */
export async function getPlombierJobs(email: string): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { assignedTo: email, status: "confirmed" },
    orderBy: { installDate: "asc" },
  });
  return rows.map(toOrder);
}

/** Confirmed (scheduled) install orders — for the confirmateur to view / cancel. */
export async function getConfirmedOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { status: "confirmed", kind: "install" },
    orderBy: { installDate: "asc" },
  });
  return rows.map(toOrder);
}

/** All installations still to do (admin oversight view), upcoming first. */
export async function getActiveInstalls(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { status: "confirmed" },
    orderBy: { installDate: "asc" },
  });
  return rows.map(toOrder);
}

/** All plombier accounts (for the confirmateur's assignment dropdown). */
export async function getPlombiers(): Promise<{ email: string; name: string | null; city: string | null }[]> {
  return prisma.adminUser.findMany({
    where: { role: "plombier" },
    select: { email: true, name: true, city: true },
    orderBy: { createdAt: "asc" },
  });
}

/* ---------- staff notifications (bell) ---------- */

export type StaffNotif = {
  count: number;
  items: { id: string; title: string; subtitle: string; href: string }[];
};

/** Confirmateur bell: orders waiting to be confirmed. */
export async function getConfirmationNotifications(): Promise<StaffNotif> {
  const [count, rows] = await Promise.all([
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.findMany({ where: { status: "pending" }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  return {
    count,
    items: rows.map((o) => ({
      id: o.id,
      title: `${o.id} · ${o.customerName}`,
      subtitle: o.city,
      href: "/confirmation",
    })),
  };
}

/** Plombier bell: installations to do (his own, or all when viewed by an admin). */
export async function getPlombierNotifications(email: string | null, all: boolean): Promise<StaffNotif> {
  const where = all
    ? { status: "confirmed" as const }
    : { status: "confirmed" as const, assignedTo: email ?? "__none__" };
  const [count, rows] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({ where, orderBy: { installDate: "asc" }, take: 8 }),
  ]);
  return {
    count,
    items: rows.map((o) => ({
      id: o.id,
      title: `${o.id} · ${o.customerName}`,
      subtitle: o.installDate
        ? new Date(o.installDate).toLocaleDateString("fr-MA", { timeZone: "Africa/Casablanca" })
        : "à planifier",
      href: "/plombier",
    })),
  };
}

/**
 * Plombier marks a job done with a photo.
 * - An installation starts the maintenance clock (completion + interval).
 * - A maintenance visit restarts the parent installation's clock instead.
 */
export async function completeInstallation(id: string, photoUrl: string): Promise<Order> {
  const now = new Date();
  return prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { id } });
    if (!existing) throw new Error("NOT_FOUND");

    const data: {
      status: string;
      completedAt: Date;
      photoUrl: string;
      nextMaintenanceAt?: Date;
    } = { status: "installed", completedAt: now, photoUrl };
    if (existing.kind !== "maintenance") {
      data.nextMaintenanceAt = addMonths(now, existing.maintenanceMonths ?? 6);
    }

    // Atomic guard: only a still-confirmed job can be completed (blocks double-completion).
    const upd = await tx.order.updateMany({ where: { id, status: "confirmed" }, data });
    if (upd.count !== 1) throw new Error("NOT_CONFIRMED");

    // A completed maintenance visit restarts the original installation's clock.
    if (existing.kind === "maintenance" && existing.parentOrderId) {
      const parent = await tx.order.findUnique({ where: { id: existing.parentOrderId } });
      if (parent) {
        await tx.order.update({
          where: { id: parent.id },
          data: { lastMaintenanceAt: now, nextMaintenanceAt: addMonths(now, parent.maintenanceMonths) },
        });
      }
    }
    const row = await tx.order.findUnique({ where: { id } });
    return toOrder(row!);
  });
}

/* ---------- after-sales: installations + maintenance (Phase 3) ---------- */

/** All completed installations (the "Suivi client" list), maintenance-due first. */
export async function getInstallations(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    where: { status: "installed", kind: "install" },
    orderBy: { nextMaintenanceAt: "asc" },
  });
  return rows.map(toOrder);
}

/** Installations whose maintenance is due within `days` (default 14) or overdue. */
export async function getMaintenanceDue(days = 14): Promise<Order[]> {
  const limit = new Date();
  limit.setDate(limit.getDate() + days);
  const rows = await prisma.order.findMany({
    where: { status: "installed", kind: "install", nextMaintenanceAt: { lte: limit } },
    orderBy: { nextMaintenanceAt: "asc" },
    take: 12,
  });
  return rows.map(toOrder);
}

/** Admin: change the maintenance interval for an installation and recompute the due date. */
export async function setMaintenanceInterval(id: string, months: number): Promise<Order> {
  const o = await prisma.order.findUnique({ where: { id } });
  if (!o) throw new Error("NOT_FOUND");
  const base = o.lastMaintenanceAt ?? o.completedAt ?? o.createdAt;
  const row = await prisma.order.update({
    where: { id },
    data: { maintenanceMonths: months, nextMaintenanceAt: addMonths(base, months) },
  });
  return toOrder(row);
}

/** Admin: mark a maintenance as done manually (restarts the clock, no visit record). */
export async function markMaintenanceDone(id: string): Promise<Order> {
  const o = await prisma.order.findUnique({ where: { id } });
  if (!o) throw new Error("NOT_FOUND");
  const now = new Date();
  const row = await prisma.order.update({
    where: { id },
    data: { lastMaintenanceAt: now, nextMaintenanceAt: addMonths(now, o.maintenanceMonths) },
  });
  return toOrder(row);
}

/** Admin: schedule a maintenance VISIT — a new work order the plombier will see + complete. */
export async function createMaintenanceVisit(
  parentId: string,
  opts: { installDate: Date; assignedTo: string | null },
): Promise<Order> {
  const parent = await prisma.order.findUnique({ where: { id: parentId } });
  if (!parent) throw new Error("PARENT_NOT_FOUND");

  // All three writes (sequence id, the visit, the parent's pushed-forward due date)
  // run in one transaction/session — safe under pooled (PgBouncer) connections.
  const row = await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`CREATE SEQUENCE IF NOT EXISTS order_seq START 1`);
    const seq = await tx.$queryRawUnsafe<{ n: number }[]>(`SELECT nextval('order_seq')::int AS n`);
    if (!seq?.[0]) throw new Error("ID_GENERATION_FAILED");
    const id = "FM-" + (2000 + seq[0].n);
    const created = await tx.order.create({
      data: {
        id,
        customerName: parent.customerName,
        phone: parent.phone,
        city: parent.city,
        address: parent.address,
        note: "Visite d'entretien (changement de filtre)",
        items: (parent.items as unknown as object) ?? [],
        total: 0,
        status: "confirmed",
        kind: "maintenance",
        parentOrderId: parent.id,
        assignedTo: opts.assignedTo,
        installDate: opts.installDate,
        source: "web",
      },
    });
    // Push the parent's due date forward so it leaves the "à prévoir" list while the
    // visit is scheduled. Completing the visit recomputes it precisely (see completeInstallation).
    await tx.order.update({
      where: { id: parent.id },
      data: { nextMaintenanceAt: addMonths(opts.installDate, parent.maintenanceMonths) },
    });
    return created;
  });
  return toOrder(row);
}

/** Plombier advances his progress on a job: "enroute" | "arrived". */
export async function setJobStage(id: string, stage: "enroute" | "arrived"): Promise<Order> {
  const row = await prisma.order.update({ where: { id }, data: { installStage: stage } });
  return toOrder(row);
}

/** Emails of all confirmateur accounts (to alert on new orders). */
export async function getConfirmateurEmails(): Promise<string[]> {
  const rows = await prisma.adminUser.findMany({
    where: { role: "confirmateur" },
    select: { email: true },
  });
  return rows.map((r) => r.email);
}

/* ---------- staff (admin users) ---------- */

export type StaffUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  city: string | null;
  createdAt: string;
};

export async function getStaffUsers(): Promise<StaffUser[]> {
  const rows = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    city: u.city,
    createdAt: u.createdAt.toISOString(),
  }));
}

/** The single plombier's email, used to auto-assign installations. */
export async function getPlombierEmail(): Promise<string | null> {
  const p = await prisma.adminUser.findFirst({
    where: { role: "plombier" },
    orderBy: { createdAt: "asc" },
  });
  return p?.email ?? null;
}

/* ---------- site settings ---------- */

export type SiteSettings = {
  siteName: string;
  logoUrl: string | null;
  phone1: string;
  phone2: string | null;
  email: string | null;
  whatsapp: string | null;
  addressText: string | null;
  mapLat: number | null;
  mapLng: number | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  announcement: string | null;
  freeDeliveryThreshold: number;
  deliveryFee: number;
};

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Filtre Maroc",
  logoUrl: "/logo.jpeg",
  phone1: "0660781919",
  phone2: "0664302923",
  email: "filter.water.maoc@gmail.com",
  whatsapp: "212660781919",
  addressText: "Agadir, Maroc",
  mapLat: 30.4144656,
  mapLng: -9.5671467,
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  announcement: null,
  freeDeliveryThreshold: 1000,
  deliveryFee: 40,
};

export async function getSettings(): Promise<SiteSettings> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  if (!row) return DEFAULT_SETTINGS;
  return {
    siteName: row.siteName,
    logoUrl: row.logoUrl,
    phone1: row.phone1 || DEFAULT_SETTINGS.phone1,
    phone2: row.phone2,
    email: row.email,
    whatsapp: row.whatsapp,
    addressText: row.addressText,
    mapLat: row.mapLat,
    mapLng: row.mapLng,
    facebook: row.facebook,
    instagram: row.instagram,
    tiktok: row.tiktok,
    announcement: row.announcement,
    freeDeliveryThreshold: row.freeDeliveryThreshold,
    deliveryFee: row.deliveryFee ?? DEFAULT_SETTINGS.deliveryFee,
  };
}

export async function updateSettings(data: Partial<SiteSettings>) {
  return prisma.siteSettings.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...DEFAULT_SETTINGS, ...data },
  });
}
