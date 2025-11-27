# Speaking Module - Frontend Documentation

## Tổng quan

Module Speaking đã hoàn thành phần UI/Frontend. Document này mô tả chức năng của từng file để team hiểu rõ cấu trúc và data flow.

---

## Cấu trúc File và Chức năng

### 📁 app/speaking/

#### `_layout.tsx`
Stack navigator cho toàn bộ speaking module, quản lý điều hướng giữa các màn hình.

#### `index.tsx`
**Màn hình chọn chế độ làm bài**
- Hiển thị 2 options: Practice (luyện tập) và Test (thi thử)
- Practice: chọn Part cụ thể để luyện
- Test: thi đầy đủ 3 Parts liên tiếp

#### `practice.tsx`
**Màn hình chọn topic (chỉ cho Practice mode)**
- Hiển thị danh sách topics theo Part (1/2/3)
- Mỗi topic có: title, description, difficulty, estimatedTime
- Hiện tại dùng mock data từ `data/speaking-mock-data.ts`
- TODO: Cần fetch topics từ API theo Part

#### `test.tsx`
**Màn hình redirect**
- Tự động chuyển sang room.tsx để bắt đầu thi
- Không có UI

#### `room.tsx`
**Màn hình phòng thi (ghi âm)**
- Tự động bắt đầu ghi âm khi vào phòng
- Hiển thị câu hỏi hiện tại
- Progress bar và timer
- Navigate qua lại giữa các câu (Next/Previous)
- Break modal 10s giữa các Part (Test mode)
- Submit khi hoàn thành
- TODO: 
  - Implement audio recording thực tế
  - Upload audio lên server
  - Submit để đánh giá

#### `result.tsx`
**Màn hình kết quả tổng quan**
- Pentagon chart hiển thị 4 điểm: Pronunciation, Fluency, Grammar, Lexical
- Overall band score (0-9)
- 3 action buttons:
  - Xem chi tiết → `feedback.tsx`
  - Luyện lại → quay về `practice.tsx` hoặc `test.tsx`
  - Về trang chủ → về home tab
- TODO: Fetch result từ API theo resultId

#### `feedback.tsx`
**Màn hình feedback chi tiết (5 tabs)**
- Tab Overall: Pentagon chart + tổng hợp điểm mạnh/cần cải thiện
- Tab Fluency & Coherence: Band descriptors + criteria details
- Tab Lexical Resource: Band descriptors + criteria details
- Tab Grammatical Range & Accuracy: Band descriptors + criteria details + errors
- Tab Pronunciation: Band descriptors + criteria details + errors
- Hiện tại dùng MOCK_FEEDBACK (trong file này)
- TODO: Fetch detailed feedback từ API theo resultId

---

### 📁 components/speaking/

#### `OverallFeedback.tsx`
Hiển thị tab Overall với:
- Pentagon chart (4 góc: Pronunciation, Fluency, Grammar, Lexical)
- Congratulations message
- Strengths (điểm mạnh)
- Improvements (điểm cần cải thiện)
- Action Plan
- Next Steps

#### `GenericFeedback.tsx`
**Component dùng chung** cho 4 tabs: Fluency, Lexical, Grammar, Pronunciation
- Hiển thị band descriptors
- Hiển thị criteria với score badge (màu theo level)
- Hiển thị errorSections (nếu có)
- Cấu trúc errorSections linh hoạt: mỗi criterion có thể có 0-N sections

#### `FluencyFeedback.tsx`
Wrapper component gọi GenericFeedback với data fluency

#### `LexicalFeedback.tsx`
Wrapper component gọi GenericFeedback với data lexical

#### `GrammarFeedback.tsx`
Wrapper component gọi GenericFeedback với data grammar

#### `PronunciationFeedback.tsx`
Wrapper component gọi GenericFeedback với data pronunciation

#### `shared/feedbackStyles.ts`
Shared styles cho tất cả feedback components, bao gồm:
- Helper functions: `getScoreBadgeColor()`, `getScoreBackgroundColor()`
- Styles cho band section, criteria card, error sections, etc.

---

### 📁 data/

#### `speaking-mock-data.ts`
Mock data cho topics và questions theo Part 1/2/3
- Structure: `SPEAKING_TOPICS[part]` → array of topics
- Mỗi topic có id, title, description, difficulty, estimatedTime, questions[]

---

### 📁 types/speaking/

#### `index.ts`
TypeScript interfaces cho Speaking module:
- `SpeakingPart`: 1 | 2 | 3
- `SpeakingTopic`: topic structure
- `SpeakingQuestion`: question structure
- Các interfaces khác cho feedback data

---

## Data Flow

### Practice Mode
```
index.tsx (chọn Practice) 
  → practice.tsx (chọn Part → chọn Topic) 
  → room.tsx (ghi âm + submit)
  → result.tsx (xem kết quả)
  → feedback.tsx (xem chi tiết 5 tabs)
```

### Test Mode
```
index.tsx (chọn Test)
  → test.tsx (redirect)
  → room.tsx (3 Parts + break 10s giữa parts)
  → result.tsx
  → feedback.tsx
```

---

## Backend Integration Points (TODO trong code)

Tất cả các chỗ cần tích hợp backend đều có comment `// TODO: Backend - ...`

### 1. Topics & Questions
- File: `practice.tsx`
- Cần: API trả về topics theo Part
- Mock data hiện tại: `data/speaking-mock-data.ts`

### 2. Audio Recording & Upload
- File: `room.tsx`
- Cần: Record audio → upload → submit để đánh giá
- Hiện tại: chỉ có UI

### 3. Results
- File: `result.tsx`
- Cần: API trả về overall result (scores, band score)
- Mock data: `MOCK_RESULT` trong file

### 4. Detailed Feedback
- File: `feedback.tsx`
- Cần: API trả về detailed feedback (5 sections: overall, fluency, lexical, grammar, pronunciation)
- Mock data: `MOCK_FEEDBACK` trong file
- **Quan trọng**: errorSections structure linh hoạt (mỗi criterion có thể có nhiều sections)

---

## Data Structure Quan Trọng

### ErrorSections (Flexible Structure)
```typescript
errorSections?: Array<{
  title: string;        // Tiêu đề section
  errors: Array<{
    type: string;       // Loại lỗi
    count: string;      // Số lần (vd: "6 Lần")
  }>;
}>
```

Ví dụ:
- Grammar có 1 errorSection: "Most frequent grammar errors"
- Pronunciation có 2 errorSections: "Common individual sound errors" + "Frequent mispronounced words"
- Fluency/Lexical có thể không có errorSections

### Score Levels
```typescript
"Excellent" | "Very Good" | "Good" | "Modest" | "Limited"
```

---

## Constants

### Break Time
```typescript
const BREAK_TIME = 10; // seconds between parts (trong room.tsx)
```

### Color Scheme
- Speaking Blue: `#1E90FF`
- Success Green: `#4CAF50`
- Warning Orange: `#FFA500`
- Error Red: `#FF6B6B`

Score badge colors:
- Excellent: Green
- Very Good: Blue
- Good: Orange
- Modest/Limited: Red

---

## Tham khảo

- TypeScript interfaces: `types/speaking/index.ts`
- Mock data examples: `data/speaking-mock-data.ts` và `app/speaking/feedback.tsx`
- Shared styles: `components/speaking/shared/feedbackStyles.ts`

---

**Last Updated**: November 25, 2025
**Author**: Bich Le
