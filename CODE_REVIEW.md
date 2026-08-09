# Kết quả tổ chức lại project

## Đã thực hiện

1. Giữ một cây source duy nhất theo hướng feature-based:
   - `app`: route, layout và app shell.
   - `features`: auth, landing, notifications và posts.
   - `shared`: component, HTTP client và global style dùng chung.
   - `assets`: tài nguyên thực sự đang được sử dụng.

2. Xóa toàn bộ bản code cũ bị trùng:
   - `src/pages`
   - `src/components`
   - `src/services`
   - `src/routes`
   - `src/layouts`
   - `src/styles`
   - `src/data`
   - `src/utils`
   - `src/App.jsx`, `src/App.css`, `src/index.css`

3. Xóa các nhóm asset cũ bị trùng và chỉ giữ `assets/brand` cùng `assets/landing`.

4. Chuẩn hóa import nội bộ bằng alias `@/` trong `vite.config.js` và `jsconfig.json`.

5. Sửa Header/UserMenu:
   - Loại bỏ cập nhật state đồng bộ trong effect.
   - Đóng menu mobile khi người dùng chọn điều hướng.
   - Đổi các mục thao tác thành button có ngữ nghĩa và hỗ trợ accessibility tốt hơn.

## Kiểm tra

- `npm run lint`: đạt, không có error hoặc warning.
- Không còn import tới cấu trúc cũ.
- Tất cả import nội bộ đều trỏ tới file tồn tại.
- Toàn bộ file còn lại trong `src` đều thuộc dependency graph bắt đầu từ `src/main.jsx`.

`npm run build` không được xác nhận trong môi trường Linux của quá trình xử lý vì archive ban đầu chứa `node_modules` được cài trên Windows và thiếu native binding Linux của Vite. Bản bàn giao không chứa `node_modules`; trên máy phát triển hãy chạy lại:

```bash
npm install
npm run build
```
