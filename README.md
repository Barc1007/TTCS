# 🏢 HỆ THỐNG QUẢN LÝ DÂN CƯ - ResidentIQ

**ResidentIQ** là phần mềm quản lý dân cư chung cư hiện đại, được xây dựng dựa trên nền tảng Web App. Hệ thống giúp Ban Quản Lý (BQL) chung cư dễ dàng theo dõi, quản lý nhân khẩu, theo dõi biến động cư trú (thường trú, tạm trú, tạm vắng) một cách nhanh chóng, chính xác và chuyên nghiệp.

---

## 🌟 Chức năng nổi bật (Features)

*   **🔐 Quản lý Tài khoản (Authentication):**
    *   Đăng nhập an toàn với JWT và mã hóa mật khẩu `bcryptjs`.
    *   Tự động sinh tài khoản cho cư dân mới (Mật khẩu mặc định là 8 số cuối CCCD).
    *   Ép buộc đổi mật khẩu trong lần đăng nhập đầu tiên (`mustChangePassword`).
*   **📊 Bảng Điều Khiển (Dashboard):**
    *   Hiển thị biểu đồ biến động dân số theo 6 tháng gần nhất (sử dụng `Chart.js`).
    *   Thống kê trực quan số lượng cư dân: Thường trú, Tạm trú, Tạm vắng.
    *   Nhật ký hoạt động (Activity Log) cập nhật thời gian thực.
*   **🧑‍🤝‍🧑 Quản lý Cư dân (Resident Management):**
    *   Thêm mới, chỉnh sửa thông tin cư dân với Validate chặt chẽ (Kiểm tra CCCD 12 số, Ràng buộc 1 phòng chỉ có 1 Chủ hộ,...).
    *   **Chuẩn hóa dữ liệu (Sanitization):** Tự động format mã phòng (VD: `"a101 "` -> `"A101"`).
    *   **Quản lý Tạm trú/Tạm vắng:** Thiết lập ngày bắt đầu/kết thúc. Đảm bảo thời hạn tạm trú không vượt quá 24 tháng theo đúng Luật cư trú.
    *   Cơ chế **Soft Delete (Xóa mềm)** an toàn, đồng bộ vô hiệu hóa tài khoản User khi hồ sơ cư dân bị xóa.
*   **🚪 Quản lý Thẻ Căn Hộ (Apartment Cards):**
    *   Tự động gom nhóm (Dynamic Grouping) danh sách cư dân theo từng Phòng mà không cần bảng Household dư thừa.
    *   Giao diện dạng Grid thân thiện, dễ dàng theo dõi chủ hộ và số lượng thành viên trong mỗi phòng.
*   **📄 Thống kê & Xuất Báo cáo (Reporting):**
    *   Chốt số liệu và tạo Báo cáo PDF động bằng thư viện `pdfkit`.
    *   Có thể trích xuất "Báo cáo Tổng Hợp", "Báo cáo Tạm trú", "Báo cáo Biến động" theo từng tháng cụ thể.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### Frontend (Client-side)
*   **Core:** React 19, Vite (siêu tốc độ).
*   **Routing:** React Router DOM.
*   **Biểu đồ:** Chart.js & react-chartjs-2.
*   **Styling:** CSS thuần (Vanilla CSS) với bộ biến toàn cục (CSS Variables).

### Backend (Server-side)
*   **Core:** Node.js, Express.js.
*   **Cơ sở dữ liệu:** MongoDB (với Mongoose ODM).
*   **Bảo mật:** Helmet, CORS, JSON Web Token (JWT), bcryptjs.
*   **Tiện ích:** Zod (Validate), PDFKit (Render PDF).

---

## 🚀 Hướng dẫn cài đặt và chạy dự án (Installation)

### 1. Yêu cầu hệ thống (Prerequisites)
*   Node.js (phiên bản 18+ trở lên).
*   MongoDB (Cài đặt Local hoặc sử dụng MongoDB Atlas).
*   Git.

### 2. Tải mã nguồn
```bash
git clone https://github.com/Barc1007/TTCS.git
cd TTCS
```

### 3. Thiết lập Backend
Mở Terminal 1 và chạy các lệnh sau:
```bash
cd backend
npm install
```
Tạo file `.env` trong thư mục `backend` và điền cấu hình:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/residentiq?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_key
JWT_EXPIRES_IN=1d
```
Chạy server Backend:
```bash
npm run dev
```

### 4. Thiết lập Frontend
Mở Terminal 2 và chạy các lệnh sau:
```bash
cd frontend
npm install
npm run dev
```

### 5. Truy cập ứng dụng
Mở trình duyệt và truy cập vào đường dẫn:
👉 **http://localhost:5173**

---

## 🛡️ Tác giả & Thông tin (Authors)

Dự án được xây dựng và phát triển cho học phần **Thực Tập Cơ Sở** (TTCS).
*   **Tài khoản Admin mặc định để test:**
    *   Username: `huudat1007`
    *   Password: `123456`
*   **Cảnh báo:** Hãy luôn đổi mật khẩu mặc định khi đưa hệ thống lên môi trường thực tế (Production).
