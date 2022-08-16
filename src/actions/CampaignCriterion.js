import axios from "axios";
import appConfig from "../config";

export const updateCampaignCriterion = async (data) => {
  let result = {};
  try {
    const res = await axios.put(`${appConfig.appUrl}/campaignCriterion/edit/${data._id}`, data,{
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

export const DeleteCampaignCriterion = async (data) => {
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/campaignCriterion/delete/${data}`,{
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

export const getCampaignCriterion = async (data) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/campaignCriterion/get`,data,{
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

export const fetchCriterion = async (data) => {
  let result = {};
  try {
    const res = await axios.get(`${appConfig.appUrl}/campaignCriterion/${data}`,{
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


