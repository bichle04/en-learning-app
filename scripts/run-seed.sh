#!/bin/bash

# Seed Data Runner Script
# This script helps you run the seed data script with proper error handling

echo "🌱 Starting English Learning App Database Seeding..."
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root directory."
    echo "📁 Current directory: $(pwd)"
    echo "💡 Try: cd /path/to/your/englearn/project"
    exit 1
fi


# Check if scripts directory exists
if [ ! -d "scripts" ]; then
    echo "❌ Error: scripts directory not found."
    exit 1
fi

# Check if seedData.ts exists
if [ ! -f "scripts/seedData.ts" ]; then
    echo "❌ Error: scripts/seedData.ts not found."
    exit 1
fi

echo "✅ Environment checks passed!"
echo ""

# Check if tsx is installed globally
if ! command -v tsx &> /dev/null; then
    echo "📦 tsx not found globally. Installing..."
    npm install -g tsx
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install tsx globally."
        echo "💡 Try running: sudo npm install -g tsx"
        echo "💡 Or use: npx tsx scripts/seedData.ts"
        exit 1
    fi
fi

echo "🚀 Running seed script..."
echo ""

# Run the seed script
tsx scripts/seedData.ts

# Check if the script ran successfully
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Seeding completed successfully!"
    echo "📱 You can now open your app to see the new courses."
    echo ""
    echo "🔍 Next steps:"
    echo "   1. Open your Supabase dashboard to verify the data"
    echo "   2. Launch your React Native app"
    echo "   3. Navigate to the courses screen"
    echo "   4. Try starting a lesson!"
else
    echo ""
    echo "❌ Seeding failed!"
    echo "💡 Check the error messages above for troubleshooting."
    echo "📖 See scripts/README.md for more help."
    exit 1
fi
