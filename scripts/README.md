# Seeding Database with Sample Data

This script will populate your Supabase database with sample courses and vocabulary words.

## Prerequisites

1. **Supabase Setup**: Make sure your Supabase project is configured with the proper database schema
2. **Environment Variables**: Ensure your `.env` file contains the correct Supabase credentials
3. **Services**: Make sure the `CourseService` is properly implemented

## What the script creates:

### 🏢 TOEIC Vocabulary Course

- **Level**: Intermediate
- **Category**: Business
- **Words**: 20 business-focused vocabulary words
- **Topics**: Collaboration, efficiency, strategy, budgets, presentations

### 🎓 IELTS Academic Course

- **Level**: Advanced
- **Category**: Academic
- **Words**: 15 academic vocabulary words
- **Topics**: Research, methodology, analysis, academic writing

### 💬 Daily Conversation Course

- **Level**: Beginner
- **Category**: General
- **Words**: 10 everyday vocabulary words
- **Topics**: Common adjectives, recommendations, daily interactions

## How to run:

### Method 1: Using npm/yarn (Recommended)

1. **Install dependencies** (if not already installed):

   ```bash
   cd scripts
   npm install
   # or
   yarn install
   ```

2. **Run the seed script**:
   ```bash
   npm run seed
   # or
   yarn seed
   ```

### Method 2: Direct execution with tsx

1. **Install tsx globally** (if not already installed):

   ```bash
   npm install -g tsx
   ```

2. **Run the script**:
   ```bash
   tsx scripts/seedData.ts
   ```

### Method 3: Using Node.js with ts-node

1. **Install ts-node** (if not already installed):

   ```bash
   npm install -g ts-node
   ```

2. **Run the script**:
   ```bash
   ts-node scripts/seedData.ts
   ```

### Method 4: Compile TypeScript first

1. **Compile to JavaScript**:

   ```bash
   tsc scripts/seedData.ts --outDir scripts/dist
   ```

2. **Run the compiled JavaScript**:
   ```bash
   node scripts/dist/seedData.js
   ```

## Expected Output:

```
🌱 Starting to seed courses...
📚 Creating TOEIC Vocabulary course...
📝 Adding TOEIC words...
📚 Creating IELTS Academic course...
📝 Adding IELTS words...
📚 Creating Daily Conversation course...
📝 Adding Daily Conversation words...
✅ Seeding completed successfully!
📊 Summary:
   - TOEIC Vocabulary: 20 words
   - IELTS Academic: 15 words
   - Daily Conversation: 10 words
   Total: 45 words across 3 courses
```

## Troubleshooting:

### Error: "Cannot find module '../services/courseService'"

- Make sure the `CourseService` is properly implemented in `services/courseService.ts`
- Check that the import path is correct relative to the script location

### Error: "Supabase connection failed"

- Verify your `.env` file contains the correct Supabase URL and API key
- Make sure your Supabase project is running and accessible

### Error: "Table does not exist"

- Ensure you have run the database migrations to create the required tables
- Check that the table schema matches what the service expects

### Error: "Permission denied"

- Check your Supabase RLS (Row Level Security) policies
- Make sure the API key has the necessary permissions

## Database Schema Required:

Make sure your Supabase database has these tables:

```sql
-- Courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  level VARCHAR(50),
  category VARCHAR(100),
  color_start VARCHAR(7),
  color_end VARCHAR(7),
  icon VARCHAR(10),
  estimated_time INTEGER,
  total_words INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Words table
CREATE TABLE words (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  word VARCHAR(255) NOT NULL,
  pronunciation VARCHAR(255),
  definition TEXT NOT NULL,
  example TEXT,
  difficulty VARCHAR(50),
  synonyms TEXT[],
  antonyms TEXT[],
  audio_url VARCHAR(500),
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Next Steps:

After running the seed script successfully:

1. **Verify in Supabase Dashboard**: Check your tables to confirm data was inserted
2. **Test the App**: Launch your React Native app to see the courses appear
3. **Customize**: Modify the script to add more courses or different vocabulary words
4. **Production**: Consider creating separate seed files for different environments

## Safety Note:

⚠️ **Warning**: This script will add new data to your database. If you need to reset your data, you may want to truncate the tables first:

```sql
TRUNCATE TABLE words, courses RESTART IDENTITY CASCADE;
```

Run this SQL command in your Supabase SQL editor before seeding if you want to start fresh.
