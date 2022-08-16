import axios from "axios";
import appConfig from "../config";

export const ManualEntry = async (accountId) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/accounts`, accountId,{
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
