# SSCare Web

Ứng dụng quản trị SSCare được xây dựng bằng React và Vite. Source đã được tổ chức lại theo hướng feature-based; không còn tồn tại song song `src/pages`, `src/components`, `src/services` cũ.

## Chạy project

Yêu cầu Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Kiểm tra code trước khi commit:

```bash
npm run lint
npm run build
```

Tạo file `.env` từ `.env.example` khi cần thay đổi địa chỉ backend:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Cấu trúc project

```text
src/
├── app/
│   ├── App.jsx
│   ├── layouts/
│   └── routes/
├── assets/
│   ├── brand/
│   └── landing/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── landing/
│   │   ├── components/
│   │   └── pages/
│   ├── notifications/
│   │   ├── components/
│   │   ├── model/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── posts/
│       ├── components/
│       ├── model/
│       ├── pages/
│       ├── services/
│       └── utils/
├── shared/
│   ├── components/
│   ├── services/
│   └── styles/
└── main.jsx
```

## Quy tắc đặt code

- `app`: cấu hình route, layout và app shell.
- `features/<feature>/pages`: màn hình được route gọi trực tiếp.
- `features/<feature>/components`: component chỉ phục vụ feature đó.
- `features/<feature>/services`: API của feature.
- `features/<feature>/model`: dữ liệu mặc định và model helper.
- `features/<feature>/utils`: validate, mapper và helper nghiệp vụ.
- `shared`: component, HTTP client và style dùng chung cho nhiều feature.
- `assets`: chỉ giữ các tài nguyên đang được source import.

Import nội bộ sử dụng alias `@/`:

```js
import authService from "@/features/auth/services/authService";
import Pagination from "@/shared/components/ui/Pagination/Pagination";
```

Không tạo lại các thư mục cấp cao như `src/pages`, `src/components` hoặc `src/services`; code mới cần được đặt trong feature tương ứng hoặc `shared`.

## Trước khi đẩy code

```bash
npm run lint
npm run build
```

Không commit `node_modules`, `dist`, `.idea`, file `.env` thật hoặc file ZIP sinh ra từ project.
