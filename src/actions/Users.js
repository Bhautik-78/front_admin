import axios from "axios";
import appConfig from "../config";

export const GetUsers = async () => {
  let result = {};
  try {
    const res = await axios.get(`${appConfig.appUrl}/users`,{
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

export const updateUsers = async (record) => {
  let result = {};
  try {
    const res = await axios.put(`${appConfig.appUrl}/users/edit/${record._id}`,record,{
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

export const DeleteUsers = async (deleteId) => {
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/users/delete/${deleteId}`,{
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

