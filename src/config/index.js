const appConfig = {
  appAuth:"http://localhost:8000/google/auth",
  appUrl: "http://localhost:8000/api",
  token: localStorage.getItem("token") || "",
  xToken:localStorage.getItem("refresh_token") || "",
};

export default appConfig


