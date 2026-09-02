import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/ui/Button/Button";

export default function GuestMenu({ onNavigate }) {
  const navigate = useNavigate();

  const goTo = (path) => {
    onNavigate?.();
    navigate(path);
  };

  return (
    <div className="guest-actions">
      <button
        type="button"
        className="guest-register-btn"
        onClick={() => goTo("/register")}
      >
        Đăng ký
      </button>
      <Button onClick={() => goTo("/login")}>Đăng nhập</Button>
    </div>
  );
}
