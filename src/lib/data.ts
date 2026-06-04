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
    createdAt: row.createdAt.toISOString(),
  };
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

export async function getDashboardStats() {
  const [total, pending, products, paid] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.product.count(),
    prisma.order.findMany({
      where: { status: { in: ["confirmed", "shipped", "delivered"] } },
      select: { total: true },
    }),
  ]);
  return {
    total,
    pending,
    products,
    revenue: paid.reduce((s, o) => s + o.total, 0),
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

/** Best-selling products by units sold, aggregated from real order items. */
export async function getTopSellers(limit = 5): Promise<TopSeller[]> {
  const orders = await prisma.order.findMany({ select: { items: true } });
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
  pendingOrders: { id: string; customerName: string; total: number; createdAt: string }[];
  lowStock: { id: string; name: string; stock: number }[];
  messages: { id: string; name: string; message: string; createdAt: string }[];
};

export async function getAdminNotifications(): Promise<AdminNotifications> {
  const [pendingCount, pending, low, unreadMessagesCount, msgs] = await Promise.all([
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.findMany({ where: { status: "pending" }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.product.findMany({ where: { inStock: true, stock: { lte: 5 } }, orderBy: { stock: "asc" }, take: 8 }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.findMany({ where: { read: false }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);
  return {
    pendingCount,
    lowStockCount: low.length,
    unreadMessagesCount,
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

const DELIVERY_FEE = 40;

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
  const delivery = subtotal >= settings.freeDeliveryThreshold ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  // aggregate quantity per product (handles the same product appearing twice)
  const qtyByProduct = new Map<string, number>();
  for (const it of orderItems) {
    if (it.productId)
      qtyByProduct.set(it.productId, (qtyByProduct.get(it.productId) ?? 0) + it.qty);
  }

  // ensure the order-number sequence exists (idempotent)
  await prisma.$executeRawUnsafe(`CREATE SEQUENCE IF NOT EXISTS order_seq START 1`);

  // ATOMIC: guard stock (prevents overselling/negative stock), reserve a
  // collision-proof id, and create the order — all in one transaction.
  const row = await prisma.$transaction(async (tx) => {
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
      },
    });
  });

  return toOrder(row);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  confirmationNote?: string,
) {
  return prisma.order.update({
    where: { id },
    data: { status, ...(confirmationNote !== undefined ? { confirmationNote } : {}) },
  });
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
  };
}

export async function updateSettings(data: Partial<SiteSettings>) {
  return prisma.siteSettings.upsert({
    where: { id: "main" },
    update: data,
    create: { id: "main", ...DEFAULT_SETTINGS, ...data },
  });
}
