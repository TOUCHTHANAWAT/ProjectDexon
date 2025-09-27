import React from "react";
import { Form, Input, Button, message, DatePicker } from "antd";
import "./InfoCreate.css";
import type { ThicknessInterface } from "../interface/Thickness";
import { createThickness } from "../services/https/Thickness";
import { useParams } from "react-router-dom";

interface ThicknessForm {
    onSuccess?: () => void;
}

const ThicknessForm: React.FC<ThicknessForm> = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const { id } = useParams<{ id: any }>();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        const payload: ThicknessInterface = {
            inspection_date: values.inspectionDate
                ? values.inspectionDate.format("YYYY-MM-DD")
                : new Date().toISOString().split("T")[0], // default เป็นวันนี้
            actual_thickness: values.actualThickness || "",
        };

        console.log("Payload:", payload);
        const res = await createThickness(id, payload);

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
                    <Form.Item name="inspectionDate" label="Inspection Date" rules={[{ required: true, message: "Please enter the Inspection Date" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="actualThickness" label="Actual Thickness" rules={[{ required: true, message: "Please enter the Actual Thickness" }]}>
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

export default ThicknessForm;
