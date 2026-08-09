import { NavLink } from "react-router-dom";
import authService from "@/features/auth/services/authService";

const menus = [
  { title: "Trang chủ", path: "/" },
  { title: "Về chúng tôi", path: "/about" },
  { title: "Tải ứng dụng", path: "/download" },
  { title: "Viết bài", path: "/posts" },
  { title: "Báo cáo", path: "/report" },
  { title: "Quản lý thông báo", path: "/notifications" },
];

export default function Navigation({ onNavigate }) {
  const user = authService.getCurrentUser();

  const visibleMenus = user
    ? menus
    : menus.filter((menu) => ["/", "/about", "/download"].includes(menu.path));

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
