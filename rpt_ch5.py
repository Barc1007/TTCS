
# ===== CHUONG 5: KE HOACH TRIEN KHAI & KIEM THU (Tuan 7) =====
H(doc,'CHƯƠNG 5. KẾ HOẠCH TRIỂN KHAI VÀ KIỂM THỬ (Tuần 7)',1)

H(doc,'5.1 Thiết kế Thuật toán – Kiểm tra Business Rules',2)
P(doc,'Hệ thống cài đặt các Business Rule trực tiếp trong ResidentController. Dưới đây là 2 thuật toán quan trọng nhất:')
P(doc,'Thuật toán xóa cư dân (BR-006 – Không xóa khi đang lưu trú):', bold=True)
for s in [
  'ĐẦU VÀO: id cư dân cần xóa.',
  'Bước 1: Tìm cư dân theo id. Nếu không tồn tại -> trả 404.',
  'Bước 2: Kiểm tra resident.status == "Tạm trú" -> trả 409: Không thể xóa cư dân đang tạm trú.',
  'Bước 3: Kiểm tra resident.status == "Tạm vắng" -> trả 409: Không thể xóa cư dân đang tạm vắng.',
  'Bước 4: User.deleteOne với residentId = resident._id để xóa tài khoản liên kết.',
  'Bước 5: resident.deleteOne() xóa hồ sơ cư dân.',
  'ĐẦU RA: 200 OK - "Xóa cư dân thành công".',
]: B(doc,s)

P(doc,'Thuật toán tính thống kê Dashboard (getResidentStats):', bold=True)
for s in [
  'ĐẦU VÀO: Không có tham số (lấy toàn bộ).',
  'Bước 1: Resident.find() lấy tất cả cư dân (chỉ lấy trường status, createdAt, history, name).',
  'Bước 2: Đếm total, thuongtru, tamtru, tamvang bằng Array.filter().',
  'Bước 3: Vòng lặp 6 tháng gần nhất: với mỗi tháng đếm số cư dân có createdAt <= endOfMonth.',
  'Bước 4: Gộp tất cả history từ mọi cư dân, sắp xếp giảm dần theo thời gian, lấy 10 mục đầu.',
  'ĐẦU RA: {total, thuongtru, tamtru, tamvang, monthlyStats[6], recentActivities[10]}.',
]: B(doc,s)

H(doc,'5.2 Xử lý lỗi (Error Handling Strategy)',2)
T(doc,['HTTP Code','Trường hợp thực tế trong Source Code'],
[['400 Bad Request','Thiếu trường bắt buộc (cccd, name, dob...). Ngày kết thúc < ngày bắt đầu (tạm trú/tạm vắng). Mật khẩu mới ít hơn 8 ký tự.'],
 ['401 Unauthorized','Sai username/password khi đăng nhập. Không có Bearer token. Token không hợp lệ hoặc hết hạn (7 ngày). User đã bị xóa khỏi DB nhưng token còn hiệu lực.'],
 ['403 Forbidden','Resident cố gọi API chỉ dành cho staff/admin. Staff cố gọi API DELETE chỉ dành cho admin.'],
 ['404 Not Found','id cư dân không tồn tại trong MongoDB. Tài khoản chưa liên kết residentId khi gọi /residents/me.'],
 ['409 Conflict','Thêm cư dân có CCCD đã tồn tại. Đăng ký tạm trú khi đang tạm vắng (và ngược lại). Xóa cư dân đang Tạm trú hoặc Tạm vắng. Mã hộ gia đình đã tồn tại.'],
 ['500 Internal Error','Lỗi kết nối MongoDB Atlas. Lỗi Mongoose schema validation. Lỗi ngoại lệ không được bắt.']])
P(doc,'Tất cả API trả về lỗi theo chuẩn JSON: { "message": "<mô tả lỗi>" }. Hàm sanitizeUser() đảm bảo trường passwordHash không bao giờ xuất hiện trong response.')

H(doc,'5.3 Chiến lược Kiểm thử',2)
T(doc,['Loại kiểm thử','Công cụ','Phạm vi & Kịch bản kiểm thử'],
[['Integration Testing (API)','Postman','Kiểm thử 15 endpoints. Test case positive: đăng nhập đúng -> nhận token. Test case negative: đăng nhập sai -> 401. Tạo 2 cư dân trùng CCCD -> 409. Đăng ký tạm trú khi đang tạm vắng -> 409. Xóa cư dân đang Tạm trú -> 409. Gọi API không có token -> 401.'],
 ['Manual Testing (UI)','Trình duyệt Chrome','Đăng nhập với từng role (admin, staff, resident), kiểm tra quyền hạn hiển thị menu. Thêm cư dân -> kiểm tra tài khoản tự tạo. Đăng nhập bằng CCCD làm username với mật khẩu 8 số cuối. Bắt buộc đổi mật khẩu lần đầu (mustChangePassword). Dashboard: kiểm tra số liệu và biểu đồ cập nhật đúng sau khi thêm cư dân.'],
 ['Data Validation','Trực tiếp trên UI','Nhập form thiếu trường -> kiểm tra thông báo lỗi validation. Nhập ngày tạm trú end < start -> kiểm tra API trả 400.']])

H(doc,'5.4 Tiêu chuẩn Code (Coding Standards)',2)
T(doc,['Quy tắc','Chi tiết áp dụng trong Source Code'],
[['Đặt tên hàm/biến','camelCase: getResidentStats, createResident, addHistory, signToken, verifyToken'],
 ['Đặt tên Model/Class','PascalCase: Resident, User, Household, ActivityLog, AuthController'],
 ['Đặt tên file','Dạng <module>.<type>.js: auth.controller.js, resident.routes.js, auth.middleware.js'],
 ['Module System','ES Modules (import/export) cho cả Backend và Frontend (package.json: "type":"module")'],
 ['Cấu trúc thư mục Backend','src/config (db, env), src/models, src/controllers, src/routes, src/middleware, src/utils'],
 ['Comment','Ghi chú Business Rules trong code: BR-006 (khong xoa khi tam tru/tam vang), ghi chú logic route (/me phai truoc /:id)'],
 ['Error handling','Moi controller dung try/catch. Middleware xu ly loi tap trung. Phan biet ro HTTP codes 400/401/403/404/409/500']])

H(doc,'5.5 Kế hoạch Triển khai',2)
T(doc,['Giai đoạn','Nhiệm vụ','Kết quả'],
[['Giai đoạn 1 (Tuan 1-4)','Phan tich yeu cau, thiet ke kien truc, chon MERN Stack, cau hinh MongoDB Atlas, xay dung Mongoose Schemas (User, Resident, Household, ActivityLog)','DB Schema hoan chinh, ket noi Atlas thanh cong'],
 ['Giai đoạn 2 (Tuan 5-6)','Trien khai day du Backend API (auth, residents, households), Middleware, JWT Auth. Xay dung Frontend React: tat ca pages, contexts, routing, Chart.js Dashboard','Backend API chay o port 5000, Frontend chay o port 5173'],
 ['Giai đoạn 3 (Tuan 7)','Kiem thu toan bo chuc nang (Postman + Manual). Sua loi. Kiem tra phan quyen tung role. Dam bao cac Business Rules hoat dong dung.','He thong on dinh, day du chuc nang theo yeu cau']])

# ===== KET LUAN =====
H(doc,'KẾT LUẬN',1)
P(doc,'Dự án Phần mềm Quản lý Cư dân – ResidentIQ đã được thiết kế và triển khai hoàn chỉnh bằng MERN Stack (MongoDB Atlas, Express.js, React.js, Node.js). Hệ thống đáp ứng đầy đủ 21 yêu cầu chức năng và 15 yêu cầu phi chức năng đề ra từ Tuần 1.')
P(doc,'Điểm nổi bật kỹ thuật của dự án: (1) Kiến trúc Modular Monolith phân chia module rõ ràng phù hợp quy mô team. (2) Hệ thống phân quyền 3 cấp (admin/staff/resident) được bảo vệ ở cả Backend (middleware) và Frontend (route guard). (3) Tính năng tự động tạo tài khoản User khi thêm cư dân. (4) Lịch sử biến động được ghi nhận tự động mọi thao tác. (5) Các Business Rules như chống xóa khi đang lưu trú (BR-006), CCCD duy nhất (BR-001), chống tạm trú khi đang tạm vắng (BR-005) được cài đặt chặt chẽ trong controller.')
P(doc,'Báo cáo này phản ánh chính xác toàn bộ quá trình từ phân tích yêu cầu đến thiết kế kiến trúc và cài đặt thực tế trong source code, phục vụ mục tiêu đánh giá cuối kỳ môn Thiết kế Hệ thống Phần mềm.')

out = r'd:\TTCS-main\BaoCaoCuoiKy_Final.docx'
doc.save(out)
print('DONE:', out)
