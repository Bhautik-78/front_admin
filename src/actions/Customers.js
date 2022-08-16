import axios from "axios";
import appConfig from "../config";

export const createCustomer = async (customerDetail) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/customers/create`, customerDetail,{
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

export const UploadExcelForCustomers = async (formData) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/customers/excelUpload`, formData,{
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

export const updateCustomer = async (customerDetail) => {
  let result = {};
  try {
    const res = await axios.put(`${appConfig.appUrl}/customers/edit/${customerDetail._id}`, customerDetail,{
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

export const getAccountForCustomer = async () => {
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

export const deleteCustomer = async (deleteId) => {
  let result = {};
  try {
    const res = await axios.delete(`${appConfig.appUrl}/customers/delete/${deleteId}`,{
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

export const loadDataForCustomer = async (query) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/customers/get`,query,{
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

export const  fetchDataForCustomer = async (selectedAccountId) => {
  let result = {};
  try {
    const res = await axios.get(`${appConfig.appUrl}/customers?accountId=${selectedAccountId}`,{
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

export const saveDataForCustomer = async (payload) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/customers/export-data`,payload,{
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

export const getCustomer = async ({accountId : accId}) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/customers/get`,{accountId : accId},{
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
