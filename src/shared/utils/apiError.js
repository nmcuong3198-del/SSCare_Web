const GENERIC_VALIDATION_DETAILS = new Set([
  "One or more fields are invalid.",
  "Validation failed",
]);

const EXACT_MESSAGE_MAP = new Map([
  ["must not be blank", "Trường này không được để trống."],
  ["must not be null", "Trường này là bắt buộc."],
  ["must be a well-formed email address", "Email không đúng định dạng."],
  ["Validation failed", "Thông tin nhập vào chưa hợp lệ."],
  ["One or more fields are invalid.", "Một hoặc nhiều trường thông tin chưa hợp lệ."],
  ["Authentication error", "Lỗi xác thực tài khoản."],
  ["Resource not found", "Không tìm thấy dữ liệu yêu cầu."],
  ["Invalid request", "Yêu cầu không hợp lệ."],
  ["Malformed request body", "Dữ liệu gửi lên không đúng định dạng."],
  ["Invalid request parameter", "Tham số yêu cầu không hợp lệ."],
  ["Upload too large", "Tệp tải lên quá lớn."],
  ["The uploaded file exceeds the maximum allowed size.", "Tệp tải lên vượt quá dung lượng cho phép."],
  ["Internal server error", "Hệ thống đang gặp sự cố."],
  ["An unexpected error occurred.", "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."],
  ["Unauthorized", "Phiên đăng nhập không hợp lệ."],
  ["Forbidden", "Bạn không có quyền thực hiện thao tác này."],
  ["This endpoint is not available.", "Chức năng này hiện không khả dụng."],
  ["A valid viewer session is required.", "Vui lòng đăng nhập để tiếp tục."],
  ["This session is not allowed to perform that action.", "Phiên đăng nhập hiện tại không có quyền thực hiện thao tác này."],
  ["Too Many Requests", "Có quá nhiều yêu cầu."],
  ["Too many guest sessions created. Try again later.", "Có quá nhiều yêu cầu truy cập. Vui lòng thử lại sau."],
  ["Bad credentials", "Thông tin đăng nhập không chính xác."],
  ["Access Denied", "Bạn không có quyền thực hiện thao tác này."],
  ["Account is disabled", "Tài khoản hiện không hoạt động."],
  ["No active push device", "Không có thiết bị nhận thông báo đang hoạt động."],
  ["Push delivery failed", "Gửi thông báo tới thiết bị thất bại."],
]);

const VALIDATION_TRANSLATORS = [
  [/^size must be between (\d+) and (\d+)$/i, (_, min, max) => `Độ dài phải từ ${min} đến ${max} ký tự.`],
  [/^size must be less than or equal to (\d+)$/i, (_, max) => `Độ dài tối đa là ${max} ký tự.`],
  [/^size must be greater than or equal to (\d+)$/i, (_, min) => `Độ dài tối thiểu là ${min} ký tự.`],
  [/^must be greater than or equal to (-?\d+)$/i, (_, min) => `Giá trị phải lớn hơn hoặc bằng ${min}.`],
  [/^must be less than or equal to (-?\d+)$/i, (_, max) => `Giá trị phải nhỏ hơn hoặc bằng ${max}.`],
  [/^must be a past date or in the present$/i, () => "Ngày không được lớn hơn ngày hiện tại."],
  [/^must match .+$/i, () => "Dữ liệu không đúng định dạng yêu cầu."],
];

function looksLikeUntranslatedEnglish(message) {
  if (!message) return false;
  const normalized = message.toLowerCase();
  const englishSignals = [
    " must ", "must ", " is required", "invalid ", "unauthorized",
    "forbidden", "not found", "failed", "error", "too many",
    "cannot ", "could not", "unable to", "malformed", "unsupported",
    "bad ", "expired", "already exists", "unavailable", "timeout",
    "timed out", "access denied", "disabled",
  ];
  return englishSignals.some((signal) => normalized.includes(signal));
}

export function translateApiMessage(message, fallback = "Yêu cầu không thể thực hiện. Vui lòng thử lại.") {
  if (typeof message !== "string") return fallback;

  const value = message.trim();
  if (!value) return fallback;

  const exact = EXACT_MESSAGE_MAP.get(value);
  if (exact) return exact;

  for (const [pattern, translate] of VALIDATION_TRANSLATORS) {
    const match = value.match(pattern);
    if (match) return translate(...match);
  }

  // Không đưa nguyên văn thông báo tiếng Anh từ backend ra giao diện.
  if (looksLikeUntranslatedEnglish(` ${value}`)) return fallback;

  return value;
}

export function getApiErrorMessage(error, fallback = "Yêu cầu không thể thực hiện. Vui lòng thử lại.") {
  const data = error?.response?.data;

  if (data?.errors && typeof data.errors === "object") {
    const firstMessage = Object.values(data.errors).find(Boolean);
    if (firstMessage) return translateApiMessage(firstMessage, fallback);
  }

  if (data?.detail && !GENERIC_VALIDATION_DETAILS.has(data.detail)) {
    return translateApiMessage(data.detail, fallback);
  }

  if (data?.message) return translateApiMessage(data.message, fallback);
  if (data?.title) return translateApiMessage(data.title, fallback);
  return fallback;
}

export function isTimeoutError(error) {
  return error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT";
}

export function hasNoServerResponse(error) {
  return Boolean(error) && !error?.response;
}

export function createConnectionError(error, action = "thực hiện yêu cầu") {
  if (!hasNoServerResponse(error)) return null;

  if (isTimeoutError(error)) {
    return {
      title: "⚠️ Máy chủ phản hồi quá chậm",
      message: `Yêu cầu ${action} đã quá thời gian chờ và chưa nhận được phản hồi từ máy chủ.`,
      details: [
        "Kiểm tra kết nối mạng của bạn.",
        "Chờ một lúc rồi thử lại.",
      ],
      tip: "Nếu tình trạng tiếp diễn, vui lòng liên hệ quản trị viên hệ thống.",
    };
  }

  return {
    title: "⚠️ Không thể kết nối tới máy chủ",
    message: `Không thể ${action} vì trình duyệt chưa nhận được phản hồi từ máy chủ.`,
    details: [
      "Kiểm tra kết nối mạng của bạn.",
      "Thử tải lại trang hoặc thử lại sau ít phút.",
    ],
    tip: "Nếu tình trạng tiếp diễn, vui lòng liên hệ quản trị viên hệ thống.",
  };
}
