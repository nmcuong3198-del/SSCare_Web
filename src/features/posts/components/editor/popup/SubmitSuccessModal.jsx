import "./SubmitSuccessModal.css";
import { SendHorizonal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubmitSuccessModal({
  open,
  onClose,
}) {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="submit-modal">

        <div className="submit-icon">
          <SendHorizonal size={34} />
        </div>

        <h2>Gửi bài viết thành công</h2>

        <p>
          Bài viết của bạn đã được gửi thành công và
          <br />
          đang chờ ban biên tập phê duyệt.
        </p>

        <button
          className="backToListPost"
          onClick={() => navigate("/posts")}
        >
          Về danh sách bài viết
        </button>

        <button
          className="text-btn"
          onClick={onClose}
        >
          Đóng
        </button>

      </div>
    </div>
  );
}