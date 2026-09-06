import { useEffect, useMemo, useState } from "react";
import Select, { components } from "react-select";

import notificationsService from "@/features/notifications/services/notificationsService";

import "./ReceiverSelect.css";

const ALL_OPTION = { value: "ALL", label: "Tất cả tài khoản có thiết bị App" };

const InputOption = (props) => (
  <components.Option {...props}>
    <input
      type="checkbox"
      checked={props.isSelected}
      readOnly
      style={{ marginRight: 8, cursor: "pointer" }}
    />
    <label
      style={{
        cursor: "pointer",
        fontWeight: "normal",
        margin: 0,
        display: "inline",
      }}
    >
      {props.label}
    </label>
  </components.Option>
);

const accountLabel = (account) => {
  const contact = account.email || account.phone || account.id;
  return `${account.fullName || "Tài khoản"} • ${contact}`;
};

export default function ReceiverSelect({ notification, setNotification }) {
  const [accountOptions, setAccountOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    notificationsService
      .getRecipients()
      .then((response) => {
        if (cancelled) return;
        const options = (response?.content || []).map((account) => ({
          value: account.id,
          label: accountLabel(account),
        }));
        setAccountOptions(options);
      })
      .catch((error) => {
        console.error("Không thể tải danh sách người nhận thông báo:", error);
        if (!cancelled) setAccountOptions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(
    () => [ALL_OPTION, ...accountOptions],
    [accountOptions],
  );

  const selectedValues = useMemo(() => {
    const currentReceivers = notification.recipients || ["ALL"];
    return currentReceivers.map((value) => {
      const option = options.find((item) => item.value === value);
      return option || { value, label: value };
    });
  }, [notification.recipients, options]);

  const handleChange = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setNotification((prev) => ({ ...prev, recipients: ["ALL"] }));
      return;
    }

    const lastSelected = selectedOptions[selectedOptions.length - 1];
    if (lastSelected.value === "ALL") {
      setNotification((prev) => ({ ...prev, recipients: ["ALL"] }));
      return;
    }

    const finalValues = selectedOptions
      .filter((option) => option.value !== "ALL")
      .map((option) => option.value);

    setNotification((prev) => ({ ...prev, recipients: finalValues }));
  };

  return (
    <div className="select-group">
      <label>Người nhận</label>

      <Select
        isMulti
        isSearchable
        isLoading={loading}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        options={options}
        value={selectedValues}
        onChange={handleChange}
        components={{ Option: InputOption }}
        placeholder="Tìm kiếm hoặc chọn tài khoản..."
        noOptionsMessage={() => "Không có tài khoản phù hợp"}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menuList: (base) => ({
            ...base,
            maxHeight: "245px",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cdd5e0",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#b8c2d1",
            },
          }),
        }}
      />
    </div>
  );
}
