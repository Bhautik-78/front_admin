import React, {useEffect, useState} from "react";
import {Row, Col, Card, Form, Input, message, Button, Table, Popconfirm,Spin} from 'antd';
import {Collapse,} from 'reactstrap';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import {UserOutlined, MailOutlined, ContactsOutlined,} from '@ant-design/icons';
import axios from "axios";
import appConfig from "../../config";
import {editAccount,CreateAccount,getAccount,deleteAccount} from "../../actions/Accounts"
import {ManualEntry} from "../../actions/Manual";
message.config({top: 50});

const Accounts = () => {
  const[loading,setLoading] =useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [collapseModalName, setCollapseModalName] = useState({});
  const [accountList, setAccountList] = useState([]);
  const [collapse, setCollapse] = useState(false);

  const DeleteText = 'Are you sure to delete this Accounts?';
  const EditText = 'Are you sure to edit this Accounts?';

  useEffect(() => {
    getAccounts()
  }, []);

  const handleChange = e => {
    const {name, value} = e.target;
    setUserDetail({...userDetail, [name]: value})
  };

  const createAccounts = async () => {
    if (userDetail && userDetail._id) {
      setLoading(true);
      const res = await editAccount(userDetail);
      if (res && res.data) {
        setCollapse(false);
        setLoading(false);
        message.success("Account Edit Successfully");
        getAccounts()
      }else {
        setLoading(false);
        message.error("Please enter valid data..")
      }
    } else {
      setLoading(true);
      const res = await CreateAccount(userDetail);
      if (res && res.data) {
        setLoading(false);
        message.success("Successfully Account Created");
        setCollapse(false);
        setUserDetail({});
        getAccounts()
      }else {
        setLoading(false);
        message.error("Please enter valid data..")
      }
    }
  };

  const getAccounts = async () => {
    setLoading(true);
    const res = await getAccount();
    if (res && res.data) {
      setLoading(false);
      setAccountList(res.data)
    }else {
      setLoading(false);
      message.error("Please enter valid data..")
    }
  };

  const confirmDeleteAccounts = async (id) => {
    const deleteId = (id._id);
    setLoading(true);
    const res = await deleteAccount(deleteId);
    if (res && res.data) {
      setLoading(false);
      getAccounts()
      message.success("Account Delete Successfully")
    }else {
      setLoading(false);
      message.error("Please enter valid data..")
    }
  };

  const confirmEditAccounts = (data) => {
    setUserDetail(data);
    setCollapse(true);
    setCollapseModalName({title: "Edit Account", title2: "Edit Account", title3: "Edit Account", title4: "Cancel"})
  };

  const AccountsButton = () => {
    setCollapse(!collapse);
    setUserDetail({});
    setCollapseModalName({title: "Add Account", title2: "create Account", title3: "Create Account", title4: "Cancel"})
  };

  const onSignIn = async (record) => {
    let result = {};
    try {
      localStorage.setItem('AccountId', record._id);
      const res = await axios.get(`${appConfig.appAuth}/${record._id}`);
      if (res && res.data) {
        window.location.href = res.data;
      }
    } catch (err) {
      console.log("error in getting entities : ", err)
    }
    return result
  };

  const onManualButton = async () => {
    if(accountList && accountList.length) {
      const accountId = accountList.map(x => x._id)
      const account = Object.assign({}, accountId)
      const res = await ManualEntry(accountId);
      if (res && res.data) {
        message.success("Success")
      } else {
        message.error("something went wrong")
      }
    }
  };

  const columns = [
    {
      title: 'Account Name',
      dataIndex: 'accountName',
    },
    {
      title: 'Account Id',
      dataIndex: '_id',
    },
    {
      title: 'Email',
      ellipsis: true,
      dataIndex: 'email',
    },
    {
      title: 'Client Id',
      ellipsis: true,
      dataIndex: 'clientId',
    },
    {
      title: 'Secret Key',
      ellipsis: true,
      dataIndex: 'secretKey',
    },
    {
      title: 'LoginCustomerId',
      ellipsis: true,
      dataIndex: 'loginCustomerId',
    },
    {
      title: 'Sign With',
      render: (record) => {
        return (
          <span>
            <p type="button" className="btn btn-primary" onClick={() => onSignIn(record)}>Login With Google</p>
          </span>
        )
      }
    },
    {
      title: 'Action',
      render: (record) => {
        return (
          <span>
              <Popconfirm
                placement="bottomLeft"
                title={EditText}
                onConfirm={() => {
                  confirmEditAccounts(record)
                }}
                okText="Yes"
                cancelText="No"
              >
            <CreateIcon/>
              </Popconfirm>
            <Popconfirm
              placement="bottomLeft"
              title={DeleteText}
              onConfirm={() => {
                confirmDeleteAccounts(record)
              }}
              okText="Yes"
              cancelText="No"
            >
            <DeleteIcon/>
            </Popconfirm>
          </span>
        )
      }

    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <button type="button" className="btn btn-primary float-md-right Exports" onClick={onManualButton}>Manual Entry</button>
        <button type="button" className="btn btn-primary float-md-right Exports" onClick={AccountsButton}>Add Account</button>
      <Collapse isOpen={collapse} id="collapseExample">
        <Row>
          <Col span={8}/>
          <Col span={8}>
            <Card className="cardtop">
              <h1 className="h2login">{collapseModalName.title}</h1>
              <Form>
                <Form.Item>
                  <label><b>Account Name</b></label>
                  <Input name="accountName" value={userDetail.accountName} onChange={handleChange}
                         placeholder="Enter Account Name" addonBefore={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <label><b>Email</b></label>
                  <Input name="email" value={userDetail.email} onChange={handleChange}
                         placeholder="Enter Email" addonBefore={<MailOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <label><b>Client Id</b></label>
                  <Input name="clientId" value={userDetail.clientId} onChange={handleChange}
                         placeholder="Enter Client Id" addonBefore={<UserOutlined/>}/>
                </Form.Item>

                <Form.Item>
                  <label><b>Secret Key</b></label>
                  <Input name="secretKey" value={userDetail.secretKey} onChange={handleChange}
                         placeholder="Enter Secret key" addonBefore={<ContactsOutlined/>}/>
                </Form.Item>

                <Form.Item>
                  <label><b>Devlop Token</b></label>
                  <Input name="devlopToken" value={userDetail.devlopToken} onChange={handleChange}
                         placeholder="Enter Devlop token" addonBefore={<ContactsOutlined/>}/>
                </Form.Item>

                <Form.Item>
                  <label><b>CallBack</b></label>
                  <Input name="callBack" value={userDetail.callBack} onChange={handleChange}
                         placeholder="Enter Call back" addonBefore={<ContactsOutlined/>}/>
                </Form.Item>

                <Form.Item>
                  <label><b>Login Customer Id</b></label>
                  <Input name="loginCustomerId" value={userDetail.loginCustomerId} onChange={handleChange}
                         placeholder="Enter Login Customer Id" addonBefore={<ContactsOutlined/>}/>
                </Form.Item>

                <Form.Item>
                  <Button className="btn-md buttonsubmitlogin" htmlType="submit"
                          onClick={createAccounts}
                          type="primary"
                          size={"large"}>
                    {collapseModalName.title3}
                  </Button>
                  <Button className="btn-md buttonsubmitlogin Cancel" htmlType="submit"
                          onClick={() => setCollapse(false)}
                          type="primary"
                          size={"large"}>
                    {collapseModalName.title4}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={8}/>
        </Row>
      </Collapse>
      <Table columns={columns} dataSource={accountList || []} size="middle"/>
      </Spin>
    </div>
  );
};
export default Accounts;
