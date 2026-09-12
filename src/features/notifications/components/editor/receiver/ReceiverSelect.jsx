import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

import notificationsService from "@/features/notifications/services/notificationsService";

import "./ReceiverSelect.css";

const ALL_OPTION = { value: "ALL", label: "Tất cả người dùng" };
const PAGE_SIZE = 100;

const recipientLabel = (account) => {
  const name = String(account?.fullName || "").trim();
  const contact = String(account?.email || account?.phone || "").trim();

  if (name && contact) return `${name} — ${contact}`;
  if (name) return name;
  if (contact) return contact;
  return String(account?.id || "Người dùng");
};

export default function ReceiverSelect({ notification, setNotification }) {
  const [recipientOptions, setRecipientOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadRecipients = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const collected = [];
        let page = 0;
        let totalPages = 1;

        do {
          const response = await notificationsService.getRecipients(page, PAGE_SIZE);
          const content = Array.isArray(response?.content) ? response.content : [];
          collected.push(...content);
          totalPages = Math.max(1, Number(response?.totalPages) || 1);
          page += 1;
        } while (page < totalPages && !cancelled);

        if (cancelled) return;

        const seen = new Set();
        const options = collected
          .filter((account) => account?.id)
          .filter((account) => {
            const key = String(account.id);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          })
          .map((account) => ({
            value: String(account.id),
            label: recipientLabel(account),
          }));

        setRecipientOptions(options);
      } catch (error) {
        if (!cancelled) {
          console.error("Không thể tải danh sách người nhận:", error);
          setLoadError("Không thể tải danh sách người nhận.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadRecipients();

    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(
    () => [ALL_OPTION, ...recipientOptions],
    [recipientOptions],
  );

  const selectedValues = useMemo(() => {
    const recipients = Array.isArray(notification.recipients)
      ? notification.recipients
      : String(notification.recipients || "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);

    if (recipients.includes("ALL")) return [ALL_OPTION];

    const byValue = new Map(options.map((option) => [option.value, option]));
    return recipients
      .map((value) => byValue.get(String(value)))
      .filter(Boolean);
  }, [notification.recipients, options]);

  const handleChange = (selectedOptions, actionMeta) => {
    const selected = Array.isArray(selectedOptions) ? selectedOptions : [];
    const selectedActionValue = actionMeta?.option?.value;

    let nextRecipients;
    if (selectedActionValue === "ALL") {
      nextRecipients = ["ALL"];
    } else {
      nextRecipients = selected
        .map((option) => option.value)
        .filter((value) => value !== "ALL");
    }

    setNotification((prev) => ({
      ...prev,
      recipients: nextRecipients,
    }));
  };

  return (
    <div className="select-group receiver-select-wrapper">
      <label>Người nhận</label>
      <Select
        isMulti
        isSearchable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        isLoading={loading}
        isDisabled={loading && recipientOptions.length === 0}
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder={loading ? "Đang tải người nhận..." : "Chọn người nhận..."}
        noOptionsMessage={() => loadError || "Không tìm thấy người dùng"}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      {loadError && <span className="receiver-load-error">{loadError}</span>}
    </div>
  );
}
