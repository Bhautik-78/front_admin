import axios from "axios";
import appConfig from "../config";

export const createUpdateSetting = async ({appId,share,bidDifference,cronJob,formula,costShare}) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/setting/create`, {appId,share,bidDifference,cronJob,formula,costShare},{
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

export const getSettingData = async (data) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/setting/get`,data,{
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
