import { useMemo } from "react";
import Select from "react-select";
import "./NotificationTypeSelect.css";

const TYPES = [
  { value: "SYSTEM", label: "Hệ thống" },
  { value: "OTHER", label: "Khác" }
];

export default function NotificationTypeSelect({ notification, setNotification }) {
  const selectedValue = useMemo(() => {
    return TYPES.find((opt) => opt.value === notification.type) || TYPES[0];
  }, [notification.type]);

  const handleChange = (selectedOption) => {
    setNotification((prev) => ({
      ...prev,
      type: selectedOption ? selectedOption.value : "SYSTEM",
    }));
  };

  return (
    <div className="select-group type-select-wrapper">
      <label>Loại thông báo</label>

      <Select
        isSearchable={false}
        options={TYPES}
        value={selectedValue}
        onChange={handleChange}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
}