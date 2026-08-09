import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import authService from "@/features/auth/services/authService";
import GuestMenu from "@/shared/components/layout/Header/GuestMenu";
import Logo from "@/shared/components/layout/Header/Logo";
import Navigation from "@/shared/components/layout/Header/Navigation";
import UserMenu from "@/shared/components/layout/Header/UserMenu";

import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = authService.getCurrentUser();

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", menuOpen);

    return () => document.body.classList.remove("mobile-menu-open");
  }, [menuOpen]);

  return (
    <header className="header">
      <div className="container header-container">
        <Logo />

        <div className={`header-menu ${menuOpen ? "is-open" : ""}`}>
          <Navigation onNavigate={closeMenu} />

          <div className="header-account">
            {user ? (
              <UserMenu onNavigate={closeMenu} />
            ) : (
              <GuestMenu onNavigate={closeMenu} />
            )}
          </div>
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}
