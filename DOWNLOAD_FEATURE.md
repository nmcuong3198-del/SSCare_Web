# Feature tải ứng dụng SSCare

## Route

- `/download`: hiển thị trang chủ phía sau và modal tải ứng dụng.
- Đóng modal bằng nút `X`, phím `Esc` hoặc bấm vào vùng nền mờ.

## Cấu hình liên kết kho ứng dụng

Tạo file `.env` từ `.env.example` và điền URL thật:

```env
VITE_APP_STORE_URL=https://apps.apple.com/...
VITE_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=...
```

## Mã QR

Ảnh QR hiện dùng file:

```text
src/assets/landing/qr.png
```

Khi có đường dẫn ứng dụng thật, thay ảnh này bằng mã QR trỏ đến App Store/Google Play. Nếu cần hai mã khác nhau, tạo `qr-app-store.png` và `qr-google-play.png`, sau đó đổi import trong `AppDownloadModal.jsx`.
