-- Tạo bảng user_vocabularies
CREATE TABLE user_vocabularies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  pronunciation TEXT,
  definition TEXT NOT NULL,
  example TEXT,
  topic TEXT,
  audio_url TEXT,
  date_added DATE DEFAULT CURRENT_DATE,
  is_favorite BOOLEAN DEFAULT FALSE,
  review_count INTEGER DEFAULT 0,
  last_reviewed DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index cho hiệu suất
CREATE INDEX idx_user_vocabularies_user_id ON user_vocabularies(user_id);
CREATE INDEX idx_user_vocabularies_word ON user_vocabularies(word);
CREATE INDEX idx_user_vocabularies_topic ON user_vocabularies(topic);
CREATE INDEX idx_user_vocabularies_date_added ON user_vocabularies(date_added);

-- Enable Row Level Security (RLS)
ALTER TABLE user_vocabularies ENABLE ROW LEVEL SECURITY;

-- Tạo RLS policies - chỉ user có thể access vocabulary của mình
CREATE POLICY "Users can view their own vocabularies" ON user_vocabularies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocabularies" ON user_vocabularies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocabularies" ON user_vocabularies
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vocabularies" ON user_vocabularies
    FOR DELETE USING (auth.uid() = user_id);

-- Tạo function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger cho updated_at
CREATE TRIGGER update_user_vocabularies_updated_at
    BEFORE UPDATE ON user_vocabularies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
