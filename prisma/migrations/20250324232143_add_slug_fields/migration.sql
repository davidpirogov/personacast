/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `episodes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `podcasts` will be added. If there are existing duplicate values, this will fail.

*/
-- First add the columns as nullable
ALTER TABLE "episodes" ADD COLUMN "slug" TEXT;
ALTER TABLE "podcasts" ADD COLUMN "slug" TEXT;

-- Update existing podcasts with a slug derived from title
UPDATE "podcasts" SET "slug" = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', ''));

-- Update existing episodes with a slug derived from title
UPDATE "episodes" SET "slug" = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '.', ''), ',', ''));

-- Make the columns required
ALTER TABLE "episodes" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "podcasts" ALTER COLUMN "slug" SET NOT NULL;

-- Create unique indexes
CREATE UNIQUE INDEX "episodes_slug_key" ON "episodes"("slug");
CREATE UNIQUE INDEX "podcasts_slug_key" ON "podcasts"("slug");
