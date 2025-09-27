import React, { useEffect, useState } from "react";
import { Button, Space, Table, message, Modal } from "antd";
import { EditOutlined, FileSearchOutlined } from "@ant-design/icons";
import type { InfoInterface } from "../interface/Info";
import { ListInfo } from "../services/https/Info";
import { useNavigate } from "react-router-dom";
import InfoCreate from "../page/InfoCreate";
import InfoUpdate from "../page/InfoUpdate";
import "./dashbord.css"
import photo from "../assets/piping.png"

const InfoTable: React.FC = () => {
  const [dataSource, setDataSource] = useState<InfoInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInfoId, setSelectedInfoId] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    const data = await ListInfo();

    if (data && Array.isArray(data)) {
      const formatted: InfoInterface[] = data.map((item: any, index: number) => ({
        id: item.id || index + 1,
        line_number: item.line_number,
        location: item.location,
        from: item.from,
        to: item.to,
        drawing_number: item.drawing_number,
        service: item.service,
        material: item.material,
        inservice_date: item.inservice_date
          ? new Date(item.inservice_date).toLocaleDateString()
          : undefined,
        pipe_size: item.pipe_size,
        original_thickness: item.original_thickness,
        stress: item.stress,
        joint_efficiency: item.joint_efficiency,
        ca: item.ca,
        design_life: item.design_life,
        design_pressure: item.design_pressure,
        operating_pressure: item.operating_pressure,
        design_temperature: item.design_temperature,
        operating_temperature: item.operating_temperature,
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
  const showModal = (record: InfoInterface) => {
    setSelectedInfoId(record.id?.toString() || "");
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showAddModal = () => setIsAddModalOpen(true);
  const handleAddCancel = () => setIsAddModalOpen(false);

  const columns = [
    { title: "Line Number", dataIndex: "line_number", key: "line_number", align: "center" as const, },
    { title: "Location", dataIndex: "location", key: "location", align: "center" as const, },
    { title: "From", dataIndex: "from", key: "from", align: "center" as const, },
    { title: "To", dataIndex: "to", key: "to", align: "center" as const, },
    { title: "Pipe Size", dataIndex: "pipe_size", key: "pipe_size", align: "center" as const, },
    { title: "Service", dataIndex: "service", key: "service", align: "center" as const, },
    { title: "Material", dataIndex: "material", key: "material", align: "center" as const, },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: any, record: InfoInterface) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />} onClick={() => showModal(record)} className="buttom-add">
            Info
          </Button>
          <Button
            icon={<FileSearchOutlined />}
            onClick={() => navigate(`CML/${record.id}`)}
            className="buttom-detail"
          >
            Detail
          </Button>
        </Space>
      ),
    }
  ];
  const handleSaveSuccess = () => {
    setIsAddModalOpen(false); // ปิด modal
    setIsModalOpen(false);
    fetchData(); // อัพเดทตาราง
  };

  return (
    <>
      <div style={{ margin: "16px" }} >
        <div className="header">
          <h1 className="Text-header">Piping</h1>
          <img src={photo} alt="photo" />
        </div>
        <div className="btn-add-wrapper">
          <Button onClick={showAddModal} className="buttom-add">
            Add Piping
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
          title="Add Piping"
          open={isAddModalOpen}
          onCancel={handleAddCancel}
          footer={null}
          className="custom-modal"
          width={1000}
        >
          <InfoCreate onSuccess={handleSaveSuccess} />
        </Modal>
        <Modal
          title="Piping Information"
          closable={{ 'aria-label': 'Custom Close Button' }}
          footer={null}
          className="custom-modal"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={1000}
        >
          <InfoUpdate infoID={selectedInfoId} onSuccess={handleSaveSuccess} />
        </Modal>
      </div>
    </>
  );
};

export default InfoTable;
