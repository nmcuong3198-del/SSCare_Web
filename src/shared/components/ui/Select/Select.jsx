import { useEffect, useRef, useState } from "react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

import "./Select.css";

export default function Select({
  id,
  value = "",
  options = [],
  onChange,
  placeholder = "Chọn giá trị",
  disabled = false,
  ariaLabel,
  className = "",
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const handleSelect = (option) => {
    if (option.disabled) return;
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`ss-select ${open ? "is-open" : ""} ${disabled ? "is-disabled" : ""} ${className}`.trim()}
    >
      <button
        id={id}
        type="button"
        className="ss-select__trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={`ss-select__value ${selectedOption ? "" : "is-placeholder"}`.trim()}>
          {selectedOption?.label ?? placeholder}
        </span>
        <FiChevronDown className="ss-select__chevron" aria-hidden="true" />
      </button>

      {open && (
        <div className="ss-select__menu" role="listbox" aria-labelledby={id}>
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={`${option.value}-${option.label}`}
                type="button"
                role="option"
                aria-selected={selected}
                className={`ss-select__option ${selected ? "is-selected" : ""}`.trim()}
                disabled={option.disabled}
                onClick={() => handleSelect(option)}
              >
                <span>{option.label}</span>
                {selected && <FiCheck aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
