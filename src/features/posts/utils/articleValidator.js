import toast from "react-hot-toast";

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

export function isArticleReadyForQualityCheck(article, imageFile) {
  const sections = Array.isArray(article.content) ? article.content : [];

  return Boolean(
    hasText(article.title) &&
      imageFile &&
      hasText(article.summary) &&
      hasText(article.cateName) &&
      Array.isArray(article.hashtags) &&
      article.hashtags.length > 0 &&
      sections.length > 0 &&
      sections.every(
        (section) => hasText(section.title) && hasText(section.content),
      ) &&
      hasText(article.conclusion),
  );
}

export function validateArticle(
  article,
  imageFile,
  { requireQualityCheck = true } = {},
) {
  if (!hasText(article.title)) {
    toast.error("Vui lòng nhập tiêu đề bài viết.");
    return false;
  }

  if (!imageFile) {
    toast.error("Vui lòng chọn ảnh bìa.");
    return false;
  }

  if (!hasText(article.summary)) {
    toast.error("Vui lòng nhập tóm tắt.");
    return false;
  }

  if (!hasText(article.cateName)) {
    toast.error("Vui lòng chọn thư mục đăng tải bài viết.");
    return false;
  }

  if (!Array.isArray(article.hashtags) || article.hashtags.length === 0) {
    toast.error("Vui lòng nhập ít nhất một hashtag.");
    return false;
  }

  const sections = Array.isArray(article.content) ? article.content : [];

  if (sections.length === 0) {
    toast.error("Bài viết phải có ít nhất một mục.");
    return false;
  }

  for (const section of sections) {
    if (!hasText(section.title)) {
      toast.error("Tiêu đề mục nội dung không được để trống.");
      return false;
    }

    if (!hasText(section.content)) {
      toast.error("Nội dung chi tiết không được để trống.");
      return false;
    }
  }

  if (!hasText(article.conclusion)) {
    toast.error("Vui lòng nhập lời kết.");
    return false;
  }

  if (requireQualityCheck && article.qualityChecked !== true) {
    toast.error("Vui lòng kiểm tra từ cấm trước khi gửi bài viết.");
    return false;
  }

  return true;
}
