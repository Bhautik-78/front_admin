import React, {useRef, useEffect, useState, PureComponent} from 'react';
import _ from "lodash"
import {DatePicker, Select, Space, Spin, Card, Col, Row, message} from "antd";
// import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import ReactHighcharts from "react-highcharts";
import {Bar} from 'react-chartjs-2';
import moment from "moment";
import {
  FetchDataForDashBoard,
  getDataForDashBoard,
  loadDataForDashBoard,
  loadDataForNewDashBoard
} from '../../actions/DashBoard'
import './card.css'
import {getApplication} from "../../actions/Application";

message.config({top: 50});
const DATE_FORMATE = 'YYYY-MM-DD';

const DashBoard = () => {
  const chart = useRef(null);
  const [loading, setLoading] = useState(false);
  const [dashBoard, setDashBoard] = useState({});
  const [sum, setSum] = useState({});
  const [dayWiseSum, setDayWiseSum] = useState([]);
  const [data, setData] = useState([])
  const [date, setDate] = useState([])

  const toMicro = (value) => {
    return value / 1000000
  };

  useEffect(() => {
    // fetchData();
    // fetchCampaign();
    fetchApplication()
  }, []);

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

  const onChange = (date, name) => {
    setDashBoard({...dashBoard, [name]: date && moment(date).format(DATE_FORMATE)})
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setDashBoard({...dashBoard, [name]: value})
  };

  // const fetchData = async () => {
  //   setLoading(true);
  //   const res = await FetchDataForDashBoard({});
  //   if (res && res.data) {
  //     if (res && res.data && res.data.length) {
  //       setLoading(false);
  //       setCustmerList(res.data);
  //     }
  //   } else {
  //     setLoading(false);
  //     console.log("Please enter valid data..")
  //   }
  // };

  // const fetchCampaign = async () => {
  //   setLoading(true);
  //   const res = await getDataForDashBoard();
  //   if (res && res.data) {
  //     if (res && res.data && res.data.length) {
  //       setLoading(false);
  //       setCampaignList(res.data);
  //     }
  //   } else {
  //     setLoading(false);
  //     console.log("Please enter valid data..")
  //   }
  // };

  const onLoadData = async () => {
    const {appId, startDate, endDate} = dashBoard;
    const payload = {startDate, App: appId, endDate};
    // const res = await loadDataForDashBoard(payload);
    const res = await loadDataForNewDashBoard(payload);
    if (res && res.data) {
      setSum(res.data.sum);
      setDayWiseSum(res.data.payload)
      const filterDate = res.data.payload.map(item => ({
        Date : item.Date
      }))
      setDate(filterDate)
      message.success("Successfully")
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  };

  const labelDate = date.map(item => item.Date)
  const revenue = dayWiseSum.map(item => item.Ad_Exchange_revenue)
  const cost = dayWiseSum.map(item => toMicro(item.cost_micros))
  const profitRs = dayWiseSum.map(item => item.profitRs)
  const profitPr = dayWiseSum.map(item => item.profitPR)
  const state = {
    labels: labelDate,
    datasets: [
      {
        label: 'revenue',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: revenue
      }
    ]
  }

  const state1 = {
    labels: labelDate,
    datasets: [
      {
        label: 'cost',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: cost
      }
    ]
  }

  const state2 = {
    labels: labelDate,
    datasets: [
      {
        label: 'profitRs',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: profitRs
      }
    ]
  }

  const state3 = {
    labels: labelDate,
    datasets: [
      {
        label: 'profitPr',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: profitPr
      }
    ]
  }

  return (
    <div>
      <Spin spinning={loading}>
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
          value={dashBoard && dashBoard.startDate && moment(dashBoard.startDate, DATE_FORMATE)}
          placeholder="Start Date"
          name='startDate'/>
      </Space>
      <Space direction="vertical">
        <DatePicker
          onChange={(date) => onChange(date, "endDate")}
          value={dashBoard && dashBoard.endDate && moment(dashBoard.endDate, DATE_FORMATE)}
          placeholder="End Date"
          format={DATE_FORMATE}
          name='endDate'
        />
      </Space>
      <button type="button" className="btn btn-primary Exports" style={{marginLeft : "30px"}} onClick={onLoadData}>Load Data</button>
      <Row gutter={16} style={{marginTop: "70px"}}>
        <Col span={6} style={{justifyContent: 'center', display: "flex"}}>
          <Card className="DashBoardCard" title="Revenue" bordered={false} style={{backgroundColor: "lightGreen"}}>
            <b>{sum && sum.Ad_Exchange_revenue && (sum.Ad_Exchange_revenue).toFixed(2)}</b>
          </Card>
        </Col>
        <Col span={6} style={{justifyContent: 'center', display: "flex"}}>
          <Card className="DashBoardCard" title="Cost" bordered={false} style={{backgroundColor: "lightGrey"}}>
            <b>{sum && sum.cost_micros && toMicro((sum.cost_micros).toFixed(2))}</b>
          </Card>
        </Col>
        <Col span={6} style={{justifyContent: 'center', display: "flex"}}>
          <Card className="DashBoardCard" title="Profit(Rs)" bordered={false} style={{backgroundColor: "lightPink"}}>
            <b>{sum && sum.profitRs && (sum.profitRs).toFixed(2)}</b>
          </Card>
        </Col>
        <Col span={6} style={{justifyContent: 'center', display: "flex"}}>
          <Card className="DashBoardCard" title="Profit(%)" bordered={false} style={{backgroundColor: "lightBlue"}}>
            <b>{sum && sum.profitPR && sum.profitPR.toFixed(2)}</b>
          </Card>
        </Col>
      </Row>

      <Row>
        <Bar data={state} options={{
          title: {display: true, text: 'revenue', fontSize: 40}, legend: {display: true, position: 'right'},
          scales: {
            xAxes: [{
              ticks: {
                fontSize: 20
              }
            }],
            yAxes: [{
              ticks: {
                fontSize: 20
              }
            }]
          }
        }}/>
        <Bar data={state1} options={{
          title: {display: true, text: 'cost', fontSize: 40}, legend: {display: true, position: 'right'}, scales: {
            xAxes: [{
              ticks: {
                fontSize: 20
              }
            }],
            yAxes: [{
              ticks: {
                fontSize: 20
              }
            }]
          }
        }}/>
      </Row>

      <Row>
        <Bar data={state2} options={{
          title: {display: true, text: 'profitRs', fontSize: 40}, legend: {display: true, position: 'right'}, scales: {
            xAxes: [{
              ticks: {
                fontSize: 20
              }
            }],
            yAxes: [{
              ticks: {
                fontSize: 20
              }
            }]
          }
        }}/>
        <Bar data={state3} options={{
          title: {display: true, text: 'profitPr', fontSize: 40}, legend: {display: true, position: 'right'}, scales: {
            xAxes: [{
              ticks: {
                fontSize: 20
              }
            }],
            yAxes: [{
              ticks: {
                fontSize: 20
              }
            }]
          }
        }}/>
      </Row>
      </Spin>
    </div>
  )
};

export default DashBoard;
