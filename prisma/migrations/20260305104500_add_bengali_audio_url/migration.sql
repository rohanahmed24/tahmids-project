-- Add Bengali audio URL support for locale-specific article playback
ALTER TABLE "posts"
ADD COLUMN "audio_url_bn" TEXT;
