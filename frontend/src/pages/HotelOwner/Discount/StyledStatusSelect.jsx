import React from "react";
import { Select, Tag } from "antd";

const STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return {
                color: "green",
                background: "#f6ffed",
                borderColor: "#b7eb8f",
            };
        case "inactive":
            return {
                color: "red",
                background: "#fff1f0",
                borderColor: "#ffa39e",
            };
        default:
            return {
                color: "geekblue",
                background: "#f0f5ff",
                borderColor: "#adc6ff",
            };
    }
};

const StyledStatusSelect = ({ status = "", record, handleStatusChange }) => {
    const currentStatus = String(status || "").toUpperCase();
    const statusStyle = getStatusColor(currentStatus);

    const [loading, setLoading] = React.useState(false);

    return (
        <Select
            loading={loading}
            style={{
                width: 108,
                background: statusStyle.background,
            }}
            value={currentStatus || undefined}
            onChange={async (newValue) => {
                try {
                    setLoading(true);
                    await handleStatusChange(record, newValue);
                    setLoading(false);
                } catch (error) {
                    setLoading(false);
                }
            }}
            popupMatchSelectWidth={false}
            className={`status-select-${currentStatus.toLowerCase()}`}
        >
            {STATUS_OPTIONS.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                    <Tag
                        color={getStatusColor(option.value).color}
                        style={{
                            border: "none",
                            padding: "4px 8px",
                            margin: 0,
                        }}
                    >
                        {option.value.toUpperCase()}
                    </Tag>
                </Select.Option>
            ))}
        </Select>
    );
};

// CSS để áp dụng style cho Select
const styles = `

.status-select-active .ant-select-selector {
  background-color: #f6ffed !important;
  border-color: #b7eb8f !important;
}

.status-select-inactive .ant-select-selector {
  background-color: #fff1f0 !important;
  border-color: #ffa39e !important;
}

.status-select- .ant-select-selector {
  background-color: white !important;
  border-color: #d9d9d9 !important;
}

.ant-select-dropdown .ant-select-item-option-content {
  padding: 0 !important;
}

.ant-select-dropdown .ant-tag {
  display: block !important;
  text-align: center !important;
}
`;

// Thêm styles vào head của document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default StyledStatusSelect;
