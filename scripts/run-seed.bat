@echo off
REM Seed Data Runner Script for Windows
REM This script helps you run the seed data script with proper error handling

echo 🌱 Starting English Learning App Database Seeding...
echo =============================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project root directory.
    echo 📁 Current directory: %CD%
    echo 💡 Try: cd C:\path\to\your\englearn\project
    pause
    exit /b 1
)

REM Check if .env file exists
@REM if not exist ".env" (
@REM     echo ❌ Error: .env file not found.
@REM     echo 💡 Make sure you have your Supabase credentials in a .env file:
@REM     echo    SUPABASE_URL=your_supabase_url
@REM     echo    SUPABASE_ANON_KEY=your_supabase_anon_key
@REM     pause
@REM     exit /b 1
@REM )

REM Check if scripts directory exists
if not exist "scripts" (
    echo ❌ Error: scripts directory not found.
    pause
    exit /b 1
)

REM Check if seedData.ts exists
if not exist "scripts\seedData.ts" (
    echo ❌ Error: scripts\seedData.ts not found.
    pause
    exit /b 1
)

echo ✅ Environment checks passed!
echo.

REM Check if tsx is installed globally
tsx --version >nul 2>&1
if errorlevel 1 (
    echo 📦 tsx not found globally. Installing...
    npm install -g tsx
    if errorlevel 1 (
        echo ❌ Failed to install tsx globally.
        echo 💡 Try running as administrator: npm install -g tsx
        echo 💡 Or use: npx tsx scripts/seedData.ts
        pause
        exit /b 1
    )
)

echo 🚀 Running seed script...
echo.

REM Run the seed script
tsx scripts/seedData.ts

REM Check if the script ran successfully
if errorlevel 1 (
    echo.
    echo ❌ Seeding failed!
    echo 💡 Check the error messages above for troubleshooting.
    echo 📖 See scripts\README.md for more help.
    pause
    exit /b 1
) else (
    echo.
    echo 🎉 Seeding completed successfully!
    echo 📱 You can now open your app to see the new courses.
    echo.
    echo 🔍 Next steps:
    echo    1. Open your Supabase dashboard to verify the data
    echo    2. Launch your React Native app
    echo    3. Navigate to the courses screen
    echo    4. Try starting a lesson!
    echo.
    pause
)
