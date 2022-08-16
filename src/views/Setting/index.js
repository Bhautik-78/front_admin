import React, {useEffect, useState} from "react";
import {Form, Input, message, Select, Spin, Tabs,Card} from 'antd';
 import {Row, Col} from "react-bootstrap";
 import {createUpdateSetting, getSettingData} from '../../actions'
import axios from "axios";
import appConfig from "../../config";
import {getApplication} from "../../actions/Application";

message.config({top : 50});

const {TabPane} = Tabs;

const Setting = () => {

  const [applicationList, setApplicationList] = useState([])
  const [cronJob,setCronJob] = useState("");
  const [costShare,setCostShare] = useState("");
  const [share, setShare] = useState("");
  const [bidDifference, setBidDifference] = useState("");
  const [formula, setFormula] = useState([{}]);
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [custName, setCustName] = useState({});

  const callback = (key) => {
    console.log(key);
  };

  useEffect(() => {
    getCustomers()
    fetchApplication()
  }, [])

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
      setApplicationList(data);
      setLoading(false);
      // handleLoadData()
    } else {
      setLoading(false);
      message.error("something went wrong")
    }
  }

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

  const searchCustName = (e) => {
    const {name, value} = e.target;
    setCustName({...custName, [name]: value})
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCustName({...custName, [name]: value})
  };

  const handelChangeShare = (e) => {
    const {value} = e.target;
    setShare(value)
  };
  const handelChangeBidDifference = (e) => {
    const {value} = e.target;
    setBidDifference(value)
  };

  const handelChangeCronJob = (e) => {
    const {value} = e.target;
    setCronJob(value)
  };

  const handelChangeCost0 = (e) => {
    const {value} = e.target;
    setCostShare(value)
  }

  const handelChangeFormula = (e, i) => {
    const {name, value} = e.target;
    formula[i][name] = value;
    setFormula([...formula])
  };

  const addObject = () => {
    formula.push({});
    setFormula([...formula])
  };

  const deleteObject = (e, i) => {
    const deleteFormula = formula.filter((item,index) =>index !== i);
    setFormula(deleteFormula)
  };

  const onBlur = () => {
    const updated = formula.map((item, index) => {
      if (Number(item.min) >= Number(item.max)) {
        formula[index].error = "please check your Min and Max"
      } else {
        formula[index].error = ""
      }
      return item
    });
    setFormula(updated)
  };

  const handleLoadData = async () => {
    setLoading(true);
    const {appId} = custName;
    let query = {};
    if (appId !== 'all') {
      query = {appId}
    } else if (appId === 'all') {
      query = {}
    }
    const res = await getSettingData(query);
    if (res && res.data && res.data.length) {
      setFormula(res.data[0].formula);
      setShare(res.data[0].share);
      setBidDifference(res.data[0].bidDifference);
      setCronJob(res.data[0].cronJob)
      setCostShare(res.data[0].costShare)
      setLoading(false);
    } else {
      console.log("some error occur");
      setShare("");
      setFormula([{}]);
      message.error("No Data Found");
      setLoading(false);
    }
  };

  const saveData = async () => {
    const appId = custName.appId;
    formula.forEach(item => {
      delete item.error
    });
    setLoading(true);
    const res = await createUpdateSetting({appId, share,bidDifference,cronJob, formula,costShare});
    if (res && res.data) {
      message.success("Successfully Setting Created");
      handleLoadData()
      setLoading(false);
    } else {
      console.log("Please enter valid data..")
      setLoading(false);
    }
    setShare("");
    setFormula([])
  };

  const isDisabledSave = () => {
    const isDisabled = Array.isArray(formula) && formula && formula.some(item => {
      const isMinError = item.min === "" || item.min === null || item.min === undefined;
      const isMaxError = item.max === "" || item.max === null || item.max === undefined;
      const isShareError = item.share === "" || item.share === null || item.share === undefined;
      return item.error || isMinError || isMaxError || isShareError
    });
    return isDisabled || !custName.appId
  };

   return (
    <div>
      <Spin spinning={loading}>
      {/*<Select className="customersDropdown" defaultValue="Select Customer"*/}
      {/*        onChange={value => searchCustName({target: {name: "custId", value}})}>*/}
      {/*  <Select.Option value='all'>All Customers</Select.Option>*/}
      {/*  {customersList.map(items => (*/}
      {/*    <Select.Option key={items.customerName} value={items.customerId}>{items.customerName}</Select.Option>*/}
      {/*  ))}*/}
      {/*</Select>*/}
        <Select defaultValue="Select Application" className="customersDropdown"
                onChange={value => handleChange({target: {name: "appId", value}})}>
          <Select.Option value='all'>All</Select.Option>
          {applicationList.map(items => (
            <Select.Option key={items.appName} value={items.appId}>{items.appName}</Select.Option>
          ))}
        </Select>
        <button type="button" className="btn btn-primary Exports" style={{marginLeft : "30px"}} onClick={handleLoadData}
                disabled={!custName.appId}>Load Data
        </button>
      <button type="button" className="btn btn-primary float-md-right Exports" disabled={isDisabledSave()} onClick={saveData}>Save</button>

      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Share" key="1">
          <Form>
            <Form.Item>
              <label><b>Enter Share</b></label><br/>
              <Input type="number" className="shareNumber" name="shareNumber"
                     onChange={(e) => handelChangeShare(e)}
                     value={share}
                      placeholder="Enter Share"/>
            </Form.Item>
            <Form.Item>
              <label><b>Enter Bid Difference</b></label><br/>
              <Input type="bidDifference" className="shareNumber" name="bidDifference"
                     onChange={(e) => handelChangeBidDifference(e)}
                     value={bidDifference}
                      placeholder="Enter Bid Difference"/>
            </Form.Item>
            <Form.Item>
              <label><b>Cron Job</b></label><br/>
              <Input type="number" className="shareNumber" name="shareNumber"
                     onChange={(e) => handelChangeCronJob(e)}
                     value={cronJob}
                     placeholder="Enter Cron Job"/>
            </Form.Item>
            <Form.Item>
              <label><b>Cost 0</b></label><br/>
              <Input type="number" className="shareNumber" name="CostShareNumber"
                     onChange={(e) => handelChangeCost0(e)}
                     value={costShare}
                     placeholder="Enter Share"/>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Formula" key="2">
          <button type="button" className="btn btn-primary float-md-right Exports"
                  onClick={addObject} disabled={isDisabledSave()}>Add New
          </button>
          <br/><br/>
          {formula.map((item, i) => {
               return (
                <div key={i} className="d-flex justify-content-between" style={{width:"100%"}}>
                  <div/>
                  <Card className="formulaCard">
                    <div key={i}>
                      <Row>
                        <Col>
                          <Form>
                            <Form.Item>
                              <label ><b>Min:</b></label>
                              <Input type="number" className="minMax" name="min"
                                     value={item.min}
                                     onBlur={onBlur}
                                     onChange={(e) => handelChangeFormula(e, i)}
                                     placeholder="Enter Min"/>
                            </Form.Item>
                            <Form.Item>
                              <label><b>Max:</b></label>
                              <Input type="number" className="minMax" name="max"
                                     value={item.max}
                                     onBlur={onBlur}
                                     onChange={(e) => handelChangeFormula(e, i)}
                                     placeholder="Enter Max"/>
                            </Form.Item>
                            <Form.Item>
                              <label><b>Share:</b></label>
                              <Input type="number" className="share" name="share"
                                     value={item.share}
                                     onChange={(e) => handelChangeFormula(e, i)}
                                     placeholder="Enter Share"/>
                            </Form.Item>
                            <span style={{color: "red"}}>{item.error}</span>
                          </Form>
                        </Col>
                          <button type="button" className="btn btn-danger deleteObjectSetting" onClick={(e) => deleteObject(e, i)}>
                            Delete
                          </button>
                      </Row>
                    </div>
                  </Card>
                  <div/>
                </div>
              );
            }
          )
          }
        </TabPane>
      </Tabs>
      </Spin>
    </div>
  )
};

export default Setting
