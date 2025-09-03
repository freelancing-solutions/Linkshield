-- Add shareable report fields to checks table
ALTER TABLE "checks" ADD COLUMN "slug" TEXT;
ALTER TABLE "checks" ADD COLUMN "shareCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "checks" ADD COLUMN "ogImageUrl" TEXT;
ALTER TABLE "checks" ADD COLUMN "customTitle" TEXT;
ALTER TABLE "checks" ADD COLUMN "customDescription" TEXT;

-- Create unique constraint on slug
ALTER TABLE "checks" ADD CONSTRAINT "checks_slug_key" UNIQUE ("slug");

-- Create indexes for performance optimization
CREATE INDEX "checks_slug_idx" ON "checks"("slug");
CREATE INDEX "checks_isPublic_createdAt_idx" ON "checks"("isPublic", "createdAt" DESC);

-- Create share_events table for tracking sharing analytics
CREATE TABLE "share_events" (
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

-- Create indexes for share_events
CREATE INDEX "share_events_checkId_idx" ON "share_events"("checkId");
CREATE INDEX "share_events_createdAt_idx" ON "share_events"("createdAt");
CREATE INDEX "share_events_shareMethod_idx" ON "share_events"("shareMethod");

-- Add foreign key constraint
ALTER TABLE "share_events" ADD CONSTRAINT "share_events_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create recent_public_reports view for efficient sidebar queries
CREATE VIEW recent_public_reports AS
SELECT 
  c.id,
  c.slug,
  c.url,
  c."securityScore",
  c."createdAt",
  (ai.id IS NOT NULL) as has_ai_analysis
FROM checks c
LEFT JOIN ai_analyses ai ON c.id = ai."checkId"
WHERE c."isPublic" = true 
  AND c.slug IS NOT NULL
ORDER BY c."createdAt" DESC;