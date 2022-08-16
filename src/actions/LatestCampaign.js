import axios from "axios";
import appConfig from "../config";

export const GetDataForLatestCampaign = async (formData) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/finalCampaign/getData`, formData,{
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

export const SelectedRowsByBid = async (data,appId) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/finalCampaign/selectedRowByBId`,{rows: data, appId: appId} ,{
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
