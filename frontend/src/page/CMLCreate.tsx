import React, { useEffect } from "react";
import { Form, Input, Button, InputNumber, message } from "antd";
import "./CMLCreate.css";
import type { CMLInterface } from "../interface/CML";
import { createCML } from "../services/https/CML";
import { useParams } from "react-router-dom";
import { GetCalculateByID } from "../services/https/Info";

interface CMLFormProps {
    onSuccess?: () => void;
}

const CMLForm: React.FC<CMLFormProps> = ({ onSuccess }) => {
    const [form] = Form.useForm();
    const { id } = useParams<{ id: any }>();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (!id) return;

        const fetchInfo = async () => {
            const data = await GetCalculateByID(id);
            if (data) {
                form.setFieldsValue({
                    actualOutsideDiameter: data.actual_outside_diameter,
                    designThickness: data.design_thickness,
                    structuralThickness: data.structural_thickness,
                    requiredThickness: data.required_thickness,
                });
            } else {
                message.error("ไม่สามารถโหลดข้อมูล Info ได้");
            }
        };

        fetchInfo();
    }, [id, form]);

    const onFinish = async (values: any) => {
        const payload: CMLInterface = {
            cml_number: values.cmlNumber || 0,
            cml_description: values.cmlDescription || "",
            actual_outside_diameter: values.actualOutsideDiameter
                ? Number(values.actualOutsideDiameter)
                : 0,
            design_thickness: values.designThickness
                ? Number(values.designThickness)
                : 0,
            structural_thickness: values.structuralThickness
                ? Number(values.structuralThickness)
                : 0,
            required_thickness: values.requiredThickness
                ? Number(values.requiredThickness)
                : 0,
        };

        console.log("Payload:", payload);
        const res = await createCML(id, payload);

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
                                <InputNumber style={{ width: "100%" }} precision={2} disabled />
                            </Form.Item>
                            <Form.Item name="structuralThickness" label="Structural Thickness">
                                <InputNumber style={{ width: "100%" }} disabled />
                            </Form.Item>
                            <Form.Item name="requiredThickness" label="Required Thickness">
                                <InputNumber style={{ width: "100%" }} precision={2} disabled />
                            </Form.Item>
                        </div>
                    </div>
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

export default CMLForm;
