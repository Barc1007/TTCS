## 2.1 USE CASE MODELING {#use-case-modeling}

## **Người dùng chính**

> **Cán bộ quản lý dân cư**
>
> **Ban quản lý khu dân cư / chung cư**

**Người dùng phụ**

> **Cư dân**
>
> **Cơ quan quản lý địa phương** (nhận báo cáo)

![](media/image1.png){width="5.302777777777778in" height="7.0784722222222225in"}

### 

### 

### Use Case Specifications  {#use-case-specifications}

### PHẦN 1: LẬP PHÁC THẢO MỤC TIÊU NGƯỜI DÙNG

<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 74%" />
</colgroup>
<thead>
<tr>
<th style="text-align: left;"><strong>Persona (Người dùng)</strong></th>
<th style="text-align: left;"><strong>Mục tiêu kinh doanh (Tác vụ cần hoàn thành)</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left;"><strong>Cán bộ quản lý</strong></td>
<td><p>- <strong>Quản lý Hồ sơ:</strong> Thêm mới, cập nhật và tra cứu thông tin cư dân.</p>
<p>- <strong>Quản lý Lưu trú:</strong> Ghi nhận đăng ký tạm trú, tạm vắng cho người dân.</p>
<p>- <strong>Theo dõi Biến động:</strong> Xem lại lịch sử các thao tác cập nhật nhân khẩu.</p></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Ban quản lý</strong></td>
<td><p>- <strong>Theo dõi Dân số:</strong> Xem thống kê tổng quan về số lượng người ở hợp pháp.</p>
<p>- <strong>Báo cáo:</strong> Trích xuất báo cáo định kỳ dưới dạng file để gửi chính quyền.</p></td>
</tr>
<tr>
<td style="text-align: left;"><strong>Cư dân</strong></td>
<td style="text-align: left;">- <strong>Tra cứu cá nhân:</strong> Xem thông tin lưu trú của bản thân trên hệ thống.</td>
</tr>
</tbody>
</table>

### PHẦN 2: DANH MỤC TRƯỜNG HỢP SỬ DỤNG

Hệ thống bao gồm 11 Use Case (đáp ứng tiêu chí 8-15 UC):

| **ID** | **Tên Trường hợp sử dụng** | **Mô tả ngắn** | **Ưu tiên** |
|:---|:---|:---|:---|
| **UC-001** | Đăng nhập hệ thống | Người dùng xác thực danh tính để truy cập hệ thống. | High |
| **UC-002** | Thêm mới hồ sơ cư dân | Cán bộ hành chính tạo hồ sơ cho người mới chuyển đến. | High |
| **UC-003** | Cập nhật thông tin cư dân | Cán bộ sửa đổi thông tin khi có sai sót hoặc thay đổi. | High |
| **UC-004** | Tra cứu thông tin cư dân | Tìm kiếm nhanh hồ sơ theo họ tên hoặc số CCCD. | High |
| **UC-005** | Xóa hồ sơ cư dân | Cán bộ gỡ bỏ hồ sơ khi cư dân chuyển đi vĩnh viễn. | Medium |
| **UC-006** | Đăng ký tạm trú | Ghi nhận khoảng thời gian một người đến lưu trú có thời hạn. | High |
| **UC-007** | Đăng ký tạm vắng | Ghi nhận khoảng thời gian cư dân rời khỏi địa phương. | High |
| **UC-008** | Thống kê số lượng cư dân | BQL xem biểu đồ thống kê dân số theo từng khu vực/trạng thái. | High |
| **UC-009** | Xuất báo cáo nhân khẩu | Trích xuất dữ liệu ra file PDF/Excel để lưu trữ và gửi báo cáo. | Medium |
| **UC-010** | Xem lịch sử biến động | Xem lại ai đã thêm/sửa/xóa hồ sơ nào và vào lúc nào. | Low |
| **UC-011** | Xem thông tin cá nhân | Cư dân xem lại trạng thái cư trú của chính mình. | Low |

### PHẦN 3: ĐẶC TẢ CHI TIẾT TRƯỜNG HỢP SỬ DỤNG

*(Đặc tả cho 6 Use Case có mức độ ưu tiên cao nhất)*

**UC-002: Thêm mới hồ sơ cư dân**

> **Đối tượng:** Cán bộ quản lý
>
> **Mô tả:** Cán bộ tạo hồ sơ mới cho một cư dân vừa chuyển đến chung cư
>
> **Điều kiện trước:** Cán bộ đã đăng nhập thành công vào hệ thống.
>
> **Luồng chính:**
>
> Cán bộ chọn chức năng \"Thêm mới cư dân\".
>
> Hệ thống hiển thị biểu mẫu nhập thông tin.
>
> Cán bộ điền: Họ tên, CCCD, Ngày sinh, Giới tính, Địa chỉ/Căn hộ, Số điện thoại.
>
> Cán bộ nhấn nút \"Lưu thông tin\".
>
> Hệ thống xác thực định dạng dữ liệu và kiểm tra các trường bắt buộc.
>
> Hệ thống kiểm tra số CCCD trong cơ sở dữ liệu để đảm bảo tính duy nhất.
>
> Hệ thống tạo bản ghi cư dân mới trong cơ sở dữ liệu.
>
> Hệ thống hiển thị thông báo \"Thêm mới thành công\" và làm trống form.
>
> **Luồng thay thế \[5a\]: Thiếu thông tin bắt buộc**
>
> Hệ thống bôi đỏ các trường còn thiếu và hiện cảnh báo \"Vui lòng nhập đủ thông tin\".
>
> Cán bộ bổ sung thông tin và thực hiện lại từ bước 4.
>
> **Luồng ngoại lệ \[6a\]: Số CCCD đã tồn tại**
>
> Hệ thống chặn việc lưu dữ liệu và báo lỗi \"Số CCCD này đã tồn tại trong hệ thống\".
>
> Cán bộ kiểm tra lại giấy tờ thực tế hoặc tìm kiếm lại cư dân này.
>
> **Điều kiện sau:** Hồ sơ cư dân được lưu với trạng thái mặc định là \"Thường trú\".

**UC-006: Đăng ký tạm trú**

> **Đối tượng:** Cán bộ quản lý
>
> **Mô tả:** Cán bộ khai báo thông tin một người từ nơi khác đến lưu trú có thời hạn.
>
> **Điều kiện trước:** Cán bộ đã đăng nhập, hồ sơ của người này đã có trong hệ thống.
>
> **Luồng chính:**
>
> Cán bộ tra cứu và chọn một cư dân cụ thể.
>
> Cán bộ chọn chức năng \"Đăng ký tạm trú\".
>
> Hệ thống hiển thị biểu mẫu (khóa thông tin cá nhân cơ bản để chỉ xem).
>
> Cán bộ nhập: Địa chỉ tạm trú, Từ ngày, Đến ngày, Lý do.
>
> Cán bộ nhấn nút \"Xác nhận\".
>
> Hệ thống kiểm tra tính hợp lệ của thời gian.
>
> Hệ thống lưu bản ghi tạm trú vào Database
>
> Hệ thống tự động chuyển trạng thái của cư dân thành \"Tạm trú\" và thông báo thành công.
>
> **Luồng ngoại lệ \[6a\]: Thời gian không hợp lệ**
>
> Hệ thống báo lỗi \"Ngày kết thúc không được nhỏ hơn ngày bắt đầu\".
>
> Cán bộ sửa lại ngày tháng và tiếp tục bước 5.
>
> **Điều kiện sau:** Trạng thái cư dân được cập nhật, sự kiện được ghi vào Lịch sử biến động.

**UC-008: Thống kê số lượng cư dân**

> **Đối tượng:** Ban quản lý
>
> **Mô tả:** Ban quản lý xem tổng quan số lượng người đang ở tại chung cư theo thời gian thực.
>
> **Điều kiện trước:** Ban quản lý đã đăng nhập.
>
> **Luồng chính:**
>
> Ban quản lý chọn tab \"Thống kê & Báo cáo\".
>
> Ban quản lý chọn tiêu chí lọc (Ví dụ: Theo tòa nhà, theo tháng).
>
> Ban quản lý nhấn \"Xem thống kê\".
>
> Hệ thống truy vấn cơ sở dữ liệu để đếm số lượng người Thường trú, Tạm trú, Tạm vắng.
>
> Hệ thống render biểu đồ tròn và bảng số liệu chi tiết lên màn hình.
>
> **Luồng thay thế \[4a\]: Không có dữ liệu**
>
> Hệ thống hiển thị thông báo \"Không có dữ liệu trong khoảng thời gian này\".
>
> Ban quản lý chọn lại tiêu chí lọc ở bước 2.
>
> **Điều kiện sau:** Hệ thống hiển thị chính xác số liệu, dữ liệu không bị thay đổi.

**UC-001: Đăng nhập hệ thống**

> **Đối tượng:** Cán bộ quản lý, Ban quản lý
>
> **Mô tả:** Người dùng xác thực để vào hệ thống theo đúng quyền hạn phân công.
>
> **Điều kiện trước:** Người dùng đã được cấp tài khoản.
>
> **Luồng chính:**
>
> Người dùng truy cập trang Đăng nhập.
>
> Hệ thống hiển thị form yêu cầu Tên đăng nhập và Mật khẩu.
>
> Người dùng nhập liệu và nhấn \"Đăng nhập\".
>
> Hệ thống kiểm tra sự trùng khớp của thông tin trong cơ sở dữ liệu.
>
> Hệ thống giải mã và kiểm tra Vai trò (Role)
>
> Hệ thống tạo Session và chuyển hướng vào trang chủ (Dashboard)
>
> **Luồng ngoại lệ \[4a\]: Sai tên đăng nhập/mật khẩu**
>
> Hệ thống báo lỗi \"Thông tin đăng nhập không chính xác\".
>
> Người dùng nhập lại thông tin ở bước 3.
>
> **Điều kiện sau:** Người dùng được truy cập vào các chức năng tương ứng với quyền của mình

**UC-007: Đăng ký tạm vắng**

> **Đối tượng**: Cán bộ quản lý
>
> **Mô tả**: Cán bộ ghi nhận khoảng thời gian cư dân rời khỏi địa phương tạm thời.
>
> **Điều kiện trước**: Cán bộ đã đăng nhập, hồ sơ cư dân đã tồn tại.

**Luồng chính:**

> 1\. Cán bộ tra cứu và chọn cư dân.
>
> 2\. Chọn \"Đăng ký tạm vắng\".
>
> 3\. Hệ thống hiển thị biểu mẫu.
>
> 4\. Nhập: Từ ngày, Đến ngày, Lý do.
>
> 5\. Nhấn \"Xác nhận\".
>
> 6\. Hệ thống kiểm tra thời gian hợp lệ.
>
> 7\. Lưu bản ghi tạm vắng.
>
> 8\. Chuyển trạng thái \"Tạm vắng\", thông báo thành công.

**Luồng thay thế \[4a\]: Đang \"Tạm trú\"**

> \- Cảnh báo phải kết thúc tạm trú trước.

**Luồng ngoại lệ \[6a\]: Thời gian không hợp lệ**

> \- Báo lỗi ngày. Sửa lại, tiếp tục bước 5.

**Điều kiện sau:** Trạng thái \"Tạm vắng\", ghi Lịch sử biến động.

**UC-004: Tra cứu thông tin cư dân**

> **Đối tượng**: Cán bộ QL, Ban QL
>
> **Mô tả**: Tìm kiếm nhanh hồ sơ theo họ tên, CCCD, địa chỉ.
>
> **Điều kiện trước**: Đã đăng nhập.

**Luồng chính:**

> 1\. Chọn \"Danh sách cư dân\" hoặc \"Tìm kiếm\".
>
> 2\. Hiển thị danh sách và thanh tìm kiếm.
>
> 3\. Nhập từ khóa.
>
> 4\. Truy vấn và lọc kết quả.
>
> 5\. Hiển thị kết quả (Họ tên, CCCD, Trạng thái).
>
> 6\. Chọn cư dân xem chi tiết.
>
> 7\. Hiển thị toàn bộ hồ sơ.

**Luồng thay thế \[4a\]: Không tìm thấy**

> \- Thông báo \"Không tìm thấy\". Nhập lại từ khóa.

**Luồng thay thế \[3a\]: Lọc nâng cao**

> \- Chọn bộ lọc (trạng thái, khu vực). Lọc và tiếp tục bước 5.

**Điều kiện sau:** Hiển thị thông tin, không thay đổi dữ liệu.

# 2.2: TÀI LIỆU SƠ ĐỒ LUỒNG QUY TRÌNH (PROCESS FLOW DIAGRAMS) {#tài-liệu-sơ-đồ-luồng-quy-trình-process-flow-diagrams}

**Mục đích:** Tài liệu này trực quan hóa các luồng nghiệp vụ cốt lõi của Hệ thống Quản lý Cư dân, giúp thấy rõ các bước thực hiện, các điểm quyết định (rẽ nhánh) và tương tác giữa Người dùng (Cán bộ/Ban quản lý) với Hệ thống.

**Các quy trình được chọn để mô hình hóa:**

> Quy trình Thêm mới thông tin cư dân.
>
> Quy trình Đăng ký Tạm trú.
>
> Quy trình Trích xuất báo cáo thống kê.

*(Lý do chọn: Đây là 3 quy trình xương sống của hệ thống, có nhiều bước xác thực dữ liệu và rẽ nhánh điều kiện phức tạp nhất).*

### 1. Sơ đồ 1: Quy trình Thêm mới thông tin cư dân {#sơ-đồ-1-quy-trình-thêm-mới-thông-tin-cư-dân}

> **Mục đích:** Mô tả các bước Cán bộ hành chính nhập liệu một cư dân mới vào hệ thống, đảm bảo dữ liệu không bị trùng lặp và thiếu sót.
>
> **Chú thích chính (Annotations):**
>
> *Thời gian phản hồi:* Việc tra cứu trùng lặp CCCD phải diễn ra dưới 2 giây.
>
> *Ràng buộc:* Căn hộ được chọn để gán cho cư dân phải tồn tại trong danh mục hệ thống
>
> ![](media/image2.png){width="6.218055555555556in" height="10.24375in"}

### Sơ đồ 2: Quy trình Đăng ký Tạm trú

> **Mục đích:** Mô tả luồng công việc khi một cư dân chuyển đến ở tạm thời. Hệ thống phải kiểm tra tính hợp lệ của thời gian và thay đổi trạng thái của người đó.
>
> **Chú thích chính (Annotations):**
>
> *Dữ liệu quyết định:* Ngày kết thúc tạm trú bắt buộc phải lớn hơn hoặc bằng Ngày bắt đầu.
>
> *Hệ quả:* Sau khi lưu, trạng thái cư dân tự động chuyển thành \"Tạm trú\" và ghi nhận vào bảng Lịch sử biến động nhân khẩu.

- 

![](media/image3.png){width="6.039583333333334in" height="9.688194444444445in"}

### Sơ đồ 3: Quy trình Trích xuất Báo cáo Thống kê

> **Mục đích:** Ban quản lý sử dụng chức năng này để tổng hợp số lượng dân cư hiện tại, số người tạm trú/tạm vắng để báo cáo chính quyền.
>
> **Chú thích chính (Annotations):**
>
> *Hiệu năng:* Do việc tổng hợp dữ liệu toàn chung cư có thể nặng, hệ thống cần hiển thị vòng xoay tải (loading spinner) trong quá trình xử lý. Đảm bảo xuất file dưới 10 giây (theo tiêu chí 1.1)

![](media/image4.png){width="3.5708333333333333in" height="7.736805555555556in"}

**2.3 CREATE INITIAL DATA MODEL**

**(Tạo mô hình dữ liệu ban đầu)**

**I. Xác định các thực thể chính (Entities)**

| **Tên Thực Thể** | **Loại Thực Thể** | **Định Nghĩa (Mục đích)** | **Ví Dụ** |
|:---|:---|:---|:---|
| **Cu_dan** | Core (Lõi) | Lưu trữ thông tin cá nhân cơ bản của mỗi người dân sinh sống tại chung cư. | Nguyễn Văn A, Nam, 0123456789 |
| **Ho_gia_dinh** | Core (Lõi) | Đại diện cho một hộ dân cư trú tại một căn hộ nhất định, gồm 1 chủ hộ. | Căn hộ 101, Chủ hộ Trần B |
| **Nguoi_dung** | Core (Lõi) | Tài khoản truy cập hệ thống của Cán bộ hoặc Ban quản lý. | admin_nam, role: CAN_BO |
| **Tam_tru** | Associative (Kết hợp) | Ghi nhận khoảng thời gian một cư dân đăng ký ở tạm trú. | Cư dân A tạm trú từ 1/1 đến 1/6 |
| **Tam_vang** | Associative (Kết hợp) | Ghi nhận khoảng thời gian cư dân khai báo vắng mặt tại địa phương. | Cư dân B vắng từ 5/5 đến 10/5 |
| **Bien_dong_nhan_khau** | Log/History | Lưu vết lịch sử mọi thay đổi liên quan đến cư dân (thêm, sửa, chuyển đi). | Thêm mới cư dân A vào 10:00 |
| **Bao_cao** | Core (Lõi) | Lưu trữ thông tin các file thống kê đã được trích xuất. | Báo cáo dân số tháng 2/2026 |

## II. Thuộc tính cho từng thực thể {#ii.-thuộc-tính-cho-từng-thực-thể}

### 1 Cư_dân {#cư_dân}

> ma_cu_dan (PK)
>
> ho_ten
>
> cccd
>
> ngay_sinh
>
> gioi_tinh
>
> dia_chi
>
> so_dien_thoai
>
> ma_ho_gia_dinh (FK)

### 2 Hộ_gia_đình {#hộ_gia_đình}

> ma_ho_gia_dinh (PK)
>
> ten_chu_ho
>
> dia_chi
>
> so_thanh_vien

### 3 Tạm_trú {#tạm_trú}

> ma_tam_tru (PK)
>
> ma_cu_dan (FK)
>
> dia_chi_tam_tru
>
> tu_ngay
>
> den_ngay
>
> ly_do

### 4 Tạm_vắng {#tạm_vắng}

> ma_tam_vang (PK)
>
> ma_cu_dan (FK)
>
> tu_ngay
>
> den_ngay
>
> ly_do

### 5 Biến_động_nhân_khẩu {#biến_động_nhân_khẩu}

> ma_bien_dong (PK)
>
> ma_cu_dan (FK)
>
> loai_bien_dong
>
> ngay_bien_dong
>
> ghi_chu

###  6 Người_dùng {#người_dùng}

> ma_nguoi_dung (PK)
>
> ten_dang_nhap
>
> mat_khau
>
> vai_tro
>
> ho_ten

### 7 Báo_cáo {#báo_cáo}

ma_bao_cao (PK)

> loai_bao_cao
>
> thoi_gian
>
> nguoi_tao (FK)

## III. Danh Mục Mối Quan Hệ {#iii.-danh-mục-mối-quan-hệ}

| **Thực Thể A** | **Thực Thể B** | **Tên Mối Quan Hệ** | **Cardinality** | **Ý Nghĩa Kinh Doanh** |
|:---|:---|:---|:---|:---|
| Ho_gia_dinh | Cu_dan | Chứa (Contains) | 1:N (1-Nhiều) | Một hộ gia đình có thể có nhiều thành viên cư dân, nhưng một cư dân chỉ thuộc một hộ gia đình chính thức. |
| Cu_dan | Tam_tru | Có (Has) | 1:N (1-Nhiều) | Một người có thể có nhiều lịch sử đăng ký tạm trú khác nhau theo thời gian. |
| Cu_dan | Tam_vang | Có (Has) | 1:N (1-Nhiều) | Một người có thể đăng ký tạm vắng nhiều lần. |
| Cu_dan | Bien_dong_nhan_khau | Gắn với (Associated with) | 1:N (1-Nhiều) | Mọi hành động làm thay đổi hồ sơ cư dân đều sinh ra nhiều bản ghi biến động. |
| Nguoi_dung | Bao_cao | Tạo (Creates) | 1:N (1-Nhiều) | Một cán bộ/ban quản lý có thể tạo và trích xuất nhiều báo cáo khác nhau. |

**IV.Lược Đồ Quan Hệ ERD**

![](media/image5.png){width="6.590277777777778in" height="4.405555555555556in"}

### Quy Tắc Kinh Doanh (Business Rules)

Hệ thống phải tuân thủ 10 quy tắc ràng buộc nghiệp vụ (Business Rules - BR) sau đây để đảm bảo tính toàn vẹn dữ liệu:

> **BR-001 (Tính duy nhất):** Số Căn cước công dân (CCCD) của mỗi Cu_dan phải là duy nhất trên toàn hệ thống, không được phép trùng lặp.
>
> **BR-002 (Xác thực dữ liệu):** Thuộc tính ngay_sinh của Cu_dan bắt buộc phải nhỏ hơn ngày hiện tại (ngày đăng ký vào hệ thống).
>
> **BR-003 (Logic cư trú):** Một Ho_gia_dinh bắt buộc phải có ít nhất 1 Cu_dan đóng vai trò là Chủ hộ.
>
> **BR-004 (Ràng buộc Tạm trú/Tạm vắng):** Thuộc tính tu_ngay (ngày bắt đầu) phải luôn nhỏ hơn hoặc bằng thuộc tính den_ngay (ngày kết thúc).
>
> **BR-005 (Trạng thái cư dân):** Một Cu_dan không thể có trạng thái \"Đang tạm trú\" và \"Đang tạm vắng\" có hiệu lực cùng một lúc tại cùng một thời điểm.
>
> **BR-006 (Xóa dữ liệu):** Không được phép xóa cứng (Hard delete) một Cu_dan nếu người đó đang có dữ liệu Tam_tru hoặc Tam_vang đang còn hiệu lực.
>
> **BR-007 (Audit Log):** Mọi thao tác Thêm, Sửa, Xóa trên bảng Cu_dan bắt buộc phải kích hoạt tự động việc tạo 1 bản ghi trong bảng Bien_dong_nhan_khau.
>
> **BR-008 (Phân quyền):** Chỉ Nguoi_dung có thuộc tính vai_tro = \"Ban Quan Ly\" mới được phép tạo bảng Bao_cao.
>
> **BR-009 (Bảo mật):** Thuộc tính mat_khau của bảng Nguoi_dung không được phép lưu dưới dạng văn bản thô (plain text) mà phải được mã hóa.
>
> **BR-010 (Xác thực thông tin):** Cư dân tạo mới bắt buộc phải có thông tin ho_ten, ngay_sinh và dia_chi (các trường Not Null)
