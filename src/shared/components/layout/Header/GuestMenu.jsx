import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/ui/Button/Button";

export default function GuestMenu({ onNavigate }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onNavigate?.();
    navigate("/login");
  };

  return <Button onClick={handleLogin}>Đăng nhập</Button>;
}
