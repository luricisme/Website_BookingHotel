import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { doGetAccount } from "~/redux/action/accountAction";

const UpdateInfo = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.account.userInfo);
    const accessToken = useSelector((state) => state.account.accessToken);
    const hotelId = userInfo.hotel?.id;

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        if (!hotelId) {
            message.error("Hotel ID not found");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                name: values.name,
                phone: values.phone,
                detailAddress: values.address,
                description: values.description,
                // Preserving existing values that aren't being updated
                email: userInfo.hotel?.email,
                star: userInfo.hotel?.star,
                city: userInfo.hotel?.city,
                district: userInfo.hotel?.district,
                ward: userInfo.hotel?.ward
            };

            await axios.patch(
                `http://localhost:3001/api/hotels/${hotelId}`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            message.success("Update hotel info successfully");
            // Refresh user info after update
            dispatch(doGetAccount());
            handleCancel();
        } catch (error) {
            console.error("Update failed:", error);
            message.error(error.response?.data?.message || "Update failed");
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
                        description: userInfo.hotel?.description || ""
                    }}
                >
                    <Form.Item
                        label="Name:"
                        name="name"
                        rules={[{ required: true, message: "Please input hotel name!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Telephone:"
                        name="phone"
                        rules={[{ required: true, message: "Please input telephone number!" }]}
                    >
                        <Input placeholder="Hotel's telephone" />
                    </Form.Item>
                    <Form.Item
                        label="Address:"
                        name="address"
                        rules={[{ required: true, message: "Please input address!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Description:"
                        name="description"
                        rules={[{ required: true, message: "Please input hotel description!" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateInfo;