# 1. Giới thiệu {#giới-thiệu}

Tài liệu này mô tả việc xác định Architectural Drivers cho hệ thống Quản lý Cư dân & Biến động Nhân khẩu. Các driver này được trích xuất từ yêu cầu dự án và sẽ định hướng toàn bộ các quyết định kiến trúc trong các bước tiếp theo.

# 2. Bối cảnh dự án {#bối-cảnh-dự-án}

\- Quy mô team: 3 developers

\- Deadline: 6 tháng

\- Hạ tầng triển khai: AWS Cloud

\- Tích hợp hệ thống phần cứng và bên thứ ba: Camera, thẻ RFID, hệ thống công an điện tử

\- Yêu cầu nghiệp vụ quan trọng: Không cho phép một cư dân thực hiện double check‑in cùng thời điểm

\- Tải cao điểm: 500 giao dịch check‑in/phút

# 3. Yêu cầu chức năng có ý nghĩa kiến trúc {#yêu-cầu-chức-năng-có-ý-nghĩa-kiến-trúc}

FR‑03: Check‑in/out realtime. Trong giờ cao điểm nhiều cư dân có thể quẹt thẻ tại cùng một cổng, dẫn đến nguy cơ race condition. Kiến trúc cần hỗ trợ distributed locking hoặc cơ chế reservation timeout (5 phút).

FR‑04: Đăng ký tạm trú/tạm vắng và quản lý thẻ cư dân. Yêu cầu tích hợp nhiều hệ thống bên thứ ba (công an điện tử, camera, RFID), làm tăng độ phức tạp tích hợp.

FR‑06: Hệ thống phải xử lý tối đa 500 giao dịch/phút trong giờ cao điểm. Cần thiết kế autoscaling, cơ chế queue và caching để đảm bảo hiệu năng.

FR‑08: Tích hợp phần cứng RFID và camera. Kiến trúc cần có anti‑corruption layer và circuit breaker để bảo vệ hệ thống lõi khỏi lỗi từ thiết bị ngoại vi.

Các chức năng còn lại như xem danh sách cư dân, export báo cáo chỉ mang tính CRUD thông thường và không ảnh hưởng đáng kể đến kiến trúc hệ thống.

# 4. Quality Attributes quan trọng {#quality-attributes-quan-trọng}

Hiệu năng: API check‑in phải đạt p95 \< 300ms với 500 người dùng đồng thời. Yêu cầu này ảnh hưởng trực tiếp đến việc lựa chọn caching layer và năng lực throughput của cơ sở dữ liệu.

Độ sẵn sàng: Downtime tối đa 4 giờ/năm (\~99.95% uptime). Điều này buộc hệ thống phải triển khai multi‑AZ và có cơ chế redundancy.

Các phát biểu chung chung như "hệ thống cần hoạt động ổn định" không đủ cụ thể để xem là architectural driver.

# 5. Xung đột kiến trúc quan trọng {#xung-đột-kiến-trúc-quan-trọng}

Khách hàng yêu cầu không được xảy ra double check‑in, tương đương yêu cầu Strong Consistency. Đồng thời hệ thống phải luôn sẵn sàng ngay cả khi một node bị lỗi, tương đương yêu cầu High Availability.

Đây là xung đột theo CAP theorem. Nhóm dự án quyết định ưu tiên Consistency (CP) hơn Availability (AP) cho Access Control Service vì hậu quả kinh doanh của việc double check‑in nghiêm trọng hơn việc gián đoạn ngắn.

# 6. Ràng buộc ảnh hưởng đến kiến trúc {#ràng-buộc-ảnh-hưởng-đến-kiến-trúc}

Tích hợp phần cứng RFID và camera yêu cầu xây dựng Adapter Layer riêng và áp dụng circuit breaker pattern.

Bảo mật dữ liệu thẻ cư dân (tương đương PCI‑DSS) yêu cầu tách Access Control Service vào một network segment cách ly.

Triển khai trên AWS với team nhỏ và deadline ngắn dẫn đến quyết định sử dụng kiến trúc Modular Monolith thay vì Microservices nhằm giảm chi phí vận hành.

# 7. Ràng buộc không ảnh hưởng kiến trúc {#ràng-buộc-không-ảnh-hưởng-kiến-trúc}

\- Hỗ trợ giao diện dark mode chỉ là concern phía frontend.

\- Export báo cáo Excel có thể xử lý bằng background job đơn giản.

\- Gửi email thông báo trong vòng 5 phút có thể xử lý bằng cơ chế async queue mặc định.

# 8. Kết luận {#kết-luận}

Các architectural drivers được xác định trong tài liệu này sẽ là cơ sở truy vết cho mọi quyết định thiết kế và triển khai hệ thống trong các bước tiếp theo của dự án.
