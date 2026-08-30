import toast from "react-hot-toast";

const MAX_TAGS = 10;
const MAX_TAG_LENGTH = 50;
const MAX_SECTIONS = 10;
const hasText = (value) => typeof value === "string" && value.trim().length > 0;

export function getQualityTextSignature(article) {
  const sections = Array.isArray(article?.content) ? article.content : [];

  return JSON.stringify({
    title: article?.title ?? "",
    summary: article?.summary ?? "",
    conclusion: article?.conclusion ?? "",
    sections: sections.map((section) => ({
      id: section?.id ?? "",
      title: section?.title ?? "",
      content: section?.content ?? "",
    })),
  });
}

export function isArticleReadyForQualityCheck(article, imageFile) {
  const sections = Array.isArray(article.content) ? article.content : [];
  return Boolean(hasText(article.title) && imageFile && hasText(article.summary) &&
    hasText(article.cateName) && Array.isArray(article.hashtags) && article.hashtags.length > 0 &&
    article.hashtags.length <= MAX_TAGS && article.hashtags.every((t) => hasText(t) && t.trim().length <= MAX_TAG_LENGTH) &&
    sections.length > 0 && sections.length <= MAX_SECTIONS &&
    sections.every((s) => hasText(s.title) && hasText(s.content)) && hasText(article.conclusion));
}

export function validateArticle(article, imageFile, { requireQuality = true } = {}) {
  if (!hasText(article.title)) return toast.error("Vui lòng nhập tiêu đề bài viết."), false;
  if (article.title.trim().length > 100) return toast.error("Tiêu đề tối đa 100 ký tự."), false;
  if (!imageFile) return toast.error("Vui lòng chọn ảnh bìa."), false;
  if (!hasText(article.summary)) return toast.error("Vui lòng nhập tóm tắt."), false;
  if (article.summary.trim().length > 500) return toast.error("Tóm tắt tối đa 500 ký tự."), false;
  if (!hasText(article.cateName)) return toast.error("Vui lòng chọn thư mục đăng tải bài viết."), false;
  if (!Array.isArray(article.hashtags) || article.hashtags.length === 0) return toast.error("Vui lòng nhập ít nhất một hashtag."), false;
  if (article.hashtags.length > MAX_TAGS) return toast.error("Tối đa 10 hashtag."), false;
  if (article.hashtags.some((tag) => !hasText(tag) || tag.trim().length > MAX_TAG_LENGTH)) return toast.error("Mỗi hashtag tối đa 50 ký tự."), false;

  const sections = Array.isArray(article.content) ? article.content : [];
  if (sections.length === 0) return toast.error("Bài viết phải có ít nhất một mục."), false;
  if (sections.length > MAX_SECTIONS) return toast.error("Tối đa 10 mục nội dung."), false;
  const ids = new Set();
  for (const section of sections) {
    if (!section.id || ids.has(section.id)) return toast.error("Mỗi mục nội dung phải có mã duy nhất."), false;
    ids.add(section.id);
    if (!hasText(section.title)) return toast.error("Tiêu đề mục nội dung không được để trống."), false;
    if (section.title.trim().length > 200) return toast.error("Tiêu đề mục nội dung tối đa 200 ký tự."), false;
    if (!hasText(section.content)) return toast.error("Nội dung chi tiết không được để trống."), false;
  }
  if (!hasText(article.conclusion)) return toast.error("Vui lòng nhập lời kết."), false;
  if (requireQuality && article.qualityChecked !== true) {
    return toast.error("Vui lòng kiểm tra từ cấm trước khi gửi bài viết."), false;
  }
  return true;
}
