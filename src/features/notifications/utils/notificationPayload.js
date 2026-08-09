const NOTIFICATION_FIELDS = [
  "id",
  "code",
  "title",
  "content",
  "type",
  "recipients",
  "scheduleTime",
  "status",
  "createdBy",
  "updatedAt",
];

export function normalizeRecipients(recipients) {
  if (Array.isArray(recipients)) {
    return recipients.length > 0 ? recipients : ["ALL"];
  }

  if (typeof recipients !== "string" || recipients.trim() === "") {
    return ["ALL"];
  }

  return recipients
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

export function normalizeNotification(notification) {
  return {
    ...notification,
    recipients: normalizeRecipients(notification?.recipients),
    updatedAt: notification?.updatedAt ?? notification?.updateDate ?? "",
  };
}

export function createNotificationFormData(notification, overrides = {}) {
  const payload = {
    ...notification,
    ...overrides,
  };
  const formData = new FormData();

  NOTIFICATION_FIELDS.forEach((field) => {
    const value = payload[field];

    if (value === null || value === undefined) return;

    if (field === "recipients") {
      formData.append(field, normalizeRecipients(value).join(","));
      return;
    }

    formData.append(field, String(value));
  });

  return formData;
}
