-- ============================================================================
-- USER ACTIVITY TRACKING SCHEMA
-- ============================================================================

-- Tạo bảng user_activity để tracking tiến độ học tập
CREATE TABLE user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  words_learned INTEGER DEFAULT 0,
  words_reviewed INTEGER DEFAULT 0,
  exercises_completed INTEGER DEFAULT 0,
  study_time_minutes INTEGER DEFAULT 0,
  accuracy_rate NUMERIC(5,2) DEFAULT 0,
  lesson_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

-- Tạo index cho user_activity
CREATE INDEX idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX idx_user_activity_date ON user_activity(activity_date);
CREATE INDEX idx_user_activity_user_date ON user_activity(user_id, activity_date);

-- Enable RLS cho user_activity
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- RLS policies cho user_activity
CREATE POLICY "Users can view their own activity" ON user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity" ON user_activity
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activity" ON user_activity
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger để auto update updated_at cho user_activity
CREATE TRIGGER update_user_activity_updated_at
    BEFORE UPDATE ON user_activity
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STORED FUNCTIONS
-- ============================================================================

-- Function để upsert user activity (tạo mới hoặc cộng dồn)
CREATE OR REPLACE FUNCTION upsert_user_activity(
  target_user_id UUID,
  target_date DATE,
  new_words_learned INTEGER DEFAULT 0,
  new_words_reviewed INTEGER DEFAULT 0,
  new_exercises_completed INTEGER DEFAULT 0,
  new_study_time_minutes INTEGER DEFAULT 0,
  new_accuracy_rate NUMERIC DEFAULT NULL,
  new_lesson_completed BOOLEAN DEFAULT FALSE
)
RETURNS user_activity AS $$
DECLARE
  result user_activity;
  existing_activity user_activity;
  calculated_accuracy NUMERIC;
BEGIN
  -- Lấy activity hiện tại nếu có
  SELECT * INTO existing_activity
  FROM user_activity
  WHERE user_id = target_user_id AND activity_date = target_date;

  -- Tính accuracy rate mới
  IF new_accuracy_rate IS NOT NULL THEN
    IF existing_activity IS NOT NULL AND existing_activity.exercises_completed > 0 THEN
      -- Tính trung bình có trọng số
      calculated_accuracy := (
        (existing_activity.accuracy_rate * existing_activity.exercises_completed) + 
        (new_accuracy_rate * new_exercises_completed)
      ) / (existing_activity.exercises_completed + new_exercises_completed);
    ELSE
      calculated_accuracy := new_accuracy_rate;
    END IF;
  ELSE
    calculated_accuracy := COALESCE(existing_activity.accuracy_rate, 0);
  END IF;

  -- Insert hoặc update
  INSERT INTO user_activity (
    user_id,
    activity_date,
    words_learned,
    words_reviewed,
    exercises_completed,
    study_time_minutes,
    accuracy_rate,
    lesson_completed
  ) VALUES (
    target_user_id,
    target_date,
    new_words_learned,
    new_words_reviewed,
    new_exercises_completed,
    new_study_time_minutes,
    calculated_accuracy,
    new_lesson_completed
  )
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    words_learned = user_activity.words_learned + new_words_learned,
    words_reviewed = user_activity.words_reviewed + new_words_reviewed,
    exercises_completed = user_activity.exercises_completed + new_exercises_completed,
    study_time_minutes = user_activity.study_time_minutes + new_study_time_minutes,
    accuracy_rate = calculated_accuracy,
    lesson_completed = user_activity.lesson_completed OR new_lesson_completed,
    updated_at = NOW()
  RETURNING * INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để tính current streak của user
CREATE OR REPLACE FUNCTION calculate_user_streak(target_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  current_streak INTEGER := 0;
  check_date DATE;
  has_activity BOOLEAN;
BEGIN
  -- Bắt đầu từ hôm nay
  check_date := CURRENT_DATE;
  
  LOOP
    -- Kiểm tra xem ngày này có activity không
    SELECT EXISTS(
      SELECT 1
      FROM user_activity
      WHERE user_id = target_user_id
        AND activity_date = check_date
        AND (words_learned > 0 OR words_reviewed > 0 OR exercises_completed > 0)
    ) INTO has_activity;
    
    -- Nếu không có activity, dừng lại
    IF NOT has_activity THEN
      -- Nếu hôm nay chưa có activity thì vẫn tính streak từ hôm qua
      IF check_date = CURRENT_DATE THEN
        check_date := check_date - INTERVAL '1 day';
        CONTINUE;
      END IF;
      EXIT;
    END IF;
    
    -- Tăng streak
    current_streak := current_streak + 1;
    
    -- Lùi về ngày trước đó
    check_date := check_date - INTERVAL '1 day';
    
    -- Giới hạn tối đa để tránh vòng lặp vô hạn
    IF current_streak > 1000 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN current_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function để lấy streak statistics
CREATE OR REPLACE FUNCTION get_user_streak_stats(target_user_id UUID)
RETURNS TABLE(
  current_streak INTEGER,
  longest_streak INTEGER,
  total_active_days INTEGER
) AS $$
DECLARE
  curr_streak INTEGER;
  long_streak INTEGER := 0;
  temp_streak INTEGER := 0;
  prev_date DATE := NULL;
  total_days INTEGER := 0;
  activity_record RECORD;
BEGIN
  -- Tính current streak
  curr_streak := calculate_user_streak(target_user_id);
  
  -- Tính longest streak và total active days
  FOR activity_record IN (
    SELECT activity_date
    FROM user_activity
    WHERE user_id = target_user_id
      AND (words_learned > 0 OR words_reviewed > 0 OR exercises_completed > 0)
    ORDER BY activity_date ASC
  ) LOOP
    total_days := total_days + 1;
    
    IF prev_date IS NULL THEN
      temp_streak := 1;
    ELSIF activity_record.activity_date = prev_date + INTERVAL '1 day' THEN
      temp_streak := temp_streak + 1;
    ELSE
      temp_streak := 1;
    END IF;
    
    IF temp_streak > long_streak THEN
      long_streak := temp_streak;
    END IF;
    
    prev_date := activity_record.activity_date;
  END LOOP;
  
  RETURN QUERY SELECT curr_streak, long_streak, total_days;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

