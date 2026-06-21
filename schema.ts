import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table for user management
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("viewer"), // admin, analyst, viewer
  passwordHash: text("password_hash"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastLogin: integer("last_login", { mode: "timestamp" }),
  loginAttempts: integer("login_attempts").notNull().default(0),
  lockedUntil: integer("locked_until", { mode: "timestamp" }),
  createdBy: integer("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// OTP codes table for two-factor authentication
export const otpCodes = sqliteTable("otp_codes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  code: text("code").notNull(),
  type: text("type").notNull().default("login"), // login, password_reset
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  usedAt: integer("used_at", { mode: "timestamp" }),
  attempts: integer("attempts").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Transactions table for fraud detection
export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  transactionId: text("transaction_id").notNull().unique(),
  step: integer("step").notNull(),
  amount: real("amount").notNull(),
  nameOrig: text("name_orig"),
  oldBalanceOrig: real("old_balance_orig"),
  newBalanceOrig: real("new_balance_orig"),
  nameDest: text("name_dest"),
  oldBalanceDest: real("old_balance_dest"),
  newBalanceDest: real("new_balance_dest"),
  type: text("type"),
  isFraud: integer("is_fraud", { mode: "boolean" }),
  fraudScore: real("fraud_score"),
  riskLevel: text("risk_level"), // low, medium, high, critical
  vendor: text("vendor"),
  region: text("region"),
  isReviewed: integer("is_reviewed", { mode: "boolean" }).notNull().default(false),
  isEscalated: integer("is_escalated", { mode: "boolean" }).notNull().default(false),
  processedAt: integer("processed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Admin logs for auditing
export const adminLogs = sqliteTable("admin_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adminId: integer("admin_id").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type"), // user, transaction, system
  targetId: text("target_id"),
  details: text("details"), // JSON string with additional details
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Datasets table for uploaded CSV files
export const datasets = sqliteTable("datasets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  rowCount: integer("row_count").notNull(),
  fraudCount: integer("fraud_count").notNull(),
  processedAt: integer("processed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
