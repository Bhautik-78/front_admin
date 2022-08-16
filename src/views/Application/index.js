import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Input, message, Popconfirm, Row, Select, Spin, Switch, Table} from "antd";
import axios from "axios";
import appConfig from "../../config";
import {createApplication, getApps,DeleteApplication,updateApplication} from "../../actions/Application";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import {UserOutlined} from "@ant-design/icons";
import {Collapse} from "reactstrap";
import {updateCampaignCriterion} from "../../actions";
message.config({top: 50});

const Application = () => {

  const [applicationDetail, setApplicationDetail] = useState({});
  const [collapse, setCollapse] = useState(false);
  const [collapseModalName, setCollapseModalName] = useState({});
  const [loading, setLoading] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [detail, setDetail] = useState({});
  const [data,setData] = useState([]);
  const DeleteText = 'Are you sure to delete this Application?';
  const EditText = 'Are you sure to edit this Application?';

  useEffect(() => {
    getCustomers()
  },[])

  const getCustomers = () => {
    const accId = localStorage.getItem('AccountId');
    setLoading(true);
    axios.post(`${appConfig.appUrl}/customers/get`, {accountId: accId}, {
      headers: {
        Authorization: `${appConfig.token}`
      }
    })
      .then(res => {
        setLoading(false);
        if (res && res.data && res.data.length > 0) {
          const response = res.data;
          setCustomersList(response)
        }
      })
      .catch(error => {
        setLoading(false);
        console.log("Please enter valid data..")
      })
  };

  const getApplicattion = async () => {
    if(detail.custId){
      const {custId} = detail
      const payload = {custId : custId}
      const res = await getApps(payload)
      if (res && res.data) {
        const data =[];
        res.data.forEach(item=> {
          if(item.custId){
            data.push({
              custId: item.custId,
              appId : item.appId,
              appName : item.appName,
              status : item.status,
              _id : item._id
            })
          }
        })
        setData(data);
        setLoading(false);
        // handleLoadData()
        message.success("Successfully Updated")
      } else {
        setLoading(false);
        message.error("something went wrong")
      }
    }
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setDetail({...detail, [name]: value})
  };

  const handleChange1 = (e) => {
    const {name, value} = e.target;
      setApplicationDetail({...applicationDetail, [name]: value})
  };

  const handleAddData = async () => {
    setLoading(true);
    const res = await createApplication(detail);
    if (res && res.data) {
      setLoading(false);
      getApplicattion()
      // handleLoadData()
      message.success("Successfully Updated")
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const confirmDeleteApplication = async (id) => {debugger
    const deleteId = (id._id);
    setLoading(true);
    const res = await DeleteApplication(deleteId);
    if (res && res.data) {
      setLoading(false);
      getApplicattion()
      message.success("Account Delete Successfully")
    }
  };

  const confirmEditApplication = (data) => {
    setApplicationDetail(data);
    setCollapse(true);
    setCollapseModalName({
      title: "Edit Application",
      title2: "Edit Application",
      title3: "Edit Application",
      title4: "Cancel"
    })
  };

  const createGeoTargetConstant = () => {
    updateDetails()
  };

  const ToggleActivity = (record, index) => {debugger
    const isActive = data[index].status;
    if (isActive === "active") {
      data[index].status = 'inactive';
      updateStatus(data[index])
    } else {
      data[index].status = 'active';
      updateStatus(data[index])
    }
  };

  const updateStatus =async (record) => {
    setLoading(true);
    const res = await updateApplication(record);
    if (res && res.data) {
      setLoading(false);
      message.success("Campaign Criterion Edit Successfully");
      getApplicattion()
    }
  };

  const updateDetails = async () => {
    setLoading(true);
    const res = await updateApplication(applicationDetail);
    if (res && res.data) {
      setLoading(false);
      setCollapse(false);
      message.success("Campaign Criterion Edit Successfully");
      getApplicattion()
    }
  };

  const columns = [
    {
      title: 'Cust ID',
      dataIndex: 'custId',
    },
    {
      title: 'App ID',
      dataIndex: 'appId',
      ellipsis: true,
    },
    {
      title: 'App Name',
      dataIndex: 'appName',
    },
    {
      title: 'Status',
      render: (record, data, index) => {
        return (
          <span>
          <Switch defaultChecked checked={record.status === "active"} size='small' onClick={() => {
            ToggleActivity(record, index)
          }}/>
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
                  confirmEditApplication(record)
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
                confirmDeleteApplication(record)
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

  return(
    <div>
      <Spin spinning={loading}>
        <button type="button" className="btn btn-primary float-md-right Exports" onClick={handleAddData}
                disabled={!detail.custId}>Add Application
        </button>
        <button type="button" className="btn btn-primary float-md-right Exports" onClick={getApplicattion}
                disabled={!detail.custId}>Load Application
        </button>

        <Collapse isOpen={collapse} id="collapseExample">
          <Row>
            <Col span={8}/>
            <Col span={8}>
              <Card className="cardtop">
                <h2 className="h2login">{collapseModalName.title}</h2>
                <Form>
                  <Form.Item>
                    <label><b>Cust Id</b></label>
                    <Input name="custId" onChange={handleChange1} value={applicationDetail.custId}
                           placeholder="Enter Cust Id" addonBefore={<UserOutlined/>}/>
                  </Form.Item>
                  <Form.Item>
                    <label><b>App Name</b></label>
                    <Input name="appName" onChange={handleChange1}
                           value={(applicationDetail.appName) || ""}
                           placeholder="Enter App Name" addonBefore={<UserOutlined/>}/>
                  </Form.Item>
                  <Form.Item>
                    <label><b>APP ID</b></label>
                    <Input name="appId" onChange={handleChange1}
                           value={(applicationDetail.appId) || ""}
                           placeholder="Enter APP ID" addonBefore={<UserOutlined/>}/>
                  </Form.Item>
                  <Form.Item>
                    <Button className="btn-md buttonsubmitlogin" htmlType="submit"
                            onClick={createGeoTargetConstant}
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
        </Collapse><br/><br/>

      <Select defaultValue="Select Customer " className="customersDropdown"
              onChange={value => handleChange({target: {name: "custId", value}})}>
        <Select.Option value='all'>All Customers</Select.Option>
        {customersList.map(items => (
          <Select.Option key={items.customerName} value={items.customerId}>{items.customerName}</Select.Option>
        ))}
      </Select>
        <Input placeholder="Enter Your AppId" name="appId" style={{width: "20%"}}
               value={detail.appId || ''}
               onChange={handleChange}/>
        <Input placeholder="Enter Your AppName" name="appName" style={{width: "20%"}}
               value={detail.appName || ''}
               onChange={handleChange}/><br/><br/>

        <Table scroll={{x: true}} columns={columns} dataSource={data || []} size="middle"/>
      </Spin>
    </div>
  )
};

export default Application;
