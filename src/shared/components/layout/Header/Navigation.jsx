import { NavLink } from "react-router-dom";
import authService from "@/features/auth/services/authService";

const menus = [
  { title: "Trang chủ", path: "/", public: true },
  { title: "Về chúng tôi", path: "/about", public: true },
  { title: "Tải ứng dụng", path: "/download", public: true },
  { title: "Viết bài", path: "/posts", roles: ["ADMIN", "CONTENT_EDITOR"] },
  { title: "Báo cáo", path: "/report", roles: ["ADMIN"] },
  { title: "Quản lý thông báo", path: "/notifications", roles: ["ADMIN", "NOTIFICATION_MANAGER"] },
  { title: "Quản lý tài khoản", path: "/accounts", roles: ["ADMIN"] },
];

export default function Navigation({ onNavigate }) {
  const user = authService.getCurrentUser();
  const roles = user?.roles || [];

  const visibleMenus = menus.filter((menu) => {
    if (menu.public) return true;
    if (!user) return false;
    return menu.roles?.some((role) => roles.includes(role));
  });

  return (
    <nav className="navigation" aria-label="Điều hướng chính">
      <ul className="nav-menu">
        {visibleMenus.map((menu) => (
          <li key={menu.path}>
            <NavLink
              to={menu.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {menu.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
