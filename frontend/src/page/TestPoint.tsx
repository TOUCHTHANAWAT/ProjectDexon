import React, { useEffect, useState } from "react";
import { Button, Space, Table, message, Modal, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, FileSearchOutlined, LeftOutlined } from "@ant-design/icons";
import type { TestPointInterface } from "../interface/TestPoint";
import { ListTestPoint, DeleteTestPoint } from "../services/https/TestPoint";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import TestPointCreate from "../page/TestPointCreate";
import TestPointUpdate from "../page/TestPointUpdate";
import "./dashbord.css"
import photo from "../assets/piping.png"

const TestPointTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<TestPointInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInfoId, setSelectedInfoId] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const fetchData = async () => {
    setLoading(true);
    const data = await ListTestPoint(id);

    if (data && Array.isArray(data)) {
      const formatted: TestPointInterface[] = data.map((item: any, index: number) => ({
        id: item.id || index + 1,
        line_number: item.line_number,
        cml_number: item.cml_number,
        tp_number: item.tp_number,
        tp_description: item.tp_description,
        note: item.note,
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
  const showModal = (record: TestPointInterface) => {
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
    if (!id) return;
    try {
      const res = await DeleteTestPoint(id);
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
    { title: "TpNumber", dataIndex: "tp_number", key: "tp_number", align: "center" as const, },
    { title: "TpDescription", dataIndex: "tp_description", key: "tp_description", align: "center" as const, },
    { title: "Note", dataIndex: "note", key: "note", width: 300, align: "center" as const, },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: TestPointInterface) => (
        <Space>
          <Button icon={<FileSearchOutlined />} type="default"
            onClick={() => navigate(`/Thickness/${record.id}`)}
            className="buttom-detail"
          >
            View Thickness
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
              title="คุณต้องการลบ Test Point นี้หรือไม่?"
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
          <h1 className="Text-header">Test Point</h1>
          <img src={photo} alt="photo" />
        </div>
        <div className="add-Back">
          <div onClick={handleBack} style={{ marginBottom: 16 }} className="buttom-back">
            <LeftOutlined />
            Back to the CML page
          </div>
          <Button onClick={showAddModal} className="buttom-add">
            Add TP
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
          title="Add TP"
          open={isAddModalOpen}
          onCancel={handleAddCancel}
          footer={null}
        >
          <TestPointCreate onSuccess={handleSaveSuccess} />
        </Modal>
        <Modal
          title="Edit TP"
          closable={{ 'aria-label': 'Custom Close Button' }}
          footer={null}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <TestPointUpdate TPID={selectedInfoId} onSuccess={handleSaveSuccess} />
        </Modal>
      </div>
    </>
  );
};

export default TestPointTable;
