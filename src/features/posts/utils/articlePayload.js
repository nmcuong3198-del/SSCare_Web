export function createArticleFormData(
  article,
  imageFile,
  { status, createdBy } = {},
) {
  const articlePayload = {
    ...article,
    status: status ?? article.status,
    createdBy: createdBy ?? article.createdBy,
  };
  const formData = new FormData();

  if (imageFile && typeof imageFile !== "string") {
    formData.append("image", imageFile);
  }

  formData.append(
    "article",
    new Blob([JSON.stringify(articlePayload)], {
      type: "application/json",
    }),
  );

  return formData;
}
