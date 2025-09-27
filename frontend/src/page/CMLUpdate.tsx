import React, { useEffect, useState } from "react";
import { Form, Input, Button, InputNumber, message, Spin } from "antd";
import "./CMLCreate.css";
import type { CMLInterface } from "../interface/CML";
import { GetCMLByID, UpdateCMLById } from "../services/https/CML"; // สร้าง API update
// import dayjs from "dayjs";

interface PipeFormProps {
    cmlID: string;
    onSuccess?: () => void;
}

const CMLUpdate: React.FC<PipeFormProps> = ({ cmlID, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await GetCMLByID(cmlID);
                console.log(res)
                if (res) {
                    const info: CMLInterface = res;
                    form.setFieldsValue({
                        cmlNumber: info.cml_number,
                        cmlDescription: info.cml_description,
                        actualOutsideDiameter: info.actual_outside_diameter,
                        designThickness: info.design_thickness,
                        structuralThickness: info.structural_thickness,
                        requiredThickness: info.required_thickness,
                    });
                } else {
                    message.error("ไม่พบข้อมูล CML");
                }
            } catch (error) {
                message.error("เกิดข้อผิดพลาดในการดึงข้อมูล CML");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cmlID]);

    const onFinish = async (values: any) => {
        const payload: CMLInterface = {
            cml_number: values.cmlNumber ?? 0,
            cml_description: values.cmlDescription ?? "",
            actual_outside_diameter: values.actualOutsideDiameter ?? 0,
            design_thickness: values.designThickness ?? 0,
            structural_thickness: values.structuralThickness ?? 0,
            required_thickness: values.requiredThickness ?? 0,
        };

        try {
            const res = await UpdateCMLById(cmlID, payload);
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
                    <div className="form-grid">
                        <div className="form-column">
                            <Form.Item name="cmlNumber" label="CML Number" rules={[{ required: true, message: "Please enter the CML Number" }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item name="cmlDescription" label="CML Description" rules={[{ required: true, message: "Please enter the CML Description" }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name="actualOutsideDiameter" label="Actual Outside Diameter">
                                <InputNumber style={{ width: "100%" }} disabled />
                            </Form.Item>
                        </div>
                        <div className="form-column">
                            <Form.Item name="designThickness" label="Design Thickness">
                                <InputNumber style={{ width: "100%" }} disabled />
                            </Form.Item>

                            <Form.Item name="structuralThickness" label="Structural Thickness">
                                <InputNumber style={{ width: "100%" }} disabled />
                            </Form.Item>

                            <Form.Item name="requiredThickness" label="Required Thickness">
                                <InputNumber style={{ width: "100%" }} disabled />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="form-submit">
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="buttom-add">Edit CML</Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default CMLUpdate;
