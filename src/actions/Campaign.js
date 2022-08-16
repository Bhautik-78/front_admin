import axios from "axios";
import appConfig from "../config";

export const UploadExcelForCampaign = async (formData) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/campaign/excelUpload`, formData,{
      headers: {
        Authorization: `${appConfig.token}`
      }
    });
    result = res.data || {};
    return {success: true, data: result};
  } catch (err) {
    console.log("error in getting info : ", err);
    return {
      success: false,
      message: (err) || "something went wrong"
    };
  }
};

export const FetchDataForCampaign = async (formData) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/campaign`, formData,{
      headers: {
        xToken: `${appConfig.xToken}`,
        Authorization: `${appConfig.token}`
      }
    });
    result = res.data || {};
    return {success: true, data: result};
  } catch (err) {
    console.log("error in getting info : ", err);
    return {
      success: false,
      message: (err) || "something went wrong"
    };
  }
};

export const DeleteDataForCampaign = async (deleteId) => {
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/campaign/delete/${deleteId}` ,{
      headers: {
        Authorization: `${appConfig.token}`
      }
    });
    result = res.data || {};
    return {success: true, data: result};
  } catch (err) {
    console.log("error in getting info : ", err);
    return {
      success: false,
      message: (err) || "something went wrong"
    };
  }
};

export const GetDataForCampaign = async (payload) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/campaign/get`,payload ,{
      headers: {
        Authorization: `${appConfig.token}`
      }
    });
    result = res.data || {};
    return {success: true, data: result};
  } catch (err) {
    console.log("error in getting info : ", err);
    return {
      success: false,
      message: (err) || "something went wrong"
    };
  }
};

export const SelectedRowsByBidCamp = async (data,appId) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/campaign/selectedRowByBId`,{rows: data, appId: appId} ,{
      headers: {
        xToken: `${appConfig.xToken}`,
        Authorization: `${appConfig.token}`
      }
    });
    result = res.data || {};
    return {success: true, data: result};
  } catch (err) {
    console.log("error in getting info : ", err);
    return {
      success: false,
      message: (err) || "something went wrong"
    };
  }
};

export const DayByBid = async (customerId) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/campaign/dayByBId`,{customerId: customerId} ,{
      headers: {
        Authorization: `${appConfig.token}`
      }
    });
    result = res.data || {};
    return {success: true, data: result};
  } catch (err) {
    console.log("error in getting info : ", err);
    return {
      success: false,
      message: (err) || "something went wrong"
    };
  }
};

export const SelectedRowsByBudget = async (data) =>{
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/campaign/selectedRowByBudget`,data ,{
      headers: {
        Authorization: `${appConfig.token}`
      }
    });
    result = res.data || {};
    return {success: true, data: result};
  } catch (err) {
    console.log("error in getting info : ", err);
    return {
      success: false,
      message: (err) || "something went wrong"
    };
  }
};

export const deleteSelectedRecord = async (data) =>{
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/campaign/deleteCampaign` ,{
      headers: {
        Authorization: `${appConfig.token}`
      },
      data: {
        source: data
      }
    });
    result = res.data || {};
    return {success: true, data: result};
  } catch (err) {
    console.log("error in getting info : ", err);
    return {
      success: false,
      message: (err) || "something went wrong"
    };
  }
};
