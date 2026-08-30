export function createArticleFormData(article, imageFile, { status } = {}) {
  const articlePayload = {
    title: article.title?.trim() ?? "",
    summary: article.summary?.trim() ?? "",
    cateName: article.cateName?.trim() ?? "",
    hashtags: (article.hashtags ?? []).map((tag) => String(tag).trim()).filter(Boolean),
    content: (article.content ?? []).map((section, index) => ({
      id: section.id || `sec-${index}`,
      title: section.title?.trim() ?? "",
      content: section.content?.trim() ?? "",
    })),
    conclusion: article.conclusion?.trim() ?? "",
    qualityChecked: article.qualityChecked === true,
    status: status ?? article.status ?? "draft",
  };

  const formData = new FormData();
  if (imageFile && typeof imageFile !== "string") formData.append("image", imageFile);
  formData.append("article", new Blob([JSON.stringify(articlePayload)], { type: "application/json" }));
  return formData;
}
