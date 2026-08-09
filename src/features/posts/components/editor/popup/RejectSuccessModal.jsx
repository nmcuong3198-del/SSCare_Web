import "./RejectSuccessModal.css";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RejectSuccessModal({
    open,
    onClose,
}) {

    const navigate = useNavigate();

    if (!open) return null;

    return (
        <div className="modal-overlay">

            <div className="reject-modal">

                <div className="icon">
                    <AlertTriangle size={36}/>
                </div>

                <h2>Từ chối bài viết thành công</h2>

                <p>
                    Bài viết đã được chuyển sang trạng thái
                    <strong> "Từ chối"</strong>
                    và sẽ không hiển thị trên ứng dụng của người dùng.
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