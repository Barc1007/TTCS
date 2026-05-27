# 1. Tổng quan {#tổng-quan}

Bước 4.3 được thực hiện dựa trên kết quả từ bước 4.1 (architectural drivers) và bước 4.2 (technology stack).

Mục tiêu chính là xác định cấu trúc hệ thống tối ưu để đáp ứng các yêu cầu về hiệu năng, bảo mật, khả năng mở rộng và giới hạn thực tế của team phát triển.

# 2. Xem xét các Architectural Pattern {#xem-xét-các-architectural-pattern}

• Microservices: mỗi chức năng là một service độc lập, yêu cầu hệ thống vận hành phức tạp.

• Pure Monolith: toàn bộ hệ thống trong một codebase duy nhất.

• Modular Monolith: một hệ thống monolith nhưng có phân chia module rõ ràng.

# 3. Lý do không chọn Microservices {#lý-do-không-chọn-microservices}

• Yêu cầu vận hành phức tạp (service discovery, monitoring, tracing).

• Mỗi service cần pipeline CI/CD riêng.

• Team nhỏ (4 dev), thời gian phát triển 6 tháng.

→ Kết luận: vượt quá khả năng vận hành.

# 4. Lý do không chọn Pure Monolith {#lý-do-không-chọn-pure-monolith}

• Không thể scale riêng từng phần.

• Lãng phí tài nguyên khi scale toàn hệ thống.

• Không đáp ứng yêu cầu phân tách mạng cho Access Control.

# 5. Kiến trúc được chọn {#kiến-trúc-được-chọn}

Modular Monolith + Access Control Service độc lập.

• Hệ thống chính là monolith với module rõ ràng.

• Access Control tách riêng do yêu cầu phần cứng và bảo mật.

• Quyết định dựa trên constraint thực tế, không theo xu hướng.

# 6. Phân rã thành các thành phần chính {#phân-rã-thành-các-thành-phần-chính}

• Resident Module: quản lý cư dân và căn hộ.

• Registration Module: quản lý đăng ký tạm trú, thẻ cư dân.

• Access Control Service: xử lý check-in/out, RFID, camera.

• Visitor Module: quản lý khách.

• Notification Module: gửi thông báo.

• Report Module: thống kê và báo cáo.

• API Gateway: điểm vào hệ thống.

# 7. Data Ownership và ranh giới {#data-ownership-và-ranh-giới}

• Mỗi module chỉ được ghi dữ liệu của chính nó.

• Không chia sẻ database giữa các module.

• Giao tiếp qua API hoặc message queue.

• Tránh coupling chặt.

# 8. System Architecture Diagram (mô tả) {#system-architecture-diagram-mô-tả}

UI → API Gateway → các Module → Database

Access Control Service kết nối phần cứng (Camera, RFID).

Notification sử dụng queue (SQS).

# 9. Checklist đánh giá {#checklist-đánh-giá}

• Tên module rõ ràng.

• Mỗi entity có owner.

• Có component tích hợp hardware.

• Số lượng component hợp lý (5--10).
