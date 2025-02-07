import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, DatePicker, Select, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const EditDiscount = ({ record, onSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [maxValue, setMaxValue] = useState(undefined);

    useEffect(() => {
        if (isModalOpen && record) {
            // Set initial form values
            form.setFieldsValue({
                code: record.code,
                type: record.type,
                value: parseFloat(record.value), // Convert from "10%" to 10
                num: record.num,
                dateRange: [moment(record.start_at), moment(record.end_at)],
            });
        }
    }, [form, isModalOpen, record]);

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
            const [startDate, endDate] = values.dateRange;

            const formData = {
                ...values,
                id: record.key, // Include record ID for update
                start_at: startDate.format("YYYY-MM-DD"),
                end_at: endDate.format("YYYY-MM-DD"),
                status: record.status, // Maintain existing status
            };
            delete formData.dateRange;

            // Call API to update discount
            // const response = await updateDiscount(formData);
            console.log("Update form:", formData);

            message.success("Discount updated successfully");
            setIsModalOpen(false);
            onSuccess?.(); // Callback to refresh discount list
        } catch (error) {
            message.error("Failed to update discount");
            console.error("Error updating discount:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={showModal}
                size="small"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                }}
            >
                Edit
            </Button>

            <Modal
                title="Edit Discount"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
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
                            Update Discount
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default EditDiscount;
