import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";

import authService from "@/features/auth/services/authService";

const publicMenus = [
  { title: "Trang chủ", path: "/" },
  { title: "Về chúng tôi", path: "/about" },
  { title: "Tải ứng dụng", path: "/download" },
];

const adminMenus = [
  { title: "Bài viết", path: "/posts" },
  { title: "Báo cáo", path: "/report" },
  { title: "Thông báo", path: "/notifications" },
  { title: "Tài khoản", path: "/accounts" },
];

const roleMenus = [
  { title: "Viết bài", path: "/posts", roles: ["CONTENT_EDITOR"] },
  { title: "Quản lý thông báo", path: "/notifications", roles: ["NOTIFICATION_MANAGER"] },
];

export default function Navigation({ onNavigate }) {
  const location = useLocation();
  const user = authService.getCurrentUser();
  const roles = user?.roles || [];
  const isAdmin = roles.includes("ADMIN");
  const [adminOpen, setAdminOpen] = useState(false);
  const adminMenuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (event) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
        setAdminOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    setAdminOpen(false);
  }, [location.pathname]);

  const handleNavigate = () => {
    setAdminOpen(false);
    onNavigate?.();
  };

  const visibleRoleMenus = roleMenus.filter((menu) =>
    menu.roles.some((role) => roles.includes(role)),
  );

  const isAdminSectionActive = adminMenus.some(
    (menu) => location.pathname === menu.path || location.pathname.startsWith(`${menu.path}/`),
  );

  return (
    <nav className="navigation" aria-label="Điều hướng chính">
      <ul className="nav-menu">
        {publicMenus.map((menu) => (
          <li key={menu.path}>
            <NavLink
              to={menu.path}
              end={menu.path === "/"}
              onClick={handleNavigate}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {menu.title}
            </NavLink>
          </li>
        ))}

        {!isAdmin &&
          visibleRoleMenus.map((menu) => (
            <li key={menu.path}>
              <NavLink
                to={menu.path}
                onClick={handleNavigate}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {menu.title}
              </NavLink>
            </li>
          ))}

        {isAdmin && (
          <li className="admin-nav" ref={adminMenuRef}>
            <button
              type="button"
              className={`nav-link admin-nav-trigger ${isAdminSectionActive ? "active" : ""}`}
              aria-expanded={adminOpen}
              onClick={() => setAdminOpen((current) => !current)}
            >
              <span>Quản trị</span>
              <FaChevronDown
                className={adminOpen ? "admin-nav-chevron is-open" : "admin-nav-chevron"}
                size={11}
              />
            </button>

            {adminOpen && (
              <div className="admin-nav-dropdown">
                {adminMenus.map((menu) => (
                  <NavLink
                    key={menu.path}
                    to={menu.path}
                    onClick={handleNavigate}
                    className={({ isActive }) =>
                      isActive ? "admin-nav-item active" : "admin-nav-item"
                    }
                  >
                    {menu.title}
                  </NavLink>
                ))}
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
