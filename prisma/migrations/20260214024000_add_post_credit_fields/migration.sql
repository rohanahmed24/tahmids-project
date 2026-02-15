-- Add optional credit fields for article translator and editor
ALTER TABLE "posts"
ADD COLUMN "translator_name" TEXT,
ADD COLUMN "editor_name" TEXT;
