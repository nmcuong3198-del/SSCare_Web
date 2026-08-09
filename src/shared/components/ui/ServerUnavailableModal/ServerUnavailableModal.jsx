import { Modal } from "antd";
import "./ServerUnavailableModal.css";

export default function ServerUnavailableModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      title="⚠️ Không thể kết nối tới máy chủ"
      onOk={onClose}
      onCancel={onClose}
      okText="Đã hiểu"
      cancelButtonProps={{ style: { display: "none" } }}
      centered
    >
      <div className="server-unavailable-content">
        <p>
          Dịch vụ thông báo hiện chưa khả dụng. Không thể kết nối tới máy chủ.
        </p>

        <ul>
          <li>Đảm bảo Backend đã được khởi động.</li>
          <li>Kiểm tra kết nối mạng.</li>
          <li>Thử lại sau vài phút.</li>
        </ul>

        <div className="tip">
          Nếu sự cố vẫn tiếp diễn, vui lòng liên hệ quản trị viên hệ thống.
        </div>
      </div>
    </Modal>
  );
}