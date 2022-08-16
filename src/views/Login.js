import React, {useState} from 'react';
import {UserOutlined, LockOutlined} from "@ant-design/icons";
import {Row, Col, Card, message, Form, Input, Button} from 'antd';
import axios from "axios";
import appConfig from "../config";

const Login = (props) => {

  const [userDetail, setUserDetail] = useState({});

  const handleChange = e => {
    const {name, value} = e.target;
    setUserDetail({...userDetail, [name]: value})
  };

  const LogIn = () => {
    if (userDetail.email && userDetail.password !== null) {
      axios.post('http://localhost:8000/auth/signin', userDetail, )
        .then(res => {
          if (res && res.data && res.data.token) {
            message.success("Successfully login")
            localStorage.setItem("token", res.data.token)
            props.history.push("/");
          } else {
            message.error("User not Found Or User Is Not Active")
          }
        })
        .catch(error => {
          message.error("Please enter valid data..")
        })
    } else {
      message.error("Please Fill Details")
    }
  };

  const signUp = () =>  {
    props.history.push("/signUp");
  };

  return (
    <>
      <Row className="row-class">
        <Col span={8}/>
        <Col span={4}>
          <Card className="login-card" bordered={true}>
            <h2 className="title">Log In</h2>
            <Form name="basic" initialValues={{remember: true}}>
              <Form.Item>
                <Input
                  placeholder="E-mail"
                  name="email"
                  value={userDetail.email}
                  onChange={handleChange}
                  addonBefore={<UserOutlined/>}
                />
              </Form.Item>
              <Form.Item>
                <Input.Password
                  placeholder="Password"
                  name="password"
                  value={userDetail.password}
                  onChange={handleChange}
                  addonBefore={<LockOutlined/>}
                />
                <span className="red"> </span>
              </Form.Item>
              <Form.Item>
                <Button
                  className="btn-md custom-btn"
                  type="button"
                  htmlType="submit"
                  onClick={LogIn}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={4}>
          <Card className="register-card" bordered={false}>
            <h2 className="signup-text">Sign up</h2>
            <p className="signup-text">New customer? Start here.</p>
            <a>
              <button className="custom-btn btn" onClick={signUp} type="button">Register Now
              </button>
            </a>
          </Card>
        </Col>
        <Col span={8}/>
      </Row>
    </>
  );
}

export default Login;
