import "./ApproveSuccessModal.css";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ApproveSuccessModal({
    open,
    onClose,
}) {

    const navigate = useNavigate();

    if (!open) return null;

    return (
        <div className="modal-overlay">

            <div className="approve-modal">

                <div className="approve-icon">
                    <Check size={34}/>
                </div>

                <h2>Duyệt bài viết thành công</h2>

                <p>
                    Bài viết đã được phê duyệt và hiển thị trên hệ thống.
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