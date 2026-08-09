import toast from "react-hot-toast";

export function validateNotification(notification) {
    if (!notification.title) {
        toast.error("Vui lòng nhập nội dung tiêu đề.");
        return false;
    }
    if (!notification.content) {
        toast.error("Vui lòng nhập nội dung thông báo.");
        return false;
    }
    return true;
}