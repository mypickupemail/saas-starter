-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER', 'OWNER');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'INCOMPLETE', 'INCOMPLETE_EXPIRED', 'PAST_DUE', 'CANCELED', 'UNPAID', 'PAUSED');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'API_ACCESS');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL_TRANSACTIONAL', 'IN_APP_ALERT', 'ANNOUNCEMENT', 'SYSTEM_MESSAGE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SUBSCRIPTION_PAYMENT', 'ONE_TIME_PRODUCT', 'CREDIT_PURCHASE', 'REFUND', 'MANUAL_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "ModelProvider" AS ENUM ('OPENAI', 'GOOGLE', 'ANTHROPIC', 'DEEPSEEK', 'MISTRAL', 'ELEVENLABS', 'SUNOAI', 'STABILITYAI');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('AUDIO', 'IMAGE', 'VIDEO', 'TEXT_DOCUMENT', 'FILE');

-- CreateTable
CREATE TABLE "ai_models" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "provider" "ModelProvider" NOT NULL,
    "model_identifier" VARCHAR(255) NOT NULL,
    "capabilities" TEXT[],
    "input_price_per_million_tokens" DOUBLE PRECISION,
    "output_price_per_million_tokens" DOUBLE PRECISION,
    "access_level" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "teamId" TEXT,
    "userId" TEXT,
    "service_name" VARCHAR(100) NOT NULL,
    "hashed_key" TEXT NOT NULL,
    "key_prefix" VARCHAR(10),
    "description" TEXT,
    "scopes" TEXT[],
    "expires_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "title" VARCHAR(255),
    "context" TEXT,
    "metadata" JSONB,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "sender_type" VARCHAR(50) NOT NULL,
    "modelId" TEXT,
    "reply_to_message_id" TEXT,
    "cost" DOUBLE PRECISION DEFAULT 0,
    "token_count" INTEGER,
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "sequence" INTEGER NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_items" (
    "id" TEXT NOT NULL,
    "messageId" TEXT,
    "userId" TEXT,
    "teamId" TEXT,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "storage_key" TEXT,
    "content_type" VARCHAR(100) NOT NULL,
    "size_bytes" INTEGER,
    "file_name" VARCHAR(255),
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "monthly_price" DOUBLE PRECISION,
    "yearly_price" DOUBLE PRECISION,
    "trial_days" INTEGER DEFAULT 0,
    "stripe_product_id" VARCHAR(255),
    "stripe_monthly_price_id" VARCHAR(255),
    "stripe_yearly_price_id" VARCHAR(255),
    "max_team_members" INTEGER,
    "daily_credits" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "stripe_subscription_id" VARCHAR(255),
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "trial_ends_at" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "canceled_at" TIMESTAMP(3),
    "ended_at" TIMESTAMP(3),
    "current_credits" DOUBLE PRECISION,
    "last_credit_reset_at" TIMESTAMP(3),
    "next_credit_reset_at" TIMESTAMP(3),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "type" "TransactionType" NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'usd',
    "description" TEXT,
    "stripe_payment_intent_id" VARCHAR(255),
    "stripe_charge_id" VARCHAR(255),
    "stripe_invoice_id" VARCHAR(255),
    "related_subscription_id" TEXT,
    "metadata" JSONB,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "display_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_features" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "limit" VARCHAR(255),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "recipient_user_id" TEXT,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(255),
    "content" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "link" TEXT,
    "audience_type" VARCHAR(50),
    "published_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "modelId" TEXT,
    "feature_key" VARCHAR(100),
    "operation" VARCHAR(100) NOT NULL,
    "token_count_in" INTEGER,
    "token_count_out" INTEGER,
    "cost" DOUBLE PRECISION,
    "duration_ms" INTEGER,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "teamId" TEXT,
    "service_name" VARCHAR(100) NOT NULL,
    "operation" VARCHAR(100),
    "error_code" VARCHAR(50),
    "message" TEXT NOT NULL,
    "stack_trace" TEXT,
    "metadata" JSONB,
    "severity" VARCHAR(50) NOT NULL DEFAULT 'error',
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "resolved_by_user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "teamId" TEXT,
    "userId" TEXT,
    "action" VARCHAR(255) NOT NULL,
    "target_id" VARCHAR(255),
    "target_type" VARCHAR(100),
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" VARCHAR(45),

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitations" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL,
    "invitedById" TEXT NOT NULL,
    "invited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',

    CONSTRAINT "invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "ownerId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "stripe_customer_id" VARCHAR(255),

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "email_verified_at" TIMESTAMP(3),
    "image" VARCHAR(255),
    "password_hash" VARCHAR(255),
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "stripe_customer_id" VARCHAR(255),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" VARCHAR(50),
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_models_name_key" ON "ai_models"("name");

-- CreateIndex
CREATE INDEX "api_keys_service_name_is_active_idx" ON "api_keys"("service_name", "is_active");

-- CreateIndex
CREATE INDEX "api_keys_teamId_idx" ON "api_keys"("teamId");

-- CreateIndex
CREATE INDEX "api_keys_userId_idx" ON "api_keys"("userId");

-- CreateIndex
CREATE INDEX "chats_userId_idx" ON "chats"("userId");

-- CreateIndex
CREATE INDEX "chats_teamId_idx" ON "chats"("teamId");

-- CreateIndex
CREATE INDEX "chats_updated_at_idx" ON "chats"("updated_at");

-- CreateIndex
CREATE INDEX "messages_chatId_idx" ON "messages"("chatId");

-- CreateIndex
CREATE INDEX "messages_userId_idx" ON "messages"("userId");

-- CreateIndex
CREATE INDEX "messages_modelId_idx" ON "messages"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "messages_chatId_sequence_key" ON "messages"("chatId", "sequence");

-- CreateIndex
CREATE INDEX "media_items_messageId_idx" ON "media_items"("messageId");

-- CreateIndex
CREATE INDEX "media_items_userId_idx" ON "media_items"("userId");

-- CreateIndex
CREATE INDEX "media_items_teamId_idx" ON "media_items"("teamId");

-- CreateIndex
CREATE INDEX "media_items_type_idx" ON "media_items"("type");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_key" ON "subscription_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_stripe_product_id_key" ON "subscription_plans"("stripe_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_stripe_monthly_price_id_key" ON "subscription_plans"("stripe_monthly_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_stripe_yearly_price_id_key" ON "subscription_plans"("stripe_yearly_price_id");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_teamId_key" ON "subscriptions"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_key" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "subscriptions_userId_idx" ON "subscriptions"("userId");

-- CreateIndex
CREATE INDEX "subscriptions_teamId_idx" ON "subscriptions"("teamId");

-- CreateIndex
CREATE INDEX "subscriptions_planId_idx" ON "subscriptions"("planId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- CreateIndex
CREATE INDEX "subscriptions_stripe_subscription_id_idx" ON "subscriptions"("stripe_subscription_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_stripe_payment_intent_id_key" ON "transactions"("stripe_payment_intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_stripe_charge_id_key" ON "transactions"("stripe_charge_id");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_teamId_idx" ON "transactions"("teamId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_stripe_payment_intent_id_idx" ON "transactions"("stripe_payment_intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "features_key_key" ON "features"("key");

-- CreateIndex
CREATE UNIQUE INDEX "plan_features_planId_featureId_key" ON "plan_features"("planId", "featureId");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_hash_key" ON "tokens"("token_hash");

-- CreateIndex
CREATE INDEX "tokens_userId_type_idx" ON "tokens"("userId", "type");

-- CreateIndex
CREATE INDEX "tokens_expires_at_idx" ON "tokens"("expires_at");

-- CreateIndex
CREATE INDEX "notifications_recipient_user_id_idx" ON "notifications"("recipient_user_id");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "notifications_published_at_expires_at_idx" ON "notifications"("published_at", "expires_at");

-- CreateIndex
CREATE INDEX "usage_logs_userId_idx" ON "usage_logs"("userId");

-- CreateIndex
CREATE INDEX "usage_logs_teamId_idx" ON "usage_logs"("teamId");

-- CreateIndex
CREATE INDEX "usage_logs_modelId_idx" ON "usage_logs"("modelId");

-- CreateIndex
CREATE INDEX "usage_logs_feature_key_idx" ON "usage_logs"("feature_key");

-- CreateIndex
CREATE INDEX "usage_logs_operation_idx" ON "usage_logs"("operation");

-- CreateIndex
CREATE INDEX "usage_logs_created_at_idx" ON "usage_logs"("created_at");

-- CreateIndex
CREATE INDEX "error_logs_userId_idx" ON "error_logs"("userId");

-- CreateIndex
CREATE INDEX "error_logs_teamId_idx" ON "error_logs"("teamId");

-- CreateIndex
CREATE INDEX "error_logs_service_name_idx" ON "error_logs"("service_name");

-- CreateIndex
CREATE INDEX "error_logs_severity_idx" ON "error_logs"("severity");

-- CreateIndex
CREATE INDEX "error_logs_resolved_idx" ON "error_logs"("resolved");

-- CreateIndex
CREATE INDEX "activity_logs_teamId_idx" ON "activity_logs"("teamId");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_target_id_target_type_idx" ON "activity_logs"("target_id", "target_type");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_userId_teamId_key" ON "team_members"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_stripe_customer_id_key" ON "teams"("stripe_customer_id");

-- CreateIndex
CREATE INDEX "teams_ownerId_idx" ON "teams"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripe_customer_id_key" ON "users"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ai_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_items" ADD CONSTRAINT "media_items_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_user_id_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ai_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_logs" ADD CONSTRAINT "error_logs_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
