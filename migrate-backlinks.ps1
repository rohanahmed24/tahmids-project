# Migration Script - Add Backlinks Field

# Run this to add backlinks column to existing posts
cd /d "C:\Users\rohan\OneDrive\Documents\thewisdomia.com"
npx prisma db push --schema ./add-backlinks-field.prisma

echo "Backlinks migration complete"
