import { useEffect, useRef, useState } from "react";
import DatePicker from "rsuite/DatePicker";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { Button, Result } from "antd";
import * as Yup from "yup";

import Stepper from "~/components/Stepper/Stepper";

// (Optional) Import component styles. If you are using Less, import the `index.less` file.
import "./Reserve.scss";
import "rsuite/DatePicker/styles/index.css";

import images from "~/assets/image";
import icons from "~/assets/icon";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
    checkTimeBooking,
    deleteCookie,
    getBookingInfo,
    getHotelDetail,
    paymentBooking,
    postBookingInfo,
} from "~/services/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";
import PaymentInfo from "./PaymentInfo";
import HotelInfo from "./HotelInfo";
import { formatDate } from "../../utils/datetime";
import PriceSummary from "./PriceSummary";
import CouponSelector from "./CouponSelector";

const StyledStepLabel = styled.div`
    font-size: 2.8rem;
    text-align: center;
    font-weight: 600;
    color: #1a4870;
`;

const Reserve = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const userInfo = useSelector((state) => state.account.userInfo);

    const {
        hotelId,
        checkInDate,
        checkOutDate,
        roomType2,
        roomType4,
        rooms,
        sumPrice,
        type2Price,
        type4Price,
        userId,
        numberOfRoom2,
        numberOfRoom4,
        tempInfo,
    } = location.state || {};

    const [hotelDetail, setHotelDetail] = useState(null);
    const [bookingInfo, setBookingInfo] = useState(null);
    const [discountList, setDiscountList] = useState([]);
    const [summaryInfo, setSummaryInfo] = useState({
        totalPrice: 0,
        discountAmount: 0,
    });

    useEffect(() => {
        const fetchBookingInfo = async () => {
            try {
                const response = await getBookingInfo();

                if (response) {
                    console.log(">>> booking info", response.data);

                    setBookingInfo(response.data);

                    const discount = response.data.discount.map((item) => {
                        let description = item.description
                            ? item.description
                            : item.discount_type === "percentage"
                            ? `${item.discount_value.toLocaleString()}% off ${
                                  item.minAmount
                                      ? `for orders from ${item.minAmount.toLocaleString()} VND`
                                      : ""
                              }`
                            : `${item.discount_value.toLocaleString()} VND off ${
                                  item.minAmount
                                      ? `for orders from ${item.minAmount.toLocaleString()} VND`
                                      : ""
                              }`;

                        return {
                            ...item,
                            id: item.discount_id,
                            minAmount: item.discount_minAmount || 0,
                            description: description || "",
                            code: item.discount_code || "",
                            discount: item.discount_value || 0,
                            type: item.discount_type || "",
                            expiryDate: item.expiry_date || item.discount_end_at || "",
                        };
                    });

                    setDiscountList(discount);
                }
            } catch (error) {
                toast.error("Failed to get booking information");
            }
        };
        // if (location.state && location.state.isReturn) {
        fetchBookingInfo();
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(location.state)]);

    const searchParams = new URLSearchParams(location.search);

    const partnerCode = searchParams.get("partnerCode");
    const orderId = searchParams.get("orderId");
    const requestId = searchParams.get("requestId");
    const amount = searchParams.get("amount");
    const orderInfo = searchParams.get("orderInfo");
    const transId = searchParams.get("transId");
    const resultCode = searchParams.get("resultCode");
    const message = searchParams.get("message");
    const payType = searchParams.get("payType");
    const responseTime = searchParams.get("responseTime");
    const extraData = searchParams.get("extraData");
    const signature = searchParams.get("signature");

    const [isFinishCashPayment, setIsFinishCashPayment] = useState(false);

    // Xử lý logic sau khi nhận kết quả thanh toán
    useEffect(() => {
        if (resultCode) {
            console.log("Payment result:", {
                partnerCode,
                orderId,
                requestId,
                amount,
                orderInfo,
                transId,
                resultCode,
                message,
                payType,
                responseTime,
                extraData,
                signature,
            });

            if (resultCode === "0") {
                clearInterval(intervalIdRef.current);

                console.log("Payment successful:", {
                    partnerCode,
                    orderId,
                    amount,
                    transId,
                    message,
                });

                const clearCookie = async () => {
                    try {
                        const res = await deleteCookie();
                    } catch (error) {
                        console.error("Failed to delete cookie:", error);
                    }
                };

                clearCookie();

                // Hiển thị thông báo thành công
                toast.success("Payment successful!");
            } else {
                console.error("Payment failed:", {
                    resultCode,
                    message,
                });
                // Hiển thị thông báo lỗi
                toast.error(`Payment failed: ${message}`);
            }
        }

        // clear cookie
        return () => {
            const clearCookie = async () => {
                try {
                    const res = await deleteCookie();
                } catch (error) {
                    console.error("Failed to delete cookie:", error);
                }
            };

            // clearCookie();
        };
    }, [resultCode]);

    const intervalIdRef = useRef(null);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (resultCode === "0" || isFinishCashPayment) {
                return false;
            }
            try {
                const response = await checkTimeBooking(); // Gọi API
                console.log(">>> response", response);

                if (
                    response &&
                    +response.status_code === 403 &&
                    resultCode !== "0" &&
                    !isFinishCashPayment
                ) {
                    toast.error("Booking time is expired");
                    navigate(`/hotel/${hotelId}`, {
                        state: {
                            checkInDate: formatDate(checkInDate, "yyyy-mm-dd"),
                            checkOutDate: formatDate(checkOutDate, "yyyy-mm-dd"),
                            roomType2,
                            roomType4,
                            rooms,
                            sumPrice,
                            type2Price,
                            type4Price,
                            userId,
                            numberOfRoom2,
                            numberOfRoom4,
                        },
                    });

                    return true;
                }
            } catch (error) {
                toast.error("Failed to check availability");

                return false;
            }
        };

        fetchAvailability();

        intervalIdRef.current = setInterval(async () => {
            const res = await fetchAvailability();

            if (res === false) {
                clearInterval(intervalIdRef.current);
            }
        }, 1000 * 30); // Gọi API mỗi 30 giây

        return () => {
            clearInterval(intervalIdRef.current);

            const clearCookie = async () => {
                try {
                    const res = await deleteCookie();
                } catch (error) {
                    console.error("Failed to delete cookie:", error);
                }
            };

            // clearCookie();
        };
    }, []);

    const formik = useFormik({
        initialValues: {
            name: userInfo?.name || "",
            cccd: userInfo?.cccd || "",
            email: userInfo?.email || "",
            phone: userInfo?.phone || "",
            specialRequest: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            cccd: Yup.string().required("CCCD is required"),
            email: Yup.string()
                .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format")
                .required("Email is required"),
            phone: Yup.string().required("Phone number is required"),
        }),
        onSubmit: (values) => {
            persistData.current = {
                ...persistData.current,
                name: values.name,
                cccd: values.cccd,
                email: values.email,
                phone: values.phone,
                discount: values.discount,
                specialRequest: values.specialRequest,
                arrivalTime: values.arrivalTime,
            };
        },
    });

    const [paymentMethod, setPaymentMethod] = useState("momo");

    const persistData = useRef({
        name: "",
        cccd: "",
        email: "",
        phone: "",
        discount: "",
        specialRequest: "",
        arrivalTime: null,
        paymentMethod: "",
    });

    const stepsConfig = [
        {
            title: t("reserve.stepTitle.step1"),
        },
        {
            title: t("reserve.stepTitle.step2"),
        },
        {
            title: t("reserve.stepTitle.step3"),
        },
    ];

    const [currentStep, setCurrentStep] = useState(2);
    const [isComplete, setIsComplete] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (currentStep === 2) {
            formik.handleSubmit();

            formik.setTouched({
                name: true,
                cccd: true,
                email: true,
                phone: true,
                specialRequest: true,
            });

            if (formik.isValid) {
                setCurrentStep((prevStep) => {
                    if (prevStep === stepsConfig.length) {
                        setIsComplete(true);
                        return prevStep;
                    }

                    return prevStep + 1;
                });
            }

            try {
                setLoading(true);
                const res = await postBookingInfo(
                    formik.values.specialRequest,
                    summaryInfo?.totalPrice || sumPrice || 0
                );
                console.log(">>> res", res);
            } catch (error) {
                console.log(">>> error", error);
                toast.error("Failed to post booking info");
            } finally {
                setLoading(false);
            }

            return;
        }

        // finish
        if (currentStep === stepsConfig.length) {
            try {
                setLoading(true);
                const res = await paymentBooking(paymentMethod);

                console.log(">>> res", res);

                if (paymentMethod === "momo" && res.paymentUrl) {
                    // open in current tab
                    window.open(res.paymentUrl, "_self");
                } else {
                    if (+res.status_code === 200) {
                        clearInterval(intervalIdRef.current);
                        toast.success("Payment successful!");
                        setIsFinishCashPayment(true);
                    }
                }
            } catch (error) {
                console.log(">>> error", error);
                toast.error("Failed to payment booking");
            } finally {
                setLoading(false);
            }

            // setIsComplete(true);

            persistData.current = {
                ...persistData.current,
                paymentMethod,
            };

            console.log(persistData.current);

            return;
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleApplyCoupon = (coupon, discountAmount) => {
        // Xử lý logic khi áp dụng mã giảm giá
        console.log("Mã giảm giá:", coupon);
        console.log("Số tiền giảm:", discountAmount);
    };

    if ((resultCode && resultCode === "0") || isFinishCashPayment) {
        return (
            <Result
                status="success"
                title="Successfully Purchased!"
                subTitle={paymentMethod === "momo" ? "Order number: " + orderId : ""}
                extra={[
                    <Button
                        type="primary"
                        key="console"
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        Go Homepage
                    </Button>,
                    // <Button key="buy">Buy Again</Button>,
                ]}
            />
        );
    } else if (resultCode && resultCode !== "0") {
        return (
            <Result
                status="error"
                title="Payment failed"
                subTitle={`Order number: ${orderId}`}
                extra={[
                    <Button type="primary" key="console" onClick={() => navigate("/")}>
                        Go Homepage
                    </Button>,
                    // <Button key="buy">Buy Again</Button>,
                ]}
            />
        );
    }

    return (
        <>
            <div className="reserve-page">
                <div className="d-none d-md-flex">
                    <Stepper
                        stepsConfig={stepsConfig}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                        isComplete={isComplete}
                        setIsComplete={setIsComplete}
                    />
                </div>

                <div className="d-md-none">
                    {currentStep === 2 && <StyledStepLabel>{stepsConfig[1].title}</StyledStepLabel>}
                    {currentStep === 3 && <StyledStepLabel>{stepsConfig[2].title}</StyledStepLabel>}
                </div>

                <div className="reserve-page__content">
                    <div className="row gy-4 gx-2 gx-lg-3">
                        <div className="col-md-6 col-lg-7">
                            <div className="reserve-container">
                                {currentStep === 2 && <UserInfo formik={formik} />}

                                {currentStep === 3 && (
                                    <PaymentInfo
                                        t={t}
                                        images={images}
                                        setPaymentMethod={setPaymentMethod}
                                    />
                                )}

                                {/* Action */}
                                <div className="mt-5 d-flex justify-content-between">
                                    <button
                                        {...(currentStep === 2 ? { disabled: true } : null)}
                                        className="btn btn-secondary btn-lg fs-3 px-4"
                                        style={{ background: "#227B94" }}
                                        onClick={() => handlePrev()}
                                    >
                                        {t("reserve.back")}
                                    </button>

                                    {!isComplete && (
                                        <Button
                                            type="primary"
                                            size="large"
                                            loading={loading}
                                            style={{
                                                background: "#227B94",
                                                height: "auto", // Để button có thể co giãn theo nội dung
                                                fontSize: "1.5rem", // tương đương fs-3
                                                padding: "0.5rem 1.5rem", // tương đương px-4
                                            }}
                                            onClick={() => handleNext()}
                                        >
                                            {currentStep === stepsConfig.length
                                                ? t("reserve.finish")
                                                : t("reserve.next")}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-5">
                            <div className="row row-cols-1 gy-4">
                                <div className="col">
                                    <HotelInfo
                                        hotelDetail={hotelDetail}
                                        bookingInfo={bookingInfo}
                                        checkInDate={checkInDate}
                                        checkOutDate={checkOutDate}
                                        roomType2={roomType2}
                                        roomType4={roomType4}
                                        rooms={rooms}
                                        sumPrice={sumPrice}
                                        type2Price={type2Price}
                                        type4Price={type4Price}
                                        userId={userId}
                                        numberOfRoom2={numberOfRoom2}
                                        numberOfRoom4={numberOfRoom4}
                                        tempInfo={tempInfo}
                                        hotelId={hotelId}
                                        icons={icons}
                                        navigate={navigate}
                                        t={t}
                                    />
                                </div>

                                <div className="col">
                                    <div className="reserve-container">
                                        <CouponSelector
                                            setSummaryInfo={setSummaryInfo}
                                            discountList={discountList}
                                            onApplyCoupon={handleApplyCoupon}
                                            totalAmount={sumPrice}
                                        />
                                    </div>
                                </div>

                                <div className="col">
                                    <PriceSummary
                                        sumPrice={sumPrice}
                                        bookingInfo={bookingInfo}
                                        summaryInfo={summaryInfo}
                                        t={t}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reserve;
