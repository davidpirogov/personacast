-- CreateTable
CREATE TABLE "episodes" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "podcast_id" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_images" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file_id" UUID NOT NULL,
    "podcast_id" INTEGER,
    "episode_id" INTEGER,
    "url_to" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hero_images_name_key" ON "hero_images"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hero_images_file_id_key" ON "hero_images"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "hero_images_podcast_id_key" ON "hero_images"("podcast_id");

-- CreateIndex
CREATE UNIQUE INDEX "hero_images_episode_id_key" ON "hero_images"("episode_id");

-- CreateIndex
CREATE UNIQUE INDEX "hero_images_url_to_key" ON "hero_images"("url_to");

-- CreateIndex
CREATE INDEX "hero_images_file_id_idx" ON "hero_images"("file_id");

-- CreateIndex
CREATE INDEX "hero_images_podcast_id_idx" ON "hero_images"("podcast_id");

-- CreateIndex
CREATE INDEX "hero_images_episode_id_idx" ON "hero_images"("episode_id");

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_images" ADD CONSTRAINT "hero_images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_images" ADD CONSTRAINT "hero_images_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hero_images" ADD CONSTRAINT "hero_images_episode_id_fkey" FOREIGN KEY ("episode_id") REFERENCES "episodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
