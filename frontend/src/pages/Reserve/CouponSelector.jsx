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
import { applyDiscount } from "../../services/apiService";

const { Text } = Typography;

const CouponSelector = ({ onApplyCoupon, totalAmount, discountList = [], setSummaryInfo }) => {
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
            // const mockData = [
            //     {
            //         id: 1,
            //         code: "WELCOME10",
            //         discount: 10,
            //         type: "percentage",
            //         minAmount: 100000,
            //         description: "10% off for orders from $100,000",
            //         expiryDate: "2025-03-31",
            //         category: "Welcome",
            //     },
            //     {
            //         id: 2,
            //         code: "FIXED50K",
            //         discount: 50000,
            //         type: "fixed",
            //         minAmount: 200000,
            //         description: "$50,000 off for orders from $200,000",
            //         expiryDate: "2025-03-31",
            //         category: "Monthly Promotion",
            //     },
            // ];
            setAvailableCoupons(discountList.length > 0 ? discountList : []);
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setIsLoadingCoupons(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            setTempSelectedCoupon(null);
            setCouponCode("");
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
                coupon?.category?.toLowerCase()?.includes(searchValue)
        );
    };

    const filteredCoupons = getFilteredCoupons();

    const paginatedCoupons = filteredCoupons.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const validateCoupon = (coupon) => {
        if (totalAmount < coupon.minAmount) {
            return `Minimum order of đ${coupon.minAmount.toLocaleString()} required to apply this code`;
        }
        return null;
    };

    const calculateDiscount = (coupon) => {
        if (coupon.type === "percentage") {
            return (totalAmount * coupon.discount) / 100;
        }
        return coupon.discount;
    };

    const handleApplyCoupon = async () => {
        setIsApplyingCoupon(true);
        setError("");

        try {
            const coupon =
                tempSelectedCoupon ||
                availableCoupons.find((c) => c.code === couponCode.toUpperCase());

            if (!coupon) {
                setError("Invalid discount code");
                return;
            }

            const validationError = validateCoupon(coupon);
            if (validationError) {
                setError(validationError);
                return;
            }

            const discountAmount = calculateDiscount(coupon);

            const res = await applyDiscount(coupon.id, totalAmount);

            if (res.discountAmount && totalAmount) {
                setSummaryInfo({
                    discountAmount: res.discountAmount,
                    totalPrice: res.totalPrice,
                });

                setSelectedCoupon(coupon);
                setError("");
                setCouponCode("");
                setTempSelectedCoupon(null);
                setIsModalOpen(false);

                onApplyCoupon(coupon, discountAmount);
            } else {
                setError("Error applying discount code");
            }
        } catch (error) {
            setError("Error applying discount code");
            console.error("Error applying coupon:", error);
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = async () => {
        setIsRemovingCoupon(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSummaryInfo({
                discountAmount: 0,
                totalPrice: totalAmount,
            });
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
        setSummaryInfo({
            discountAmount: 0,
            totalPrice: totalAmount,
        });
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
                    <span>Select Discount Code</span>
                </Space>
            }
            open={isModalOpen}
            onCancel={() => {
                handleCloseModal();
                setTempSelectedCoupon(null);
                setCouponCode("");
            }}
            footer={null}
            width={600}
        >
            <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                <Input
                    ref={searchInputRef}
                    placeholder="Search discount codes..."
                    onPressEnter={handleSearch}
                    style={{ width: "calc(100% - 90px)" }}
                />
                <Button icon={<CloseOutlined />} onClick={handleClearSearch} />
                <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                    Search
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
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedCoupon(null);
                                        setTempSelectedCoupon(coupon);
                                        setError("");
                                        handleCloseModal();
                                    }}
                                >
                                    <List.Item.Meta
                                        title={
                                            <Space>
                                                <Text strong>{coupon.code}</Text>
                                                <Tag color="green">
                                                    {coupon.type === "percentage"
                                                        ? `${coupon.discount}% Off`
                                                        : `$${coupon.discount.toLocaleString()} Off`}
                                                </Tag>
                                                {coupon.category && (
                                                    <Tag color="purple">{coupon.category}</Tag>
                                                )}
                                            </Space>
                                        }
                                        description={
                                            <>
                                                <Text>{coupon.description}</Text>
                                                <br />
                                                <Text type="secondary">
                                                    Minimum order: đ
                                                    {coupon.minAmount.toLocaleString()}
                                                </Text>
                                            </>
                                        }
                                    />
                                    <Tag color="blue">
                                        Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
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
                    <Empty description="No discount codes found" />
                )}
            </Spin>
        </Modal>
    );

    return (
        <Card title="Discount Code" style={{ width: "100%", maxWidth: 500 }}>
            {!selectedCoupon ? (
                <>
                    <Space.Compact style={{ width: "100%" }}>
                        <Input
                            placeholder="Enter discount code"
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
                            Apply
                        </Button>
                    </Space.Compact>

                    <Space style={{ marginTop: 8 }}>
                        <Button
                            type="link"
                            icon={<GiftOutlined />}
                            onClick={() => setIsModalOpen(true)}
                            disabled={isApplyingCoupon}
                        >
                            Select Discount Code
                        </Button>
                        {(couponCode || tempSelectedCoupon) && (
                            <Button
                                type="link"
                                danger
                                onClick={handleClearTempCoupon}
                                disabled={isApplyingCoupon}
                            >
                                Remove
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
                                    Remove
                                </Button>
                            }
                        >
                            <Space direction="vertical" size="small">
                                <Space>
                                    <Text strong>{tempSelectedCoupon.code}</Text>
                                    <Tag color="green">
                                        {tempSelectedCoupon.type === "percentage"
                                            ? `${tempSelectedCoupon.discount}% Off`
                                            : `$${tempSelectedCoupon.discount.toLocaleString()} Off`}
                                    </Tag>
                                    {tempSelectedCoupon.category && (
                                        <Tag color="purple">{tempSelectedCoupon.category}</Tag>
                                    )}
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
                                    onClick={() => {
                                        setIsModalOpen(true);
                                    }}
                                    disabled={isRemovingCoupon}
                                >
                                    Change
                                </Button>
                                <Popconfirm
                                    title="Remove Discount Code"
                                    description="Are you sure you want to remove this discount code?"
                                    onConfirm={handleRemoveCoupon}
                                    okText="Remove"
                                    cancelText="Cancel"
                                    disabled={isRemovingCoupon}
                                >
                                    <Button
                                        type="text"
                                        danger
                                        icon={<CloseOutlined />}
                                        loading={isRemovingCoupon}
                                    >
                                        Remove
                                    </Button>
                                </Popconfirm>
                            </Space>
                        }
                    >
                        <Space direction="vertical" size="small">
                            <Space>
                                <Text strong>{selectedCoupon.code}</Text>
                                <Tag color="green">
                                    {selectedCoupon.type === "percentage"
                                        ? `${selectedCoupon.discount}% Off`
                                        : `$${selectedCoupon.discount.toLocaleString()} Off`}
                                </Tag>
                                {selectedCoupon.category && (
                                    <Tag color="purple">{selectedCoupon.category}</Tag>
                                )}
                            </Space>
                            <Text type="secondary">{selectedCoupon.description}</Text>
                        </Space>
                    </Card>
                    <Alert
                        message="Discount code applied successfully!"
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
