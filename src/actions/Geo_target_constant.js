import axios from "axios";
import appConfig from "../config";

export const updateGtcDetail = async (data) => {
  let result = {};
  try {
    const res= await axios.put(`${appConfig.appUrl}/geotargetconstant/edit/${data._id}`, data,{
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


export const updateGtcData = async ({id,data}) => {
  let result = {};
  try {
    const res= await axios.put(`${appConfig.appUrl}/geotargetconstant/edit/${id}`, data,{
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

export const deleteGtcData = async (data) => {
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/geotargetconstant/delete/${data}`,{
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

export const createGtc = async (data) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/geotargetconstant/create`,data,{
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

export const getGtcData = async () => {
  let result = {};
  try {
    const res = await axios.get(`${appConfig.appUrl}/geotargetconstant/get`,{
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
