import React, { useState, useEffect, useRef } from "react";
import {
    Input,
    Button,
    Card,
    Alert,
    List,
    Typography,
    Tag,
    Space,
    Modal,
    Pagination,
    Empty,
    Popconfirm,
    Spin,
} from "antd";
import { TagOutlined, CloseOutlined, SearchOutlined, GiftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const CouponSelector = ({ onApplyCoupon, totalAmount }) => {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState("");
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [isRemovingCoupon, setIsRemovingCoupon] = useState(false);
    const [tempSelectedCoupon, setTempSelectedCoupon] = useState(null);
    const searchInputRef = useRef(null);
    const [, setForceUpdate] = useState(0);
    const pageSize = 5;

    const [availableCoupons, setAvailableCoupons] = useState([]);

    const fetchCoupons = async () => {
        setIsLoadingCoupons(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const mockData = [
                {
                    code: "WELCOME10",
                    discount: 10,
                    type: "percent",
                    minAmount: 100000,
                    description: "Giảm 10% cho đơn hàng từ 100,000đ",
                    expiryDate: "2025-03-31",
                    category: "Chào mừng",
                },
                {
                    code: "FIXED50K",
                    discount: 50000,
                    type: "fixed",
                    minAmount: 200000,
                    description: "Giảm 50,000đ cho đơn hàng từ 200,000đ",
                    expiryDate: "2025-03-31",
                    category: "Khuyến mãi tháng",
                },
            ];
            setAvailableCoupons(mockData);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setIsLoadingCoupons(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchCoupons();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (tempSelectedCoupon) {
            setCouponCode(tempSelectedCoupon.code);
        }
    }, [tempSelectedCoupon]);

    const handleSearch = () => {
        setCurrentPage(1);
        setForceUpdate((prev) => prev + 1);
    };

    const handleClearSearch = () => {
        if (searchInputRef.current) {
            searchInputRef.current.input.value = "";
            setCurrentPage(1);
            setForceUpdate((prev) => prev + 1);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        handleClearSearch();
    };

    const getFilteredCoupons = () => {
        const searchValue = searchInputRef.current?.input?.value.toLowerCase() || "";
        return availableCoupons.filter(
            (coupon) =>
                coupon.code.toLowerCase().includes(searchValue) ||
                coupon.description.toLowerCase().includes(searchValue) ||
                coupon.category.toLowerCase().includes(searchValue)
        );
    };

    const filteredCoupons = getFilteredCoupons();

    const paginatedCoupons = filteredCoupons.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const validateCoupon = (coupon) => {
        if (totalAmount < coupon.minAmount) {
            return `Đơn hàng tối thiểu ${coupon.minAmount.toLocaleString()}đ để áp dụng mã`;
        }
        return null;
    };

    const calculateDiscount = (coupon) => {
        if (coupon.type === "percent") {
            return (totalAmount * coupon.discount) / 100;
        }
        return coupon.discount;
    };

    const handleApplyCoupon = async () => {
        setIsApplyingCoupon(true);
        setError("");

        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            const coupon =
                tempSelectedCoupon ||
                availableCoupons.find((c) => c.code === couponCode.toUpperCase());

            if (!coupon) {
                setError("Mã giảm giá không hợp lệ");
                return;
            }

            const validationError = validateCoupon(coupon);
            if (validationError) {
                setError(validationError);
                return;
            }

            setSelectedCoupon(coupon);
            const discountAmount = calculateDiscount(coupon);
            onApplyCoupon(coupon, discountAmount);
        } catch (error) {
            setError("Có lỗi xảy ra khi áp dụng mã giảm giá");
            console.error("Error applying coupon:", error);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = async () => {
        setIsRemovingCoupon(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSelectedCoupon(null);
            setTempSelectedCoupon(null);
            setCouponCode("");
            setError("");
            onApplyCoupon(null, 0);
        } catch (error) {
            console.error("Error removing coupon:", error);
        } finally {
            setIsRemovingCoupon(false);
        }
    };

    const handleClearTempCoupon = () => {
        setTempSelectedCoupon(null);
        setCouponCode("");
    };

    useEffect(() => {
        setCurrentPage(1);
    }, []);

    // const handleSelectCoupon = (coupon) => {
    //     setTempSelectedCoupon(coupon);
    //     setIsModalOpen(false);
    // };

    const CouponModal = () => (
        <Modal
            title={
                <Space>
                    <GiftOutlined />
                    <span>Chọn mã giảm giá</span>
                </Space>
            }
            open={isModalOpen}
            onCancel={handleCloseModal}
            footer={null}
            width={600}
        >
            <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                <Input
                    ref={searchInputRef}
                    placeholder="Tìm kiếm mã giảm giá..."
                    onPressEnter={handleSearch}
                    style={{ width: "calc(100% - 90px)" }}
                />
                <Button icon={<CloseOutlined />} onClick={handleClearSearch} />
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    Tìm
                </Button>
            </Space.Compact>

            <Spin spinning={isLoadingCoupons}>
                {paginatedCoupons.length > 0 ? (
                    <>
                        <List
                            itemLayout="horizontal"
                            dataSource={paginatedCoupons}
                            renderItem={(coupon) => (
                                <List.Item
                                    className={`cursor-pointer hover:bg-gray-50 ${
                                        tempSelectedCoupon?.code === coupon.code ? "bg-blue-50" : ""
                                    }`}
                                    onClick={() => {
                                        setTempSelectedCoupon(coupon);
                                        handleCloseModal();
                                    }}
                                >
                                    <List.Item.Meta
                                        title={
                                            <Space>
                                                <Text strong>{coupon.code}</Text>
                                                <Tag color="green">
                                                    {coupon.type === "percent"
                                                        ? `Giảm ${coupon.discount}%`
                                                        : `Giảm ${coupon.discount.toLocaleString()}đ`}
                                                </Tag>
                                                <Tag color="purple">{coupon.category}</Tag>
                                            </Space>
                                        }
                                        description={
                                            <>
                                                <Text>{coupon.description}</Text>
                                                <br />
                                                <Text type="secondary">
                                                    Đơn tối thiểu:{" "}
                                                    {coupon.minAmount.toLocaleString()}đ
                                                </Text>
                                            </>
                                        }
                                    />
                                    <Tag color="blue">
                                        HSD: {new Date(coupon.expiryDate).toLocaleDateString()}
                                    </Tag>
                                </List.Item>
                            )}
                        />
                        <div style={{ textAlign: "right", marginTop: 16 }}>
                            <Pagination
                                current={currentPage}
                                total={filteredCoupons.length}
                                pageSize={pageSize}
                                onChange={setCurrentPage}
                                size="small"
                            />
                        </div>
                    </>
                ) : (
                    <Empty description="Không tìm thấy mã giảm giá" />
                )}
            </Spin>
        </Modal>
    );

    return (
        <Card title="Mã giảm giá" style={{ width: "100%", maxWidth: 500 }}>
            {!selectedCoupon ? (
                <>
                    <Space.Compact style={{ width: "100%" }}>
                        <Input
                            placeholder="Nhập mã giảm giá"
                            value={couponCode}
                            onChange={(e) => {
                                setCouponCode(e.target.value);
                                setTempSelectedCoupon(null);
                            }}
                            prefix={<TagOutlined />}
                            style={{ textTransform: "uppercase" }}
                            disabled={isApplyingCoupon}
                        />
                        <Button
                            type="primary"
                            onClick={handleApplyCoupon}
                            loading={isApplyingCoupon}
                        >
                            Áp dụng
                        </Button>
                    </Space.Compact>

                    <Space style={{ marginTop: 8 }}>
                        <Button
                            type="link"
                            icon={<GiftOutlined />}
                            onClick={() => setIsModalOpen(true)}
                            disabled={isApplyingCoupon}
                        >
                            Chọn mã giảm giá
                        </Button>
                        {(couponCode || tempSelectedCoupon) && (
                            <Button
                                type="link"
                                danger
                                onClick={handleClearTempCoupon}
                                disabled={isApplyingCoupon}
                            >
                                Xóa
                            </Button>
                        )}
                    </Space>

                    {error && (
                        <Alert message={error} type="error" showIcon style={{ marginTop: 16 }} />
                    )}

                    {tempSelectedCoupon && (
                        <Card
                            size="small"
                            style={{ marginTop: 16 }}
                            extra={
                                <Button
                                    type="text"
                                    danger
                                    icon={<CloseOutlined />}
                                    onClick={handleClearTempCoupon}
                                    disabled={isApplyingCoupon}
                                >
                                    Xóa
                                </Button>
                            }
                        >
                            <Space direction="vertical" size="small">
                                <Space>
                                    <Text strong>{tempSelectedCoupon.code}</Text>
                                    <Tag color="green">
                                        {tempSelectedCoupon.type === "percent"
                                            ? `Giảm ${tempSelectedCoupon.discount}%`
                                            : `Giảm ${tempSelectedCoupon.discount.toLocaleString()}đ`}
                                    </Tag>
                                    <Tag color="purple">{tempSelectedCoupon.category}</Tag>
                                </Space>
                                <Text type="secondary">{tempSelectedCoupon.description}</Text>
                            </Space>
                        </Card>
                    )}
                </>
            ) : (
                <>
                    <Card
                        size="small"
                        extra={
                            <Space>
                                <Button
                                    type="text"
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={isRemovingCoupon}
                                >
                                    Thay đổi
                                </Button>
                                <Popconfirm
                                    title="Xóa mã giảm giá"
                                    description="Bạn có chắc chắn muốn xóa mã giảm giá này?"
                                    onConfirm={handleRemoveCoupon}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    disabled={isRemovingCoupon}
                                >
                                    <Button
                                        type="text"
                                        danger
                                        icon={<CloseOutlined />}
                                        loading={isRemovingCoupon}
                                    >
                                        Xóa
                                    </Button>
                                </Popconfirm>
                            </Space>
                        }
                    >
                        <Space direction="vertical" size="small">
                            <Space>
                                <Text strong>{selectedCoupon.code}</Text>
                                <Tag color="green">
                                    {selectedCoupon.type === "percent"
                                        ? `Giảm ${selectedCoupon.discount}%`
                                        : `Giảm ${selectedCoupon.discount.toLocaleString()}đ`}
                                </Tag>
                                <Tag color="purple">{selectedCoupon.category}</Tag>
                            </Space>
                            <Text type="secondary">{selectedCoupon.description}</Text>
                        </Space>
                    </Card>
                    <Alert
                        message="Đã áp dụng mã giảm giá thành công!"
                        type="success"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                </>
            )}

            <CouponModal />
        </Card>
    );
};

export default CouponSelector;
