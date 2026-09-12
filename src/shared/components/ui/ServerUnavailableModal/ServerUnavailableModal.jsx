import { Modal } from "antd";
import "./ServerUnavailableModal.css";

export default function ServerUnavailableModal({
  open,
  onClose,
  title = "⚠️ Không thể kết nối tới máy chủ",
  message = "Trình duyệt chưa nhận được phản hồi từ máy chủ.",
  details = [
    "Kiểm tra kết nối mạng của bạn.",
    "Thử tải lại trang hoặc thử lại sau ít phút.",
  ],
  tip = "Nếu sự cố vẫn tiếp diễn, vui lòng liên hệ quản trị viên hệ thống.",
}) {
  return (
    <Modal
      open={open}
      title={title}
      onOk={onClose}
      onCancel={onClose}
      okText="Đã hiểu"
      cancelButtonProps={{ style: { display: "none" } }}
      centered
    >
      <div className="server-unavailable-content">
        <p>{message}</p>

        {details?.length > 0 && (
          <ul>
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}

        {tip && <div className="tip">{tip}</div>}
      </div>
    </Modal>
  );
}
