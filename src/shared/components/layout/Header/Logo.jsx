import { Link } from "react-router-dom";
import logo from "@/assets/brand/logo.png";
import "./Logo.css";

export default function Logo() {
    return (
        <Link to="/" className="logo" aria-label="SSCare - Mạng Xã Hội">
            <img src={logo} alt="SSCare Logo" className="logo-image" />

            <span className="logo-copy">
        <span className="logo-text">SSCare</span>
        <span className="logo-service-type">Mạng Xã Hội</span>
      </span>
        </Link>
    );
}
