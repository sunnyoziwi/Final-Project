# 🎥 Dự Án: Web Interview Recorder (Per-Question Upload)
---
[cite_start]Dự án phát triển ứng dụng web Client-Server để ghi lại và tải lên video phỏng vấn (tối đa 5 câu hỏi)[cite: 7, 23]. [cite_start]Video được tải lên ngay lập tức sau khi hoàn thành mỗi câu hỏi (per-question upload)[cite: 9].

## 🛠️ Kiến Trúc và Luồng Hoạt động

**Kiến trúc:** Client-Server.
* **Frontend:** [Ghi rõ công nghệ, ví dụ: React/Vue].
* **Backend:** [Ghi rõ công nghệ, ví dụ: Node.js/Express].

**Luồng Giao tiếp Mạng Cốt lõi:**
1.  [cite_start]Client (trình duyệt) gửi yêu cầu API đến Server qua HTTP/HTTPS[cite: 13].
2.  [cite_start]Sau khi ghi hình, Client gửi video mỗi câu hỏi đến Server (tương tự như tải file)[cite: 15, 20].
3.  [cite_start]Quản lý phiên sử dụng các API: verify-token, session/start, upload-one, session/finish[cite: 9, 26].

## 📜 Hợp Đồng API (API Contract)

| Phương thức | Endpoint | Input | Output |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/verify-token` | `{token}` | [cite_start]`{ok: true }` hoặc `status 401` [cite: 39] |
| **POST** | `/api/session/start` | `{token, userName}` | [cite_start]`{ok: true, folder: "DD_MM_YYYY_HH_mm_ten_user" }` [cite: 40, 41] |
| **POST** | `/api/upload-one` | [cite_start]*multipart/form-data* (token, folder, questionIndex, video) [cite: 42] | [cite_start]`{ok: true, savedAs: "Q<index>.webm" }` [cite: 42] |
| **POST** | `/api/session/finish` | [cite_start]`{token, folder, questions Count}` [cite: 43] | [cite_start]`{ok: true }` [cite: 43] |

## 🚀 Thiết Lập và Hướng Dẫn Chạy

### Yêu cầu Bắt buộc
* [cite_start]**HTTPS:** HTTPS là bắt buộc khi triển khai công khai để truy cập camera/microphone[cite: 4, 32, 85].
* [cite_start]**Server Storage:** Thư mục được đặt tên theo thời gian và người dùng: DD_MM_YYYY_HH_mm_ten_user/ (timezone: Asia/Bangkok)[cite: 10, 57].

### Hướng dẫn Khởi động
[Thêm hướng dẫn chi tiết của nhóm bạn cho Client và Server, ví dụ:]
1.  **Server:** `cd server` $\to$ `npm install` $\to$ `npm start`
2.  **Client:** `cd client` $\to$ `npm install` $\to$ `npm run dev`

## 🛡️ Chính Sách và Giới Hạn

* [cite_start]**Chính sách Retry:** Hệ thống phải xử lý lỗi mạng (loss, retries with backoff)[cite: 16]. [cite_start]Client phải có chính sách thử lại với **exponential backoff** ít nhất 2-3 lần và cung cấp nút Retry thủ công[cite: 48].
* [cite_start]**Giới hạn File:** [Ghi rõ giới hạn kích thước file và MIME types được chấp nhận][cite: 31].
