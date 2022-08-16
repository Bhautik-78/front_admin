import React, {useEffect, useState} from 'react';
import {Collapse} from "reactstrap";
import _ from "lodash"
import * as XLSX from 'xlsx';
import {Button, Card, Col, Form, Input, message, Popconfirm, Row, Table, Upload, Switch, Spin} from "antd";
import {UserOutlined} from "@ant-design/icons";
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import {createGtc, getGtcData, deleteGtcData, updateGtcData, updateGtcDetail} from "../../actions";

message.config({top: 50});

const Geo_target_constant = (props) => {
  const [loading, setLoading] = useState(false);
  const [geoConstantDetail, setGeoConstantDetail] = useState({});
  const [collapseModalName, setCollapseModalName] = useState({});
  const [collapse, setCollapse] = useState(false);
  const [exportcollapse, setExportCollapse] = useState(false);
  const [gtcList, setGtcList] = useState([]);
  const [file, setFile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);


  const DeleteText = 'Are you sure to delete this GTC?';
  const EditText = 'Are you sure to edit this GTC?';

  useEffect(() => {
    getGtc()
  }, []);


  const handleChange = e => {
    const {name, value} = e.target;
    setGeoConstantDetail({...geoConstantDetail, [name]: value})
  }

  const updateDetails = async () => {
    setLoading(true);
    const res = await updateGtcDetail(geoConstantDetail);
    if (res && res.data) {
      setCollapse(false);
      message.success("GTC Edit Successfully");
      getGtc()
      setLoading(false);
    }
  }

  const updateStatus = async (record) => {
    setLoading(true);
    const res = await updateGtcDetail(record);
    if (res && res.data) {
      setCollapse(false);
      message.success("GTC Edit Successfully");
      getGtc();
      setLoading(false);
    }
  }

  const createDetails = async () => {
    setLoading(true);
    geoConstantDetail.status = "active";
    const res = await createGtc(geoConstantDetail);
    if (res && res.data) {
      setLoading(false);
      message.success("Successfully GTC Created");
      getGtc();
      setGeoConstantDetail({});
      setCollapse(false)
    }
  }

  const createGeoTargetConstant = () => {
    if (geoConstantDetail && geoConstantDetail._id) {
      updateDetails()
    } else {
      createDetails()
    }
  };

  const getGtc = async () => {
    setLoading(true);
    const res = await getGtcData();
    if (res && res.data) {
      setGtcList(res.data);
      setLoading(false)
    }
  };

  const confirmDeleteGtc = async (id) => {
    setLoading(true);
    const deleteId = (id._id);
    const res = await deleteGtcData(deleteId);
    setLoading(false);
    if (res && res.data) {
      getGtc();
      message.success("Account Delete Successfully")
    }
  };

  const confirmEditGtc = (data) => {
    setGeoConstantDetail(data);
    setCollapse(true);
    setCollapseModalName({title: "Edit Gtc", title2: "Edit Gtc", title3: "Edit Gtc", title4: "Cancel"})
  };

  const GtcButton = () => {
    setCollapse(!collapse)
    setExportCollapse(false);
    setGeoConstantDetail({});
    setCollapseModalName({
      title: "Add Geo_target_constant",
      title2: "create Gtc",
      title3: "Create Gtc",
      title4: "Cancel"
    })
  };

  const ExportsButton = () => {
    setExportCollapse(!exportcollapse);
    setCollapse(false)
  };

  const save = () => {
    const promiseBuilder = {
      updateAppPromise: (payload) => {
        return new Promise(async (resolve, reject) => {
          const isExist = gtcList.find(record => record.countryName === payload.countryName);
          if (isExist && isExist._id) {
            setLoading(true);
            const res = await updateGtcData({id: isExist._id, payload});
            if (res && res.data) {
              resolve({success: true});
              getGtc()
              setLoading(false);
              setExportCollapse(false)
            } else {
              resolve({success: false});
              setLoading(false);
            }
          } else {
            geoConstantDetail.status = "active";
            setLoading(true);
            const res = await createGtc(payload);
            if (res && res.data) {
              setLoading(false);
              resolve({success: true});
              getGtc();
              setExportCollapse(false)
            } else {
              setLoading(false);
              resolve({success: false})
            }
          }
        })
      }
    };
    if (Array.isArray(data) && data.length) {
      const allPromises = [];
      data.forEach((payload) => {
        allPromises.push(promiseBuilder.updateAppPromise(payload));
      });
      Promise.all(allPromises).then(values => {
        if (values.some(value => value.success)) {
          getGtc()
          setGeoConstantDetail({})
          setCollapse(false)
          message.success("Successfully uploaded");
        } else {
          message.error("Something went wrong")
        }
      });
    }
  };

  const processExcel = (data) => {
    const workbook = XLSX.read(data, {type: 'binary'});
    for (var i = 0; i < workbook.SheetNames.length; ++i) {
      var sheets = workbook.Sheets[workbook.SheetNames[i]];
    }
    const excelRows = XLSX.utils.sheet_to_row_object_array(sheets);
    setIsLoading(false);
    setData(excelRows);
  };

  const HandleUpload = (file) => {
    setIsLoading(true);
    const strFileName = file.name.split(".");
    if (['xls', 'xlsx'].includes(strFileName[strFileName.length - 1])) {
      if (typeof (FileReader) !== 'undefined') {
        setFile(file);
        const reader = new FileReader();
        if (reader.readAsBinaryString) {
          reader.onload = (e) => {
            processExcel(reader.result);
          };
          reader.readAsBinaryString(file);
        }
      } else {
        setIsLoading(false);
        message.error("Please upload a valid Excel file.")
      }
    } else {
      setIsLoading(false);
      message.error("Please upload a valid Excel file.")
    }
  };

  const ToggleActivity = (record, index) => {
    const isActive = gtcList[index].status;
    if (isActive === "active") {
      gtcList[index].status = 'inactive';
      updateStatus(record)
    } else {
      gtcList[index].status = 'active';
      updateStatus(record)
    }
    setGtcList(gtcList)
  };

  const columns = [
    {
      title: 'Country Code',
      dataIndex: 'countryCode',
    },
    {
      title: 'Country Name',
      dataIndex: 'countryName',
    },
    {
      title: 'Geo_target_constant',
      dataIndex: 'geo_target_constant',
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
                  confirmEditGtc(record)
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
                confirmDeleteGtc(record)
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
        <button type="button" className="btn btn-primary float-md-right" onClick={GtcButton}>Add Geo_target_constant
        </button>
        <button type="button" className="btn btn-primary float-md-right Exports" onClick={ExportsButton}>Exports
        </button>
        <Collapse isOpen={exportcollapse} id="exportCollapseExample">
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
        <Collapse isOpen={collapse} id="collapseExample">
          <Row>
            <Col span={8}/>
            <Col span={8}>
              <Card className="cardtop">
                <h2 className="h2login">{collapseModalName.title}</h2>
                <Form>
                  <Form.Item>
                    <label><b>Country Code</b></label>
                    <Input name="countryCode" onChange={handleChange} value={geoConstantDetail.countryCode}
                           placeholder="Enter Country Code" addonBefore={<UserOutlined/>}/>
                  </Form.Item>
                  <Form.Item>
                    <label><b>Country Name</b></label>
                    <Input name="countryName" onChange={handleChange} value={geoConstantDetail.countryName}
                           placeholder="Enter Country Name" addonBefore={<UserOutlined/>}/>
                  </Form.Item>
                  <Form.Item>
                    <label><b>Geo_target_constant</b></label>
                    <Input name="geo_target_constant" onChange={handleChange}
                           value={geoConstantDetail.geo_target_constant}
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
        <Table columns={columns} dataSource={gtcList || []} size="middle"/>
      </Spin>
    </div>
  )
};
export default Geo_target_constant;
