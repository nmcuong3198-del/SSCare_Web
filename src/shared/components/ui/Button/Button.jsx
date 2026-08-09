import "./Button.css";

export default function Button({
  children,

  onClick,

  type = "button",
}) {
  return (
    <button type={type} className="primary-btn" onClick={onClick}>
      {children}
    </button>
  );
}
