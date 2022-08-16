import React, {useState} from 'react';
import moment from "moment"
import XLSX from "xlsx"
import {Button, Col, Input, message, Row, Select, Spin, Upload} from "antd";
import _ from "lodash";
import * as exceljs from 'exceljs';
import {saveAs} from 'file-saver';

message.config({top: 50});

const Excel_Converter = () => {

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState({});
  const [column, setColumn] = useState({});
  const [columnKey, setColumnKey] = useState([]);
  const [oldExcelData, setOldExcelData] = useState([]);
  const [newExcelData, setNewExcelData] = useState([]);
  const [detail, setDetail] = useState({
    name : "",
    price : 1
  });

  const handleChange = e => {
    const {name, value} = e.target;
    setDetail({...detail, [name]: value})
  };

  const handleChange1 = (e) => {
    const {name, value} = e.target;
    setColumn({...column, [name]: value})
  };

  const HandleUpload = async (file) => {
    setIsLoading(true);
    const strFileName =  file.name.split(".");
    if (['xls','xlsx'].includes(strFileName[strFileName.length-1]) ) {
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
    }else {
      setIsLoading(false);
      message.error("Please upload a valid Excel file.")
    }
  };

  const processExcel = (data) => {
    const workbook = XLSX.read(data, {type: 'binary'});
    for ( var i = 0; i <workbook.SheetNames.length ; ++i) {
      var sheets = workbook.Sheets[workbook.SheetNames[i]];
    }
    const excelRows = XLSX.utils.sheet_to_row_object_array(sheets);
    setIsLoading(false);
    setOldExcelData(excelRows);
    setColumnKey(Object.keys(excelRows[0]))
  };

  // const HandleUpload = async (file) => {
  //   const strFileName = file.name.split(".");
  //   if (['xls', 'xlsx'].includes(strFileName[strFileName.length - 1])) {
  //     if (typeof (FileReader) !== 'undefined') {
  //       setFile(file);
  //     } else {
  //       message.error("Please upload a valid Excel file.")
  //     }
  //   } else {
  //     setLoading(false);
  //     message.error("Please upload a valid Excel file.")
  //   }
  // };

  // const processExcel = workbook => {
  //   const sheetNamesList = workbook.SheetNames
  //   const filesData = {}
  //   sheetNamesList.forEach(sheetName => {
  //     const worksheet = workbook.Sheets[sheetName]
  //     const headers = {}
  //     const data = []
  //     for (const z in worksheet) {
  //       if (z[0] === "!") continue
  //       let tt = 0
  //       for (let i = 0; i < z.length; i++) {
  //         if (!isNaN(z[i])) {
  //           tt = i
  //           break
  //         }
  //       }
  //       const col = z.substring(0, tt)
  //       const row = parseInt(z.substring(tt))
  //       const value = worksheet[z].v
  //       if (row == 1 && value) {
  //         headers[col] = value
  //         continue
  //       }
  //       if (!data[row]) data[row] = {}
  //       // if (headers[col] === "Date") {
  //       //   const parsedDate = moment(value).add("day", 1).format("YYYY-MM-DD")
  //       //   data[row][headers[col]] = parsedDate
  //       // } else {
  //       data[row][headers[col]] = value
  //       // }
  //
  //     }
  //     data.shift()
  //     data.shift()
  //     filesData[sheetName] = data
  //   })
  //   return filesData
  // }

  const save = async () => {
    const {Date,Country,Revenue} = column
    if(Date && Country && Revenue){
      const result = oldExcelData.map(item => {
        return{
          Date: item[Date],
          Country: item[Country],
          "Ad Exchange revenue (₹)": item[Revenue],
        }
      })
      if (result) {
        setLoading(false);
        setNewExcelData(result)
        message.success("successFully")
      } else {
        setLoading(false);
        message.error("something went wrong")
      }
    }else {
      message.error("Please Select Below Column")
    }
    // let formData = new FormData();
    // formData.append('file', file);
    // setLoading(true);
    // const res = await Application(formData);
    // if (res && res.data) {
    //   setLoading(false);
    //   setExcelData(res.data.payload)
    //   message.success("successFully")
    // } else {
    //   setLoading(false);
    //   message.error("something went wrong")
    // }
  };

  const onDownloadXLS = () => {
    if (newExcelData && file && detail.name) {
      setLoading(true)
      const result = newExcelData.map(item => ({
        Date: moment(item.Date).format("YYYY-MM-DD"),
        Country: item.Country,
        "Ad Exchange revenue (₹)": ((parseFloat((item["Ad Exchange revenue (₹)"]).replace('$' || '₹', '')))) * (parseFloat(detail.price)),
        "App ID": detail.name || ""
      }))
      prepareAndDownload(result);
    } else {
      message.error('Something went wrong! Please try again later!')
    }
  }

  const prepareAndDownload = (rows) => {
    const workbook = new exceljs.Workbook();
    workbook.creator = 'BVM InfoTech';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet("Google Ads");
    worksheet.columns = [
      {header: 'App ID', key: 'App ID', width: 30},
      {
        header: 'Ad Exchange revenue (₹)',
        key: 'Ad Exchange revenue (₹)',
        width: 25,
        style: {alignment: {wrapText: true}}
      },
      {header: 'Country', key: 'Country', width: 25, style: {alignment: {wrapText: true}}},
      {header: 'Date', key: 'Date', width: 25, style: {alignment: {wrapText: true}}},
    ];
    rows.forEach((x) => {
      worksheet.addRow(x);
    });

    const firstRow = worksheet.getRow(1);
    firstRow.font = {name: 'New Times Roman', family: 4, size: 10, bold: true};
    firstRow.alignment = {vertical: 'middle', horizontal: 'center'};
    firstRow.height = 30;

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
      saveAs(blob, `new ${file.name}`);
    });

    setDetail({})
    setFile({})
    setLoading(false)
  }

  return (
    <>
      <Spin spinning={loading}>
      <Row>
        <Input placeholder="Enter Your AppId" name="name" style={{width: "20%"}}
               value={detail.name || ''}
               onChange={handleChange}/>
        <Input placeholder="price" name="price" type="number" style={{width: "7%"}}
               value={detail.price || null}
               onChange={handleChange}/>
      </Row><br/>
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
        <Button
          type="primary"
          size={"large"}
          onClick={onDownloadXLS}
          disabled={!newExcelData.length}
        >Download</Button>
      </Row>
      <Row style={{marginTop : "14px"}}>
        <p style={{textAlign: "center", marginRight: "53px"}}>Date</p>
        <Select defaultValue="Select Column" className="customersDropdown"
                onChange={value => handleChange1({target: {name: "Date", value}})}>
          {columnKey.map(items => (
            <Select.Option key={items} value={items}>{items}</Select.Option>
          ))}
        </Select>
      </Row><br/>
      <Row style={{marginTop : "14px"}}>
        <p style={{textAlign: "center", marginRight: "33px"}}>Country</p>
        <Select defaultValue="Select Column" className="customersDropdown"
                onChange={value => handleChange1({target: {name: "Country", value}})}>
          {columnKey.map(items => (
            <Select.Option key={items} value={items}>{items}</Select.Option>
          ))}
        </Select>
      </Row><br/>
      <Row style={{marginTop : "14px"}}>
        <p style={{textAlign: "center", marginRight: "31px"}}>Revenue</p>
        <Select defaultValue="Select Column" className="customersDropdown"
                onChange={value => handleChange1({target: {name: "Revenue", value}})}>
          {columnKey.map(items => (
            <Select.Option key={items} value={items}>{items}</Select.Option>
          ))}
        </Select>
      </Row><br/>
      </Spin>
    </>
  )
};

export default Excel_Converter;
