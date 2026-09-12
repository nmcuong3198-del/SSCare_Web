import { useEffect } from "react";
import Select from "react-select";

import "./ReceiverSelect.css";

const ALL_OPTION = { value: "ALL", label: "Tất cả người dùng" };

export default function ReceiverSelect({ notification, setNotification }) {
  useEffect(() => {
    const recipients = Array.isArray(notification.recipients)
      ? notification.recipients
      : [notification.recipients];
    if (recipients.length !== 1 || recipients[0] !== "ALL") {
      setNotification((prev) => ({ ...prev, recipients: ["ALL"] }));
    }
  }, [notification.recipients, setNotification]);

  return (
    <div className="select-group">
      <label>Người nhận</label>
      <Select
        isDisabled
        isSearchable={false}
        options={[ALL_OPTION]}
        value={ALL_OPTION}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
    </div>
  );
}
