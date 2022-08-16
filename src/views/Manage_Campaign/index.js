import React, {useEffect, useState} from 'react';
import {
  Button,
  Col,
  DatePicker,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Upload
} from "antd";
import moment from "moment";
import { FetchDataCampaign, LoadDataCampaign, UploadExcelForFinalCampaign, FetchDataCampaignApplication } from "../../actions/NewCampaign";
import {getApplication} from "../../actions/Application";

message.config({top: 50});
const DATE_FORMATE = 'YYYY-MM-DD';

const toMicro = (value) => {
  if(value !== 0){
    return value / 1000000
  }else {
    return 0
  }
};

const Final_Campaign = (props) => {

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [custmerList, setCustmerList] = useState([]);
  const [campaign, setCampaign] = useState({});
  const [finalCampaign, setFinalCampaign] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchApplication()
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCampaign({...campaign, [name]: value})
  };

  const onChange = (date, name) => {
    setCampaign({...campaign, [name]: date && moment(date).format(DATE_FORMATE)})
  };

  const fetchApplication = async () => {
    const res = await getApplication()
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
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  }

  const handleFetchData = async () => {
    const { appId, startDate, endDate } = campaign
    const res = await FetchDataCampaign({appId, startDate, endDate});
    if (res && res.data && res.data.success) {
      setLoading(false);
      if(res && res.data && res.data.message !== "no data available"){
        message.success("Successfully Updated")
        // handleLoadData()
      }else{
        message.error("BidDifference Occur")
      }
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  }

  const handleLoadData = async () => {
    const { appId, startDate, endDate } = campaign
    setLoading(true);
    const res = await LoadDataCampaign({appId, startDate, endDate});
    if (res && res.data && res.data.success) {
      setFinalCampaign(res.data.payload)
      setLoading(false);
      if(res && res.data && res.data.message !== "no data available"){
        message.success("Successfully Updated")
      }else{
        message.error("BidDifference Occur")
      }
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  }

  const HandleUpload = async (record, file) => {debugger
    const strFileName = file.name.split(".");
    if (['xls', 'xlsx'].includes(strFileName[strFileName.length - 1])) {
      if (typeof (FileReader) !== 'undefined') {
      } else {
        message.error("Please upload a valid Excel file.")
      }
    } else {
      setLoading(false);
      message.error("Please upload a valid Excel file.")
    }
    const {Date , appId} = record
    let formData = new FormData();
    formData.append('file', file);
    formData.append('appId', appId);
    formData.append('startDate', Date);
    setLoading(true);
    const res = await UploadExcelForFinalCampaign(formData);
    if (res && res.data) {
      setLoading(false);
      handleLoadData()
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const fetchCost = async (record) => {
    const {Date , appId} = record
    setLoading(true);
    const res = await FetchDataCampaignApplication({Date,appId});
    if (res && res.data && res.data.success) {
      setLoading(false);
      if(res && res.data && res.data.message !== "no data available"){
        message.success("Successfully Updated")
        handleLoadData()
      }else{
        message.error("BidDifference Occur")
      }
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'Date',
      sorter: (a, b) =>  moment(b.Date) - moment(a.Date),
    },
    {
      title: 'App ID',
      dataIndex: 'appId',
      ellipsis: true,
      sorter: (a, b) => a.App - b.App,
    },
    {
      title: 'Cost',
      render: (record) => (
        <span>{toMicro(record && record.cost_micros).toFixed(2) || 0}</span>
      ),
      sorter: (a, b) =>  a.cost_micros -  b.cost_micros,
    },
    {
      title: 'Cost + Gst',
      render: (record) => (
        <span>{toMicro(record && record.cost_micros_gst).toFixed(2) || 0}</span>
      ),
      sorter: (a, b) =>  a.cost_micros_gst -  b.cost_micros_gst,
    },
    {
      title: 'Revenue',
      dataIndex: 'Ad_Exchange_revenue',
      sorter: (a, b) =>  a.Ad_Exchange_revenue -  b.Ad_Exchange_revenue,
    },
    {
      title: 'Action',
      render: (record) => {
        return (
          <space size="middle">
            <Button className="d-inline" type="primary" onClick={() => fetchCost(record)}>Fetch Cost</Button>
            <Upload showUploadList={false} beforeUpload={(file) => HandleUpload(record, file)} multiple={true}>
              <Button type="primary" style={{marginLeft: 0}}>Fetch Revenue</Button>
            </Upload>
          </space>
        )
      }
    },
  ];

  return(
    <>
      <Spin spinning={loading}>
      <button type="button" className="btn btn-primary float-md-right Exports" onClick={handleFetchData}
              disabled={!campaign.appId || !campaign.startDate}>Fetch Data
      </button>

      <Select defaultValue="Select Application" className="customersDropdown"
              onChange={value => handleChange({target: {name: "appId", value}})}>
        <Select.Option value='all'>All</Select.Option>
        {data.map(items => (
          <Select.Option key={items.appName} value={items.appId}>{items.appName}</Select.Option>
        ))}
      </Select>
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
          format={DATE_FORMATE}
          value={campaign && campaign.endDate && moment(campaign.endDate, DATE_FORMATE)}
          placeholder="End Date"
          name='endDate'/>
      </Space>
        <button type="button" className="btn btn-primary Exports" style={{marginLeft : "30px"}} onClick={handleLoadData}
                disabled={!campaign.appId || !campaign.startDate}>Load Data
        </button>
      <br/>

      {/*<Collapse isOpen={exportcollapse} id="exportCollapseExample" className="ExportsCustomers">*/}
      {/*  <Row gutter={[0, 24]}>*/}
      {/*    <Col span={4}>*/}
      {/*      <Input readOnly value={file && file.name} placeholder="file name"*/}
      {/*             onChange={e => setFile(e.target.value)}/>*/}
      {/*    </Col>*/}
      {/*    <Col span={3}>*/}
      {/*      <Upload showUploadList={false} beforeUpload={HandleUpload} multiple={true}>*/}
      {/*        <Button type="primary" style={{marginLeft: 0}} loading={isLoading}>Browse...</Button>*/}
      {/*      </Upload>*/}
      {/*    </Col>*/}
      {/*    <Col span={3}>*/}
      {/*      <Button type="primary" disabled={_.isEmpty(file)} loading={isLoading}>Save</Button>*/}
      {/*    </Col>*/}
      {/*  </Row>*/}
      {/*</Collapse>*/}

      <Table scroll={{x: true}} columns={columns} dataSource={finalCampaign || []} size="middle"/>
      </Spin>
      </>
  )
};

export default Final_Campaign
