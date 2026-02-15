-- Add Bengali-localized fields for multilingual publishing support
ALTER TABLE "posts"
ADD COLUMN "title_bn" TEXT,
ADD COLUMN "subtitle_bn" TEXT,
ADD COLUMN "author_bn" TEXT,
ADD COLUMN "translator_name_bn" TEXT,
ADD COLUMN "editor_name_bn" TEXT,
ADD COLUMN "category_bn" TEXT,
ADD COLUMN "content_bn" TEXT,
ADD COLUMN "excerpt_bn" TEXT,
ADD COLUMN "meta_description_bn" TEXT;

