import axios from "axios";
import appConfig from "../config";

export const LoadDataAllCampaign = async (date) => {
  let result = {};
  try {
    const res = await axios.post(`${appConfig.appUrl}/finalCampaign/getAllCampaign`, date,{
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
