import React, { useEffect, useState } from "react";
import { Form, Input, Button, InputNumber, message, Spin } from "antd";
import "./InfoCreate.css";
import type { TestPointInterface } from "../interface/TestPoint";
import { GetTestPointByID, UpdateTestPointById } from "../services/https/TestPoint";

interface TestPointFormProps {
    TPID: string;
    onSuccess?: () => void;
}

const CMLUpdate: React.FC<TestPointFormProps> = ({ TPID, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await GetTestPointByID(TPID);
                console.log(res)
                if (res) {
                    const info: TestPointInterface = res;
                    form.setFieldsValue({
                        tpNumber: info.tp_number,
                        tpDescription: info.tp_description,
                        note: info.note,
                    });
                } else {
                    message.error("ไม่พบข้อมูล TestPoint");
                }
            } catch (error) {
                message.error("เกิดข้อผิดพลาดในการดึงข้อมูล TestPoint");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [TPID]);

    const onFinish = async (values: any) => {
        const payload: TestPointInterface = {
            tp_number: values.tpNumber ?? 0,
            tp_description: values.tpDescription ?? 0,
            note: values.note ?? "",
        };

        try {
            const res = await UpdateTestPointById(TPID, payload);
            if (res && res.status === 200) {
                messageApi.success("Update successful!");
                if (onSuccess) onSuccess();
            } else {
                messageApi.error("Update unsuccessful. Please try again.");
            }
        } catch (error) {
            message.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
        }
    };

    if (loading) return <Spin tip="Loading..." />;

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
                            <Button type="primary" htmlType="submit" className="buttom-add">Edit TestPoint</Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default CMLUpdate;
