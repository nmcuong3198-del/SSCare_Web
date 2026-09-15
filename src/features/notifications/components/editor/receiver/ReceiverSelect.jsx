import { useEffect, useMemo, useState } from "react";
import Select from "react-select";

import notificationsService from "@/features/notifications/services/notificationsService";

import "./ReceiverSelect.css";

const ALL_OPTION = { value: "ALL", label: "Tất cả người dùng" };
const DEFAULT_ROLE_OPTIONS = [
  { value: "ROLE:PARENT", label: "Phụ huynh" },
  { value: "ROLE:EXPERT", label: "Chuyên gia" },
  { value: "ROLE:ADMIN", label: "Quản trị viên" },
  { value: "ROLE:CONTENT_EDITOR", label: "Biên tập nội dung" },
  { value: "ROLE:NOTIFICATION_MANAGER", label: "Quản lý thông báo" },
  { value: "ROLE:SUPPORT", label: "Hỗ trợ" },
];
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
  const [roleOptions, setRoleOptions] = useState(DEFAULT_ROLE_OPTIONS);
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
          setLoadError("Không thể tải danh sách tài khoản cụ thể. Bạn vẫn có thể chọn nhóm người nhận.");
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

  useEffect(() => {
    let cancelled = false;

    notificationsService
      .getRecipientRoles()
      .then((roles) => {
        if (cancelled || !Array.isArray(roles)) return;

        const nextRoleOptions = roles
          .filter((role) => role?.code)
          .map((role) => ({
            value: `ROLE:${String(role.code).trim().toUpperCase()}`,
            label: String(role.name || role.code).trim(),
          }));

        if (nextRoleOptions.length > 0) {
          setRoleOptions(nextRoleOptions);
        }
      })
      .catch((error) => {
        // Keep the built-in SSCare role list as a backward-compatible fallback
        // when Web is deployed slightly before Backend.
        console.error("Không thể tải danh sách nhóm người nhận:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const options = useMemo(() => [
    {
      label: "Phạm vi",
      options: [ALL_OPTION],
    },
    {
      label: "Nhóm người nhận",
      options: roleOptions,
    },
    {
      label: "Tài khoản cụ thể",
      options: recipientOptions,
    },
  ], [recipientOptions, roleOptions]);

  const selectedValues = useMemo(() => {
    const recipients = Array.isArray(notification.recipients)
      ? notification.recipients
      : String(notification.recipients || "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);

    if (recipients.some((value) => String(value).toUpperCase() === "ALL")) {
      return [ALL_OPTION];
    }

    const allOptions = [ALL_OPTION, ...roleOptions, ...recipientOptions];
    const byValue = new Map(allOptions.map((option) => [option.value, option]));
    return recipients
      .map((value) => {
        const rawValue = String(value);
        const normalizedValue = rawValue.toUpperCase().startsWith("ROLE:")
          ? rawValue.toUpperCase()
          : rawValue;
        return byValue.get(normalizedValue);
      })
      .filter(Boolean);
  }, [notification.recipients, recipientOptions, roleOptions]);

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
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder={loading ? "Đang tải người nhận..." : "Chọn nhóm hoặc người nhận..."}
        noOptionsMessage={() => loadError || "Không tìm thấy người nhận"}
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      {loadError && <span className="receiver-load-error">{loadError}</span>}
    </div>
  );
}
