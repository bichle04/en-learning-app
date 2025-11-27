# 🎓 Ứng dụng Học Tiếng Anh Thông Minh

Một ứng dụng học tiếng Anh hiện đại, được xây dựng với Expo và Supabase, mang đến trải nghiệm học tập tương tác, thú vị và hiệu quả. Với các bài tập từ vựng đa dạng, giao diện thân thiện, và tính năng theo dõi tiến độ học tập, EngLearn giúp người dùng cải thiện vốn từ vựng tiếng Anh một cách dễ dàng và đầy cảm hứng. Ứng dụng hỗ trợ đa nền tảng (iOS, Android, và web) với các tính năng như học từ mới, ôn tập, và tham gia các khóa học theo cấp độ.

## ✨ Tính năng chính

### 👤 Quản lý người dùng

- **Đăng ký/Đăng nhập**: Xác thực an toàn qua email và mật khẩu với Supabase Auth.
- **Đặt lại mật khẩu**: Gửi liên kết đặt lại mật khẩu qua email.
- **Hồ sơ cá nhân**: Xem và cập nhật thông tin người dùng (tên, email).
- **Âm thanh nền**: Tùy chọn bật/tắt âm thanh nền để tăng trải nghiệm học tập.

### 📚 Khóa học và từ vựng

- **Khóa học đa dạng**: Các khóa học được phân loại theo cấp độ (Beginner, Intermediate, Advanced, Expert) với giao diện gradient đẹp mắt.
- **Quản lý từ vựng**: Lưu trữ từ vựng cá nhân, đánh dấu yêu thích, và theo dõi lịch sử ôn tập.
- **Bài tập tương tác**:

```
- Flashcard: Ôn tập từ vựng nhanh chóng.
- Multiple Choice: Chọn đáp án đúng từ các lựa chọn.
- Fill Blank: Điền từ vào câu.
- Word Order: Sắp xếp từ thành câu hoàn chỉnh.
- Word-Definition Matching: Nối từ với định nghĩa.
```

- **Hỗ trợ phát âm**: Tích hợp âm thanh phát âm từ và câu ví dụ.

### 📊 Theo dõi tiến độ

- **Thống kê học tập**: Hiển thị số từ đã học, chuỗi ngày học liên tiếp (streak), và tỷ lệ hoàn thành mục tiêu hàng ngày.
- **Báo cáo hàng tuần**: Theo dõi số từ học được và thời gian học mỗi ngày trong tuần.
- **Mục tiêu học tập**: Đặt mục tiêu học từ mỗi tháng và theo dõi tiến độ.
- **Ôn tập thông minh**: Gợi ý từ vựng cần ôn lại dựa trên số lần ôn tập và thời gian gần nhất.

### 🐱 Giao diện thân thiện

- **Thiết kế hiện đại**: Sử dụng `LinearGradient` và `Lucide Icons` để tạo giao diện bắt mắt.
- **Hiệu ứng động**: Tích hợp `Lottie animations` và giao diện kéo-thả mượt mà với `react-native-draggable-flatlist.`
- **Responsive Design**: Tối ưu cho cả điện thoại, máy tính bảng và web.
- **Hiệu ứng rung (Haptics)**: Tăng trải nghiệm người dùng với phản hồi xúc giác.

## 🚀 Công nghệ sử dụng

### Core Technologies

- **Expo**: Framework để xây dựng ứng dụng đa nền tảng.
- **React Native**: Tạo giao diện native cho iOS, Android, và web.
- **Supabase**: Backend-as-a-Service cho xác thực, cơ sở dữ liệu, và lưu trữ.
- **TypeScript**: Đảm bảo type safety và cải thiện chất lượng code.

### UI & Styling

- **Expo Linear Gradient**: Tạo hiệu ứng gradient đẹp mắt cho giao diện.
- **Lucide Icons**: Bộ icon hiện đại, nhẹ và dễ sử dụng.
- **Lottie Animations**: Hiệu ứng động sinh động với `lottie-react-native`.
- **React Native Reanimated**: Hiệu ứng animation mượt mà.

### State Management & Data

- **React Context API**: Quản lý trạng thái xác thực và khóa học.
- **Supabase Client**: Gọi API cơ sở dữ liệu và xác thực.
- **React Hooks**: Tối ưu logic với các custom hooks `(useAuth, useCourse, useUserStats)`.

### Development Tools

- **ESLint & Prettier**: Đảm bảo chất lượng code.
- **Expo Router**: Điều hướng dựa trên file-based routing.
- **TypeScript**: Kiểm tra kiểu tĩnh và IntelliSense.
- **Supabase CLI**: Quản lý schema và seed dữ liệu.

### Additional Features

- **Expo AV**: Phát âm thanh (âm thanh nền, âm thanh phản hồi đúng/sai).
- **Expo Haptics**: Hiệu ứng rung cho trải nghiệm tương tác.
- **Expo Image**: Tối ưu tải và hiển thị hình ảnh.

## 📁 Cấu trúc dự án

```
englearn/
├── app/                     # Mã nguồn giao diện
│   ├── (auth)/              # Các màn hình xác thực
│   ├── (tabs)/              # Các tab chính (Home, Courses, Notebook, Profile, User)
│   ├── lesson/              # Màn hình bài học
├── assets/                  # Tài nguyên tĩnh (hình ảnh, âm thanh, animations)
├── components/              # Các component tái sử dụng
│   ├── exercises/           # Các component bài tập
│   ├── ui/                  # Component giao diện chung
├── constants/               # Các hằng số (màu sắc,...)
├── contexts/                # Context cho quản lý trạng thái
├── database/                # Schema cơ sở dữ liệu
├── hooks/                   # Custom hooks
├── lib/                     # Thư viện bên ngoài (Supabase client)
├── scripts/                 # Script hỗ trợ (seed dữ liệu, reset project)
├── services/                # Logic nghiệp vụ (auth, course, user activity, vocabulary)
├── types/                   # Type definitions
├── utils/                   # Các hàm tiện ích
├── .env.example             # Mẫu file môi trường
├── .gitignore               # Quy tắc bỏ qua file
├── app.json                 # Cấu hình Expo
├── package.json             # Dependencies dự án
├── README.md                # Tài liệu hướng dẫn
└── tsconfig.json            # Cấu hình TypeScript
```

## 🛠 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Expo CLI**: Cài đặt global hoặc sử dụng `npx`
- **Supabase**: Tài khoản Supabase để lấy URL và `anon key`

### Cài đặt Supabase

- Tạo dự án trên `Supabase Dashboard`.
- Lấy `SUPABASE_URL` và `SUPABASE_ANON_KEY` từ phần `Settings → API`.

### Cấu hình môi trường

- Copy file `.env.example` thành `.env`: `cp .env.example .env`
- Cập nhật thông tin Supabase trong file `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url-here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### Cài đặt dependencies và seed dữ liệu

- Tại thư mục gốc của dự án: `npm install`

#### Khởi động dứng dụng

```
npx expo start
```

- App chạy tại `http://localhost:8081`.

## 📜 Scripts có sẵn

- `npm start`: Khởi động ứng dụng với Expo.
- `npm run android`: Chạy trên Android emulator.
- `npm run ios`: Chạy trên iOS simulator.
- `npm run web`: Chạy trên trình duyệt.
- `npm run lint`: Kiểm tra code với ESLint.
- `npm run reset-project`: Reset thư mục app.
- `npm run seed`: Chèn dữ liệu mẫu vào Supabase.

## 🌐 Environment Variables

Tạo file `.env` trong thư mục gốc:

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url-here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

## 🎨 Theme và Styling

- **Màu sắc chủ đạo**: Sử dụng gradient
- **Responsive Design**: Tối ưu cho mọi kích thước màn hình.
- **Hiệu ứng động**: Sử dụng Lottie và Reanimated cho trải nghiệm mượt mà.

## 🔐 Authentication Flow

- **Đăng nhập**: Xác thực qua email/mật khẩu, trả về session từ Supabase.
- **Đăng ký**: Tạo tài khoản mới với email xác thực.
- **Đặt lại mật khẩu**: Gửi email chứa liên kết đặt lại mật khẩu.
- **Context API**: Quản lý trạng thái xác thực với `AuthContext`.

## 📚 Tài liệu tham khảo

- **Expo Documentation**: Hướng dẫn sử dụng Expo.
- **Supabase Documentation**: Tài liệu Supabase.
- **React Native Documentation**: Hướng dẫn React Native.
- **Learn Expo Tutorial**: Hướng dẫn từng bước.
