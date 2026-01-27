import { pgTable, text, bigint, pgEnum } from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", ["email", "api-key"]);

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountType: accountTypeEnum("account_type").notNull(),
  type: text("type").notNull(),
  email: text("email"),
  password: text("password"),
  totpSecret: text("totp_secret"),
  recoveryEmail: text("recovery_email"),
  provider: text("provider"),
  apiKey: text("api_key"),
  apiAccount: text("api_account"),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
});

export const loginTypes = pgTable("login_types", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  color: text("color").notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export const apiProviders = pgTable("api_providers", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  color: text("color").notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

export type DbAccount = typeof accounts.$inferSelect;
export type NewDbAccount = typeof accounts.$inferInsert;
export type DbLoginType = typeof loginTypes.$inferSelect;
export type NewDbLoginType = typeof loginTypes.$inferInsert;
export type DbApiProvider = typeof apiProviders.$inferSelect;
export type NewDbApiProvider = typeof apiProviders.$inferInsert;
