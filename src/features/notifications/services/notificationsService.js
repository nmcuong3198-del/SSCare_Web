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
  pushNotification(formData){
    return axiosClient.post(`/firebase/sendNotification`, formData);
  }
}

export default notificationsService;