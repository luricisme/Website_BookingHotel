import React, { useState } from "react";
import "./about.scss";

const About = () => {
    const [activeTab, setActiveTab] = useState("service");

    const renderContent = () => {
        switch (activeTab) {
            case "service":
                return (
                    <div>
                        <h1>Thỏa thuận dịch vụ</h1>
                        <p>Nội dung của thỏa thuận dịch vụ...</p>
                    </div>
                );
            case "privacy":
                return (
                    <div>
                        <h1>Chính sách bảo mật</h1>
                        <p>Nội dung của chính sách bảo mật...</p>
                    </div>
                );
            case "payment":
                return (
                    <div>
                        <h1>Chính sách thanh toán</h1>
                        <p>A. Phương thức thanh toán</p>
                        <p>
                            Người dùng có thể lựa chọn các hình thức thanh toán sau khi đặt phòng trực tuyến tại ứng dụng Go2Joy:
                        </p>
                        <p>
                            1. Thanh toán tại Cơ sở lưu trú (Trả tại khách sạn): Người dùng khi nhận phòng theo thông tin đặt phòng đã đặt sẽ tiến hành thanh toán trực tiếp tại cơ sở lưu trú.
                        </p>
                        <p>
                            Lưu ý:
                        </p>
                        <p>
                            - Người dùng có thể không thể lựa chọn Thanh toán tại cơ sở lưu trú do một trong các nguyên nhân sau:
                        </p>
                        <p>
                            Cơ sở lưu trú không sử dụng phương thức thanh toán trực tiếp.
                        </p>
                        <p>
                            Go2Joy đang tạm thời khoá phương thức thanh toán "Trả tại Khách sạn" của người dùng do hệ thống ghi nhận người dùng có lịch sử đặt phòng bằng hình thức trả tại khách sạn nhưng "Không đến nhận phòng" theo thời gian đã đặt.
                        </p>
                        <p>
                            - Để được khôi phục phương thức thanh toán "Trả tại khách sạn" (trả sau) khi đặt phòng: Khách hàng phải hoàn thành một đơn đặt phòng bằng các hình thức thanh toán khác hiện có trên Go2Joy (đặt và đến nhận phòng theo đúng thời gian đã đặt qua App).
                        </p>
                        <p>
                            - Trường hợp không thể thanh toán trả sau tại cơ sở lưu trú, Khách hàng vẫn có thể lựa chọn các hình thức thanh toán khác hiện có trên Go2Joy để tiếp tục đặt phòng.
                        </p>
                        <p>
                            2. Thanh toán online qua Momo
                        </p>
                        <p>
                            3. Thanh toán online qua ZaloPay
                        </p>
                        <p>
                            4. Thanh toán online qua ShopeePay
                        </p>
                        <p>
                            5. Thanh toán online bằng thẻ ATM/ Visa/ Master Card qua cổng VNPT Epay
                        </p>
                        <p>
                            B. Chính sách hoàn tiền
                        </p>
                        <p>
                            Người dùng đáp ứng đầy đủ các điều khoản và điều kiện tại Chính sách hủy đặt phòng sẽ được áp dụng hoàn tiền tuỳ theo từng hình thức thanh toán người dùng sử dụng, cụ thể như sau:
                        </p>
                        <p>
                            Thẻ ATM (nội địa): Hoàn tiền trong 7 ngày làm việc.
                        </p>
                        <p>
                            Thẻ Visa/ Master Card (nội địa): Hoàn tiền trong 7 đến 15 ngày làm việc.
                        </p>
                        <p>
                            Thẻ Visa/ Master Card (quốc tế): Hoàn tiền từ 30 đến 45 ngày làm việc.
                        </p>
                        <p>
                            Momo, ZaloPay, ShopeePay: Hoàn tiền trong vòng 24 giờ làm việc.
                        </p>
                        <p>
                            Lưu ý:
                        </p>
                        <p>
                            Chính sách hoàn tiền không áp dụng cho trường hợp người dùng lựa chọn và thực hiện phương thức thanh toán đặt phòng tại khách sạn.
                            Thời gian hoàn tiền cho chính sách này không bao gồm thứ 7, chủ nhật và các ngày lễ và sẽ phụ thuộc vào chính sách riêng của các đối tác cung cấp nền tảng thanh toán.
                            Không áp dụng hoàn tiền một phần cho bất kỳ các loại đặt phòng trả trước. Yêu cầu hoàn tiền chỉ được áp dụng cho toàn bộ thời gian lưu trú tại cơ sở lưu trú của cùng một mã đặt phòng và đáp ứng đầy đủ điều kiện tại Chính sách hủy đặt phòng.
                            Tùy theo chính sách của từng khách sạn mà đặt phòng cần hủy có thể phát sinh phí hủy phòng.</p>
                    </div>
                );
            case "contact":
                return (
                    <div>
                        <h1>Về chúng tôi</h1>
                        <p>
                            BookaStay là một trang web đặt phòng khách sạn trực
                            tuyến, giúp bạn dễ dàng tìm kiếm và đặt phòng khách
                            sạn một cách nhanh chóng và tiện lợi. Với hệ thống
                            phòng khách sạn đa dạng, từ 1 sao đến 5 sao, từ
                            phòng tiêu chuẩn đến phòng hạng sang, từ phòng
                            đơn đến phòng gia đình, BookaStay cam kết mang đến cho
                            bạn trải nghiệm đặt phòng khách sạn tốt nhất.
                        </p>
                        <p className="mb-0">Hỗ trợ khách hàng:{" "}
                            <a href="mailto:help@bookastay.vn" className="text-decoration-none">
                                help@bookastay.vn
                            </a>
                        </p>
                        <p>
                            Liên hệ hợp tác:{" "}
                            <a href="mailto:support@bookastay.vn" className="text-decoration-none">
                                support@bookastay.vn
                            </a>
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="about-us-container">
            <div className="side-bar">
                <ul>
                    <li
                        className={activeTab === "contact" ? "active" : ""}
                        onClick={() => setActiveTab("contact")}
                    >
                        Về chúng tôi
                    </li>
                    <li
                        className={activeTab === "service" ? "active" : ""}
                        onClick={() => setActiveTab("service")}
                    >
                        Thỏa thuận dịch vụ
                    </li>
                    <li
                        className={activeTab === "privacy" ? "active" : ""}
                        onClick={() => setActiveTab("privacy")}
                    >
                        Chính sách bảo mật
                    </li>
                    <li
                        className={activeTab === "payment" ? "active" : ""}
                        onClick={() => setActiveTab("payment")}
                    >
                        Chính sách thanh toán
                    </li>
                </ul>
            </div>
            <div className="content">{renderContent()}</div>
        </div>
    );
};

export default About;
