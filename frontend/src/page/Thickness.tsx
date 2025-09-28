// src/pages/InfoTable.tsx
import React, { useEffect, useState } from "react";
import { Button, Space, Table, message, Modal, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, LeftOutlined } from "@ant-design/icons";
import type { ThicknessInterface } from "../interface/Thickness";
import { Listhickness, DeleteThickness } from "../services/https/Thickness";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TThicknessCreate from "../page/ThicknessCreate";
import TThicknessUpdate from "../page/ThicknessUpdate";
import "./dashbord.css"
import photo from "../assets/piping.png"

const ThicknessTable: React.FC = () => {
    const [dataSource, setDataSource] = useState<ThicknessInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedInfoId, setSelectedInfoId] = useState<string>("");
    const [messageApi, contextHolder] = message.useMessage();

    const fetchData = async () => {
        setLoading(true);
        const data = await Listhickness(id);

        if (data && Array.isArray(data)) {
            const formatted: ThicknessInterface[] = data.map((item: any, index: number) => ({
                id: item.id || index + 1,
                line_number: item.line_number,
                cml_number: item.cml_number,
                tp_number: item.tp_number,
                inspection_date: item.inspection_date,
                actual_thickness: item.actual_thickness,
            }));
            setDataSource(formatted);
        } else {
            message.error("ไม่สามารถดึงข้อมูลได้");
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);
    const showModal = (record: ThicknessInterface) => {
        setSelectedInfoId(record.id?.toString() || "");
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleBack = () => {
        navigate(-1);
    };

    const showAddModal = () => setIsAddModalOpen(true);
    const handleAddCancel = () => setIsAddModalOpen(false);

    // ฟังก์ชันลบ CML
    const handleDelete = async (id?: number) => {
        console.log("Deleting record id:", id);
        if (!id) return;
        try {
            const res = await DeleteThickness(id);
            if (res && (res.status === 200 || res.status === 204)) {
                messageApi.success("Delete successful!");
                fetchData(); // รีเฟรชตาราง
            } else {
                messageApi.error("Delete unsuccessful. Please try again.");
            }
        } catch (error) {
            message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
    };

    const columns = [
        {
            title: "InspectionDate", dataIndex: "inspection_date", key: "inspection_date", align: "center" as const, render: (value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US");
            },
        },
        { title: "ActualThickness", dataIndex: "actual_thickness", key: "actual_thickness", align: "center" as const },
        {
            title: "Action",
            key: "action",
            align: "center" as const,
            render: (_: any, record: ThicknessInterface) => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(record)} className="buttom-add">
                        Edit
                    </Button>
                    <Button
                        danger
                        onClick={(e) => e.stopPropagation()}
                        className="buttom-delete"
                    >
                        <Popconfirm
                            title="คุณต้องการลบ CML นี้หรือไม่?"
                            onConfirm={(e) => {
                                e?.stopPropagation();
                                handleDelete(record.id);
                            }}
                            onCancel={(e) => e?.stopPropagation()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ marginRight: 4 }} />
                            Delete
                        </Popconfirm>
                    </Button>
                </Space>
            ),
        },
    ];

    const handleSaveSuccess = () => {
        setIsAddModalOpen(false); // ปิด modal
        setIsModalOpen(false);
        fetchData(); // อัพเดทตาราง
    };

    return (
        <>
            <div style={{ margin: "16px" }} >
                {contextHolder}
                <div className="header">
                    <h1 className="Text-header">Thickness</h1>
                    <img src={photo} alt="photo" />
                </div>
                <div className="add-Back">
                    <div onClick={handleBack} style={{ marginBottom: 16 }} className="buttom-back">
                        <LeftOutlined />
                        Back to the Test Point page
                    </div>
                    <Button onClick={showAddModal} className="buttom-add">
                        Add Thickness
                    </Button>
                </div>
                <div className="body">
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: true }}
                        rowKey="id"
                    />
                </div>
                <Modal
                    title="Add Thickness"
                    open={isAddModalOpen}
                    onCancel={handleAddCancel}
                    footer={null}
                >
                    <TThicknessCreate onSuccess={handleSaveSuccess} />
                </Modal>
                <Modal
                    title="Edit Thickness"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    footer={null}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <TThicknessUpdate TsID={selectedInfoId} onSuccess={handleSaveSuccess} />
                </Modal>
            </div>
        </>
    );
};

export default ThicknessTable;
