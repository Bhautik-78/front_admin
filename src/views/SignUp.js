import React, {useState} from "react";
import axios from "axios";
import {Row, Col, Card, Form, Input, Button, message} from 'antd';
import {UserOutlined, MailOutlined, LockOutlined} from '@ant-design/icons';

const SignUp = (props) => {
  const [userDetail, setUserDetail] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  const [errors,setError] = useState({});

  const handleChange = e => {
    const {name, value} = e.target;
    setUserDetail({...userDetail, [name]: value})
  }

  const validation = (name, value) => {
    switch (name) {
      case 'displayName':
        if (!value) {
          return "Please Enter First Name!!";
        } else {
          return "";
        }
      case 'email':
        if (!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
          return "please Enter valid email";
        } else {
          return "";
        }
      case 'password':
        if (value.length < 8) {
          return "Please Enter Valid Password";
        } else {
          return "";
        }
    }
  }

  const submitValue = () => {
    let allErrors = {};

    const userData = {
      displayName: userDetail.displayName,
      email: userDetail.email,
      password: userDetail.password
    };

    Object.keys(userData).forEach(key => {
      const error = validation(key, userData[key]);
      if (error && error.length) {
        allErrors[key] = error;
      }
    });

    if (Object.keys(allErrors).length) {
      return setError(allErrors)
    } else {
      userDetail.isActive = true;
      axios.post('http://localhost:8000/auth/signup', userDetail)
        .then(res => {
          if(res && res.data) {
            message.success("Successfully Registered")
            props.history.push("/login")
          }
        })
        .catch(error => {
          console.log("Please enter valid data..")
        })
    }
  };

  return (
    <>
      <Row>
        <Col span={8}/>
        <Col span={8}>
          <Card className="signup-card-header">
            <h1 className="title">Register</h1>
            <p><b>Create your account</b></p>
            <Form>
              <Form.Item>
                <Input
                  name="displayName"
                  value={userDetail.displayName}
                  onChange={handleChange}
                  placeholder="Enter Your Display name"
                  addonBefore={<UserOutlined/>}
                />
                <span className="validation">{errors.displayName}</span>
              </Form.Item>
              <Form.Item>
                <Input
                  name="email"
                  value={userDetail.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  addonBefore={<MailOutlined/>
                  }/>
                <span className="validation">{errors.email}</span>
              </Form.Item>
              <Form.Item>
                <Input.Password
                  name="password"
                  value={userDetail.password}
                  onChange={handleChange}
                  addonBefore={(< LockOutlined/>)}
                  placeholder="Enter Your Password"
                />
                <span className="validation">{errors.password}</span>
              </Form.Item>
              <Form.Item>
                <Button
                  className="btn-md custom-btn"
                  onClick={submitValue}
                  type="primary"
                  size={"large"}
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={8}/>
      </Row>
    </>
  );
};

export default SignUp;
