import axiosClient from "@/shared/services/http/axiosClient";

const accountAdminService = {
  getAccounts({ keyword = "", page = 0, size = 10 } = {}) {
    return axiosClient.get("/admin/accounts", {
      params: { keyword, page, size },
    });
  },

  updatePermissions(accountId, permissions) {
    return axiosClient.put(`/admin/accounts/${accountId}/permissions`, permissions);
  },
};

export default accountAdminService;
