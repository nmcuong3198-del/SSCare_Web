import axiosClient from "@/shared/services/http/axiosClient";

const notificationsService = {
    //Tạo mới
  create(formData) {
    return axiosClient.post(`/notifications/create`, formData);
  },
  update(formData){
    return axiosClient.post(`/notifications/update`, formData);
  },
  getByCode(code){
    return axiosClient.get(`/notifications/${code}`);
  },
  getList(page, size) {
    return axiosClient.get("/notifications/list", {
      params: {
        page,
        size,
      },
    });
  },
  pushNotification(payload){
    // Firebase delivery is an outbound network call from Backend -> Google and
    // may take longer than ordinary CRUD APIs. Keep this timeout isolated to
    // push delivery instead of increasing the timeout for the whole website.
    return axiosClient.post(`/firebase/sendNotification`, payload, { timeout: 45000 });
  },
  getRecipients(page = 0, size = 100){
    return axiosClient.get(`/notifications/recipients`, {
      params: { page, size },
    });
  }
}

export default notificationsService;