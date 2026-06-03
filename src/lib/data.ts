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

export async function createOrder(data: {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  note?: string;
  items: OrderItem[];
  total: number;
}): Promise<Order> {
  const count = await prisma.order.count();
  const id = "FM-" + (2001 + count);
  const row = await prisma.order.create({
    data: {
      id,
      customerName: data.customerName,
      phone: data.phone,
      city: data.city,
      address: data.address,
      note: data.note ?? null,
      items: data.items as unknown as object,
      total: data.total,
      status: "pending",
    },
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
