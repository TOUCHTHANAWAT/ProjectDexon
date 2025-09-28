import { Button, Card, Form, Input, message, Flex, Row, Col } from "antd";

// import { useNavigate } from "react-router-dom";

import { SignIn } from "../services/https";

import { type UserInterface } from "../interface/UserInterface";

import logo from "../assets/dacon_inspection_technologies_logo.jpg";

import "../App.css"
import bgImage from "../assets/backLogin.png";


function Login() {

  // const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();


  const onFinish = async (values: UserInterface) => {

    console.log(values.username);
    console.log(values.password);
    let res = await SignIn(values);


    if (res.status == 200) {

      messageApi.success("Sign-in successful");

      localStorage.setItem("isLogin", "true");

      localStorage.setItem("page", "dashboard");

      localStorage.setItem("token_type", res.data.token_type);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("id", res.data.id);

      setTimeout(() => {

        location.href = "/";

      }, 2000);

    } else {

      messageApi.error(res.data.error);

    }

  };


  return (

    <>

      {contextHolder}

      <Flex justify="center" align="center" className="login"
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >

        <Card className="card-login">

          <Row align={"middle"} justify={"center"} >

            <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

              <img

                alt="logo"
                style={{ color: "green", alignItems: "center" }}

                src={logo}

                className="images-logo"

              />

            </Col>

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>

              <Form

                name="basic"

                onFinish={onFinish}

                autoComplete="off"

                layout="vertical"

              >

                <Form.Item

                  label="Username"

                  name="username"

                  rules={[

                    { required: true, message: "Please input your username!" },

                  ]}
                   className="text-login"

                >

                  <Input />

                </Form.Item>


                <Form.Item

                  label="Password"

                  name="password"

                  rules={[

                    { required: true, message: "Please input your password!" },

                  ]}
                  className="text-login"
                >

                  <Input.Password />

                </Form.Item>


                <Form.Item>

                  <Button

                    type="primary"

                    htmlType="submit"

                    className="login-form-button buttom-add"

                    style={{ marginBottom: 20 }}

                  >

                    Log in

                  </Button>


                </Form.Item>

              </Form>

            </Col>

          </Row>

        </Card>

      </Flex>

    </>

  );

}


export default Login;