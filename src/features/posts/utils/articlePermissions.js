import authService from "@/features/auth/services/authService";

const EDITABLE_STATUSES = new Set(["draft", "pending", "rejected"]);

export function canEditArticle(status) {
  if (!authService.canWriteArticles()) return false;
  return EDITABLE_STATUSES.has(status);
}

export function editLockReason(status) {
  if (canEditArticle(status)) return null;

  if (status === "published") {
    return "Bài viết đã được phê duyệt nên không thể chỉnh sửa.";
  }
  if (status === "archived") {
    return "Bài viết đã được lưu trữ nên không thể chỉnh sửa.";
  }
  return "Bạn không có quyền sửa bài viết này.";
}
