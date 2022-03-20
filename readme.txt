Hướng dẫn cài đặt và chạy trang web:
A. Chuẩn bị:
- Visual Studio Code (không bắt buộc)
- Node.js phiên bản 8.1.2 (Bắt buộc)
b. Build và chạy code:
Front-end:
- B1: Mở Command Prompt trên thư mục front-end
- B2: Gõ lệnh: `npm install` . Đợi lệnh kết thúc sẽ có đủ cái modules cần thiết cho ứng dụng
- B3: Gõ lệnh `npm start` để khởi động ứng dụng
- Ứng dụng sẽ chạy mặc định ở localhost:3000

Back-end:
- B1: Mở Command Prompt trên thư mục front-end
- B2: Gõ lệnh: `npm install` . Đợi lệnh kết thúc sẽ có đủ cái modules cần thiết cho ứng dụng
- B3: Gõ lệnh `npm start` để khởi động ứng dụng
- Ứng dụng sẽ chạy mặc định ở localhost:5000. Có thể thay đổi Port này ở file .env

* Cấu hình file AxiosClient.js khi thay đổi Port của backend (Chỉ thực hiện khi đổi port)
- Mở file AxiosClient.js theo đường dẫn front-end/src/api/AxiosClient.js
- Thay đổi đường dẫn ở biến baseURL