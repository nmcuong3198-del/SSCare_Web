export const createEmptySection = () => ({
  id: crypto.randomUUID(),
  title: "",
  content: "",
});

export function createEmptyArticle() {
  return {
    title: "",
    summary: "",
    subtabId: "",
    subtabName: "",
    cateName: "",
    hashtags: [],
    status: "",
    content: [createEmptySection()],
    conclusion: "",
    qualityChecked: false,
    anonymousAuthor: false,
    authorName: "",
    createdBy: "",
  };
}
