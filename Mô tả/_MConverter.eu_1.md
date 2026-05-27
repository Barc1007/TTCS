# Phần mềm quản lý cư dân

Nhóm 17:

Nguyễn Thành Nam N23DCCN108

Nguyễn Hữu Đạt N23DCCN077

Nguyễn Kỳ Đức An N23DCCN070

# 

## 1.1 Define Project Vision {#define-project-vision}

### 1. Vấn đề hệ thống cần giải quyết (Problem Statement) {#vấn-đề-hệ-thống-cần-giải-quyết-problem-statement}

Nhóm chúng em mang đến phần mềm quản lý cư dân, giúp chính quyền và ban quản lý chung cư dễ dàng quản lý dân cư trong chung cư/ nhà trọ,... giúp giải quyết các vấn đề mà quản lý bằng sổ sách trước đây dễ mắc sai sót như:

> Khó theo dõi ai đang cư trú tại căn hộ nào
>
> Quản lý tạm trú, tạm vắng không đồng bộ
>
> Dễ sai sót, mất dữ liệu
>
> Khó thống kê, báo cáo nhanh khi cần

### 2. Mục tiêu chính của hệ thống  {#mục-tiêu-chính-của-hệ-thống}

> Quản lý đầy đủ thông tin cư dân trong khu vực
>
> Theo dõi chính xác tình trạng cư trú: thường trú, tạm trú, tạm vắng
>
> Xác định rõ ai đang ở căn hộ nào tại từng thời điểm
>
> Hỗ trợ tra cứu, thống kê và báo cáo nhanh
>
> Giảm sai sót và thời gian xử lý so với phương pháp thủ công

### 3. Phạm vi hệ thống (Scope) {#phạm-vi-hệ-thống-scope}

#### IN SCOPE (Trong phạm vi)

> Quản lý thông tin cư dân
>
> Quản lý căn hộ / địa chỉ cư trú
>
> Đăng ký và theo dõi tạm trú, tạm vắng
>
> Quản lý thẻ cư dân / thẻ ra vào (mức cơ bản)
>
> Thống kê số lượng cư dân và biến động nhân khẩu

#### OUT OF SCOPE (Ngoài phạm vi)

> Tích hợp với hệ thống dân cư quốc gia
>
> Nhận diện khuôn mặt / sinh trắc học
>
> Thanh toán, thu phí
>
> Ứng dụng mobile cho cư dân (chỉ tập trung quản lý)

### 4. Tiêu chí đánh giá thành công (Success Criteria -- đo được) {#tiêu-chí-đánh-giá-thành-công-success-criteria-đo-được}

> Thêm, sửa, xóa và tìm kiếm cư dân trong thời gian \< 5 giây
>
> Toàn bộ cư dân có thể xác định được trạng thái cư trú hiện tại
>
> Tạo báo cáo thống kê cơ bản trong vòng 10 giây

## 

## 

1.2 Xác Định người dùng và các bên liên quan\
1. Người dùng chính {#xác-định-người-dùng-và-các-bên-liên-quan-1.-người-dùng-chính}
---------------------------------------------

### 1.1 Ban quản lý khu dân cư {#ban-quản-lý-khu-dân-cư}

**Vai trò:**

> Quản lý toàn bộ dữ liệu cư dân
>
> Duyệt và cập nhật thông tin tạm trú, tạm vắng
>
> Xem báo cáo, thống kê

**Quy trình làm việc trước khi có hệ thống**

> Ghi chép thông tin cư dân bằng sổ giấy hoặc file Excel rời rạc
>
> Khi cần tra cứu phải lật sổ hoặc tìm nhiều file khác nhau
>
> Dễ sai sót, trùng lặp dữ liệu, khó tổng hợp báo cáo
>
> Mất nhiều thời gian khi có kiểm tra đột xuất

**Bất tiện:**

> Tốn thời gian
>
> Dễ thiếu sót thông tin
>
> Khó theo dõi biến động theo thời gian

**Hệ thống sẽ giải quyết:** lưu trữ tập trung, tra cứu nhanh, tự động thống kê.

### 1.2 Cán bộ hành chính / lễ tân {#cán-bộ-hành-chính-lễ-tân}

**Vai trò:**

> Nhập thông tin cư dân mới
>
> Ghi nhận đăng ký tạm trú -- tạm vắng
>
> Cấp và quản lý thẻ cư dân

**Trước khi có hệ thống:**

> Nhập tay vào sổ
>
> Dễ ghi sai thời gian, nhầm người
>
> Phải hỏi lại nhiều lần

**Hệ thống hỗ trợ:** nhập liệu chuẩn hóa, kiểm tra trùng lặp.

## 2. Người dùng phụ {#người-dùng-phụ}

### 2.1 Cư dân {#cư-dân}

> Cung cấp thông tin cá nhân
>
> Đăng ký tạm trú / tạm vắng thông qua ban quản lý
>
> Nhận thẻ cư dân

### 2.2 Cơ quan quản lý địa phương  {#cơ-quan-quản-lý-địa-phương}

> Nhận báo cáo thống kê khi cần
>
> Không trực tiếp sử dụng hệ thống

### 3. User Personas (2--3 personas) {#user-personas-23-personas}

#### Person 1

> **Tên:** Nguyễn Thành Nam
>
> **Vai trò:** Cán bộ quản lý dân cư
>
> **Mục tiêu:** Quản lý chính xác thông tin cư dân, giảm giấy tờ
>
> **Pain points:**
>
> Dữ liệu phân tán
>
> Khó thống kê nhanh
>
> Dễ nhầm lẫn tạm trú -- tạm vắng

#### Person 2

> **Tên:** Trần Thị Nữ
>
> **Vai trò:** Ban quản lý chung cư
>
> **Mục tiêu:** Biết chính xác ai đang sinh sống trong từng căn hộ
>
> **Pain points:**
>
> Khó kiểm soát người ra vào
>
> Không biết cư dân đã rời đi hay chưa

#### Person 3

**Tên: Nguyễn Thị Gái**

> **Vai trò:** Cư dân
>
> **Mục tiêu:** Đăng ký tạm trú tạm vắng
>
> **Pain points:**
>
> Thủ tục đăng ký tạm trú rườm rà
>
> Chậm xác nhận giấy tờ

# 1.3 Define System Context {#define-system-context}

## 1. Mục tiêu {#mục-tiêu}

Xác định ranh giới hệ thống, các tác nhân bên ngoài, cũng như dữ liệu vào -- ra của hệ thống quản lý cư dân và biến động nhân khẩu.

## 2. System Boundary (Ranh giới hệ thống) {#system-boundary-ranh-giới-hệ-thống}

### BÊN TRONG HỆ THỐNG

Hệ thống **Quản lý Cư dân & Biến động nhân khẩu** bao gồm:

> Quản lý thông tin cư dân
>
> Quản lý căn hộ / địa chỉ
>
> Đăng ký và theo dõi tạm trú, tạm vắng
>
> Quản lý thẻ cư dân / ra vào (mức cơ bản)
>
> Thống kê và báo cáo nhân khẩu

Tất cả dữ liệu được lưu trữ và xử lý nội bộ trong hệ thống

### BÊN NGOÀI HỆ THỐNG

> Người dùng (cán bộ, ban quản lý)
>
> Các hệ thống khác (nếu có tích hợp)

## 3. External Systems / Services (Hệ thống bên ngoài) {#external-systems-services-hệ-thống-bên-ngoài}

> **Hệ thống hành chính địa phương**\
> → Nhận báo cáo thống kê nhân khẩu
>
> **Hệ thống an ninh / bảo vệ**\
> → Tham khảo thông tin cư dân, thẻ ra vào
>
> **Người dân / cư dân**\
> → Cung cấp thông tin đăng ký tạm trú, tạm vắng

## 4. Các tác nhân chính (Actors) {#các-tác-nhân-chính-actors}

> Cán bộ quản lý dân cư
>
> Ban quản lý khu dân cư / chung cư
>
> Cư dân (gián tiếp)

## 5. Dữ liệu đầu vào (Main Inputs) {#dữ-liệu-đầu-vào-main-inputs}

> Thông tin cư dân:
>
> Họ tên, CCCD, ngày sinh, giới tính
>
> Thông tin căn hộ / địa chỉ
>
> Thông tin đăng ký tạm trú:
>
> Thời gian bắt đầu -- kết thúc
>
> Thông tin đăng ký tạm vắng:
>
> Thời gian đi -- về
>
> Thông tin thẻ cư dân

## 6. Dữ liệu đầu ra (Main Outputs) {#dữ-liệu-đầu-ra-main-outputs}

> Danh sách cư dân theo căn hộ
>
> Danh sách người đang tạm trú
>
> Danh sách người đang tạm vắng
>
> Thống kê tổng số cư dân
>
> Báo cáo biến động nhân khẩu theo thời gian

## 7. System Context Diagram {#system-context-diagram}

![](media/image1.png){width="6.320833333333334in" height="2.6069444444444443in"}
