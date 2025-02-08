import React, { useState } from "react";
import "./policy.scss";

const HandlePolicy = () => {
    return (
        <div className={"policy m-5 p-5"}>
            <h1 className={"my-5"}>Cơ chế giải quyết tranh chấp</h1>
            <h2>1. Nguyên tắc giải quyết tranh chấp</h2>
            <ul>
                <li>BookaStay khuyến khích các bên tự thỏa thuận để giải quyết tranh chấp.</li>
                <li>Trong trường hợp không thể tự thỏa thuận, BookaStay sẽ hỗ trợ giải quyết trên nguyên tắc công bằng, minh bạch.</li>
                <li>Nếu tranh chấp không thể giải quyết thông qua nền tảng, các bên có thể đưa vụ việc ra cơ quan có thẩm quyền theo quy định của pháp luật.</li>
            </ul>
            <h2>2. Quy trình giải quyết tranh chấp</h2>
            <h3>Bước 1: Tiếp nhận khiếu nại</h3>
            <ul>
                <li>Khách hàng hoặc khách sạn gửi khiếu nại qua email hoặc hệ thống hỗ trợ của BookaStay.</li>
                <li>Khiếu nại phải bao gồm thông tin chi tiết như mã đặt phòng, nội dung tranh chấp, bằng chứng liên quan.</li>
                <li>BookaStay tiếp nhận khiếu nại và phản hồi trong vòng 24 giờ.</li>
            </ul>
            <h3>Bước 2: Xác minh và xử lý</h3>
            <ul>
                <li>Bộ phận hỗ trợ của BookaStay sẽ xác minh thông tin trong vòng 3-5 ngày làm việc.</li>
                <li>BookaStay có thể yêu cầu các bên cung cấp thêm bằng chứng để làm rõ tranh chấp.</li>
            </ul>
            <h3>Bước 3: Đề xuất giải pháp</h3>
            <ul>
                <li>Dựa trên thông tin thu thập, BookaStay sẽ đưa ra giải pháp phù hợp, có thể bao gồm hoàn tiền, đổi phòng hoặc các hình thức hỗ trợ khác.</li>
            </ul>
            <h3>Bước 4: Giải quyết cuối cùng</h3>
            <ul>
                <li>Nếu các bên đồng ý với giải pháp, tranh chấp sẽ được đóng lại.</li>
                <li>Nếu một trong hai bên không đồng ý, tranh chấp có thể được đưa ra cơ quan có thẩm quyền để giải quyết theo pháp luật..</li>
            </ul>
            <h2>3. Các trường hợp đặc biệt</h2>
            <ul>
                <li>Nếu khách hàng không nhận được phòng như đã đặt, BookaStay sẽ hỗ trợ tìm phòng thay thế hoặc hoàn tiền.</li>
                <li>Nếu khách hàng bị thu phí sai, BookaStay sẽ làm việc với đối tác khách sạn để hoàn trả số tiền chênh lệch.</li>
                <li>Nếu khách sạn bị khách hàng gây thiệt hại, BookaStay sẽ hỗ trợ liên hệ để khách hàng bồi thường hợp lý.</li>
            </ul>
        </div>
    );
};

export default HandlePolicy;
