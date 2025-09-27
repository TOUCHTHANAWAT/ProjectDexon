import React from "react";
import { Form, Input, Button, InputNumber, message } from "antd";
import "./InfoCreate.css";
import type { TestPointInterface } from "../interface/TestPoint";
import { createTestPoint } from "../services/https/TestPoint";
import { useParams } from "react-router-dom";

interface TestPointForm {
    onSuccess?: () => void;
}

const TestPointForm: React.FC<TestPointForm> = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const { id } = useParams<{ id: any }>();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        const payload: TestPointInterface = {
            tp_number: values.tpNumber || 0,
            tp_description: values.tpDescription || 0,
            note: values.note || "",
        };

        console.log("Payload:", payload);
        const res = await createTestPoint(id, payload);

        if (res && res.status === 201) {
            messageApi.success("Saved successfully!");
            form.resetFields();
            if (onSuccess) onSuccess();
        } else {
            messageApi.error("Save unsuccessful. Please try again.");
        }
    };

    return (
        <>
            {contextHolder}
            <div className="pipe-form-container">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="tpNumber" label="TP Number" rules={[{ required: true, message: "Please enter the TP Number" }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="tpDescription" label="TP Description" rules={[{ required: true, message: "Please enter the TP Description" }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="note" label="Note">
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <div className="form-submit">
                            <Button type="primary" htmlType="submit" className="buttom-add">
                                Save CML
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default TestPointForm;
