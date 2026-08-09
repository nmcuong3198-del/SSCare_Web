import { Link } from "react-router-dom";
import logo from "@/assets/brand/logo.png";
import "./Logo.css";

export default function Logo() {
  return (
    <Link to="/" className="logo">
      <img src={logo} alt="SSCare Logo" className="logo-image" />
      <span className="logo-text">SSCare</span>
    </Link>
  );
}