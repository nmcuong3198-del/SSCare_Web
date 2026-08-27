import authService from "@/features/auth/services/authService";

// Editing a published article bumps its contentVersion, which resets reading progress on every
// device that has it open. That is a publishing decision, so it stays with admins.
const EDITOR_CAN_EDIT = new Set(["draft", "pending", "rejected"]);

export function canEditArticle(status) {
  if (authService.isAdmin()) return true;
  if (!authService.canWriteArticles()) return false;

  return EDITOR_CAN_EDIT.has(status);
}

export function editLockReason(status) {
  if (canEditArticle(status)) return null;

  return status === "published" || status === "archived"
    ? "Chỉ quản trị viên mới sửa được bài đã xuất bản."
    : "Bạn không có quyền sửa bài viết này.";
}
