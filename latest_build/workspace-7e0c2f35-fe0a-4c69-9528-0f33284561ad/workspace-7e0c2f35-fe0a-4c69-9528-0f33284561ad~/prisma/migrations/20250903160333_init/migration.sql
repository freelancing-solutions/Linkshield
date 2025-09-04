-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "plan" TEXT NOT NULL DEFAULT 'free',
    "checks_used_this_month" INTEGER NOT NULL DEFAULT 0,
    "ai_analyses_used_this_month" INTEGER NOT NULL DEFAULT 0,
    "plan_expires_at" TIMESTAMP(3),
    "stripe_customer_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checks" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "url" TEXT NOT NULL,
    "urlHash" TEXT NOT NULL,
    "statusCode" INTEGER,
    "responseTimeMs" INTEGER,
    "sslValid" BOOLEAN,
    "redirectChain" TEXT,
    "metaData" TEXT,
    "securityScore" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "ogImageUrl" TEXT,
    "customTitle" TEXT,
    "customDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ai_analyses" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "checkId" TEXT,
    "url" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "contentSummary" TEXT,
    "contentEmbedding" TEXT,
    "qualityMetrics" TEXT,
    "topicCategories" TEXT,
    "keywordDensity" TEXT,
    "contentLength" INTEGER,
    "language" TEXT,
    "processingStatus" TEXT NOT NULL DEFAULT 'pending',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."similar_pages" (
    "id" TEXT NOT NULL,
    "sourceAnalysisId" TEXT NOT NULL,
    "targetAnalysisId" TEXT NOT NULL,
    "similarityScore" DOUBLE PRECISION NOT NULL,
    "similarityType" TEXT NOT NULL,
    "comparisonMetadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "similar_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "checksPerMonth" INTEGER NOT NULL,
    "aiAnalysesPerMonth" INTEGER NOT NULL,
    "priceMonthly" INTEGER,
    "features" TEXT,
    "stripePriceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."report_views" (
    "id" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "viewerIp" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."share_events" (
    "id" TEXT NOT NULL,
    "checkId" TEXT NOT NULL,
    "shareMethod" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,
    "userAgent" TEXT,
    "referrer" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sidebar_impressions" (
    "id" TEXT NOT NULL,
    "viewerIp" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sidebar_impressions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "checks_slug_key" ON "public"."checks"("slug");

-- CreateIndex
CREATE INDEX "checks_userId_idx" ON "public"."checks"("userId");

-- CreateIndex
CREATE INDEX "checks_urlHash_idx" ON "public"."checks"("urlHash");

-- CreateIndex
CREATE INDEX "checks_createdAt_idx" ON "public"."checks"("createdAt");

-- CreateIndex
CREATE INDEX "checks_isPublic_idx" ON "public"."checks"("isPublic");

-- CreateIndex
CREATE INDEX "checks_slug_idx" ON "public"."checks"("slug");

-- CreateIndex
CREATE INDEX "checks_isPublic_createdAt_idx" ON "public"."checks"("isPublic", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "ai_analyses_contentHash_key" ON "public"."ai_analyses"("contentHash");

-- CreateIndex
CREATE INDEX "ai_analyses_contentHash_idx" ON "public"."ai_analyses"("contentHash");

-- CreateIndex
CREATE INDEX "ai_analyses_processingStatus_idx" ON "public"."ai_analyses"("processingStatus");

-- CreateIndex
CREATE INDEX "ai_analyses_createdAt_idx" ON "public"."ai_analyses"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ai_analyses_checkId_key" ON "public"."ai_analyses"("checkId");

-- CreateIndex
CREATE INDEX "similar_pages_sourceAnalysisId_idx" ON "public"."similar_pages"("sourceAnalysisId");

-- CreateIndex
CREATE INDEX "similar_pages_similarityScore_idx" ON "public"."similar_pages"("similarityScore");

-- CreateIndex
CREATE UNIQUE INDEX "similar_pages_sourceAnalysisId_targetAnalysisId_key" ON "public"."similar_pages"("sourceAnalysisId", "targetAnalysisId");

-- CreateIndex
CREATE INDEX "report_views_checkId_idx" ON "public"."report_views"("checkId");

-- CreateIndex
CREATE INDEX "report_views_createdAt_idx" ON "public"."report_views"("createdAt");

-- CreateIndex
CREATE INDEX "share_events_checkId_idx" ON "public"."share_events"("checkId");

-- CreateIndex
CREATE INDEX "share_events_createdAt_idx" ON "public"."share_events"("createdAt");

-- CreateIndex
CREATE INDEX "share_events_shareMethod_idx" ON "public"."share_events"("shareMethod");

-- CreateIndex
CREATE INDEX "sidebar_impressions_createdAt_idx" ON "public"."sidebar_impressions"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."checks" ADD CONSTRAINT "checks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_analyses" ADD CONSTRAINT "ai_analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ai_analyses" ADD CONSTRAINT "ai_analyses_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "public"."checks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."similar_pages" ADD CONSTRAINT "similar_pages_sourceAnalysisId_fkey" FOREIGN KEY ("sourceAnalysisId") REFERENCES "public"."ai_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."similar_pages" ADD CONSTRAINT "similar_pages_targetAnalysisId_fkey" FOREIGN KEY ("targetAnalysisId") REFERENCES "public"."ai_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."report_views" ADD CONSTRAINT "report_views_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "public"."checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."share_events" ADD CONSTRAINT "share_events_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "public"."checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
