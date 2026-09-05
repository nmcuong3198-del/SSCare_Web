import { markdownPlainTextLength } from "@/features/posts/utils/markdownEditor";
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
    hashtags: Array.isArray(article?.hashtags) ? article.hashtags : [],
    sections: sections.map((section) => ({
      id: section?.id ?? "",
      title: section?.title ?? "",
      content: section?.content ?? "",
    })),
  });
}

export function isArticleReadyForQualityCheck(article) {
  const sections = Array.isArray(article?.content) ? article.content : [];
  return [
    article?.title,
    article?.summary,
    article?.conclusion,
    ...(article?.hashtags ?? []),
    ...sections.flatMap((section) => [section?.title, section?.content]),
  ].some(hasText);
}

export function validateArticle(article, imageFile, { requireQuality = true } = {}) {
  if (!hasText(article.title)) {
    toast.error("Vui lòng nhập tiêu đề bài viết.");
    return false;
  }
  if (article.title.trim().length > 100) {
    toast.error("Tiêu đề tối đa 100 ký tự.");
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
  if (article.summary.trim().length > 500) {
    toast.error("Tóm tắt tối đa 500 ký tự.");
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
  if (article.hashtags.length > MAX_TAGS) {
    toast.error("Tối đa 10 hashtag.");
    return false;
  }
  if (
    article.hashtags.some(
      (tag) => !hasText(tag) || tag.trim().length > MAX_TAG_LENGTH,
    )
  ) {
    toast.error("Mỗi hashtag tối đa 50 ký tự.");
    return false;
  }

  const sections = Array.isArray(article.content) ? article.content : [];
  if (sections.length === 0) {
    toast.error("Bài viết phải có ít nhất một mục.");
    return false;
  }
  if (sections.length > MAX_SECTIONS) {
    toast.error("Tối đa 10 mục nội dung.");
    return false;
  }

  const ids = new Set();
  for (const section of sections) {
    if (!section.id || ids.has(section.id)) {
      toast.error("Mỗi mục nội dung phải có mã duy nhất.");
      return false;
    }
    ids.add(section.id);

    if (!hasText(section.title)) {
      toast.error("Tiêu đề mục nội dung không được để trống.");
      return false;
    }
    if (section.title.trim().length > 100) {
      toast.error("Tiêu đề mục nội dung tối đa 100 ký tự.");
      return false;
    }
    if (!hasText(section.content)) {
      toast.error("Nội dung chi tiết không được để trống.");
      return false;
    }
    if (markdownPlainTextLength(section.content) > 1000) {
      toast.error("Nội dung chi tiết tối đa 1000 ký tự.");
      return false;
    }
  }

  if (!hasText(article.conclusion)) {
    toast.error("Vui lòng nhập lời kết.");
    return false;
  }

  if (requireQuality && article.qualityChecked !== true) {
    toast.error("Vui lòng kiểm tra từ cấm trước khi gửi bài viết.");
    return false;
  }

  return true;
}
