import React, { useState } from "react";
import "./about.scss";

const About = () => {
    const [activeTab, setActiveTab] = useState("contact");

    const renderContent = () => {
        switch (activeTab) {
            case "service":
                return (
                    <div>
                        <h1>Thỏa thuận dịch vụ</h1>
                        <p>BẠN PHẢI ĐỌC NHỮNG ĐIỀU KHOẢN SỬ DỤNG DƯỚI ĐÂY TRƯỚC KHI SỬ DỤNG ỨNG DỤNG NÀY. VIỆC SỬ DỤNG ỨNG DỤNG NÀY XÁC NHẬN VIỆC CHẤP THUẬN VÀ TUÂN THỦ CÁC ĐIỀU KHOẢN VÀ ĐIỀU KIỆN DƯỚI ĐÂY.</p>
                        <h2>1. Điều kiện sử dụng</h2>
                        <ul>
                            <li>Bạn phải từ 18 tuổi trở lên để sử dụng dịch vụ đặt phòng của BookaStay.</li>
                            <li>Bạn cam kết cung cấp thông tin cá nhân chính xác và đầy đủ.</li>
                            <li>Việc sử dụng dịch vụ của chúng tôi phải tuân thủ pháp luật và không được sử dụng vào mục đích trái phép.</li>
                        </ul>
                        <h2>2. Đặt phòng và thanh toán</h2>
                        <ul>
                            <li>Để đặt phòng, bạn cần chọn ngày nhận phòng và trả phòng, số lượng phòng, loại phòng và số lượng khách.</li>
                            <li>Chính sách hủy phòng sẽ tùy thuộc vào từng khách sạn và sẽ được hiển thị trước khi xác nhận đặt phònng.</li>
                            <li>Chúng tôi không chịu trách nhiệm đối với các vấn đề phát sinh do cung cấp thông tin sai lệch từ khách hàng hoặc đối tác.</li>
                        </ul>
                        <h2>3. Trách nhiệm và quyền lợi</h2>
                        <ul>
                            <li>Chúng tôi cung cấp nền tảng kết nối khách hàng với các đơn vị cung cấp dịch vụ lưu trú, không trực tiếp vận hành các khách sạn.</li>
                            <li>Chúng tôi không chịu trách nhiệm về chất lượng dịch vụ lưu trú, nhưng sẽ hỗ trợ giải quyết tranh chấp khi cần thiết.</li>
                            <li>Người dùng có quyền khiếu nại nếu dịch vụ không đúng như mô tả.</li>
                        </ul>
                        <h2>4. Sửa đổi điều khoản</h2>
                        <p className={"ms-4"}>Chúng tôi có quyền sửa đổi điều khoản dịch vụ vào bất kỳ thời điểm nào. Những thay đổi sẽ có hiệu lực ngay sau khi được cập nhật trên nền tảng.</p>
                    </div>
                );
            case "privacy":
                return (
                    <div>
                        <h1>Chính sách bảo mật</h1>
                        <h2>1. Thu thập thông tin</h2>
                        <p>
                            Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đặt phòng hoặc liên hệ với chúng tôi.
                        </p>
                        <ul>
                            <li>Thông tin cá nhân: tên, email, số điện thoại, địa chỉ.</li>
                            <li>Thông tin thanh toán.</li>
                            <li>Thông tin về lịch sử đặt phòng và phản hồi.</li>
                        </ul>
                        <h2>2. Sử dụng thông tin</h2>
                        <p>
                            Chúng tôi sử dụng thông tin thu thập được để:
                        </p>
                        <ul>
                            <li>Xác nhận đặt phòng và gửi thông tin liên quan.</li>
                            <li>Hỗ trợ khách hàng và giải quyết khiếu nại.</li>
                            <li>Cập nhật thông tin khuyến mãi và sự kiện (nếu được cho phép).</li>
                        </ul>
                        <h2>3. Bảo mật thông tin</h2>
                        <p>
                            Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn và áp dụng các biện pháp bảo mật để ngăn chặn truy cập trái phép.
                        </p>
                        <h2>4. Chia sẻ thông tin</h2>
                        <p>
                            Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba, ngoại trừ các trường hợp:
                        </p>
                        <ul>
                            <li>Cung cấp thông tin cho khách sạn đối tác để hoàn tất đặt phòng.</li>
                            <li>Chia sẻ thông tin với cơ quan chức năng theo yêu cầu pháp luật.</li>
                        </ul>
                        <h2>5. Quyền lợi người dùng</h2>
                        <p>Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của mình bằng cách liên hệ với chúng tôi.</p>
                        <h2>6. Thay đổi chính sách</h2>
                        <p>Chúng tôi có thể thay đổi chính sách bảo mật vào bất kỳ thời điểm nào. Những thay đổi sẽ được cập nhật trên trang web.</p>
                    </div>
                );
            case "payment":
                return (
                    <div>
                        <h1>Chính sách thanh toán</h1>
                        <h2>A. Phương thức thanh toán</h2>
                        <p>
                            Người dùng có thể lựa chọn các hình thức thanh toán sau khi đặt phòng trực tuyến tại ứng dụng BookaStay:
                        </p>
                        <p>
                            <strong>1. Thanh toán tại Cơ sở lưu trú (Trả tại khách sạn):</strong> Người dùng khi nhận phòng theo thông tin đặt phòng đã đặt sẽ tiến hành thanh toán trực tiếp tại cơ sở lưu trú.
                        </p>
                        <p>
                            <strong>Lưu ý:</strong>
                        </p>
                        <p>
                            - Người dùng có thể không thể lựa chọn Thanh toán tại cơ sở lưu trú do một trong các nguyên nhân sau:
                        </p>
                        <p>
                            + Cơ sở lưu trú không sử dụng phương thức thanh toán trực tiếp.
                        </p>
                        <p>
                            + BookaStay đang tạm thời khoá phương thức thanh toán "Trả tại Khách sạn" của người dùng do hệ thống ghi nhận người dùng có lịch sử đặt phòng bằng hình thức trả tại khách sạn nhưng "Không đến nhận phòng" theo thời gian đã đặt.
                        </p>
                        <p>
                            - Để được khôi phục phương thức thanh toán "Trả tại khách sạn" (trả sau) khi đặt phòng: Khách hàng phải hoàn thành một đơn đặt phòng bằng các hình thức thanh toán khác hiện có trên BookaStay (đặt và đến nhận phòng theo đúng thời gian đã đặt qua App).
                        </p>
                        <p>
                            - Trường hợp không thể thanh toán trả sau tại cơ sở lưu trú, Khách hàng vẫn có thể lựa chọn các hình thức thanh toán khác hiện có trên BookaStay để tiếp tục đặt phòng.
                        </p>
                        <p>
                            <strong>2. Thanh toán online qua Momo</strong>
                        </p>

                        <h2 className="mt-5">
                            B. Chính sách hoàn tiền
                        </h2>
                        <p>
                            Người dùng đáp ứng đầy đủ các điều khoản và điều kiện tại Chính sách hủy đặt phòng sẽ được áp dụng hoàn tiền tuỳ theo từng hình thức thanh toán người dùng sử dụng, cụ thể như sau:
                        </p>
                        <p>
                            Momo: Hoàn tiền trong vòng 24 giờ làm việc.
                        </p>
                        <p>
                            <strong>Lưu ý:</strong>
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
