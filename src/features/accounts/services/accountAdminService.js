import axiosClient from "@/shared/services/http/axiosClient";

/**
 * @typedef {Object} AuthorProfile
 * @property {string|null} credentials
 * @property {boolean} verified
 */

/**
 * @typedef {Object} AdminAccount
 * @property {string} id
 * @property {string} fullName
 * @property {string|null} email
 * @property {string|null} phone
 * @property {string[]} roles
 * @property {boolean} canWriteArticles
 * @property {boolean} canManageNotifications
 * @property {AuthorProfile|null} authorProfile
 */

/**
 * @typedef {Object} AdminAccountPage
 * @property {AdminAccount[]} content
 * @property {number} totalPages
 * @property {number} totalElements
 */

const accountAdminService = {
  /**
   * @param {{fullName?: string, email?: string, phone?: string, role?: string, page?: number, size?: number}} [options]
   * @returns {Promise<AdminAccountPage>}
   */
  getAccounts({
    fullName = "",
    email = "",
    phone = "",
    role = "",
    page = 0,
    size = 10,
  } = {}) {
    return /** @type {Promise<AdminAccountPage>} */ (
      axiosClient.get("/admin/accounts", {
        params: { fullName, email, phone, role, page, size },
      })
    );
  },

  /**
   * @param {string} accountId
   * @param {{canWriteArticles: boolean, canManageNotifications: boolean}} permissions
   * @returns {Promise<AdminAccount>}
   */
  updatePermissions(accountId, permissions) {
    return /** @type {Promise<AdminAccount>} */ (
      axiosClient.put(`/admin/accounts/${accountId}/permissions`, permissions)
    );
  },

  /**
   * @param {string} accountId
   * @param {{credentials: string|null, verified: boolean}} profile
   * @returns {Promise<AdminAccount>}
   */
  updateAuthorProfile(accountId, profile) {
    return /** @type {Promise<AdminAccount>} */ (
      axiosClient.put(`/admin/accounts/${accountId}/author-profile`, profile)
    );
  },
};

export default accountAdminService;
