import axiosClient from "@/shared/services/http/axiosClient";

const legalService = {
  getCurrentDocuments() {
    return axiosClient.get("/v1/legal-documents/current");
  },
};

export default legalService;
