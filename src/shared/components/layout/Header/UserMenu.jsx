import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import authService from "@/features/auth/services/authService";

import "./UserMenu.css";

export default function UserMenu({ onNavigate }) {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const navigateTo = (path) => {
    setOpen(false);
    onNavigate?.();
    navigate(path);
  };

  const logout = () => {
    authService.logout();
    setOpen(false);
    onNavigate?.();
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="user-info"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <FaUserCircle size={35} />
        <span>{user?.fullName || user?.username || "Người dùng"}</span>
        <FaChevronDown />
      </button>

      {open && (
        <div className="dropdown">
          <button type="button" onClick={() => navigateTo("/profile")}>
            Hồ sơ
          </button>
          <button type="button" onClick={() => navigateTo("/settings")}>
            Cài đặt
          </button>
          <hr />
          <button type="button" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
