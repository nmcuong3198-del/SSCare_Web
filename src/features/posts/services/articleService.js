import axiosClient from "@/shared/services/http/axiosClient";

const articleService = {
  getCategories: () => axiosClient.get("/articles/categories"),
  getStats: () => axiosClient.get("/articles/stats"),
  getAuthors: () => axiosClient.get("/articles/authors"),
  checkForbiddenWords(payload) { return axiosClient.post("/articles/forbidden-words/check", payload); },
  getList(page, size, filters = {}) {
    return axiosClient.get("/articles", {
      params: {
        page,
        size,
        ...(filters.title ? { title: filters.title } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.author ? { author: filters.author } : {}),
      },
    });
  },
  getDetail(code) { return axiosClient.get(`/articles/${code}`); },
  // Do not set multipart Content-Type manually: the browser must append the boundary.
  create(formData) { return axiosClient.post("/articles", formData); },
  update(code, formData) { return axiosClient.put(`/articles/${code}`, formData); },
  updateStatus(data) { return axiosClient.put("/articles/update-status", data); },
  revoke(code) { return axiosClient.delete(`/articles/${code}/revoke`); },
  remove(code, { reason } = {}) { return axiosClient.delete(`/articles/${code}`, { params: { reason } }); },
  restore(code) { return axiosClient.put(`/articles/${code}/restore`); },
  recycleBin() { return axiosClient.get("/articles/recycle-bin"); },
};

export default articleService;
