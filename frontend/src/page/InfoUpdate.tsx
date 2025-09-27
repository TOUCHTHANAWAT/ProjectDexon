import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, InputNumber, message, Spin, Popconfirm } from "antd";
import "./InfoCreate.css";
import type { InfoInterface } from "../interface/Info";
import { GetInfoByID, UpdateInfoById, DeleteInfo } from "../services/https/Info"; // สร้าง API update
import dayjs from "dayjs";

interface PipeFormProps {
    infoID: string; // id ของ record ที่ต้องการแก้ไข
    onSuccess?: () => void;
}

const PipeForm: React.FC<PipeFormProps> = ({ infoID, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await GetInfoByID(infoID);
                if (res) {
                    const info: InfoInterface = res;
                    form.setFieldsValue({
                        lineNumber: info.line_number,
                        location: info.location,
                        from: info.from,
                        to: info.to,
                        drawingNumber: info.drawing_number,
                        service: info.service,
                        material: info.material,
                        inServiceDate: info.inservice_date ? dayjs(info.inservice_date) : null,
                        pipeSize: info.pipe_size,
                        originalThickness: info.original_thickness,
                        stress: info.stress,
                        jointEfficiency: info.joint_efficiency,
                        ca: info.ca,
                        designLife: info.design_life,
                        designPressure: info.design_pressure,
                        operatingPressure: info.operating_pressure,
                        designTemperature: info.design_temperature,
                        operatingTemperature: info.operating_temperature,
                    });
                } else {
                    message.error("ไม่พบข้อมูล");
                }
            } catch (error) {
                message.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [infoID]);

    const onFinish = async (values: any) => {
        const payload: InfoInterface = {
            line_number: values.lineNumber || "",
            location: values.location || "",
            from: values.from || "",
            to: values.to || "",
            drawing_number: values.drawingNumber || "",
            service: values.service || "",
            material: values.material || "",
            inservice_date: values.inServiceDate
                ? values.inServiceDate.toISOString()
                : new Date().toISOString(),
            pipe_size: values.pipeSize ? Number(values.pipeSize) : 0,
            original_thickness: values.originalThickness
                ? Number(values.originalThickness)
                : 0,
            stress: values.stress ? Number(values.stress) : 0,
            joint_efficiency: values.jointEfficiency
                ? Number(values.jointEfficiency)
                : 0,
            ca: values.ca ? Number(values.ca) : 0,
            design_life: values.designLife ? Number(values.designLife) : 0,
            design_pressure: values.designPressure
                ? Number(values.designPressure)
                : 0,
            operating_pressure: values.operatingPressure
                ? Number(values.operatingPressure)
                : 0,
            design_temperature: values.designTemperature
                ? Number(values.designTemperature)
                : 0,
            operating_temperature: values.operatingTemperature
                ? Number(values.operatingTemperature)
                : 0,
        };

        try {
            const res = await UpdateInfoById(infoID, payload);
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

    const handleDelete = async (id?: number) => {
        console.log("Deleting record id:", id);
        if (!id) return;
        try {
            const res = await DeleteInfo(id);
            if (res && (res.status === 200 || res.status === 204)) {
                if (onSuccess) onSuccess();
                messageApi.success("Delete successful!");
            } else {
                messageApi.error("Delete unsuccessful. Please try again.");
            }
        } catch (error) {
            message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
    };

    return (
        <>
            {contextHolder}
            <div className="pipe-form-container">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <div className="form-grid">
                        {/* Left column */}
                        <div className="form-column">
                            <Form.Item name="lineNumber" label="Line number" rules={[{ required: true, message: "Please enter the Line number" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="from" label="From" rules={[{ required: true, message: "Please enter the From" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="drawingNumber" label="Drawing number" rules={[{ required: true, message: "Please enter the Drawing number" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="material" label="Material" rules={[{ required: true, message: "Please enter the Material" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="pipeSize" label="Pipe size" rules={[{ required: true, message: "Please enter the Pipe size" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="stress" label="Stress" rules={[{ required: true, message: "Please enter the Stress" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="ca" label="CA" rules={[{ required: true, message: "Please enter the CA" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="designPressure" label="Design pressure" rules={[{ required: true, message: "Please enter the Design pressure" }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="designTemperature" label="Design temperature" rules={[{ required: true, message: "Please enter the Design temperature" }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </div>
                        <div className="form-column">
                            <Form.Item name="location" label="Location" rules={[{ required: true, message: "Please enter the Location" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="to" label="To" rules={[{ required: true, message: "Please enter the To" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="service" label="Service" rules={[{ required: true, message: "Please enter the Service" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="inServiceDate" label="Inservice date" rules={[{ required: true, message: "Please enter the Inservice date" }]}>
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="originalThickness" label="Original thickness" rules={[{ required: true, message: "Please enter the Original thickness" }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="jointEfficiency" label="Joint efficiency" rules={[{ required: true, message: "Please enter the Joint efficiency" }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="designLife" label="Design life" rules={[{ required: true, message: "Please enter the Design life." }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="operatingPressure" label="Operating pressure" rules={[{ required: true, message: "Please enter the Operating pressure." }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item name="operatingTemperature" label="Operating temperature" rules={[{ required: true, message: "Please enter the Operating temperature." }]}>
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </div>
                    </div>

                    <div className="form-submit">
                        <Button
                            danger
                            onClick={(e) => e.stopPropagation()} // ป้องกันการ trigger row click
                            className="buttom-delete"
                            style={{marginRight:"5px"}}
                        >
                            <Popconfirm
                                title="คุณต้องการลบ CML นี้หรือไม่?"
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    handleDelete(Number(infoID));
                                }}
                                onCancel={(e) => e?.stopPropagation()}
                                okText="Yes"
                                cancelText="No"
                            >
                                Delete
                            </Popconfirm>
                        </Button>
                        <Button type="primary" htmlType="submit" className="buttom-add">
                            Edit
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default PipeForm;
