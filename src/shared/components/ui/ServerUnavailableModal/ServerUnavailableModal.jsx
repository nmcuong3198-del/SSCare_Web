import { Modal } from "antd";
import "./ServerUnavailableModal.css";

export default function ServerUnavailableModal({
  open,
  onClose,
  title = "⚠️ Không thể kết nối tới máy chủ",
  message = "Dịch vụ thông báo hiện chưa khả dụng. Không thể kết nối tới máy chủ.",
  details = [
    "Đảm bảo Backend đã được khởi động.",
    "Kiểm tra kết nối mạng.",
    "Thử lại sau vài phút.",
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
