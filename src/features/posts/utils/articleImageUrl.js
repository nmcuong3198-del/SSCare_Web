const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const getApiOrigin = () => {
  try {
    return new URL(API_BASE_URL, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
};

/**
 * Backend lưu ảnh dưới dạng /article/yyyy/MM/file.jpg.
 * Hàm này chuẩn hóa cả URL tuyệt đối lẫn path tương đối để ảnh luôn được tải
 * đúng host ở local/prod.
 */
export function resolveArticleImageUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  const value = imageUrl.trim();
  if (!value) return null;

  if (/^(blob:|data:)/i.test(value)) return value;

  if (/^https?:\/\//i.test(value)) return value;

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${getApiOrigin()}${path}`;
}
