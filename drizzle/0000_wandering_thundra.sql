CREATE TYPE "public"."account_type" AS ENUM('email', 'api-key');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_type" "account_type" NOT NULL,
	"type" text NOT NULL,
	"email" text,
	"password" text,
	"totp_secret" text,
	"recovery_email" text,
	"provider" text,
	"api_key" text,
	"api_account" text,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_providers" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"color" text NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "login_types" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"color" text NOT NULL,
	"created_at" bigint NOT NULL
);
