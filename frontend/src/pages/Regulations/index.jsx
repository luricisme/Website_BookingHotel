import React, { useState } from "react";
import "./regulations.scss";

const Regulations = () => {
    return (
        <div className={"regulation m-5 p-5"}>
            <h1 className={"my-5"}>Quy chế hoạt động của BookaStay</h1>
            <h2>1. Nguyên tắc hoạt động</h2>
            <ul>
                <li>BookaStay hoạt động với vai trò trung gian giữa khách hàng và đơn vị cung cấp dịch vụ lưu trú.</li>
                <li>Tất cả các giao dịch phải tuân thủ pháp luật Việt Nam và các quy định của BookaStay.</li>
                <li>Các khách sạn đăng ký trên nền tảng phải cung cấp thông tin chính xác và chịu trách nhiệm về chất lượng dịch vụ.</li>
                <li>Khách hàng có quyền đánh giá dịch vụ và phản hồi về trải nghiệm lưu trú của mình.</li>
                <li>BookaStay cam kết bảo vệ thông tin cá nhân của khách hàng theo chính sách bảo mật.</li>
            </ul>
            <h2>2. Quy định đối với khách hàng</h2>
            <ul>
                <li>Khách hàng phải cung cấp thông tin chính xác khi đặt phòng.</li>
                <li>Thanh toán phải được thực hiện qua các phương thức được BookaStay chấp nhận.</li>
                <li>Khách hàng phải tuân thủ các chính sách hủy phòng và hoàn tiền của khách sạn.</li>
                <li>Mọi hành vi gian lận hoặc vi phạm quy định có thể dẫn đến việc tài khoản bị khóa.</li>
            </ul>
            <h2>3. Quy định đối với đối tác khách sạn</h2>
            <ul>
                <li>Đảm bảo cung cấp dịch vụ đúng với mô tả trên nền tảng.</li>
                <li>Xử lý đặt phòng và phản hồi khách hàng trong thời gian quy định.</li>
                <li>Minh bạch về giá cả, chính sách hủy phòng và các điều kiện liên quan.</li>
                <li>Không được tự ý hủy đặt phòng của khách hàng nếu không có lý do chính đáng.</li>
            </ul>
        </div>
    );
};

export default Regulations;
