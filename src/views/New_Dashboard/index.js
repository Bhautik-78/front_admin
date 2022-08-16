import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom'
import {Col, DatePicker, message, Row, Space, Spin, Table} from "antd";
import moment from "moment";
import {LoadDataAllCampaign} from "../../actions/NewDashboard";
import _ from "lodash";
// import "./New_Dashboard.scss"

message.config({top: 50});
const DATE_FORMATE = 'YYYY-MM-DD';

const toMicro = (value) => {
  if (value !== 0) {
    return value / 1000000
  } else {
    return 0
  }
};

const New_Dashboard = () => {

  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState({
    cost_micros_gst: 0,
    Ad_Exchange_revenue_final: 0,
    Ad_Exchange_revenue: 0,
    profitRs: 0,
    profitPR: 0,
    cost_micros: 0
  });

  useEffect(()=>{
    fetchDataForYesterDay()
  },[])

  const onChange = (date, name) => {
    setCampaign({...campaign, [name]: date && moment(date).format(DATE_FORMATE)})
  };

  const fetchDataForYesterDay = async () => {
    const today = new Date();
    const date = moment(new Date(today.setDate(today.getDate() - 1))).format("YYYY-MM-DD")
    const res = await LoadDataAllCampaign({date});
    res.data.result.forEach(item => {
      item.profitRs = item.Ad_Exchange_revenue_final - (item.cost_micros_gst / 1000000) || 0
    })
    res.data.result.forEach(item => {
      item.profitPR = item.profitRs === 0 ? -100 : ((item.cost_micros_gst / 1000000) === 0 ? ((item.profitRs / item.profitRs)) * 100 : ((item.profitRs / (item.cost_micros_gst / 1000000))) * 100) || 0
    })
    if (res && res.data && res.data.result) {
      setData(res.data.result)
      getSumOfSummary(res.data.result);
      setLoading(false);
    }
  }

  const handleLoadData = async () => {
    const {date} = campaign
    setLoading(true);
    const res = await LoadDataAllCampaign({date});
    res.data.result.forEach(item => {
      item.profitRs = item.Ad_Exchange_revenue_final - (item.cost_micros_gst / 1000000) || 0
    })
    res.data.result.forEach(item => {
      item.profitPR = item.profitRs === 0 ? -100 : ((item.cost_micros_gst / 1000000) === 0 ? ((item.profitRs / item.profitRs)) * 100 : ((item.profitRs / (item.cost_micros_gst / 1000000))) * 100) || 0
    })
    if (res && res.data && res.data.result) {
      setData(res.data.result)
      getSumOfSummary(res.data.result);
      setLoading(false);
      message.success("Successfully Fetched")
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const getSumOfSummary = (data) => {
    let total = {cost_micros: 0, cost_micros_gst: 0, Ad_Exchange_revenue: 0, Ad_Exchange_revenue_final: 0 , profitRs: 0, profitPR: 0,};

    Array.isArray(data) && data.forEach((item) => {
      total.cost_micros_gst += parseFloat(item["cost_micros_gst"] || 0);
      total.cost_micros += parseFloat(item["cost_micros"] || 0);
      total.Ad_Exchange_revenue_final += parseFloat(item["Ad_Exchange_revenue_final"] || 0);
      total.Ad_Exchange_revenue += parseFloat(item["Ad_Exchange_revenue"] || 0);
      total.profitRs += parseFloat(item["profitRs"] || 0);
      total.profitPR += parseFloat(item["profitPR"] || 0);
    });
    setTotalData(total)
  };

  const columns = [
    {
      title: 'App ID',
      ellipsis: true,
      render: (record) => (
        <Link style={{color : "rgba(0, 0, 0, 0.85)", textDecoration: "none"}} to={{pathname: "/latestCampaign", appId: record.appId, Date : campaign.date}}>{record.appId}</Link>
      ),
      sorter: (a, b) => a.App - b.App,
    },
    {
      title: 'Cost',
      render: (record) => (
        <span>{toMicro(record && record.cost_micros).toFixed(2) || 0}</span>
      ),
      sorter: (a, b) => a.cost_micros - b.cost_micros,
    },
    {
      title: 'Cost + Gst',
      render: (record) => (
        <span>{toMicro(record && record.cost_micros_gst).toFixed(2) || 0}</span>
      ),
      sorter: (a, b) => a.cost_micros_gst - b.cost_micros_gst,
    },
    {
      title: 'Revenue',
      render: (record) => (
        <span>{(record && record.Ad_Exchange_revenue).toFixed(2) || 0}</span>
      ),
      sorter: (a, b) => a.Ad_Exchange_revenue - b.Ad_Exchange_revenue,
    },
    {
      title: 'Profit(Rs)',
      render: (record) => (
        <span>{(record && record.profitRs).toFixed(2) || 0}</span>
      ),
      sorter: (a, b) => a.profitRs - b.profitRs,
    },
    {
      title: 'Profit(%)',
      render: (record) => (
        <span>{(record && record.profitPR).toFixed(2) || 0} % </span>
      ),
      sorter: (a, b) => a.profitPR - b.profitPR,
    }
  ];

  return (
    <>
      <Spin spinning={loading}>
        <Space direction="vertical">
          <DatePicker
            onChange={(date) => onChange(date, "date")}
            format={DATE_FORMATE}
            value={campaign && campaign.date && moment(campaign.date, DATE_FORMATE)}
            placeholder="Select Date"
            name='date'/>
        </Space>
        <button type="button" className="btn btn-primary Exports" style={{marginLeft: "30px"}} onClick={handleLoadData}
                disabled={!campaign.date}>Load Data
        </button>
        <br/>
        <Table scroll={{x: true}} columns={columns} dataSource={data || []} size="middle"
               footer={() =>
                 data.length > 0 && (
                   <>
                     <Row className="backGroundColor">
                       <Col md={10} >
                         <strong><b>TOTAL</b></strong>
                       </Col>
                       <Col md={2} style={{marginLeft: "38px"}}>
                         <span>{!_.isEmpty(totalData) && toMicro(totalData.cost_micros || 0).toFixed(2)}</span>
                       </Col>
                       <Col md={3} >
                         <span>{!_.isEmpty(totalData) && toMicro(totalData.cost_micros_gst || 0).toFixed(2)}</span>
                       </Col>
                       <Col md={3}>
                         R - <span>{!_.isEmpty(totalData) && (totalData.Ad_Exchange_revenue || 0).toFixed(2)}</span>
                       </Col>
                       <Col md={3}>
                         <span>{!_.isEmpty(totalData) && (totalData.profitRs || 0).toFixed(2)}</span>
                       </Col >
                       <Col md={2} >
                         <span>{!_.isEmpty(totalData) && ((((totalData.profitRs)) / (toMicro(totalData.cost_micros_gst))) * 100 || 0).toFixed(2)}%</span>
                       </Col>
                     </Row>
                   </>
                 )
               }/>
      </Spin>
    </>
  )
};

export default New_Dashboard;
