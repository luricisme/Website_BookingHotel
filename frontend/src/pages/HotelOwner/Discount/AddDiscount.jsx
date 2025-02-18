import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { createDiscount } from "../../../services/apiService";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AddDiscount = ({ onSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [maxValue, setMaxValue] = useState(undefined);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const handleChangeType = (value) => {
        if (value === "Percentage") {
            setMaxValue(100);
        } else {
            setMaxValue(undefined);
        }

        form.setFieldsValue({ value: undefined });
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            // Transform date range to start_at and end_at
            const [startDate, endDate] = values.dateRange;

            const formData = {
                ...values,
                start_at: startDate.format("YYYY-MM-DD"),
                end_at: endDate.format("YYYY-MM-DD"),
                status: "Active", // Default status for new discount
            };
            delete formData.dateRange;

            // Call API to create discount
            const response = await createDiscount(formData);
            console.log("Submit form:", response);

            message.success("Discount created successfully");
            form.resetFields();
            setIsModalOpen(false);
            onSuccess?.(); // Callback to refresh discount list
        } catch (error) {
            message.error("Failed to create discount");
            console.error("Error creating discount:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                size="large"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                }}
            >
                Add New Discount
            </Button>

            <Modal
                title="Add New Discount"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        type: "Percentage",
                    }}
                >
                    <Form.Item
                        name="code"
                        label="Discount Code"
                        rules={[
                            { required: true, message: "Please input discount code!" },
                            { min: 3, message: "Code must be at least 3 characters!" },
                            { max: 20, message: "Code cannot be longer than 20 characters!" },
                        ]}
                    >
                        <Input placeholder="Enter discount code (e.g., SUMMER2024)" />
                    </Form.Item>

                    <Form.Item
                        name="minAmount"
                        label="Minimum Booking Amount"
                        rules={[
                            { required: true, message: "Please input minimum booking amount!" },
                            { type: "number", min: 0, message: "Must be at least 0!" },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Enter minimum booking amount"
                            min={0}
                        />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Discount Type"
                        rules={[{ required: true, message: "Please select discount type!" }]}
                    >
                        <Select placeholder="Select discount type" onChange={handleChangeType}>
                            <Option value="Percentage">Percentage (%)</Option>
                            <Option value="Fixed">Fixed Amount</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="value"
                        label="Discount Value"
                        rules={[
                            { required: true, message: "Please input discount value!" },
                            {
                                validator: (_, value) => {
                                    if (
                                        form.getFieldValue("type") === "Percentage" &&
                                        (value <= 0 || value > 100)
                                    ) {
                                        return Promise.reject(
                                            "Percentage must be between 0 and 100!"
                                        );
                                    }
                                    if (value <= 0) {
                                        return Promise.reject("Value must be greater than 0!");
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Enter discount value"
                            min={0}
                            max={maxValue}
                        />
                    </Form.Item>

                    <Form.Item
                        name="num"
                        label="Number of Discounts Available"
                        rules={[
                            { required: true, message: "Please input number of discounts!" },
                            { type: "number", min: 1, message: "Must be at least 1!" },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            placeholder="Enter number of discounts"
                            min={1}
                        />
                    </Form.Item>

                    <Form.Item
                        name="dateRange"
                        label="Validity Period"
                        rules={[{ required: true, message: "Please select date range!" }]}
                    >
                        <RangePicker
                            style={{ width: "100%" }}
                            disabledDate={(current) => {
                                return current && current < moment().startOf("day");
                            }}
                        />
                    </Form.Item>

                    <div style={{ textAlign: "right", marginTop: "24px" }}>
                        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Create Discount
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default AddDiscount;
