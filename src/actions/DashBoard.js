import axios from "axios";
import appConfig from "../config";

export const FetchDataForDashBoard = async () => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/customers/get`,{},{
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

export const getDataForDashBoard = async () => {
  let result = {};
  try {
    const res = await axios.get(`${appConfig.appUrl}/campaign/get`,{
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

export const loadDataForDashBoard = async (payload) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/campaign/dashboard`, payload,{
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

export const loadDataForNewDashBoard = async (payload) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/finalCampaign/dashboard`, payload,{
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
}
