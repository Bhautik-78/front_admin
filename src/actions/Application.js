import axios from "axios";
import appConfig from "../config";

export const createApplication = async (formData) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/application/create`, formData,{
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

export const getApps = async (custId) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/application/get`, custId,{
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

export const DeleteApplication = async (data) => {
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/application/delete/${data}`,{
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

export const updateApplication = async (data) => {debugger
  let result = {};
  try {
    const res = await axios.put(`${appConfig.appUrl}/application/edit/${data._id}`, data,{
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

export const getApplication = async () => {
  let result = {};
  try {
    const res = await axios.get(`${appConfig.appUrl}/application/get`,{
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


