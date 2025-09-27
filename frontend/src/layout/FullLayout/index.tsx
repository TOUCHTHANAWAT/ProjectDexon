import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import {
  DashboardOutlined, LoginOutlined
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, message } from "antd";
import logo from "../../assets/dacon_inspection_technologies_logo.jpg";
import Dashboard from "../../page/dashbord";
import "../../layout/FullLayout/sidebar.css";
import CML from "../../page/CML";
import TestPoint from "../../page/TestPoint";
import Thickness from "../../page/Thickness";

const { Content, Sider } = Layout;
// const { SubMenu } = Menu;

const FullLayout: React.FC = () => {
  const page = localStorage.getItem("page");
  // const location = useLocation();

  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 1500);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="custom-sider"
        width={175}
      >
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={[page ? page : "dashboard"]}
          selectedKeys={[page ? page : "dashboard"]}
        >
          <Menu.Item
            key="dashboard"
            onClick={() => setCurrentPage("dashboard")}
            icon={<DashboardOutlined />}
          >
            <Link to="/">Piping</Link>
          </Menu.Item>

          <Menu.Item
            key="logout"
            onClick={Logout}
            icon={<LoginOutlined />}
            style={{ marginTop: "auto", color: "#fff", backgroundColor: "#eb124f" }}
          >
            Logout
          </Menu.Item>
        </Menu>

        {/* <Button onClick={Logout} className="logout-button">
          <LoginOutlined />
          Logout
        </Button> */}
      </Sider>

      <Layout>
        <Content >
          <Breadcrumb >
          </Breadcrumb>

          <div
          // style={{
          //   padding: 24,
          //   minHeight: "100%",
          //   background: colorBgContainer,
          // }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/CML/:id" element={<CML />} />
              <Route path="/TestPoint/:id" element={<TestPoint />} />
              <Route path="/Thickness/:id" element={<Thickness />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FullLayout;
