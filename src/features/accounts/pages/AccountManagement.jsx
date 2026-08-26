import { useEffect, useState } from "react";
import { FaSearch, FaShieldAlt, FaUsers } from "react-icons/fa";

import accountAdminService from "@/features/accounts/services/accountAdminService";
import Pagination from "@/shared/components/ui/Pagination/Pagination";

import "./AccountManagement.css";

const PAGE_SIZE = 10;

const roleLabel = (role) => {
  const labels = {
    ADMIN: "Admin",
    PARENT: "Tài khoản app",
    CONTENT_EDITOR: "Viết bài",
    NOTIFICATION_MANAGER: "Quản lý thông báo",
    SUPPORT: "Hỗ trợ",
    EXPERT: "Chuyên gia",
  };
  return labels[role] || role;
};

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    accountAdminService
      .getAccounts({ keyword: searchKeyword, page, size: PAGE_SIZE })
      .then((response) => {
        if (cancelled) return;
        setAccounts(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Không thể tải danh sách tài khoản.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, searchKeyword]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(0);
    setSearchKeyword(keyword.trim());
  };

  const updatePermission = async (account, field, checked) => {
    setSavingId(account.id);
    setError("");
    setMessage("");

    const payload = {
      canWriteArticles:
        field === "canWriteArticles" ? checked : account.canWriteArticles,
      canManageNotifications:
        field === "canManageNotifications"
          ? checked
          : account.canManageNotifications,
    };

    try {
      const updated = await accountAdminService.updatePermissions(account.id, payload);
      setAccounts((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setMessage(`Đã cập nhật quyền cho ${updated.displayName}.`);
    } catch {
      setError("Cập nhật quyền thất bại. Vui lòng thử lại.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="account-management-page">
      <div className="account-page-header">
        <div>
          <div className="account-title-row">
            <FaUsers />
            <h1>Quản lý tài khoản</h1>
          </div>
          <p>
            Tài khoản đăng ký từ ứng dụng và tài khoản dùng trên web được quản lý
            chung tại đây.
          </p>
        </div>

        <div className="account-total-card">
          <FaShieldAlt />
          <div>
            <strong>{totalElements}</strong>
            <span>Tổng tài khoản</span>
          </div>
        </div>
      </div>

      <form className="account-search" onSubmit={handleSearch}>
        <FaSearch />
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên, email hoặc số điện thoại"
        />
        <button type="submit">Tìm kiếm</button>
      </form>

      {message && <div className="account-alert success">{message}</div>}
      {error && <div className="account-alert error">{error}</div>}

      <div className="account-table-wrap">
        <table className="account-table">
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Liên hệ</th>
              <th>Vai trò hiện tại</th>
              <th>Viết bài</th>
              <th>Quản lý thông báo</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="account-empty">Đang tải dữ liệu...</td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan="6" className="account-empty">Không có tài khoản phù hợp.</td>
              </tr>
            ) : (
              accounts.map((account) => {
                const isAdmin = account.roles?.includes("ADMIN");
                const disabled = savingId === account.id || isAdmin;

                return (
                  <tr key={account.id}>
                    <td>
                      <div className="account-name">{account.displayName}</div>
                      <div className="account-id">{account.id}</div>
                    </td>
                    <td>
                      <div>{account.email || "-"}</div>
                      <div className="account-phone">{account.phone || "-"}</div>
                    </td>
                    <td>
                      <div className="role-list">
                        {(account.roles || []).map((role) => (
                          <span key={role} className="role-badge">{roleLabel(role)}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <label className="permission-switch">
                        <input
                          type="checkbox"
                          checked={isAdmin || account.canWriteArticles}
                          disabled={disabled}
                          onChange={(event) =>
                            updatePermission(account, "canWriteArticles", event.target.checked)
                          }
                        />
                        <span />
                      </label>
                    </td>
                    <td>
                      <label className="permission-switch">
                        <input
                          type="checkbox"
                          checked={isAdmin || account.canManageNotifications}
                          disabled={disabled}
                          onChange={(event) =>
                            updatePermission(
                              account,
                              "canManageNotifications",
                              event.target.checked,
                            )
                          }
                        />
                        <span />
                      </label>
                    </td>
                    <td>
                      <span className={`account-status ${account.status?.toLowerCase()}`}>
                        {account.status === "ACTIVE" ? "Hoạt động" : account.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}
