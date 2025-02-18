import React from "react";
import { Result, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";

const RegisterSuccess = ({ email, onBackToLogin }) => {
    return (
        <Result
            icon={<MailOutlined style={{ color: "#1890ff" }} />}
            title="Registration Successful!"
            subTitle={
                <div>
                    <p>We've sent an activation link to your email:</p>
                    <p style={{ color: "#1890ff", fontWeight: "bold" }}>{email}</p>
                    <p>
                        Please check your email and click the activation link to complete your
                        registration.
                    </p>
                </div>
            }
            extra={[
                <Button type="primary" key="login" onClick={onBackToLogin}>
                    Back to Login
                </Button>,
            ]}
        />
    );
};

export default RegisterSuccess;
