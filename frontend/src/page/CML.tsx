// src/pages/InfoTable.tsx
import React, { useEffect, useState } from "react";
import { Button, Space, Table, message, Modal, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, FileSearchOutlined, LeftOutlined } from "@ant-design/icons";
import type { CMLInterface } from "../interface/CML";
import { ListCML, DeleteCML } from "../services/https/CML";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CMLCreate from "../page/CMLCreate";
import CMLUpdate from "../page/CMLUpdate";
import "./dashbord.css"
import photo from "../assets/piping.png"

const CMLTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<CMLInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInfoId, setSelectedInfoId] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    const data = await ListCML(id);

    if (data && Array.isArray(data)) {
      const formatted: CMLInterface[] = data.map((item: any, index: number) => ({
        id: item.id || index + 1,
        line_number: item.line_number,
        cml_number: item.cml_number,
        cml_description: item.cml_description,
        actual_outside_diameter: item.actual_outside_diameter,
        design_thickness: item.design_thickness,
        structural_thickness: item.structural_thickness,
        required_thickness: item.required_thickness,
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

  // ฟังก์ชันลบ CML
  const handleDelete = async (id?: number) => {
    console.log("Deleting record id:", id);
    if (!id) return;
    try {
      const res = await DeleteCML(id);
      if (res && (res.status === 200 || res.status === 204)) {
        messageApi.success("Delete successful!");
        fetchData();
      } else {
        messageApi.error("Delete unsuccessful. Please try again.");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };
  const showModal = (record: CMLInterface) => {
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
    navigate(-1); // -1 หมายถึงกลับไปหน้าก่อนหน้า
  };

  const showAddModal = () => setIsAddModalOpen(true);
  const handleAddCancel = () => setIsAddModalOpen(false);


  const columns = [
    { title: "CmlNumber", dataIndex: "cml_number", key: "cml_number",align: "center" as const, },
    { title: "Cml Description", dataIndex: "cml_description", key: "cml_description" ,align: "center" as const,},
    { title: "Actual Outside Diameter", dataIndex: "actual_outside_diameter", key: "actual_outside_diameter",align: "center" as const, },
    { title: "Design Thickness", dataIndex: "design_thickness", key: "design_thickness", render: (value: number) => value.toFixed(2) ,align: "center" as const,},
    { title: "Structural Thickness", dataIndex: "structural_thickness", key: "structural_thickness",align: "center" as const, },
    { title: "Required Thickness", dataIndex: "required_thickness", key: "required_thickness", render: (value: number) => value.toFixed(2) ,align: "center" as const,},
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: CMLInterface) => (
        <Space>
          <Button
            icon={<FileSearchOutlined />}
            type="default"
            onClick={() => navigate(`/TestPoint/${record.id}`)}
            className="buttom-detail"
          >
            View TP
          </Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(record)} className="buttom-add">
            Edit
          </Button>
          <Button
            danger
            onClick={(e) => e.stopPropagation()} // ป้องกันการ trigger row click
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
    setIsAddModalOpen(false);
    setIsModalOpen(false);
    fetchData();
  };

  return (
    <>
      <div style={{ margin: "16px" }} >
        {contextHolder}
             <div className="header">
        <h1 className="Text-header">Piping</h1>
        <img src= {photo} alt="photo" />
        </div>
        <div className="add-Back">
          <div onClick={handleBack} style={{ marginBottom: 16 }} className="buttom-back">
            <LeftOutlined />
            Back to the Piping page
          </div>
          <Button onClick={showAddModal} className="buttom-add">
            Add CML
          </Button>
        </div>
        <div className="body">
          <h1>Line Number: {dataSource.length > 0 ? dataSource[0].line_number : ""}</h1>
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
          title="Add CML"
          open={isAddModalOpen}
          onCancel={handleAddCancel}
          footer={null}
          className="custom-modal"
          width={1000}
        >
          <CMLCreate onSuccess={handleSaveSuccess} />
        </Modal>

        <Modal
          title="Edit CML "
          closable={{ 'aria-label': 'Custom Close Button' }}
          footer={null}
          open={isModalOpen}
          className="custom-modal"
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
        >
          <CMLUpdate cmlID={selectedInfoId} onSuccess={handleSaveSuccess} />
        </Modal>
      </div>
    </>
  );
};

export default CMLTable;
