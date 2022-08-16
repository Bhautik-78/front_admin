import axios from "axios";
import appConfig from "../config";

export const editAccount = async (userDetail) => {
  let result = {};
  try {
    const res = await axios.put(`${appConfig.appUrl}/accounts/edit/${userDetail._id}`,userDetail,{
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

export const CreateAccount = async (userDetail) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/accounts/create`,userDetail,{
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

export const getAccount = async () => {
  let result = {};
  try {
    const res = await axios.get(`${appConfig.appUrl}/accounts/get`,{
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

export const deleteAccount = async (deleteId) => {
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/accounts/delete/${deleteId}`,{
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
