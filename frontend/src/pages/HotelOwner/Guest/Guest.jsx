import "./Guest.scss";
import { useEffect, useState } from "react";

import { Space, Table, Tag, Button, Popconfirm, Input, Select, Modal } from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import { useNavigate } from "react-router-dom";
import StyledStatusSelect from "./StyledStatusSelect";
import { useSelector } from "react-redux";
import { updateStatus } from "~/services/apiService";
import { formatDate } from "~/utils/datetime";

import axios from "~/utils/axiosCustomize";

const Guest = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    const userInfo = useSelector((state) => state.account.userInfo);

    const handleStatusChange = async (recordKey, newStatus) => {
        try {
            if (!recordKey) {
                console.error("Invalid record key:", recordKey);
                return;
            }

            setLoading(true);

            const res = await updateStatus(recordKey, newStatus);

            if (res && +res.status_code === 200) {
                fetchBookings();
            }
        } catch {
            console.log("Error when updating status");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: "Reservation ID",
            dataIndex: "reservationID",
            key: "reservationID",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Guest Name",
            dataIndex: "guestName",
            key: "guestName",
            fixed: "left",
            // ...getColumnSearchProps("guestName"),
        },
        {
            title: "Check-in Date",
            key: "checkInDate",
            dataIndex: "checkInDate",
        },
        {
            title: "Check-out Date",
            key: "checkOutDate",
            dataIndex: "checkOutDate",
        },
        {
            title: "Total Price",
            key: "totalPrice",
            dataIndex: "totalPrice",
            render: (text) => {
                return `${Number(text).toLocaleString()}`;
            },
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            // filters: STATUS_OPTIONS,
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
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        onClick={() => {
                            // Handle view action
                            navigate(
                                `/hotel-owner/order-detail/${userId}/${record.reservationID}`,
                                {
                                    state: { reservationID: record.reservationID, userId: userId },
                                }
                            );
                        }}
                    >
                        View
                    </Button>
                </Space>
            ),
        },
    ];

    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            position: ["bottomCenter"],
        },
    });

    const userId = localStorage.getItem("user_id");
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/booking/guest?userId=${userId}&page=${tableParams?.pagination?.current}&per_page=${tableParams?.pagination?.pageSize}`
            );
            const result = response;
            if (result.status_code === 200) {
                const formattedData = result.data.bookings.map((booking) => ({
                    key: booking.id,
                    reservationID: booking.id,
                    guestName: booking.name,
                    checkInDate: formatDate(booking.checkInDate),
                    checkOutDate: formatDate(booking.checkOutDate),
                    totalPrice: booking.totalPrice,
                    status: [booking.status],
                }));

                setBookings(formattedData);

                setTableParams({
                    pagination: {
                        ...tableParams.pagination,
                        current: result.data.page,
                        pageSize: result.data.per_page,
                        total: result.data.total,
                    },
                });
            } else {
                console.error("Failed to fetch bookings:", result.message);
            }
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [tableParams.pagination.current, tableParams.pagination.pageSize]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
        });
    };

    return (
        <>
            {userInfo && userInfo.hotel === undefined ? (
                <Modal
                    open={true}
                    title="Notice"
                    content="You have not registered any hotel yet. Please register your hotel first."
                    closeable={false}
                    onCancel={() => navigate("/hotel-owner/login")}
                    maskClosable={false}
                    onOk={() => navigate("/hotel-owner/register-hotel")}
                >
                    <p>You have not registered any hotel yet. Please register your hotel first.</p>
                </Modal>
            ) : null}
            <div className="guest">
                <h1>Guest</h1>
                <div className="d-flex my-3">
                    {/* <button className="btn btn-primary ms-auto fs-4" onClick={() => handleAddRoom()}>
                        Add Room
                    </button> */}
                </div>
                <Table
                    columns={columns}
                    dataSource={bookings}
                    scroll={{ x: "max-content" }}
                    tableLayout="auto"
                    loading={loading}
                    pagination={tableParams.pagination}
                    onChange={handleTableChange}
                />
            </div>
        </>
    );
};

export default Guest;
