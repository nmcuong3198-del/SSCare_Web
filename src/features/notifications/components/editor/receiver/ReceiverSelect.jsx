import { useMemo } from "react";
import Select, { components } from "react-select";
import "./ReceiverSelect.css";

const MEMBER_DATA = [
  { id: "huongnguyen123", name: "huongnguyen123" },
  { id: "M002", name: "Trần Thị B" },
  { id: "M003", name: "Lê Văn C" },
  { id: "M004", name: "Phạm Minh D" },
  { id: "M005", name: "Nguyễn Văn A" },
  { id: "M006", name: "Trần Thị B" },
  { id: "M007", name: "Lê Văn C" },
  { id: "M008", name: "Phạm Minh D" },
  { id: "M009", name: "Nguyễn Văn A" },
  { id: "M010", name: "Trần Thị B" },
  { id: "M011", name: "Lê Văn C" },
  { id: "M012", name: "Phạm Minh D" },
];

const ALL_OPTION = { value: "ALL", label: "Tất cả" };
const MEMBER_OPTIONS = MEMBER_DATA.map((member) => ({
  value: member.id,
  label: member.name,
}));
const OPTIONS = [ALL_OPTION, ...MEMBER_OPTIONS];

const InputOption = (props) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        readOnly
        style={{ marginRight: 8, cursor: "pointer" }}
      />
      <label
        style={{
          cursor: "pointer",
          fontWeight: "normal",
          margin: 0,
          display: "inline",
        }}
      >
        {props.label}
      </label>
    </components.Option>
  );
};

export default function ReceiverSelect({ notification, setNotification }) {
  const selectedValues = useMemo(() => {
    const currentReceivers = notification.recipients || ["ALL"];
    return OPTIONS.filter((opt) => currentReceivers.includes(opt.value));
  }, [notification.recipients]);

  const handleChange = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) {
      setNotification((prev) => ({ ...prev, recipients: ["ALL"] }));
      return;
    }

    const lastSelected = selectedOptions[selectedOptions.length - 1];

    if (lastSelected.value === "ALL") {
      setNotification((prev) => ({ ...prev, recipients: ["ALL"] }));
      return;
    }

    let finalValues = selectedOptions
      .filter((opt) => opt.value !== "ALL")
      .map((opt) => opt.value);

    setNotification((prev) => ({ ...prev, recipients: finalValues }));
  };

  return (
    <div className="select-group">
      <label>Người nhận</label>

      <Select
        isMulti
        isSearchable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        options={OPTIONS}
        value={selectedValues}
        onChange={handleChange}
        components={{ Option: InputOption }}
        placeholder="Tìm kiếm hoặc chọn thành viên..."
        classNamePrefix="react-select"
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menuList: (base) => ({
            ...base,
            maxHeight: "245px",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#cdd5e0",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#b8c2d1",
            },
          }),
        }}
      />
    </div>
  );
}