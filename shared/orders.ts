import { pgTable, serial, integer, text, timestamp, doublePrecision, boolean } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  status: text('status').default('pending'), // pending | paid | failed | refunded
  paymentMethod: text('payment_method').notNull(),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  total: doublePrecision('total').notNull(),
})

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull(),
  artworkId: integer('artwork_id').notNull(),
  title: text('title').notNull(),
  price: doublePrecision('price').notNull(),
  quantity: integer('quantity').notNull().default(1),
})

export const insertOrderSchema = createInsertSchema(orders).pick({
  status: true,
  paymentMethod: true,
  customerName: true,
  customerEmail: true,
  total: true,
})

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  artworkId: true,
  title: true,
  price: true,
  quantity: true,
})

export type InsertOrder = z.infer<typeof insertOrderSchema>
export type Order = typeof orders.$inferSelect
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>
export type OrderItem = typeof orderItems.$inferSelect