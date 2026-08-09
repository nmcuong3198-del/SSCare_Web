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
    folderId: 1,
    folderName: "Nuôi dưỡng tinh thần",
    cateId: 1,
    cateName: "Hiểu con",
    hashtags: [],
    status: "",
    content: [createEmptySection()],
    conclusion: "",
    qualityChecked: false,
    createdBy: "",
  };
}
