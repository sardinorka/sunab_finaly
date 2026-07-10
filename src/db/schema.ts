import { pgTable, serial, text, integer, boolean, jsonb, timestamp, decimal } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  comparePrice: decimal("compare_price", { precision: 12, scale: 2 }),
  image: text("image").notNull(),
  gallery: jsonb("gallery").$type<string[]>().default([]).notNull(),
  category: text("category").notNull(),
  material: text("material"),
  dimensions: text("dimensions"),
  capacity: text("capacity"),
  features: jsonb("features").$type<string[]>().default([]).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  stock: integer("stock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  authorRole: text("author_role").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analytics: one row per pageview for the admin SEO dashboard
export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  country: text("country"),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Settings: simple key/value store for SEO & site configuration
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders table for the native SUNAB platform
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  paymentMethod: text("payment_method").notNull(),
  note: text("note"),
  items: jsonb("items").$type<
    { productId: string | number; name: string; slug: string; image: string; price: string; quantity: number }[]
  >().notNull(),
  total: decimal("total", { precision: 14, scale: 2 }).notNull(),
  status: text("status").default("pending").notNull(), // pending, processing, shipped, completed, cancelled
  source: text("source").default("platform").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blog posts table for SEO-optimized content
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  authorName: text("author_name").notNull().default("تیم سوناب"),
  authorAvatar: text("author_avatar"),
  readTime: integer("read_time").default(5).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
