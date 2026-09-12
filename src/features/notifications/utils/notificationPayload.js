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
  const values = Array.isArray(recipients)
    ? recipients
    : typeof recipients === "string"
      ? recipients.split(",")
      : [];

  const normalized = [...new Set(
    values
      .map((recipient) => String(recipient || "").trim())
      .filter(Boolean),
  )];

  if (normalized.some((recipient) => recipient.toUpperCase() === "ALL")) {
    return ["ALL"];
  }

  return normalized.length > 0 ? normalized : ["ALL"];
}

export function normalizeNotification(notification) {
  return {
    ...notification,
    recipients: normalizeRecipients(notification?.recipients),
    updatedAt: notification?.updatedAt ?? notification?.updateDate ?? "",
  };
}

/**
 * Backend notification endpoints use @RequestBody, therefore this must stay a
 * plain JSON object. Sending FormData here produces multipart/form-data and can
 * fail with HTTP 415 depending on Spring's configured converters.
 */
export function createNotificationPayload(notification, overrides = {}) {
  const source = {
    ...notification,
    ...overrides,
  };

  return NOTIFICATION_FIELDS.reduce((payload, field) => {
    const value = source[field];
    if (value === null || value === undefined) return payload;
    if (value === "" && ["code", "scheduleTime", "updatedAt", "createdBy"].includes(field)) {
      return payload;
    }

    payload[field] = field === "recipients"
      ? normalizeRecipients(value).join(",")
      : value;
    return payload;
  }, {});
}
