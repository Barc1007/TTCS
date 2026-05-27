3.1-A: DANH SÁCH YÊU CẦU CHỨC NĂNG

## Hệ Thống Quản Lý Dân Cư Khu Dân Cư / Chung Cư {#hệ-thống-quản-lý-dân-cư-khu-dân-cư-chung-cư}

## PHẦN 1: YÊU CẦU THEO LĨNH VỰC TÍNH NĂNG

### 1.1 Xác Thực và Phân Quyền {#xác-thực-và-phân-quyền}

| ID | Phát biểu yêu cầu | Nguồn UC | Ưu tiên |
|:---|:---|:---|:---|
| REQ-001 | Hệ thống phải cho phép cán bộ quản lý đăng nhập bằng tên đăng nhập và mật khẩu hợp lệ | UC-001 | High |
| REQ-002 | Hệ thống phải hiển thị thông báo lỗi khi tên đăng nhập hoặc mật khẩu không đúng | UC-001 (Alt Flow) | High |
| REQ-003 | Hệ thống phải phân quyền người dùng theo vai trò (Cán bộ quản lý / Ban quản lý) | UC-001 | High |
| REQ-004 | Hệ thống phải ghi nhận thời gian đăng nhập và cập nhật dữ liệu của từng người dùng | UC-001 | Medium |

### 1.2 Quản Lý Thông Tin Cư Dân {#quản-lý-thông-tin-cư-dân}

| ID | Phát biểu yêu cầu | Nguồn UC | Ưu tiên |
|:---|:---|:---|:---|
| REQ-005 | Hệ thống phải cho phép cán bộ quản lý thêm mới thông tin cư dân gồm: họ tên, CCCD, ngày sinh, giới tính, địa chỉ, SĐT và mã hộ gia đình | UC-002 | High |
| REQ-006 | Hệ thống phải kiểm tra và yêu cầu nhập lại khi thông tin cư dân thiếu hoặc không hợp lệ trước khi lưu | UC-002 (Alt Flow) | High |
| REQ-007 | Hệ thống phải cho phép cán bộ quản lý cập nhật thông tin cư dân đã tồn tại trong hệ thống | UC-003 | High |
| REQ-008 | Hệ thống phải cho phép cán bộ quản lý xóa thông tin cư dân khi cần thiết | UC-003 | Medium |
| REQ-009 | Hệ thống phải cho phép tra cứu thông tin cư dân theo họ tên hoặc số CCCD | UC-002, UC-003 | High |
| REQ-010 | Hệ thống phải cho phép cư dân xem thông tin cư trú của bản thân | UC-002 | Medium |
| REQ-011 | Hệ thống phải cho phép cư dân cung cấp và cập nhật thông tin cá nhân của bản thân | UC-002 | Low |

### 1.3 Quản Lý Tạm Trú {#quản-lý-tạm-trú}

| ID | Phát biểu yêu cầu | Nguồn UC | Ưu tiên |
|:---|:---|:---|:---|
| REQ-012 | Hệ thống phải cho phép cán bộ quản lý đăng ký tạm trú cho cư dân với các thông tin: địa chỉ tạm trú, từ ngày, đến ngày và lý do | UC-004 | High |
| REQ-013 | Hệ thống phải lưu và hiển thị trạng thái tạm trú của cư dân sau khi đăng ký thành công | UC-004 | High |

### 1.4 Quản Lý Tạm Vắng {#quản-lý-tạm-vắng}

| ID | Phát biểu yêu cầu | Nguồn UC | Ưu tiên |
|:---|:---|:---|:---|
| REQ-014 | Hệ thống phải cho phép cán bộ quản lý đăng ký tạm vắng cho cư dân với các thông tin: từ ngày, đến ngày và lý do | UC-005 | High |
| REQ-015 | Hệ thống phải cập nhật trạng thái tạm vắng của cư dân sau khi đăng ký thành công | UC-005 | High |

### 1.5 Lịch Sử Biến Động Nhân Khẩu {#lịch-sử-biến-động-nhân-khẩu}

| ID | Phát biểu yêu cầu | Nguồn UC | Ưu tiên |
|:---|:---|:---|:---|
| REQ-016 | Hệ thống phải tự động lưu trữ lịch sử biến động nhân khẩu (thêm mới, cập nhật, tạm trú, tạm vắng) kèm thời gian thực hiện | UC-002, UC-003, UC-004, UC-005 | Medium |

### 1.6 Thống Kê và Báo Cáo {#thống-kê-và-báo-cáo}

| ID | Phát biểu yêu cầu | Nguồn UC | Ưu tiên |
|:---|:---|:---|:---|
| REQ-017 | Hệ thống phải thống kê số lượng cư dân đang sinh sống theo từng khu vực | UC-006 | High |
| REQ-018 | Hệ thống phải thống kê số lượng cư dân đang tạm trú và tạm vắng tại một thời điểm | UC-006 | High |
| REQ-019 | Hệ thống phải cho phép ban quản lý xem báo cáo tổng hợp dân số | UC-006 | High |
| REQ-020 | Hệ thống phải cho phép xuất báo cáo dưới dạng file PDF hoặc Excel | UC-006 | Medium |
| REQ-021 | Hệ thống phải gửi báo cáo nhân khẩu định kỳ cho cơ quan quản lý địa phương | UC-006 | Low |

## PHẦN 2: MA TRẬN CRUD

| Thực Thể | Create | Read | Update | Delete |
|:---|:---|:---|:---|:---|
| Nguoi_dung | (admin tạo ngoài HT) | REQ-001 | REQ-003 | --- |
| Cu_dan | REQ-005 | REQ-009, REQ-010 | REQ-007 | REQ-008 |
| Ho_gia_dinh | REQ-005 | REQ-009 | REQ-007 | --- |
| Tam_tru | REQ-012 | REQ-013 | --- | --- |
| Tam_vang | REQ-014 | REQ-015 | --- | --- |
| Bien_dong_nhan_khau | REQ-016 | REQ-016 | --- | --- |
| Bao_cao | REQ-019 | REQ-017, REQ-018, REQ-019 | --- | --- |

**Khoảng trống xác định:** - Nguoi_dung: Chưa có yêu cầu tạo/xóa người dùng từ giao diện (admin tạo trực tiếp DB) - Tam_tru / Tam_vang: Không có Update/Delete (lịch sử không nên chỉnh sửa - chấp nhận được) - Ho_gia_dinh: Chưa có yêu cầu Delete riêng biệt

## PHẦN 3: KHẢ NĂNG TRUY XUẤT (TRACEABILITY MATRIX)

| ID Yêu Cầu | Use Case Nguồn                 | Thực Thể Bị Ảnh Hưởng      |
|:-----------|:-------------------------------|:---------------------------|
| REQ-001    | UC-001: Đăng nhập              | Nguoi_dung                 |
| REQ-002    | UC-001: Đăng nhập (Alt Flow)   | Nguoi_dung                 |
| REQ-003    | UC-001: Đăng nhập              | Nguoi_dung                 |
| REQ-004    | UC-001: Đăng nhập              | Nguoi_dung                 |
| REQ-005    | UC-002: Thêm cư dân mới        | Cu_dan, Ho_gia_dinh        |
| REQ-006    | UC-002: Thêm cư dân (Alt Flow) | Cu_dan                     |
| REQ-007    | UC-003: Cập nhật thông tin     | Cu_dan, Ho_gia_dinh        |
| REQ-008    | UC-003: Cập nhật thông tin     | Cu_dan                     |
| REQ-009    | UC-002, UC-003                 | Cu_dan                     |
| REQ-010    | UC-002                         | Cu_dan                     |
| REQ-011    | UC-002                         | Cu_dan                     |
| REQ-012    | UC-004: Đăng ký tạm trú        | Tam_tru, Cu_dan            |
| REQ-013    | UC-004: Đăng ký tạm trú        | Tam_tru                    |
| REQ-014    | UC-005: Đăng ký tạm vắng       | Tam_vang, Cu_dan           |
| REQ-015    | UC-005: Đăng ký tạm vắng       | Tam_vang                   |
| REQ-016    | UC-002, UC-003, UC-004, UC-005 | Bien_dong_nhan_khau        |
| REQ-017    | UC-006: Thống kê và Báo cáo    | Bao_cao, Cu_dan            |
| REQ-018    | UC-006: Thống kê và Báo cáo    | Bao_cao, Tam_tru, Tam_vang |
| REQ-019    | UC-006: Thống kê và Báo cáo    | Bao_cao                    |
| REQ-020    | UC-006: Thống kê và Báo cáo    | Bao_cao                    |
| REQ-021    | UC-006: Thống kê và Báo cáo    | Bao_cao                    |

*Tổng số yêu cầu chức năng: 21 yêu cầu (REQ-001 đến REQ-021)\
\*
3.2-A: ĐẶC TẢ YÊU CẦU PHI CHỨC NĂNG

## Hệ Thống Quản Lý Dân Cư Khu Dân Cư / Chung Cư {#hệ-thống-quản-lý-dân-cư-khu-dân-cư-chung-cư-1}

## 1. HIỆU NĂNG (PERFORMANCE) {#hiệu-năng-performance}

| ID | Danh mục | Phát biểu yêu cầu | Ưu tiên |
|:---|:---|:---|:---|
| NFR-001 | Hiệu năng | Hệ thống phải phản hồi các thao tác tra cứu thông tin cư dân trong vòng 10 giây khi có tối đa 50 người dùng đồng thời | High |
| NFR-002 | Hiệu năng | Hệ thống phải tạo và hiển thị báo cáo thống kê trong vòng 20 giây với tập dữ liệu lên đến 10.000 bản ghi cư dân | High |
| NFR-003 | Hiệu năng | Hệ thống phải xử lý và lưu trữ tối thiểu 100 giao dịch cập nhật dữ liệu cư dân mỗi ngày | Medium |

**Giải thích:** - NFR-001: Tra cứu là thao tác thường xuyên nhất → cần phản hồi nhanh - NFR-002: Báo cáo tổng hợp phức tạp hơn → cho phép 5 giây - NFR-003: Phù hợp quy mô khu dân cư/chung cư cỡ vừa

## 2. BẢO MẬT (SECURITY) {#bảo-mật-security}

| ID | Danh mục | Phát biểu yêu cầu | Ưu tiên |
|:---|:---|:---|:---|
| NFR-004 | Bảo mật | Hệ thống phải xác thực người dùng bằng tên đăng nhập và mật khẩu trước khi cho phép truy cập bất kỳ chức năng nào | High |
| NFR-005 | Bảo mật | Hệ thống phải mã hóa toàn bộ mật khẩu người dùng bằng thuật toán băm bcrypt trước khi lưu vào cơ sở dữ liệu | High |
| NFR-006 | Bảo mật | Hệ thống phải yêu cầu mật khẩu tối thiểu 8 ký tự, bao gồm ít nhất một chữ hoa và một chữ số | High |
| NFR-007 | Bảo mật | Hệ thống phải giới hạn quyền truy cập chức năng xóa thông tin cư dân chỉ dành cho vai trò Cán bộ quản lý | High |
| NFR-008 | Bảo mật | Hệ thống phải tự động đăng xuất người dùng sau 30 phút không có hoạt động | Medium |

**Giải thích:** - NFR-004 đến NFR-006: Bảo vệ thông tin nhân khẩu là dữ liệu nhạy cảm - NFR-007: Phân quyền theo UC-001 (Ban quản lý chỉ xem báo cáo) - NFR-008: Bảo vệ khi người dùng quên không đăng xuất

## 3. KHẢ NĂNG SỬ DỤNG (USABILITY) {#khả-năng-sử-dụng-usability}

| ID | Danh mục | Phát biểu yêu cầu | Ưu tiên |
|:---|:---|:---|:---|
| NFR-009 | Khả năng sử dụng | Hệ thống phải hoạt động trên các trình duyệt Chrome, Firefox và Edge phiên bản phát hành trong 2 năm gần nhất | High |
| NFR-010 | Khả năng sử dụng | Hệ thống phải hiển thị giao diện hoàn chỉnh trên màn hình có độ phân giải tối thiểu 1280x720 pixel | Medium |
| NFR-011 | Khả năng sử dụng | Cán bộ quản lý mới phải có khả năng thực hiện thao tác thêm cư dân và đăng ký tạm trú/tạm vắng sau tối đa 2 giờ đào tạo | Medium |

**Giải thích:** - NFR-009: Không yêu cầu cài đặt phần mềm đặc biệt, dùng trình duyệt phổ thông - NFR-011: Cán bộ quản lý không nhất thiết phải là người am hiểu công nghệ

## 4. KHẢ DỤNG (AVAILABILITY) {#khả-dụng-availability}

| ID | Danh mục | Phát biểu yêu cầu | Ưu tiên |
|:---|:---|:---|:---|
| NFR-012 | Khả dụng | Hệ thống phải hoạt động liên tục trong giờ hành chính (7h00 -- 17h00) các ngày làm việc với uptime tối thiểu 99% | High |
| NFR-013 | Khả dụng | Hệ thống phải phục hồi dữ liệu và hoạt động trở lại trong vòng 4 giờ sau sự cố kỹ thuật | Medium |

**Giải thích:** - NFR-012: Hệ thống quản lý hành chính → chủ yếu dùng trong giờ làm việc - NFR-013: RTO (Recovery Time Objective) = 4 giờ là chấp nhận được với hệ thống cấp phường/khu dân cư

## 5. RÀNG BUỘC KỸ THUẬT (CONSTRAINTS) {#ràng-buộc-kỹ-thuật-constraints}

| ID | Danh mục | Phát biểu yêu cầu | Ưu tiên |
|:---|:---|:---|:---|
| NFR-014 | Ràng buộc | Hệ thống phải được xây dựng dưới dạng ứng dụng web, không yêu cầu cài đặt phần mềm phía người dùng | High |
| NFR-015 | Ràng buộc | Hệ thống phải lưu trữ dữ liệu bằng hệ quản trị cơ sở dữ liệu quan hệ (MySQL ) | High |

**Giải thích:** - NFR-014: Đảm bảo triển khai dễ dàng, không cần cài đặt tại từng máy trạm - NFR-015: Phù hợp với mô hình ERD quan hệ đã thiết kế (DOC 2.3)

## TỔNG KẾT

| Danh mục         | Số lượng NFR | IDs                     |
|:-----------------|:-------------|:------------------------|
| Hiệu năng        | 3            | NFR-001 đến NFR-003     |
| Bảo mật          | 5            | NFR-004 đến NFR-008     |
| Khả năng sử dụng | 3            | NFR-009 đến NFR-011     |
| Khả dụng         | 2            | NFR-012 đến NFR-013     |
| Ràng buộc        | 2            | NFR-014 đến NFR-015     |
| **Tổng cộng**    | **15**       | **NFR-001 đến NFR-015** |

# 3.3-A: TÀI LIỆU WIREFRAMES UI {#a-tài-liệu-wireframes-ui}

## Hệ Thống Quản Lý Dân Cư Khu Dân Cư / Chung Cư {#hệ-thống-quản-lý-dân-cư-khu-dân-cư-chung-cư-2}

## DANH MỤC MÀN HÌNH

| STT | Tên màn hình | Mục đích | Use Case hỗ trợ | Ưu tiên |
|:---|:---|:---|:---|:---|
| 1 | Đăng nhập | Xác thực người dùng | UC-001 | High |
| 2 | Trang chủ / Dashboard | Tổng quan và điều hướng | UC-001 | High |
| 3 | Danh sách cư dân | Xem & tìm kiếm cư dân | UC-002, UC-003 | High |
| 4 | Thêm cư dân mới | Nhập thông tin cư dân | UC-002 | High |
| 5 | Chi tiết cư dân | Xem & sửa thông tin cư dân | UC-003 | High |
| 6 | Đăng ký tạm trú | Form đăng ký tạm trú | UC-004 | High |
| 7 | Đăng ký tạm vắng | Form đăng ký tạm vắng | UC-005 | High |
| 8 | Thống kê & Báo cáo | Xem thống kê và xuất báo cáo | UC-006 | High |

## WIREFRAME 1: ĐĂNG NHẬP

**Tên màn hình:** Đăng nhập hệ thống **Mục đích:** Xác thực danh tính người dùng trước khi truy cập hệ thống **Use Case hỗ trợ:** UC-001

    +----------------------------------------------------------+
    |         HỆ THỐNG QUẢN LÝ DÂN CƯ CHUNG CƯ               |
    |                  [LOGO PLACEHOLDER]                       |
    +----------------------------------------------------------+
    |                                                          |
    |              +---------------------------+               |
    |              |       ĐĂNG NHẬP           |               |
    |              +---------------------------+               |
    |              |                           |               |
    |              | Tên đăng nhập:            |               |
    |              | [_______________________] |               |
    |              |                           |               |
    |              | Mật khẩu:                 |               |
    |              | [_______________________] |               |
    |              |                           |               |
    |              | [!] Thông báo lỗi         |               |
    |              |     (hiện khi sai TK/MK)  |               |
    |              |                           |               |
    |              |    [  ĐĂNG NHẬP  ]        |               |
    |              |                           |               |
    |              +---------------------------+               |
    |                                                          |
    +----------------------------------------------------------+

**Ghi chú:** - Trường "Mật khẩu" ẩn ký tự (type=password) - Nút \[ĐĂNG NHẬP\] gửi form → UC-001 Main Flow - Thông báo lỗi hiện khi sai thông tin → UC-001 Alt Flow (REQ-002) - Sau đăng nhập thành công → chuyển đến màn hình Dashboard

## WIREFRAME 2: TRANG CHỦ / DASHBOARD {#wireframe-2-trang-chủ-dashboard}

**Tên màn hình:** Trang chủ **Mục đích:** Cung cấp cái nhìn tổng quan và điều hướng đến các chức năng **Use Case hỗ trợ:** UC-001, UC-006

    +----------------------------------------------------------+
    | [LOGO] HỆ THỐNG QUẢN LÝ DÂN CƯ     [Tên người dùng] [X]|
    |------|--------|---------|----------|---------------------|
    | TRANG CHỦ | CƯ DÂN | TẠM TRÚ | BÁO CÁO | ĐĂNG XUẤT   |
    +----------------------------------------------------------+
    |                                                          |
    |  +------------------+  +------------------+             |
    |  | TỔNG CƯ DÂN      |  | TẠM TRÚ          |             |
    |  |                  |  |                  |             |
    |  |     [SỐ]         |  |     [SỐ]         |             |
    |  | người            |  | người            |             |
    |  +------------------+  +------------------+             |
    |                                                          |
    |  +------------------+  +------------------+             |
    |  | TẠM VẮNG         |  | BIẾN ĐỘNG        |             |
    |  |                  |  | THÁNG NÀY        |             |
    |  |     [SỐ]         |  |     [SỐ]         |             |
    |  | người            |  | giao dịch        |             |
    |  +------------------+  +------------------+             |
    |                                                          |
    |  TRUY CẬP NHANH:                                        |
    |  [ + Thêm cư dân ] [ Đăng ký tạm trú ] [Xem báo cáo]  |
    |                                                          |
    +----------------------------------------------------------+
    | Cập nhật lần cuối: [THỜI GIAN]                          |
    +----------------------------------------------------------+

**Ghi chú:** - 4 thẻ thống kê nhanh (REQ-017, REQ-018) - Thanh điều hướng trên cùng → truy cập tất cả chức năng - Nút truy cập nhanh cho 3 thao tác phổ biến nhất

## WIREFRAME 3: DANH SÁCH CƯ DÂN

**Tên màn hình:** Quản lý danh sách cư dân **Mục đích:** Xem, tìm kiếm toàn bộ danh sách cư dân **Use Case hỗ trợ:** UC-002, UC-003

    +----------------------------------------------------------+
    | [LOGO] HỆ THỐNG QUẢN LÝ DÂN CƯ     [Tên người dùng] [X]|
    | TRANG CHỦ | [CƯ DÂN] | TẠM TRÚ | BÁO CÁO | ĐĂNG XUẤT  |
    +----------------------------------------------------------+
    | DANH SÁCH CƯ DÂN                   [ + THÊM CƯ DÂN ]   |
    +----------------------------------------------------------+
    |                                                          |
    | Tìm kiếm: [_____________________] [Theo: Họ tên v]      |
    |           [  TÌM KIẾM  ]                                |
    |                                                          |
    +--------+------------------+------------+--------+-------+
    | STT    | Họ và tên        | CCCD       | Trạng  | Thao  |
    |        |                  |            | thái   | tác   |
    +--------+------------------+------------+--------+-------+
    | 1      | [Tên cư dân]     | [Số CCCD]  | Thường | [Xem] |
    |        |                  |            | trú    | [Sửa] |
    +--------+------------------+------------+--------+-------+
    | 2      | [Tên cư dân]     | [Số CCCD]  | Tạm    | [Xem] |
    |        |                  |            | trú    | [Sửa] |
    +--------+------------------+------------+--------+-------+
    | 3      | [Tên cư dân]     | [Số CCCD]  | Tạm    | [Xem] |
    |        |                  |            | vắng   | [Sửa] |
    +--------+------------------+------------+--------+-------+
    |                    [ < Trang trước ] [1] [ Trang sau > ] |
    +----------------------------------------------------------+

**Ghi chú:** - Ô tìm kiếm hỗ trợ tìm theo họ tên hoặc CCCD (REQ-009) - Cột "Trạng thái": Thường trú / Tạm trú / Tạm vắng - Nút \[Xem\] → Màn hình 5 (Chi tiết cư dân) - Nút \[Sửa\] → Màn hình 5 (bật chế độ chỉnh sửa) - Nút \[+ THÊM CƯ DÂN\] → Màn hình 4

## WIREFRAME 4: THÊM CƯ DÂN MỚI

**Tên màn hình:** Thêm cư dân mới **Mục đích:** Nhập thông tin cho cư dân mới đăng ký **Use Case hỗ trợ:** UC-002

    +----------------------------------------------------------+
    | [LOGO] HỆ THỐNG QUẢN LÝ DÂN CƯ     [Tên người dùng] [X]|
    | TRANG CHỦ | [CƯ DÂN] | TẠM TRÚ | BÁO CÁO | ĐĂNG XUẤT  |
    +----------------------------------------------------------+
    | < Quay lại danh sách      THÊM CƯ DÂN MỚI               |
    +----------------------------------------------------------+
    |                                                          |
    | THÔNG TIN CÁ NHÂN                                       |
    | +------------------------------------------------------+|
    | | Họ và tên (*):    [______________________________]  ||
    | | Số CCCD (*):      [______________________________]  ||
    | | Ngày sinh (*):    [DD/MM/YYYY]                      ||
    | | Giới tính (*):    ( ) Nam  ( ) Nữ  ( ) Khác         ||
    | | Số điện thoại:    [______________________________]  ||
    | +------------------------------------------------------+|
    |                                                          |
    | THÔNG TIN CƯ TRÚ                                        |
    | +------------------------------------------------------+|
    | | Địa chỉ thường trú: [__________________________]    ||
    | | Mã hộ gia đình (*): [__________________________]    ||
    | |                     [Tìm hộ gia đình]               ||
    | +------------------------------------------------------+|
    |                                                          |
    | [!] Vùng thông báo lỗi (hiện khi thiếu thông tin)      |
    |                                                          |
    |           [  HỦY  ]    [  LƯU CƯ DÂN  ]                |
    |                                                          |
    +----------------------------------------------------------+

**Ghi chú:** - (\*) = trường bắt buộc (REQ-005) - Validation trước khi lưu → hiển thị lỗi nếu thiếu (REQ-006) - \[LƯU CƯ DÂN\] → lưu thành công → quay về màn hình 3 - \[HỦY\] → quay về màn hình 3 không lưunot

## WIREFRAME 5: CHI TIẾT CƯ DÂN

**Tên màn hình:** Chi tiết / Chỉnh sửa thông tin cư dân **Mục đích:** Xem đầy đủ và chỉnh sửa thông tin cư dân **Use Case hỗ trợ:** UC-003

    +----------------------------------------------------------+
    | [LOGO] HỆ THỐNG QUẢN LÝ DÂN CƯ     [Tên người dùng] [X]|
    | TRANG CHỦ | [CƯ DÂN] | TẠM TRÚ | BÁO CÁO | ĐĂNG XUẤT  |
    +----------------------------------------------------------+
    | < Quay lại danh sách          CHI TIẾT CƯ DÂN           |
    +----------------------------------------------------------+
    |                                                          |
    | THÔNG TIN CÁ NHÂN              [ CHỈNH SỬA ] [ XÓA ]   |
    | +------------------------------------------------------+|
    | | Họ và tên:       Nguyễn Văn A                       ||
    | | Số CCCD:         001234567890                        ||
    | | Ngày sinh:       01/01/1990                          ||
    | | Giới tính:       Nam                                 ||
    | | Số điện thoại:   0912345678                          ||
    | | Địa chỉ:         Số 1, Đường ABC                    ||
    | | Hộ gia đình:     HGD-001                             ||
    | | Trạng thái:      [Thường trú]                        ||
    | +------------------------------------------------------+|
    |                                                          |
    | LỊCH SỬ BIẾN ĐỘNG                                       |
    | +------------------------------------------------------+|
    | | 25/02/2026 | Đăng ký tạm vắng | Cán bộ XYZ          ||
    | | 01/01/2026 | Thêm mới cư dân  | Cán bộ XYZ          ||
    | +------------------------------------------------------+|
    |                                                          |
    | [ Đăng ký tạm trú ] [ Đăng ký tạm vắng ]               |
    |                                                          |
    +----------------------------------------------------------+

**Ghi chú:** - \[CHỈNH SỬA\] → chuyển các trường sang chế độ input (REQ-007) - \[XÓA\] → xác nhận xóa cư dân (REQ-008) - chỉ hiện với Cán bộ QL - Lịch sử biến động hiển thị từ bảng Bien_dong_nhan_khau (REQ-016) - 2 nút dưới → dẫn đến màn hình 6, 7

## WIREFRAME 6: ĐĂNG KÝ TẠM TRÚ

**Tên màn hình:** Form đăng ký tạm trú **Mục đích:** Đăng ký tạm trú cho cư dân **Use Case hỗ trợ:** UC-004

    +----------------------------------------------------------+
    | [LOGO] HỆ THỐNG QUẢN LÝ DÂN CƯ     [Tên người dùng] [X]|
    | TRANG CHỦ | CƯ DÂN | [TẠM TRÚ] | BÁO CÁO | ĐĂNG XUẤT  |
    +----------------------------------------------------------+
    | < Quay lại            ĐĂNG KÝ TẠM TRÚ                   |
    +----------------------------------------------------------+
    |                                                          |
    | Cư dân: [Nguyễn Văn A - CCCD: 001234567890]             |
    |         [Chọn cư dân khác]                              |
    |                                                          |
    | THÔNG TIN TẠM TRÚ                                       |
    | +------------------------------------------------------+|
    | | Địa chỉ tạm trú (*): [_____________________________]||
    | |                                                     ||
    | | Từ ngày (*):   [DD/MM/YYYY]                         ||
    | | Đến ngày (*):  [DD/MM/YYYY]                         ||
    | |                                                     ||
    | | Lý do (*):     [_____________________________]      ||
    | |                [_____________________________]      ||
    | +------------------------------------------------------+|
    |                                                          |
    | [!] Vùng thông báo lỗi                                  |
    |                                                          |
    |        [  HỦY  ]    [  XÁC NHẬN ĐĂNG KÝ  ]             |
    |                                                          |
    +----------------------------------------------------------+

**Ghi chú:** - (\*) = trường bắt buộc (REQ-012) - \[XÁC NHẬN ĐĂNG KÝ\] → lưu tạm trú, cập nhật trạng thái cư dân → REQ-013 - Sau khi lưu → thông báo thành công, quay lại màn hình 5

## WIREFRAME 7: ĐĂNG KÝ TẠM VẮNG

**Tên màn hình:** Form đăng ký tạm vắng **Mục đích:** Đăng ký tạm vắng cho cư dân **Use Case hỗ trợ:** UC-005

    +----------------------------------------------------------+
    | [LOGO] HỆ THỐNG QUẢN LÝ DÂN CƯ     [Tên người dùng] [X]|
    | TRANG CHỦ | CƯ DÂN | [TẠM VẮNG] | BÁO CÁO | ĐĂNG XUẤT |
    +----------------------------------------------------------+
    | < Quay lại            ĐĂNG KÝ TẠM VẮNG                  |
    +----------------------------------------------------------+
    |                                                          |
    | Cư dân: [Nguyễn Văn A - CCCD: 001234567890]             |
    |         [Chọn cư dân khác]                              |
    |                                                          |
    | THÔNG TIN TẠM VẮNG                                      |
    | +------------------------------------------------------+|
    | | Từ ngày (*):   [DD/MM/YYYY]                         ||
    | | Đến ngày (*):  [DD/MM/YYYY]                         ||
    | |                                                     ||
    | | Lý do (*):     [_____________________________]      ||
    | |                [_____________________________]      ||
    | +------------------------------------------------------+|
    |                                                          |
    | [!] Vùng thông báo lỗi                                  |
    |                                                          |
    |        [  HỦY  ]    [  XÁC NHẬN ĐĂNG KÝ  ]             |
    |                                                          |
    +----------------------------------------------------------+

**Ghi chú:** - (\*) = trường bắt buộc (REQ-014) - \[XÁC NHẬN ĐĂNG KÝ\] → lưu tạm vắng, cập nhật trạng thái → REQ-015 - Sau khi lưu → thông báo thành công, quay lại màn hình 5

## WIREFRAME 8: THỐNG KÊ VÀ BÁO CÁO

**Tên màn hình:** Thống kê và báo cáo **Mục đích:** Hiển thị số liệu thống kê và xuất báo cáo **Use Case hỗ trợ:** UC-006

    +----------------------------------------------------------+
    | [LOGO] HỆ THỐNG QUẢN LÝ DÂN CƯ     [Tên người dùng] [X]|
    | TRANG CHỦ | CƯ DÂN | TẠM TRÚ | [BÁO CÁO] | ĐĂNG XUẤT  |
    +----------------------------------------------------------+
    | THỐNG KÊ VÀ BÁO CÁO                                     |
    +----------------------------------------------------------+
    |                                                          |
    | Loại báo cáo: [Tổng hợp dân số v]  Kỳ: [Tháng 2/2026 v]|
    |               [  TẠO BÁO CÁO  ]                         |
    |                                                          |
    | KẾT QUẢ THỐNG KÊ                                        |
    | +------------------------------------------------------+|
    | | Tổng số cư dân:              [SỐ]                   ||
    | | Đang thường trú:             [SỐ]                   ||
    | | Đang tạm trú:                [SỐ]                   ||
    | | Đang tạm vắng:               [SỐ]                   ||
    | +------------------------------------------------------+|
    |                                                          |
    | THỐNG KÊ THEO KHU VỰC                                   |
    | +------------+------------------+--------------------+  |
    | | Khu vực    | Số cư dân        | Tỷ lệ              |  |
    | +------------+------------------+--------------------+  |
    | | Tòa A      | [SỐ]             | [%]                |  |
    | | Tòa B      | [SỐ]             | [%]                |  |
    | +------------+------------------+--------------------+  |
    |                                                          |
    | [  XUẤT PDF  ]   [  XUẤT EXCEL  ]   [ GỬI BÁO CÁO ]   |
    |                                                          |
    +----------------------------------------------------------+

**Ghi chú:** - Dropdown "Loại báo cáo": Tổng hợp dân số / Tạm trú / Tạm vắng / Biến động (REQ-017, REQ-018, REQ-019) - \[XUẤT PDF\] → xuất file PDF (REQ-020) - \[XUẤT EXCEL\] → xuất file Excel (REQ-020) - \[GỬI BÁO CÁO\] → gửi cho cơ quan địa phương (REQ-021)

## XÁC THỰC VỚI USE CASE

| Use Case | Màn hình(s) | Trường bắt buộc | Nút hành động |
|:---|:---|:---|:---|
| UC-001: Đăng nhập | WF-1 | Username, Password | Đăng nhập |
| UC-002: Thêm cư dân | WF-3, WF-4 | Họ tên, CCCD, Ngày sinh, Giới tính, Mã HGĐ | Thêm, Lưu |
| UC-003: Cập nhật cư dân | WF-3, WF-5 | Tất cả trường | Chỉnh sửa, Xóa |
| UC-004: Tạm trú | WF-5, WF-6 | Địa chỉ, Từ ngày, Đến ngày, Lý do | Đăng ký TT |
| UC-005: Tạm vắng | WF-5, WF-7 | Từ ngày, Đến ngày, Lý do | Đăng ký TV |
| UC-006: Báo cáo | WF-2, WF-8 | Loại báo cáo, Kỳ | Tạo, Xuất, Gửi |

# 3.3-B: SƠ ĐỒ LUỒNG ĐIỀU HƯỚNG {#b-sơ-đồ-luồng-điều-hướng}

## Hệ Thống Quản Lý Dân Cư Khu Dân Cư / Chung Cư {#hệ-thống-quản-lý-dân-cư-khu-dân-cư-chung-cư-3}

## SƠ ĐỒ ĐIỀU HƯỚNG TỔNG THỂ

                  +------------------+
                  |  TRANG ĐĂNG NHẬP |  (WF-1)
                  | [Username + Pass]|
                  +--------+---------+
                           |
              Đăng nhập thành công
                           |
                           v
                  +------------------+
                  |    DASHBOARD     |  (WF-2)
                  |  (Trang chủ)     |
                  +---+---+-----+----+
                      |   |     |
           +----------+   |     +----------+
           |              |                |
           v              v                v
    +----------+   +-----------+   +-------------+
    | DANH SÁCH|   | ĐĂNG KÝ   |   | THỐNG KÊ &  |
    | CƯ DÂN   |   | (Nav menu)|   | BÁO CÁO     |
    |  (WF-3)  |   |           |   |  (WF-8)     |
    +----+-----+   +-----------+   +-------------+
         |
         |--[+ Thêm cư dân]--------> +------------------+
         |                           | THÊM CƯ DÂN MỚI  | (WF-4)
         |                           | [Form nhập liệu] |
         |                           | [Lưu] → về WF-3  |
         |                           +------------------+
         |
         |--[Xem/Sửa cư dân]-------> +------------------+
                                      | CHI TIẾT CƯ DÂN  | (WF-5)
                                      |  [Chỉnh sửa]     |
                                      |  [Xóa]           |
                                      +----+----------+--+
                                           |          |
                        [Đăng ký tạm trú]  |          | [Đăng ký tạm vắng]
                                           |          |
                                           v          v
                                   +--------+    +---------+
                                   | FORM   |    | FORM    |
                                   | TẠM    |    | TẠM     |
                                   | TRÚ    |    | VẮNG    |
                                   | (WF-6) |    | (WF-7)  |
                                   +---+----+    +----+----+
                                       |              |
                        [Xác nhận]     |              | [Xác nhận]
                                       |              |
                                       +------+-------+
                                              |
                                              v
                                   +------------------+
                                   | Cập nhật trạng   |
                                   | thái → Về WF-5   |
                                   +------------------+

## MÔ TẢ CÁC ĐƯỜNG DẪN NGƯỜI DÙNG CHÍNH

### Đường dẫn 1: Đăng nhập hệ thống

    WF-1 (Đăng nhập)
      → [Nhập đúng TK/MK] → WF-2 (Dashboard)
      → [Sai TK/MK] → WF-1 (Hiện thông báo lỗi, nhập lại)

### Đường dẫn 2: Thêm cư dân mới

    WF-2 (Dashboard) / WF-3 (Danh sách)
      → [+ Thêm cư dân] → WF-4 (Form thêm)
      → [Điền đầy đủ thông tin + Lưu] → WF-3 (Danh sách, cư dân mới xuất hiện)
      → [Thiếu thông tin + Lưu] → WF-4 (Hiện lỗi, nhập lại)
      → [Hủy] → WF-3 (Danh sách, không lưu)

### Đường dẫn 3: Cập nhật/Xóa thông tin cư dân

    WF-3 (Danh sách)
      → [Xem/Sửa] → WF-5 (Chi tiết)
      → [Chỉnh sửa + Lưu] → WF-5 (Hiển thị thông tin mới)
      → [Xóa + Xác nhận] → WF-3 (Danh sách, cư dân đã xóa)

### Đường dẫn 4: Đăng ký tạm trú

    WF-3 (Danh sách) → [Xem] → WF-5 (Chi tiết)
      → [Đăng ký tạm trú] → WF-6 (Form tạm trú)
      → [Điền đầy đủ + Xác nhận] → WF-5 (Trạng thái: Tạm trú)
      → [Hủy] → WF-5 (Không thay đổi)

### Đường dẫn 5: Đăng ký tạm vắng

    WF-3 (Danh sách) → [Xem] → WF-5 (Chi tiết)
      → [Đăng ký tạm vắng] → WF-7 (Form tạm vắng)
      → [Điền đầy đủ + Xác nhận] → WF-5 (Trạng thái: Tạm vắng)
      → [Hủy] → WF-5 (Không thay đổi)

### Đường dẫn 6: Xem thống kê và xuất báo cáo

    WF-2 (Dashboard) / Nav menu
      → [Báo cáo] → WF-8 (Thống kê & Báo cáo)
      → [Chọn loại + Tạo báo cáo] → WF-8 (Hiển thị kết quả)
      → [Xuất PDF / Xuất Excel] → File tải về
      → [Gửi báo cáo] → Gửi đến cơ quan địa phương

## BẢNG TÓM TẮT ĐIỀU HƯỚNG

| Từ màn hình    | Hành động            | Đến màn hình       |
|:---------------|:---------------------|:-------------------|
| WF-1 Đăng nhập | Đăng nhập thành công | WF-2 Dashboard     |
| WF-1 Đăng nhập | Sai TK/MK            | WF-1 (hiện lỗi)    |
| WF-2 Dashboard | \+ Thêm cư dân       | WF-4 Form thêm     |
| WF-2 Dashboard | Đăng ký tạm trú      | WF-3 → WF-6        |
| WF-2 Dashboard | Xem báo cáo          | WF-8 Báo cáo       |
| WF-2 Dashboard | Nav: Cư dân          | WF-3 Danh sách     |
| WF-3 Danh sách | \+ Thêm cư dân       | WF-4 Form thêm     |
| WF-3 Danh sách | \[Xem\] / \[Sửa\]    | WF-5 Chi tiết      |
| WF-3 Danh sách | Tìm kiếm             | WF-3 (lọc kết quả) |
| WF-4 Form thêm | Lưu thành công       | WF-3 Danh sách     |
| WF-4 Form thêm | Hủy                  | WF-3 Danh sách     |
| WF-5 Chi tiết  | Đăng ký tạm trú      | WF-6 Form TT       |
| WF-5 Chi tiết  | Đăng ký tạm vắng     | WF-7 Form TV       |
| WF-5 Chi tiết  | Xóa                  | WF-3 Danh sách     |
| WF-5 Chi tiết  | Quay lại             | WF-3 Danh sách     |
| WF-6 Form TT   | Xác nhận             | WF-5 Chi tiết      |
| WF-6 Form TT   | Hủy                  | WF-5 Chi tiết      |
| WF-7 Form TV   | Xác nhận             | WF-5 Chi tiết      |
| WF-7 Form TV   | Hủy                  | WF-5 Chi tiết      |
| WF-8 Báo cáo   | Đăng xuất            | WF-1 Đăng nhập     |

*Tổng số màn hình: 8 (WF-1 đến WF-8)* *Tổng số đường dẫn điều hướng chính: 6*
