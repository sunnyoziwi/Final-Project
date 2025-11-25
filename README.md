# 🎥 Dự Án: Web Interview Recorder (Per-Question Upload)
---
Dự án phát triển ứng dụng web Client-Server để ghi lại và tải lên video phỏng vấn (tối đa 5 câu hỏi). Video được tải lên ngay lập tức sau khi hoàn thành mỗi câu hỏi (per-question upload).

## 🛠️ Kiến Trúc và Luồng Hoạt động

**Kiến trúc:** Client-Server.
* **Frontend:** [Python].
* **Backend:** [Python].

**Luồng Giao tiếp Mạng Cốt lõi:**
1.  Client (trình duyệt) gửi yêu cầu API đến Server qua HTTP/HTTPS.
2.  Sau khi ghi hình, Client gửi video mỗi câu hỏi đến Server (tương tự như tải file).
3.  Quản lý phiên sử dụng các API: verify-token, session/start, upload-one, session/finish.

## 📜 Hợp Đồng API (API Contract)

| Phương thức | Endpoint | Input | Output |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/verify-token` | `{token}` | `{ok: true }` hoặc `status 401`  |
| **POST** | `/api/session/start` | `{token, userName}` | `{ok: true, folder: "DD_MM_YYYY_HH_mm_ten_user" }`  |
| **POST** | `/api/upload-one` | *multipart/form-data* (token, folder, questionIndex, video)  | `{ok: true, savedAs: "Q<index>.webm" }` |
| **POST** | `/api/session/finish` | `{token, folder, questions Count}`  | `{ok: true }` |

## 🚀 Thiết Lập và Hướng Dẫn Chạy

### Yêu cầu Bắt buộc
* **HTTPS:** HTTPS là bắt buộc khi triển khai công khai để truy cập camera/microphone. 
* **Server Storage:** Thư mục được đặt tên theo thời gian và người dùng: DD_MM_YYYY_HH_mm_ten_user/ (timezone: Asia/Bangkok).

### Hướng dẫn Khởi động
[Thêm hướng dẫn chi tiết của nhóm bạn cho Client và Server, ví dụ:]
1.  **Server:** `cd server` $\to$ `npm install` $\to$ `npm start`
2.  **Client:** `cd client` $\to$ `npm install` $\to$ `npm run dev`

## 🛡️ Chính Sách và Giới Hạn

* **Chính sách Retry:** Hệ thống phải xử lý lỗi mạng (loss, retries with backoff). Client phải có chính sách thử lại với **exponential backoff** ít nhất 2-3 lần và cung cấp nút Retry thủ công.
* **Giới hạn File:** [Ghi rõ giới hạn kích thước file và MIME types được chấp nhận].
