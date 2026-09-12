import { useEffect, useMemo } from "react";
import Select from "react-select";
import "./NotificationTypeSelect.css";

// Phase hiện tại của tài liệu chỉ cho phép Admin tạo thủ công thông báo Hệ thống.
// NOTI_OTHER là thông báo tự động do Backend rule engine sinh.
const TYPES = [{ value: "NOTI_GEN", label: "Hệ thống" }];

export default function NotificationTypeSelect({ notification, setNotification }) {
  const selectedValue = useMemo(
    () => TYPES.find((opt) => opt.value === notification.type) || TYPES[0],
    [notification.type],
  );

  useEffect(() => {
    if (notification.type !== "NOTI_GEN") {
      setNotification((prev) => ({
        ...prev,
        type: "NOTI_GEN",
      }));
    }
  }, [notification.type, setNotification]);

  return (
    <div className="select-group type-select-wrapper">
      <label>Loại thông báo</label>
      <Select
        isSearchable={false}
        isDisabled
        options={TYPES}
        value={selectedValue}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
    </div>
  );
}
