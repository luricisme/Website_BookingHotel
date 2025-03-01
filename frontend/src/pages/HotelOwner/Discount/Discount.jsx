import React, { useCallback, useEffect, useState } from "react";
import { Modal, Space, Table, Button, Popconfirm, message } from "antd";
import { QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import AddDiscount from "./AddDiscount";
import { useNavigate } from "react-router-dom";
import EditDiscount from "./EditDiscount";
import { deleteDiscount, getDiscounts, updateDiscountStatus } from "../../../services/apiService";
import { Capitalize, Lowercase } from "../../../utils/stringUtils";
import { formatDate } from "../../../utils/datetime";
import StyledStatusSelect from "./StyledStatusSelect";

const Discount = () => {
    const userInfo = useSelector((state) => state.account.userInfo);

    const navigate = useNavigate();

    const [discounts, setDiscounts] = useState([]);

    const fetchDiscounts = useCallback(async () => {
        try {
            const res = await getDiscounts(userInfo.hotel.id);
            if (res && +res.statusCode === 200) {
                const discounts = res.data.map((discount) => ({
                    ...discount,
                    key: discount.id,
                }));

                setDiscounts(discounts);
            }
        } catch (error) {
            console.error("Error fetching discounts:", error);
        }
    }, [userInfo.hotel]);

    useEffect(() => {
        if (userInfo.hotel) {
            fetchDiscounts();
        }
    }, [fetchDiscounts, userInfo.hotel]);

    const handleStatusChange = async (record, status) => {
        console.log("Update status", record, status);
        try {
            const res = await updateDiscountStatus(record.id || record, {
                status: Capitalize(status),
            });
            if (res && +res.statusCode === 200) {
                message.success("Discount status updated successfully");
                fetchDiscounts();
            } else {
                message.error("Failed to update discount status");
            }
        } catch (error) {
            message.error("Failed to update discount status");
        }
    };

    const columns = [
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
            width: 120,
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            width: 100,
            render: (value, record) => {
                if (Lowercase(record.type) === "percentage") {
                    return `${value}%`;
                } else {
                    return `${value.toLocaleString()}`;
                }
            },
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 100,
            render: (text) => Capitalize(text),
        },
        {
            title: "Num",
            dataIndex: "num",
            key: "num",
            width: 80,
        },
        {
            title: "Min Amount",
            dataIndex: "minAmount",
            key: "minAmount",
            width: 120,
            render: (text) => Number(text).toLocaleString() || "N/A",
        },
        // {
        //     title: "Start Date",
        //     dataIndex: "start_at",
        //     key: "start_at",
        //     width: 120,
        //     render: (text) => formatDate(new Date(text), "yyyy-mm-dd") || "N/A",
        // },
        {
            // title: "End Date",
            title: "Expiry Date",
            dataIndex: "end_at",
            key: "end_at",
            width: 120,
            render: (text) => formatDate(new Date(text), "yyyy-mm-dd") || "N/A",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (status, record) => (
                <>
                    <StyledStatusSelect
                        status={status}
                        record={record}
                        handleStatusChange={handleStatusChange}
                    />
                </>
            ),
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            width: 150, // Increased width for better spacing
            render: (text, record) => (
                <Space size="small">
                    <EditDiscount
                        record={{ ...record, type: Capitalize(record.type) }}
                        onSuccess={() => {
                            fetchDiscounts();
                        }}
                    />
                    <Popconfirm
                        title="Delete Discount"
                        description="Are you sure you want to delete this discount?"
                        icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                        okText="Yes"
                        cancelText="No"
                        onConfirm={async () => {
                            console.log("Delete record", record);
                            try {
                                const res = await deleteDiscount(record.id);
                                if (res && +res.statusCode === 200) {
                                    message.success("Discount deleted successfully");
                                    fetchDiscounts();
                                } else {
                                    message.error("Failed to delete discount");
                                }
                            } catch (error) {
                                message.error("Failed to delete discount");
                            }
                        }}
                    >
                        <Button
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleDiscountAdded = () => {
        // Refresh discount list
        fetchDiscounts();
    };

    return (
        <>
            {userInfo && userInfo.hotel === undefined ? (
                <Modal
                    open={true}
                    title="Notice"
                    closeable={false}
                    onCancel={() => navigate("/hotel-owner/login")}
                    maskClosable={false}
                    onOk={() => navigate("/hotel-owner/register-hotel")}
                >
                    <p>You have not registered any hotel yet. Please register your hotel first.</p>
                </Modal>
            ) : null}
            <div className="discount-page container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="mb-0">Discount</h1>
                    <AddDiscount onSuccess={handleDiscountAdded} />
                </div>

                <div className="table-responsive">
                    <div style={{ minWidth: "800px" }}>
                        <Table
                            columns={columns}
                            dataSource={discounts}
                            scroll={{ x: 800 }}
                            tableLayout="fixed"
                            loading={false}
                            pagination={false}
                            className="table"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Discount;
