import toast from "react-hot-toast";

const TITLE_MAX = 100;
const CONTENT_MAX = 1000;

export function validateNotification(notification) {
  const title = String(notification?.title ?? "").trim();
  const content = String(notification?.content ?? "").trim();
  const recipients = Array.isArray(notification?.recipients)
    ? notification.recipients
    : String(notification?.recipients ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

  if (!title) {
    toast.error("Vui lòng nhập nội dung tiêu đề.");
    return false;
  }
  if (title.length > TITLE_MAX) {
    toast.error(`Tiêu đề tối đa ${TITLE_MAX} ký tự.`);
    return false;
  }
  if (!content) {
    toast.error("Vui lòng nhập nội dung thông báo.");
    return false;
  }
  if (content.length > CONTENT_MAX) {
    toast.error(`Nội dung thông báo tối đa ${CONTENT_MAX} ký tự.`);
    return false;
  }
  if (recipients.length === 0) {
    toast.error("Vui lòng chọn người nhận.");
    return false;
  }

  return true;
}
