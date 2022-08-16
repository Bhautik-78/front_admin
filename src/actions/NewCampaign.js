import axios from "axios";
import appConfig from "../config";

export const FetchDataCampaign = async (formData) => {debugger
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/finalCampaign/create`, formData,{
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

export const LoadDataCampaign = async (formData) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/finalCampaign/get`, formData,{
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
}

export const UploadExcelForFinalCampaign = async (formData) => {debugger
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/finalCampaign/excelUpload`, formData,{
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

export const FetchDataCampaignApplication = async (formData) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/finalCampaign/createOne`, formData,{
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
}



