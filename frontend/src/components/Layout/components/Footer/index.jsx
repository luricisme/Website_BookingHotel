import React from "react";
import "./Footer.scss"; // Import your styles here
import icons from "~/assets/icon";

const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-content row">
                {/* Hỗ trợ */}
                <div className="col-md-4 my-2 p-5">
                    <h2 className="fw-bold">Help</h2>
                    <ul className="list-unstyled mt-4">
                        <li>
                            <img
                                src={icons.phoneIcon}
                                alt="Phone"
                                className="icon me-3"
                            />
                            Hotline: 1900 686868</li>
                        <li>
                            Hỗ trợ khách hàng:{" "}
                            <a href="mailto:help@bookastay.vn" className="text-decoration-none text-info">
                                help@bookastay.vn
                            </a>
                        </li>
                        <li>
                            Liên hệ hợp tác:{" "}
                            <a href="mailto:support@bookastay.vn" className="text-decoration-none text-info">
                                support@bookastay.vn
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Về chúng tôi */}
                <div className="col-md-4 my-2 p-5">
                    <h2 className="fw-bold">Giới thiệu</h2>
                    <ul className="list-unstyled mt-4">
                        <li>
                            <button className="text-light text-start p-0">About Us</button>
                        </li>
                        <li>
                            <button className="text-light text-start p-0">Regulations on BookaStay</button>
                        </li>
                        <li>
                            <button className="text-light text-start p-0">Connect with us</button>
                        </li>
                        <li>
                            <button className="text-light text-start p-0">Complaint handling policy</button>
                        </li>
                    </ul>
                </div>

                {/* Đối tác thanh toán */}
                <div className="col-md-3 my-2 p-5">
                    <h2 className="fw-bold">Đối tác thanh toán</h2>
                    <div className="d-flex flex-wrap gap-2 mt-4">
                        <img src="https://play-lh.googleusercontent.com/uCtnppeJ9ENYdJaSL5av-ZL1ZM1f3b35u9k8EOEjK3ZdyG509_2osbXGH5qzXVmoFv0" alt="MoMo" className="img-fluid rounded" style={{ width: "50px" }} />
                    </div>
                </div>
            </div>
            <div className="footer-bottom d-flex justify-content-between mt-4">
                <p className="pb-2">© 2025 Capybara. All Rights Reserved.</p>
                <p className="pb-2">Developed by: Capybara Team</p>
            </div>
        </div>
    );
};

export default Footer;
