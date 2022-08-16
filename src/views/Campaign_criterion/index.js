import React, {useEffect, useState} from 'react';
import {Collapse} from "reactstrap";
 import {Button, Card, Col, Form, Input, message, Popconfirm, Row, Table,Spin, Switch, Select} from "antd";
import {UserOutlined, SearchOutlined} from "@ant-design/icons";
import axios from "axios";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import appConfig from "../../config";
import {updateCampaignCriterion,DeleteCampaignCriterion,getCampaignCriterion,fetchCriterion} from "../../actions";
import {getApps} from "../../actions/Application";
message.config({top: 50});

const Campaign_criterion = () => {
  const [loading, setLoading] = useState(false);
  const [duplicate, setDuplicate] = useState([]);
  const [campaignCriterionList, setCampaignCriterionList] = useState([]);
  const [fixList, setFixList] = useState([]);
  const [campaignCriterionDetail, setCampaignCriterionDetail] = useState({});
  const [custName, setCustName] = useState({});
  const [collapse, setCollapse] = useState(false);
  const [collapseModalName, setCollapseModalName] = useState({});
  const [customersList, setCustomersList] = useState([]);
   const [searchDetail, setSearchDetail] = useState({});
  const [appId, setAppId] = useState('');
  const [campName, setCampName] = useState('');
  const [data, setData] =useState([]);
  const DeleteText = 'Are you sure to delete this Campaign Criterion?';
  const EditText = 'Are you sure to edit this Campaign Criterion?';

  useEffect(() => {
    getCustomers()
   }, [custName]);

  const handleChange = (e, set, location) => {
    const {name, value} = e.target;
    if (!set) {
      setCampaignCriterionDetail({...campaignCriterionDetail, [name]: value})
    } else if (!location) {
      setCampaignCriterionDetail({...campaignCriterionDetail, [set]: {...campaignCriterionDetail[set], [name]: value}})
    } else {
      setCampaignCriterionDetail({
        ...campaignCriterionDetail,
        [set]: {...campaignCriterionDetail[set], [location]: {...campaignCriterionDetail[set][location], [name]: value}}
      })
    }
  };

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

  const updateDetails = async () => {
    setLoading(true);
    const res = await updateCampaignCriterion(campaignCriterionDetail);
    if (res && res.data) {
      setLoading(false);
      setCollapse(false);
      message.success("Campaign Criterion Edit Successfully");
      handleLoadData()
    }
  };

  const updateStatus =async (record) => {
    setLoading(true);
    const res = await updateCampaignCriterion(record);
         if (res && res.data) {
           setLoading(false);
          message.success("Campaign Criterion Edit Successfully");
          handleLoadData()
        }
      };

  const confirmDeleteCampaignCriterion = async (id) => {
    const deleteId = (id._id);
    setLoading(true);
    const res = await DeleteCampaignCriterion(deleteId);
        if (res && res.data) {
          setLoading(false);
          handleLoadData();
          message.success("Account Delete Successfully")
        }
  };

  const confirmEditCampaignCriterion = (data) => {
    setCampaignCriterionDetail(data);
    setCollapse(true);
    setCollapseModalName({
      title: "Edit Campaign Criterion",
      title2: "Edit Campaign Criterion",
      title3: "Edit Campaign Criterion",
      title4: "Cancel"
    })
  };

  const createGeoTargetConstant = () => {
    updateDetails()
  };

  const handleLoadData = async () => {
    setLoading(true);
    const {custId, appId} = custName;
    let query = {};
    if (custId !== 'all') {
      query = {custId: custId, appId: appId}
    } else if (custId === 'all') {
      query = {}
    }
    const res = await getCampaignCriterion(query);
        if (res && res.data) {
          setLoading(false);
          setCampaignCriterionList(res.data);
          setFixList(res.data)
        }
  };

  const handleFetchData = async () => {
    setCampaignCriterionList([]);
    const {custId} = custName;
    // const {custId} = 7014551448
    setLoading(true);
    const res = await fetchCriterion(custId);
        if (res && res.data && res.data.success) {
          setLoading(false);
          handleLoadData()
          message.success("Successfully Updated")
        } else {
          setLoading(false);
          message.error("something went wrong")
        }
      };

  const ToggleActivity = (record, index) => {
    const isActive = campaignCriterionList[index].status;
    if (isActive === "active") {
      campaignCriterionList[index].status = 'inactive';
      updateStatus(campaignCriterionList[index])
    } else {
      campaignCriterionList[index].status = 'active';
      updateStatus(campaignCriterionList[index])
    }
  };

  const columns = [
    {
      title: 'Camp Id',
      dataIndex: ['campaign', 'id'],
    },
    {
      title: 'APP ID',
      dataIndex: ['campaign', 'app'],
      ellipsis: true,
    },
    {
      title: 'Camp Name',
      dataIndex: ['campaign', 'name'],
    },
    {
      title: 'Country Name',
      dataIndex: ['campaign_criterion', "location", 'countryName'],
    },
    // {
    //   title: 'Country Code',
    //   dataIndex: ['campaign_criterion', "location", 'countryCode'],
    // },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
    },
    {
      title: 'Updated Date',
      dataIndex: 'lastUpdated',
    },
    {
      title: 'Updated Date Bid',
      dataIndex: 'updatedBidDate'
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
                  confirmEditCampaignCriterion(record)
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
                confirmDeleteCampaignCriterion(record)
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

  const handleChanges = (e) => {
    const {name, value} = e.target;
    setCustName({...custName,[name]: value})
  }

  const searchCustName = (e) => {
    const {name, value} = e.target;
    setCustName({...campaignCriterionDetail, [name]: value})
    getApplication(value)
  };

  const getApplication = async (value) => {
    if(value){
      const payload = {custId : value}
      const res = await getApps(payload)
      if (res && res.data) {
        const data =[];
        res.data.forEach(item=> {
          if(item.custId){
            data.push({
              custId: item.custId,
              appId : item.appId,
              appName : item.appName
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
  }

  const searchName = (e) => {
    const {name, value} = e.target;
    setAppId(value);
    let updatedCcList = duplicate;
    if (value !== 'all' && value) {
      updatedCcList = campaignCriterionList.filter(v => v.campaign.app.toLowerCase().includes(value.toLowerCase()));
      setCampaignCriterionList(updatedCcList);
      setDuplicate(updatedCcList)
    }
    if (!value && !campName) {
      setCampaignCriterionList(fixList)
    }
    if (value === 'all') {
      return setSearchDetail({...searchDetail, campId: '', [name]: value})
    }
    if (!value && !campName) {
      setCampaignCriterionList(fixList)
    }
    if (value && !campName) {
      const a = fixList.filter(v => v.campaign.app.toLowerCase().includes(value.toLowerCase()));
      setCampaignCriterionList(a)
    }
    setSearchDetail({...searchDetail, [name]: value});
  };

  const searchCampName = (e) => {
    const {value, name} = e.target;
    setCampName(value);
    let updatedList;
    if (value !== 'all' && value) {
      updatedList = campaignCriterionList.filter(v => v.campaign.name.toLowerCase().includes(value.toLowerCase()));
      setCampaignCriterionList(updatedList);
      setDuplicate(updatedList);
    }
    if (!value && appId) {
      const a = fixList.filter(v => v.campaign.app.toLowerCase().includes(value.toLowerCase()));
      setCampaignCriterionList(a)
    }
    if (!appId && !value) {
      setCampaignCriterionList(fixList)
    }
    setSearchDetail({...searchDetail, [name]: value});
  };

  return (
    <div>
      <Spin spinning={loading}>
      <button type="button" className="btn btn-primary float-md-right Exports" onClick={handleFetchData}
              disabled={!custName.custId}>Fetch Data
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
                  <Input name="custId" onChange={handleChange} value={campaignCriterionDetail.custId}
                         placeholder="Enter Cust Id" addonBefore={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <label><b>Camp Id</b></label>
                  <Input name="id" onChange={(e) => handleChange(e, "campaign")}
                         value={(campaignCriterionDetail && campaignCriterionDetail.campaign && campaignCriterionDetail.campaign.id) || ""}
                         placeholder="Enter Camp Id" addonBefore={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <label><b>APP ID</b></label>
                  <Input name="app" onChange={(e) => handleChange(e, "campaign")}
                         value={(campaignCriterionDetail && campaignCriterionDetail.campaign && campaignCriterionDetail.campaign.app) || ""}
                         placeholder="Enter APP ID" addonBefore={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <label><b>Camp Name</b></label>
                  <Input name="name" onChange={(e) => handleChange(e, "campaign")}
                         value={(campaignCriterionDetail && campaignCriterionDetail.campaign && campaignCriterionDetail.campaign.name) || ""}
                         placeholder="Enter Camp Name" addonBefore={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <label><b>Camp Resource</b></label>
                  <Input name="resource_name" onChange={(e) => handleChange(e, "campaign")}
                         value={(campaignCriterionDetail && campaignCriterionDetail.campaign && campaignCriterionDetail.campaign.resource_name) || ""}
                         placeholder="Enter Camp Resource" addonBefore={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <label><b>Budget Resource</b></label>
                  <Input name="resource_name" onChange={(e) => handleChange(e, "campaign_criterion")}
                         value={(campaignCriterionDetail && campaignCriterionDetail.campaign_criterion && campaignCriterionDetail.campaign_criterion.resource_name) || ""}
                         placeholder="Enter Budget Resource" addonBefore={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <label><b>Geo_target_constant</b></label>
                  <Input name="geo_target_constant" onChange={(e) => handleChange(e, "campaign_criterion", "location")}
                         value={(campaignCriterionDetail && campaignCriterionDetail.campaign_criterion && campaignCriterionDetail.campaign_criterion.location && campaignCriterionDetail.campaign_criterion.location.geo_target_constant) || ""}
                         placeholder="Enter Geo_target_constant" addonBefore={<UserOutlined/>}/>
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
      </Collapse>
      <Select defaultValue="Select Customer " className="customersDropdown"
              onChange={value => searchCustName({target: {name: "custId", value}})}>
        <Select.Option value='all'>All Customers</Select.Option>
        {customersList.map(items => (
          <Select.Option key={items.customerName} value={items.customerId}>{items.customerName}</Select.Option>
        ))}
      </Select>
        <Select defaultValue="Select Application " className="customersDropdown"
                onChange={value => handleChanges({target: {name: "appId", value}})}>
          <Select.Option value='all'>All Application</Select.Option>
          {data.map(items => (
            <Select.Option key={items.appName} value={items.appId}>{items.appName}</Select.Option>
          ))}
        </Select>
        <button type="button" className="btn btn-primary Exports" style={{marginLeft: "30px"}} onClick={handleLoadData}
                disabled={!custName.custId}>Load Data
        </button>
        <br/>
      <Input className="ExportsCustomers customersDropdown" name="app" onChange={searchName}
             value={searchDetail.app}
             placeholder="Enter APPID" addonBefore={<SearchOutlined/>}/>
      <Input className="ExportsCustomers SearchCampName customersDropdown" name="name" onChange={searchCampName}
             value={searchDetail.name}
             placeholder="Enter Camp Name" addonBefore={<SearchOutlined/>}/>
      <Table scroll={{x: true}} columns={columns} dataSource={campaignCriterionList || []} size="middle"/>
      </Spin>
    </div>
  )
};

export default Campaign_criterion;
