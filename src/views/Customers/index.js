import React, {useEffect, useState} from "react";
import {Collapse} from "reactstrap";
import {Button, Card, Col, Row, Form, Input, Select, message, Table, Popconfirm, Spin, Upload} from 'antd';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { UserOutlined } from "@ant-design/icons";
import {createCustomer,updateCustomer,getAccountForCustomer,deleteCustomer,loadDataForCustomer,fetchDataForCustomer,UploadExcelForCustomers,getCustomer} from '../../actions'
import _ from "lodash";

message.config({top : 50});

const Customers = () => {

  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [accountList, setAccountList] = useState([]);
  const [collapseModalName, setCollapseModalName] = useState({});
  const [customerList, setCustomerList] = useState([]);
  const [collapse, setCollapse] = useState(false);
  const [customerDetail, setCustomerDetail] = useState({});
  const [exportcollapse, setExportCollapse] = useState(false);
  const [file, setFile] = useState({});
  const DeleteText = 'Are you sure to delete this Customer?';
  const EditText = 'Are you sure to edit this Customer?';

  useEffect(() => {
    getAccountList()
   },[]);

  const handleChange = e => {
    const {name, value} = e.target;
    setCustomerDetail({...customerDetail, [name]: value})
  };

  const getAccountList = async () => {
    setLoading(true);
    const res = await getAccountForCustomer();
    if(res && res.data && res.data.length) {
      setLoading(false);
      setAccountList(res.data);
    }
    else{
      setLoading(false);
      console.log("Please enter valid data..")
    }
  };

  const getCustomerList = async () => {
    setLoading(true);
    const accId = localStorage.getItem('AccountId');
    const res = await getCustomer({accountId: accId});
    if (res && res.data && res.data.length > 0) {
      setLoading(false);
      const response = res.data;
      Array.isArray(response) && response.forEach(customer => {
        customer.accountName = Array.isArray(accountList) && accountList.find(u => u._id === customer.accountId).accountName || ''
      });
      setCustomerList(response)
    } else {
      setLoading(false);
      console.log("Please enter valid data..")
    }
  };

  const createCustomers = async () => {
    if (customerDetail && customerDetail._id) {
      const response = await updateCustomer(customerDetail);
      if (response && response.data) {
        setCollapse(false);
        message.success("customer edit Successfully");
        getCustomerList(accountList)
      } else {
        console.log("Please enter valid data..")
      }
    } else {
      const response = await createCustomer(customerDetail);
      if (response && response.data) {
        setCustomerDetail({});
        setCollapse(false);
        message.success("Successfully Account Created");
        getCustomerList(accountList)
      } else {
        console.log("Please enter valid data..")
      }
    }
  };

  const confirmDeleteCustomers = async (id) => {
    setLoading(true);
    const deleteId = (id._id);
    const res = await deleteCustomer(deleteId);
    if (res && res.data) {
      setLoading(false);
      handleLoadData();
      message.success("customer Delete Successfully")
    } else {
      setLoading(false);
      console.log("Please enter valid data..")
    }
  };

  const confirmEditCustomers = (data) => {
    setCustomerDetail(data);
    setCollapse(true);
    setCollapseModalName({title: "Edit Customers", title2: "Edit Customers", title3: "Edit Account", title4: "Cancel"})
  };

  const handleLoadData = async () => {
    const {selectedAccountId} = searchData;
    let query = {};
    if (selectedAccountId !== 'all') {
      query = {accountId: selectedAccountId}
    } else if (selectedAccountId === 'all') {
      query = {}
    }
    const res = await loadDataForCustomer(query);
    if (res && res.data) {
      Array.isArray(res.data) && res.data.forEach(customer => {
        customer.accountName = Array.isArray(accountList) && accountList.find(u => u._id === customer.accountId).accountName || ''
      });
      setCustomerList(res.data);
    } else {
      console.log("Please enter valid data..")
    }
  };

  const handleFetchData = async () => {
    const {selectedAccountId} = searchData;
    setCustomerList([])
    setLoading(true);
    const res = await fetchDataForCustomer(selectedAccountId);
    if (res && res.data && res.data.success) {
      setLoading(false);
      message.success("Successfully Updated");
      handleLoadData()
    } else {
      setLoading(false);
      console.log("Please enter valid data..")
    }
  };

  const ExportsButton = () => {
    setExportCollapse(!exportcollapse);
    setCollapse(false)
  };

  const save = async () => {
    let formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    const res = await UploadExcelForCustomers(formData);
    if (res && res.data) {
      setLoading(false);
      setExportCollapse(false);
      handleLoadData()
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const HandleUpload = async (file) => {
    const strFileName = file.name.split(".");
    if (['xls', 'xlsx'].includes(strFileName[strFileName.length - 1])) {
      if (typeof (FileReader) !== 'undefined') {
        setFile(file);
      } else {
        message.error("Please upload a valid Excel file.")
      }
    } else {
      message.error("Please upload a valid Excel file.")
    }
  };

  const columns = [
    {
      title: 'Account Name',
      dataIndex: 'accountName',
    },
    {
      title: 'Account Id',
      dataIndex: 'accountId',
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
    },
    {
      title: 'Customer Id',
      dataIndex: 'customerId',
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
                  confirmEditCustomers(record)
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
                 confirmDeleteCustomers(record)
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

  const searchName = (e) =>{
    const {name, value} = e.target;
    setSearchData({...customerDetail, [name]: value})
  };

  return(
    <div>
      <Spin spinning={loading}>
       <button type="button" className="btn btn-primary float-md-right Exports" onClick={handleFetchData} disabled={!searchData.selectedAccountId}>Fetch Data</button>
      <button type="button" className="btn btn-primary float-md-right collapseButton loadData" onClick={handleLoadData} disabled={!searchData.selectedAccountId}>Load Data</button>
      <button type="button" className="btn btn-primary float-md-right Exports" onClick={ExportsButton} disabled={!searchData.selectedAccountId}>Exports</button>
      <Select defaultValue="Select Account "  className="AccountsDropdown"
              onChange={value => searchName({target: {name: "selectedAccountId", value}})}>
        <Select.Option value='all'>All Accounts</Select.Option>
        {accountList.map(items => (
          <Select.Option key={items.accountName} value={items._id}>{items.accountName}</Select.Option>
        ))}
      </Select>
      <Collapse isOpen={exportcollapse} id="exportCollapseExample" className="ExportsCustomers">
        <Row  gutter={[0, 24]}>
          <Col span={4}>
            <Input readOnly value={file && file.name} placeholder="file name" onChange={e => setFile(e.target.value)}/>
          </Col>
          <Col span={3}>
            <Upload showUploadList={false} beforeUpload={HandleUpload} multiple={true}>
              <Button type="primary" style={{marginLeft: 0}} >Browse...</Button>
            </Upload>
          </Col>
          <Col span={3}>
            <Button type="primary" onClick={save} disabled={_.isEmpty(file)} >Save</Button>
          </Col>
        </Row>
      </Collapse>
      <Collapse isOpen={collapse} id="collapseExample">
        <Row>
          <Col span={8}/>
          <Col span={8}>
            <Card className="cardtop">
              <h1 className="h2login">{collapseModalName.title}</h1>
               <Form>
                <Form.Item>
                  <label><b>Account</b></label>
                  <Select defaultValue="Select Account " style={{width: 400}} value={customerDetail.accountId || 'Select Account'}
                          onChange={value => handleChange({target: {name: "accountId", value}})}>
                    {accountList.map(items => (
                      <Select.Option key={items.accountName} value={items._id}>{items.accountName}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <label><b>Customer Name</b></label>
                  <Input name="customerName" value={customerDetail.customerName || ''} onChange={handleChange}
                         placeholder="Enter Customer Name" addonBefore={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <label><b>Customer Id</b></label>
                  <Input name="customerId" value={customerDetail.customerId || ''} onChange={handleChange}
                         placeholder="Enter Customer Id" addonBefore={<UserOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <Button className="btn-md buttonsubmitlogin" htmlType="submit"
                          onClick={createCustomers}
                          type="primary"
                          size={"large"}>
                    {collapseModalName.title3}
                  </Button>
                  <Button className="btn-md buttonsubmitlogin Cancel" htmlType="submit"
                          onClick={()=>setCollapse(false)}
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
      <Table columns={columns} dataSource={customerList || []} size="middle"/>
      </Spin>
    </div>
  );
};

export default Customers
