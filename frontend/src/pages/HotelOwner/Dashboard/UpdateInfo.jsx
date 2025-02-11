import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const UpdateInfo = ({ record, onSuccess }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const userInfo = useSelector((state) => state.account.userInfo);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        try {
            setLoading(true);
            console.log(values); // Log dữ liệu gửi lên
            message.success("Update hotel info successfully");
            onSuccess();
            handleCancel();
        } catch (error) {
            console.log(error);
            message.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button type="primary" icon={<EditOutlined />} onClick={showModal} size="large">
                Edit
            </Button>
            <Modal
                title="Edit Hotel's Information"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={form.submit}>
                        Update
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        name: userInfo.hotel?.name || "",
                        phone: userInfo.hotel?.phone || "",
                        address: userInfo.hotel?.detailAddress || "",
                    }}
                >
                    <Form.Item label="Name:" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Telephone:" name="phone">
                        <Input placeholder="Hotel's telephone" />
                    </Form.Item>
                    <Form.Item
                        label="Address:"
                        name="address"
                    >
                        <Input />
                        <div className="row row-cols-2 row-cols-md-3 my-3">
                            <div className="col">
                                <select
                                    className={`form-select form-select-lg fs-4` }
                                >
                                    <option value="">Select city</option>
                                    <option value="1">Hanoi</option>
                                </select>
                            </div>
                            <div className="col">
                                <select className={`form-select form-select-lg fs-4` }
                                >
                                    <option value="">Select district</option>
                                </select>
                            </div>
                            <div className="col">
                                <select
                                    className={`form-select form-select-lg fs-4`}
                                >
                                    <option value="">Select ward</option>
                                </select>
                            </div>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateInfo;
