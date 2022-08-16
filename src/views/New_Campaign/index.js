import React, {useEffect, useState} from 'react';
import moment from 'moment'
import {message, Select, Table, DatePicker, Space, Spin, Upload, Button, Row, Col, Input,Typography,Modal} from "antd";
import axios from "axios";
import appConfig from "../../config";
import {
  UploadExcelForCampaign,
  FetchDataForCampaign,
  DeleteDataForCampaign,
  GetDataForCampaign,
  SelectedRowsByBudget,
  DayByBid,
  getCampaignCriterion
} from "../../actions";
import _ from "lodash";
import {Collapse} from "reactstrap";
import {SearchOutlined} from "@ant-design/icons";
import './campaign.css'
import {getApps} from "../../actions/Application";
import {SelectedRowsByBid} from "../../actions/LatestCampaign";

const {Text} = Typography;
message.config({top: 50});
const DATE_FORMATE = 'YYYY-MM-DD';

const New_Campaign = () => {
  const [applicationData, setApplicationData] = useState([]);
  const [isBid, setBid] = useState(false);
  const [newBid, setNewBid] = useState("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState({});
  const [campaign, setCampaign] = useState({});
  const [campaignList, setCampaignList] = useState([]);
  const [dublicateCampaignList, setDublicateCampaignList] = useState([]);
  const [custmerList, setCustmerList] = useState([]);
  const [exportcollapse, setExportCollapse] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [file, setFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selecedRow, setSelectedRow] = useState([]);
  const [data, setData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listArray, setListArray] = useState(campaignList);
  const [totalData, setTotalData] = useState({
    cost_micros_gst: 0,
    Ad_Exchange_revenue_final: 0,
    profitRs: 0,
    profitPR: 0,
  });

  const toMicro = (value) => {
    if(value !== 0){
      return value / 1000000
    }else {
      return 0
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCampaign({...campaign, [name]: value})
    // localStorage.setItem("custName" , value)
    getApplication(value)
  };

  const getApplication = async (value) => {
    if(value){
      let payload = {}
      if(value === 'all'){
        payload = {}
      }else {
        payload = {custId : value}
      }
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
        setApplicationData(data)
        setLoading(false);
        // handleLoadData()
        message.success("Successfully Updated")
      } else {
        setLoading(false);
        message.error("something went wrong")
      }
    }
  }

  const onHandle = (e) => {
    const {name, value} = e.target;
    if(name === "amount_micros"){
      setRecords({...records, campaign_budget: {...records.campaign_budget,[name]: value}})
    }else {
      setNewBid(value)
    }
  };

  const fetchData = () => {
    const accId = localStorage.getItem('AccountId');
    // const custId = localStorage.getItem('custName');
    setLoading(false);
    axios.post(`${appConfig.appUrl}/customers/get`, {accountId: accId}, {
      headers: {
        Authorization: `${appConfig.token}`
      }
    })
      .then(res => {
        if (res && res.data && res.data.length) {
          setLoading(false);
          setCustmerList(res.data);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log("Please enter valid data..")
      })
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
      setLoading(false);
      message.error("Please upload a valid Excel file.")
    }
  };

  const save = async () => {
    const {customerId, startDate, endDate} = campaign;
    let formData = new FormData();
    formData.append('file', file);
    formData.append('customerId', customerId);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    setLoading(true);
    const res = await UploadExcelForCampaign(formData);
    if (res && res.data) {
      setLoading(false);
      setExportCollapse(!exportcollapse);
      getCampaign();
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const handleFetchData = async () => {
    const {customerId, appId, startDate, endDate} = campaign;
    setLoading(true);
    const res = await FetchDataForCampaign({customerId,appId, startDate, endDate});
    if (res && res.data && res.data.success) {
      setLoading(false);

      if(res && res.data && res.data.message !== "no data available"){
        getCampaign();
        message.success("Successfully Updated")
      }else{
        message.error("BidDifference Occur")
      }
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const getCampaign = async () => {

    const {customerId, startDate, appId} = campaign;
    let payload = {};
    if (customerId !== 'all') {
      payload = {createdDate: startDate, custId: customerId, App: appId}
    } else if (customerId === 'all') {
      payload = {createdDate: startDate}
    }
    setLoading(true);
    const res = await GetDataForCampaign(payload);

    if (res && res.data) {
      const data =[];
      res.data.forEach(item=> {
        if(item.lastUpdateBid){
          data.push({campId: item.campaign.id})
        }
      })
      setData(data);
      setLoading(false);
      res.data.forEach((v, index) => {
        v.key = index + 1;
      });
      getSumOfSummary(res.data);
      setCampaignList(res.data);
      setDublicateCampaignList(res.data)
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  // const getCampaign = () => {
  //
  // };

  const onChange = (date, name) => {
    setCampaign({...campaign, [name]: date && moment(date).format(DATE_FORMATE)})
  };

  const confirmDeleteCampaign = async (id) => {
    const deleteId = (id._id);
    setLoading(true);
    const res = await DeleteDataForCampaign(deleteId);
    if (res && res.data) {
      setLoading(false);
      getCampaign();
      message.success("Account Delete Successfully")
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const ExportsButton = () => {
    setExportCollapse(!exportcollapse);
    setCollapse(false)
  };

  const onBid = async (record) => {
    const {customerId} = campaign;
    let payload = [];
    if (record && record._id) {
      payload.push(record)
    } else {
      payload = selecedRow
    }
    setLoading(true);

    const res = await SelectedRowsByBid(payload, customerId);
    if (res && res.data) {
      const customersId=campaign.customerId
      setLoading(false);
      message.success("selected Bid Row successFully Added")
      getCampaign()
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const onBidByLastDays = async () => {
    const {customerId} = campaign;
    const res = await DayByBid(customerId);
    if (res && res.data) {
      const customersId=campaign.customerId
      setLoading(false);
      message.success("selected Bid Row successFully Added")
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const onBudget = async (record) => {
    let payload = [];
    if (record && record._id) {
      payload.push(record)
    } else {
      payload = selecedRow
    }
    setLoading(true);
    const res = await SelectedRowsByBudget(payload);
    if (res && res.data) {
      setLoading(false);
      message.success("selected Budget Row successFully Added")
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const getSumOfSummary = (data) => {
    let total = {cost_micros_gst: 0, Ad_Exchange_revenue: 0, Ad_Exchange_revenue_final: 0 , profitRs: 0, profitPR: 0,};

    Array.isArray(data) && data.forEach((item) => {
      total.cost_micros_gst += parseFloat(item.metrics["cost_micros_gst"] || 0);
      total.Ad_Exchange_revenue_final += parseFloat(item["Ad_Exchange_revenue_final"] || 0);
      total.Ad_Exchange_revenue += parseFloat(item["Ad_Exchange_revenue"] || 0);
      total.profitRs += parseFloat(item["profitRs"] || 0);
      total.profitPR += parseFloat(item["profitPR"] || 0);
    });

    setTotalData(total)
  };

  const columns = [
    {
      title: 'APP ID',
      ellipsis: true,
      render: (record) => (
        <span>{record.campaign.App}</span>
      ),
      sorter: (a, b) => a.campaign.App - b.campaign.App,
    },
    {
      title: 'Camp Name',
      ellipsis: true,
      render: (record) => (
        <span>{record.campaign.name}</span>
      ),
      sorter: (a, b) => a.campaign.name.length - b.campaign.name.length,
    },
    {
      title: 'Country Name',
      ellipsis: true,
      render: (record) => (
        <span>{record.countryName}</span>
      ),
      sorter: (a, b) => a.countryName.length - b.countryName.length,
    },
    {
      title: 'Cost + GST',
      ellipsis: true,
      render: (record) => (
        <span>{toMicro(record && record.metrics && record.metrics.cost_micros_gst).toFixed(2) || 0}</span>
      ),
      sorter: (a, b) =>  a.metrics.cost_micros_gst -  b.metrics.cost_micros_gst,
    },
    {
      title: 'Cpa',
      ellipsis: true,
      render: (record) => (
        <span>{toMicro(record.campaign.target_cpa.target_cpa_micros).toFixed(2) || 0}</span>
      ),
      sorter: (a, b) =>  a.campaign.target_cpa.target_cpa_micros -  b.campaign.target_cpa.target_cpa_micros,
    },
    {
      title: 'CPI',
      ellipsis: true,
      render: (record) => (
        <span>{ record.metrics.cost_per_conversion && toMicro(record.metrics.cost_per_conversion).toFixed(2) || 0}</span>
      ),
      sorter: (a, b) =>  a.metrics.cost_per_conversion -  b.metrics.cost_per_conversion,
    },
    {
      title: 'Budget Amount',
      ellipsis: true,
      render: (record) => (
        <span>{toMicro(record.campaign_budget.amount_micros)}</span>
      ),
      sorter: (a, b) =>  a.campaign_budget.amount_micros -  b.campaign_budget.amount_micros,
    },
    {
      title: 'Revenue',
      ellipsis: true,
      render: (record) => (
        <span>{record && record.Ad_Exchange_revenue && (record.Ad_Exchange_revenue).toFixed(2)}</span>
      ),
      sorter: (a, b) =>  a.Ad_Exchange_revenue -  b.Ad_Exchange_revenue,
    },
    {
      title: 'FN Revenue',
      ellipsis: true,
      render: (record) => (
        <span>{record && record.Ad_Exchange_revenue_final && (record.Ad_Exchange_revenue_final).toFixed(2)}</span>
      ),
      sorter: (a, b) =>  a.Ad_Exchange_revenue_final -  b.Ad_Exchange_revenue_final,
    },
    {
      title: 'Profit(Rs)',
      ellipsis: true,
      render: (record) => (
        <span>{record && record.profitRs && (record.profitRs).toFixed(2)}</span>
      ),
      sorter: (a, b) =>  a.profitRs -  b.profitRs,
    },
    {
      title: 'Profit(%)',
      ellipsis: true,
      render: (record) => (
        <span>{record && record.profitPR && (record.profitPR).toFixed(2)}%</span>
      ),
      sorter: (a, b) =>  a.profitPR -  b.profitPR,
    },
    {
      title: 'New Bid',
      ellipsis: true,
      render: (record) => (
        <span>{toMicro((record.newBid || 0).toFixed(2))}</span>
      ),
      sorter: (a, b) =>  a.newBid -  b.newBid,
    },
    {
      title: 'Action',
      width: "217px",
      render: (record) => {
        return (
          <space size="middle">
            <Button className="d-inline" style={{backgroundColor: "green", color: "white"}}
                    onClick={() => showModal(record, true)}>Bid</Button>
            <Button className="d-inline" type="primary" onClick={() => showModal(record, false)}>Budget</Button>
            <Button className="d-inline" type="danger"
                    onClick={() => confirmDeleteCampaign(record)}>Delete</Button>
          </space>
        )
      }
    },
  ];

  const showModal = (record,bid) => {
    setBid(bid);
    setRecords(record);
    setNewBid(toMicro(record.newBid) || 0)
    setIsModalVisible(true);
  };

  const handleOk = () => {
    records.newBid=newBid*1000000;
    onBid(records);
    setIsModalVisible(false);
    setBid(false);
    getCampaign();
    setNewBid("")
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setBid(false)
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRow(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: (Array.isArray(data) && (data.find(item => item.campId === record.campaign.id))),
      name: record.name,
    }),
  };

  const SearchCountryName = (e) => {
    const {value} = e.target;
    const searchCampaign = dublicateCampaignList.filter(item => item.countryName.toLowerCase().includes(value.toLowerCase()));
    if (value)
      setDublicateCampaignList(searchCampaign);
    else
      setDublicateCampaignList(campaignList)
  };

  const SearchCampName = (e) => {
    const {value} = e.target;
    const searchCampaign = dublicateCampaignList.filter(item => item.campaign.name.toLowerCase().includes(value.toLowerCase()));
    if (value)
      setDublicateCampaignList(searchCampaign);
    else
      setDublicateCampaignList(campaignList)
  };

  const handleChange1 = (e) => {
    const {value} = e.target;
    let searchResult = []
    if(value === "withOutCost"){
      const searchCampaign = campaignList.filter(item => item.metrics.cost_micros === 0);
      searchResult.push(...searchCampaign)
    } else if(value === "withCost"){
      const searchCampaign = campaignList.filter(item => item.metrics.cost_micros !== 0);
      searchResult.push(...searchCampaign)
    }
    if (value !== "all"){
      setDublicateCampaignList(searchResult);
    } else{
      setDublicateCampaignList(campaignList)
    }
  };

  return (
    <div>
      {
        isBid === true ?
          <Modal title="Update Bid" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Input value={(records &&  `Current Bid: ${toMicro(records.newBid)}` || 0)} disabled={true}/>
            <Input onChange={onHandle} className="mt-2" placeholder="Enter New Bid Here" name="newBid" value={newBid}/>
          </Modal> :
          <Modal title="Update Budget" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Input onChange={onHandle} name="amount_micros"
                   value={(records && records.campaign_budget && records.campaign_budget.amount_micros || 0)}/>
          </Modal>
      }
      <Spin spinning={loading}>
        <button type="button" className="btn btn-primary float-md-right Exports" onClick={onBid}
                disabled={!selecedRow.length}>Update Bid
        </button>
        <button type="button" className="btn btn-primary float-md-right Exports" onClick={onBudget}
                disabled={!selecedRow.length}>Update budget
        </button>
        <button type="button" className="btn btn-primary float-md-right Exports" onClick={handleFetchData}
                disabled={!campaign.customerId || !campaign.startDate}>Fetch Data
        </button>


        <Select defaultValue="Select Customer " className="customersDropdown"
                onChange={value => handleChange({target: {name: "customerId", value}})}>
          <Select.Option value='all'>All</Select.Option>
          {custmerList.map(items => (
            <Select.Option key={items.customerName} value={items.customerId}>{items.customerName}</Select.Option>
          ))}
        </Select>
        <Select defaultValue="Select Application " className="customersDropdown"
                onChange={value => handleChange({target: {name: "appId", value}})}>
          <Select.Option value='all'>All</Select.Option>
          {applicationData.map(items => (
            <Select.Option key={items.appName} value={items.appId}>{items.appName}</Select.Option>
          ))}
        </Select>{'  '}
        <Space direction="vertical">
          <DatePicker
            onChange={(date) => onChange(date, "startDate")}
            format={DATE_FORMATE}
            value={campaign && campaign.startDate && moment(campaign.startDate, DATE_FORMATE)}
            placeholder="Start Date"
            name='startDate'/>
        </Space>
        <Space direction="vertical">
          <DatePicker
            onChange={(date) => onChange(date, "endDate")}
            value={campaign && campaign.endDate && moment(campaign.endDate, DATE_FORMATE)}
            placeholder="End Date"
            format={DATE_FORMATE}
            name='endDate'
          />
        </Space>
        <button type="button" className="btn btn-primary Exports" style={{marginLeft : "30px"}} onClick={getCampaign}
                disabled={!campaign.customerId || !campaign.startDate}>Load Data
        </button>
        <button type="button" className="btn btn-primary Exports" onClick={ExportsButton}
                disabled={!campaign.customerId || !campaign.startDate}>Exports
        </button>
        <br/>
        <div>
          <Row>
            <Input className="ExportsCustomers" style={{width: 200}} name="appId" onChange={handleChange}
                   placeholder="Enter APPID" addonBefore={<SearchOutlined/>}/>
            <Select style={{width: 120}} defaultValue="all" className="ExportsCustomers"
                    onChange={value => handleChange1({target: {name: "cost", value}})}>
              <Select.Option value='all'>All</Select.Option>
              <Select.Option value='withCost'>withCost</Select.Option>
              <Select.Option value='withOutCost'>withOutCost</Select.Option>
            </Select>
          </Row>
        </div>
        <Collapse isOpen={exportcollapse} id="exportCollapseExample" className="ExportsCustomers">
          <Row gutter={[0, 24]}>
            <Col span={4}>
              <Input readOnly value={file && file.name} placeholder="file name"
                     onChange={e => setFile(e.target.value)}/>
            </Col>
            <Col span={3}>
              <Upload showUploadList={false} beforeUpload={HandleUpload} multiple={true}>
                <Button type="primary" style={{marginLeft: 0}} loading={isLoading}>Browse...</Button>
              </Upload>
            </Col>
            <Col span={3}>
              <Button type="primary" onClick={save} disabled={_.isEmpty(file)} loading={isLoading}>Save</Button>
            </Col>
          </Row>
        </Collapse>
        <div>
          <Row style={{marginBottom: "10px"}}>
            <Col md={3}>
              <Input type="text"   placeholder="Camp Name" onChange={SearchCampName}/>
            </Col>
            <Col md={2} >
              <Input type="text"  value={listArray.countryName} placeholder="Country Name" onChange={SearchCountryName}/>
            </Col>
            <Col md={1} >
              <Input type="text" value={selecedRow.length} placeholder="Country Name"/>
            </Col>
          </Row>
        </div>
        <Table rowSelection={{type: "checkbox", ...rowSelection,}}
               columns={columns}
               className="campaign-list"
               dataSource={dublicateCampaignList || []}
               size="middle"
               pagination={false}
               scroll={{ y: 550}}
               rowClassName={(record, index) => (Array.isArray(data) && (data.find(item => item.campId === record.campaign.id)) ? "table-bgColor" : "")}
               footer={() =>
                 dublicateCampaignList.length > 0 && (
                   <>
                     <Row className="backGroundColor">
                       <Col md={5} >
                         <strong><b>TOTAL</b></strong>
                         <strong><b>==</b></strong>
                         <strong><b>{dublicateCampaignList.length}</b></strong>
                       </Col>
                       <Col md={6}  style={{marginLeft: "34px"}}>
                         <span>{!_.isEmpty(totalData) && toMicro(totalData.cost_micros_gst || 0).toFixed(2)}</span>
                       </Col>
                       <Col md={2} style={{marginLeft: "15px"}}>
                         R - <span>{!_.isEmpty(totalData) && (totalData.Ad_Exchange_revenue || 0).toFixed(2)}</span>
                       </Col>
                       <Col md={2} style={{marginLeft: "15px"}}>
                         FNR -  <span>{!_.isEmpty(totalData) && (totalData.Ad_Exchange_revenue_final || 0).toFixed(2)}</span>
                       </Col>
                       <Col md={2}  style={{marginLeft: "10px"}}>
                         <span>{!_.isEmpty(totalData) && (totalData.profitRs || 0).toFixed(2)}</span>
                       </Col >

                       <Col md={2} >
                         <span>{!_.isEmpty(totalData) && ((((totalData.profitRs)) / (toMicro(totalData.cost_micros_gst))) || 0).toFixed(2)}%</span>
                       </Col>
                     </Row>
                   </>
                 )
               }
        />
      </Spin>
    </div>
  )
};

export default New_Campaign;

