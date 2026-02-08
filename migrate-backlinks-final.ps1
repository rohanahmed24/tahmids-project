cd /d "C:\Users\rohan\OneDrive\Documents\thewisdomia.com"
npx prisma db push --schema ./add-backlinks-field.prisma

if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: Backlinks field added to database schema
) else (
    echo FAILED: Migration failed with error code %ERRORLEVEL%
)

if %ERRORLEVEL% NEQ 0 echo. %ERRORLEVEL%
