import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Steps, message, Typography, Modal } from "antd";
import {
    UserOutlined,
    LockOutlined,
    MailOutlined,
    ArrowLeftOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { formatTime } from "../../utils/datetime";
import { resetPassword, sendResetCode } from "../../services/apiService";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const { confirm } = Modal;

const BackToLoginLink = styled(Button)`
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;

const ForgotPassword = () => {
    const navigate = useNavigate();

    const showConfirmDialog = () => {
        const hasFormData = form.isFieldsTouched();

        if (currentStep === 1 || hasFormData) {
            confirm({
                title: "Return to Login",
                icon: <ExclamationCircleOutlined />,
                content:
                    "Are you sure you want to return to login? Your current progress will be lost.",
                okText: "Yes, return",
                cancelText: "No, stay here",
                onOk() {
                    form.resetFields();
                    handleBackToLogin();
                },
            });
        } else {
            handleBackToLogin();
        }
    };

    const handleBackToLogin = () => {
        navigate("/login");
    };

    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(300);
    const [isCodeSent, setIsCodeSent] = useState(false);

    useEffect(() => {
        let timer;
        if (isCodeSent && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            message.error("Verification code has expired. Please request a new one!");
            setCurrentStep(0);
            setIsCodeSent(false);
        }
        return () => clearInterval(timer);
    }, [countdown, isCodeSent]);

    const handleSubmitEmail = async (values) => {
        try {
            setLoading(true);
            await sendResetCode(values.email);
            message.success("Verification code has been sent to your email!");
            setIsCodeSent(true);
            setCountdown(300);
            setCurrentStep(1);
        } catch (error) {
            message.error("An error occurred. Please try again!");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (values) => {
        if (countdown === 0) {
            message.error("Verification code has expired. Please request a new one!");
            return;
        }

        try {
            setLoading(true);

            const data = {
                email: form.getFieldValue("email"),
                codeId: values.verificationCode,
                newPassword: values.newPassword,
            };

            const res = await resetPassword(data);

            console.log(res);

            message.success("Password has been reset successfully!");
            setIsCodeSent(false);
            setCountdown(300);
        } catch (error) {
            message.error("An error occurred. Please try again!");
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setLoading(true);
            await sendResetCode(form.getFieldValue("email"));
            setCountdown(300);
            setIsCodeSent(true);
            message.success("New verification code has been sent!");
        } catch (error) {
            message.error("Failed to resend code. Please try again!");
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: "Verify Email",
            content: (
                <Form form={form} layout="vertical" onFinish={handleSubmitEmail}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please input your email!" },
                            { type: "email", message: "Please enter a valid email!" },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Enter your email"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            size="large"
                        >
                            Send Code
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: "Reset Password",
            content: (
                <Form form={form} layout="vertical" onFinish={handleResetPassword}>
                    <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <div style={{ fontSize: 16, marginBottom: 8 }}>
                            Time remaining:{" "}
                            <span style={{ color: countdown < 60 ? "#ff4d4f" : "#1890ff" }}>
                                {formatTime(countdown)}
                            </span>
                        </div>
                        {countdown < 60 && (
                            <Button type="link" onClick={handleResendCode} loading={loading}>
                                Resend Code
                            </Button>
                        )}
                    </div>
                    <Form.Item
                        name="verificationCode"
                        label="Verification Code"
                        rules={[
                            { required: true, message: "Please input verification code!" },
                            // { len: 6, message: "Verification code must be 6 characters!" },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter verification code"
                            size="large"
                            // maxLength={6}
                        />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            { required: true, message: "Please input new password!" },
                            { min: 6, message: "Password must be at least 6 characters!" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Enter new password"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Please confirm your password!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Passwords do not match!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Confirm new password"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            size="large"
                            disabled={countdown === 0}
                        >
                            Reset Password
                        </Button>
                        <Button
                            onClick={() => {
                                setCurrentStep(0);
                                setIsCodeSent(false);
                                setCountdown(300);
                            }}
                            block
                            size="large"
                            style={{ marginTop: 16 }}
                        >
                            Back
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <div
            style={{
                maxWidth: 480,
                margin: "40px auto",
                padding: "0 16px",
            }}
        >
            <Card>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 24,
                    }}
                >
                    <Text strong style={{ fontSize: 24 }}>
                        Forgot Password
                    </Text>
                    <Button type="link" icon={<ArrowLeftOutlined />} onClick={showConfirmDialog}>
                        Back to Login
                    </Button>
                </div>

                <Steps
                    current={currentStep}
                    items={steps.map((item) => ({ title: item.title }))}
                    style={{
                        marginBottom: 24,
                        padding: "0 20px",
                    }}
                    // size="small"
                />
                {steps[currentStep].content}

                <div style={{ textAlign: "center" }}>
                    <Text type="secondary">Remember your password?</Text>
                    <BackToLoginLink type="link" onClick={showConfirmDialog}>
                        <ArrowLeftOutlined />
                        Return to Login
                    </BackToLoginLink>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;
