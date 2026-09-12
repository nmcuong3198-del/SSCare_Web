const GENERIC_VALIDATION_DETAIL = "One or more fields are invalid.";

export function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (data?.detail && data.detail !== GENERIC_VALIDATION_DETAIL) {
    return data.detail;
  }

  if (data?.errors && typeof data.errors === "object") {
    const firstMessage = Object.values(data.errors).find(Boolean);
    if (firstMessage) return firstMessage;
  }

  if (data?.message) return data.message;
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
