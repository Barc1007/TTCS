# 1. Mục tiêu {#mục-tiêu}

Tài liệu này trình bày quá trình lựa chọn Technology Stack cho hệ thống dựa trên các Architectural Drivers đã được xác định ở bước trước. Mọi quyết định công nghệ đều phải truy vết trực tiếp đến driver cụ thể.

# 2. Đánh giá lựa chọn Backend Language {#đánh-giá-lựa-chọn-backend-language}

Java 17 kết hợp Spring Boot 3 được đánh giá phù hợp nhất vì đội ngũ đã có kinh nghiệm, ecosystem tích hợp RFID và SOAP trưởng thành, đồng thời thị trường tuyển dụng tại Việt Nam rộng. Giải pháp này đáp ứng đầy đủ các architectural drivers của dự án.

Node.js với NestJS không được chọn do đội ngũ chưa có kinh nghiệm, có thể mất từ 1--2 tháng học tập, tạo rủi ro đáng kể cho deadline 6 tháng.

Ngôn ngữ Go có ưu điểm về hiệu năng nhưng đội ngũ không có kinh nghiệm, hệ sinh thái tích hợp RFID còn hạn chế và việc tuyển dụng khó khăn.

Quyết định cuối cùng: sử dụng Java 17 và Spring Boot 3. Bài học rút ra là không lựa chọn công nghệ chỉ dựa trên hiệu năng nếu driver về nguồn lực và tiến độ không cho phép.

# 3. Lựa chọn Primary Database {#lựa-chọn-primary-database}

Nghiệp vụ check-in/out là một giao dịch liên quan giữa các thực thể Resident, Access Card và Access Log, đòi hỏi tính atomic cao. Do đó cần cơ sở dữ liệu hỗ trợ ACID mạnh.

Dữ liệu hệ thống có cấu trúc rõ ràng và quan hệ chặt chẽ, nên không có lý do kiến trúc để sử dụng NoSQL. Lập luận "NoSQL linh hoạt hơn" không phải là một architectural driver hợp lệ.

Quyết định cuối cùng: PostgreSQL, nhằm đảm bảo Strong Consistency và tránh double check-in.

# 4. Redis và việc giải quyết đồng thời nhiều driver {#redis-và-việc-giải-quyết-đồng-thời-nhiều-driver}

Để đạt yêu cầu hiệu năng p95 \< 300ms, hệ thống cần caching cho các luồng đọc nhiều như danh sách cư dân.

Redis được sử dụng để lưu trạng thái "thẻ tạm" với TTL = 300 giây, giúp tự động giải phóng khi hết hạn.

Giải pháp này thay thế cơ chế cronjob quét database định kỳ, tránh tạo lock spike và ảnh hưởng latency hệ thống.

Quyết định: sử dụng Redis dưới dạng managed service AWS ElastiCache.

# 5. Lưu trữ file {#lưu-trữ-file}

Hệ thống cần lưu trữ ảnh thẻ cư dân và giấy tờ tùy thân, không có yêu cầu xử lý phức tạp. Do ràng buộc triển khai trên AWS đã được xác định từ trước, Amazon S3 trở thành lựa chọn mặc định. Không cần xây dựng evaluation matrix cho quyết định này.

# 6. Message Queue {#message-queue}

Hệ thống cần message queue để xử lý bất đồng bộ việc gửi email/SMS và làm phẳng tải trong giờ cao điểm (lên tới 500 request/phút).

RabbitMQ có khả năng routing mạnh nhưng yêu cầu tự vận hành, giám sát và mở rộng, tạo thêm gánh nặng vận hành cho đội ngũ nhỏ.

AWS SQS là dịch vụ managed giúp giảm đáng kể ops overhead. Driver về quy mô team khiến RabbitMQ trở thành lựa chọn rủi ro.

Quyết định: sử dụng AWS SQS.

# 7. Authentication và Monitoring {#authentication-và-monitoring}

Ứng dụng hướng đến người dùng cuối cần hỗ trợ đăng nhập qua Google hoặc Facebook. Việc tự xây dựng hệ thống xác thực là một anti-pattern về mặt kiến trúc.

Giải pháp được chọn là Firebase Authentication nhằm tận dụng managed identity platform.

Để đáp ứng yêu cầu uptime 99.95%, hệ thống sử dụng Amazon CloudWatch kết hợp với Sentry cho việc giám sát và cảnh báo.

# 8. Tổng kết Technology Stack và driver tương ứng {#tổng-kết-technology-stack-và-driver-tương-ứng}

• Java 17 + Spring Boot → Đáp ứng driver về năng lực đội ngũ và deadline 6 tháng.

• PostgreSQL → Đảm bảo ACID transaction cho nghiệp vụ check-in/out.

• Redis → Đáp ứng yêu cầu hiệu năng và cơ chế TTL cho thẻ tạm.

• Amazon S3 → Tuân thủ ràng buộc triển khai trên AWS.

• AWS SQS → Managed queue phù hợp với đội ngũ nhỏ.

• Firebase Authentication → Đáp ứng yêu cầu bảo mật và xác thực người dùng.

• CloudWatch + Sentry → Đáp ứng driver về độ sẵn sàng hệ thống.

# 9. Kết luận {#kết-luận}

Mọi quyết định công nghệ trong tài liệu này đều có thể truy vết trực tiếp về các architectural drivers đã xác định ở bước trước. Công nghệ không được lựa chọn dựa trên xu hướng hoặc mức độ phổ biến, mà dựa trên mức độ phù hợp với bối cảnh dự án.
