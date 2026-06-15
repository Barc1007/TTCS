
# ===== CHUONG 4: THIET KE CAP THAP (Tuan 6) =====
H(doc,'CHƯƠNG 4. THIẾT KẾ CẤP THẤP (Tuần 6)',1)
H(doc,'4.1 Sơ đồ Lớp – Backend Classes',2)
T(doc,['Lớp','Phương thức chính','Phụ thuộc'],
[['AuthController','register(), login(), me(), changePassword()','User model, bcrypt, jwt.js'],
 ['ResidentController','listResidents(), getResidentById(), createResident(), updateResident(), deleteResident(), registerTamTru(), registerTamVang(), getMyResidentInfo(), getResidentStats()','Resident model, User model, bcrypt'],
 ['HouseholdController','listHouseholds(), createHousehold()','Household model'],
 ['authMiddleware','requireAuth(req,res,next), requireRole(...roles)','User model, jwt.js'],
 ['jwt.js','signToken(payload): tạo token 7 ngày, verifyToken(token): giải mã token','jsonwebtoken, env.js'],
 ['User Model','Mongoose Schema: username unique, email unique, passwordHash, role enum, residentId ref Resident, mustChangePassword','mongoose'],
 ['Resident Model','Mongoose Schema: cccd unique, name, dob, gender, room, status enum, tamTru embedded, tamVang embedded, history array','mongoose'],
 ['Household Model','Mongoose Schema: code unique, apartment, address, headResidentId ref Resident, members array ref Resident','mongoose'],
 ['ActivityLog Model','Mongoose Schema: actor, action, entityType, entityId, before, after (Mixed type)','mongoose']])

H(doc,'4.2 Sơ đồ Trình tự – Luồng Đăng nhập',2)
for s in [
  '1. Client goi POST /api/auth/login voi body {usernameOrEmail, password}.',
  '2. login() kiem tra body: thieu truong bat buoc thi tra ve 400 Bad Request.',
  '3. User.findOne de tim kiem user theo username hoac email trong MongoDB.',
  '4. Khong tim thay user -> tra 401: Thong tin dang nhap khong chinh xac.',
  '5. bcrypt.compare(password, user.passwordHash) kiem tra mat khau.',
  '6. Mat khau sai -> tra 401: Thong tin dang nhap khong chinh xac.',
  '7. Hop le: jwt.sign voi payload {id, role, username}, ky bang JWT_SECRET, expiresIn 7d.',
  '8. Tra 200 OK voi {token, user: sanitizeUser(user)} (loai bo truong passwordHash).',
]: N(doc,s)

H(doc,'4.3 Sơ đồ Trình tự – Thêm cư dân & Tạo tài khoản',2)
for s in [
  '1. POST /api/residents voi body day du cac truong bat buoc.',
  '2. requireAuth: jwt.verify() giai ma token, User.findById() xac nhan user ton tai.',
  '3. requireRole(admin, staff): kiem tra req.user.role -> khong du quyen tra 403.',
  '4. Kiem tra cac truong bat buoc: cccd, name, dob, gender, room, regdate -> thieu tra 400.',
  '5. Resident.findOne kiem tra CCCD da ton tai chua -> co roi tra 409 Conflict.',
  '6. Resident.create: luu ho so voi status mac dinh Thuong tru, history ghi Them moi cu dan.',
  '7. defaultPassword = 8 so cuoi CCCD: cccd.slice(-8).',
  '8. bcrypt.hash ma hoa mat khau mac dinh voi salt rounds = 10.',
  '9. User.create: username=cccd, email=cccd@resident.local, role=resident, mustChangePassword=true, residentId lien ket.',
  '10. Tra 201 Created voi {message, resident}.',
]: N(doc,s)

H(doc,'4.4 Sơ đồ Trình tự – Đăng ký Tạm trú',2)
for s in [
  '1. POST /api/residents/:id/tam-tru voi body {address, start, end, reason, phone}.',
  '2. requireAuth + requireRole(admin, staff) kiem tra token va quyen.',
  '3. Resident.findById(id) -> khong tim thay tra 404.',
  '4. Thieu address, start, end hoac phone -> tra 400: Thieu thong tin tam tru.',
  '5. So sanh end < start -> tra 400: Ngay ket thuc khong duoc nho hon ngay bat dau.',
  '6. resident.status dang la Tam vang -> tra 409: Cu dan dang tam vang, khong the dang ky tam tru.',
  '7. Cap nhat: resident.status = Tam tru; resident.tamTru = {address, start, end, reason, phone}.',
  '8. addHistory: push {action: Dang ky tam tru, by: ten can bo, at: thoi gian hien tai} vao history[].',
  '9. resident.save() luu thay doi xuong MongoDB Atlas.',
  '10. Tra 200 OK voi {message, resident da cap nhat}.',
]: N(doc,s)

H(doc,'4.5 Thiết kế Frontend – Màn hình & Routing',2)
P(doc,'Frontend la SPA React dieu huong bang React-Router-DOM v7. App.jsx xu ly phan quyen UI dua tren user.role:')
T(doc,['Route','Component','Quyen','Chuc nang'],
[['/dashboard','Dashboard.jsx','admin, staff','Thong ke: tong so cu dan, phan loai trang thai, bieu do Line Chart 6 thang (Chart.js), log hoat dong gan nhat'],
 ['/residents','ResidentList.jsx','admin, staff','Danh sach cu dan, tim kiem realtime, loc theo trang thai'],
 ['/residents/add','ResidentAdd.jsx','admin, staff','Form them cu dan moi co validation phia client'],
 ['/residents/:id','ResidentDetail.jsx','admin, staff','Xem chi tiet ho so, sua thong tin, nut Dang ky tam tru/tam vang, xem lich su bien dong'],
 ['/tamtru','TamTru.jsx','admin, staff','Form dang ky tam tru cho cu dan duoc chon'],
 ['/tamvang','TamVang.jsx','admin, staff','Form dang ky tam vang cho cu dan duoc chon'],
 ['/reports','Reports.jsx','admin, staff','Trang bao cao va thong ke tong hop'],
 ['/my-profile','MyProfile.jsx','resident','Cu dan xem ho so ca nhan (goi GET /api/residents/me)']])
P(doc,'Hai Context Provider quan ly state toan app: AuthContext (user, token, login, logout) va ResidentContext (danh sach cu dan, toast, modal xac nhan).')
