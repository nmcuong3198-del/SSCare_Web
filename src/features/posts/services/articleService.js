import axiosClient from "@/shared/services/http/axiosClient";

const articleService = {
  //Danh sách bài viết
  getList(page, size) {
    return axiosClient.get("/articles", {
      params: {
        page,
        size,
      },
    });
  },

  //Chi tiết bài viết
  getDetail(code) {
    return axiosClient.get(`/articles/${code}`);
  },

  //Tạo mới
  create(formData) {
    return axiosClient.post(
      "/articles",

      formData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  //Cập nhật
  update(id, data) {
    return axiosClient.put(`/articles/${id}`, data);
  },

  //Cập nhật trạng thái
  updateStatus(data) {
    return axiosClient.put(`/articles/update-status`, data);
  },

  //Xóa
  remove(id) {
    return axiosClient.delete(`/articles/${id}`);
  },
};

export default articleService;
