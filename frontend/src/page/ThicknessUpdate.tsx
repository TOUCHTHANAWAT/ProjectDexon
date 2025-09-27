import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Spin, DatePicker } from "antd";
import "./InfoCreate.css";
import type { ThicknessInterface } from "../interface/Thickness";
import { GetThicknessByID, UpdateThicknessById } from "../services/https/Thickness"; // สร้าง API update
import dayjs from "dayjs";

interface PipeFormProps {
    TsID: string;
    onSuccess?: () => void;
}

const CMLUpdate: React.FC<PipeFormProps> = ({ TsID, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await GetThicknessByID(TsID);
                console.log(res)
                if (res) {
                    const info: ThicknessInterface = res;
                    form.setFieldsValue({
                        inspectionDate: info.inspection_date ? dayjs(info.inspection_date) : null,
                        actualThickness: info.actual_thickness,
                    });
                } else {
                    message.error("ไม่พบข้อมูล Thickness");
                }
            } catch (error) {
                message.error("เกิดข้อผิดพลาดในการดึงข้อมูล Thickness");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [TsID]);

    const onFinish = async (values: any) => {
        const payload: ThicknessInterface = {
            inspection_date: values.inspectionDate ? values.inspectionDate.format("YYYY-MM-DD") : "",
            actual_thickness: values.actualThickness ?? "",
        };

        try {
            const res = await UpdateThicknessById(TsID, payload);
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
                    <Form.Item name="inspectionDate" label="Inspection Date" rules={[{ required: true, message: "Please enter the Inspection Date" }]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="actualThickness" label="Actual Thickness" rules={[{ required: true, message: "Please enter the Actual Thickness" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <div className="form-submit">
                        <Button type="primary" htmlType="submit" className="buttom-add">Edit Thickness</Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default CMLUpdate;
