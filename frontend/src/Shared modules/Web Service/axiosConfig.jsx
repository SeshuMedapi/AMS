// File: axiosConfig.js
import axios from "axios";
import { showModal } from "../../View Components/Session components/SessionController";

function checkIpAddress(ip) {
  if('localhost' === ip)
      return true

  const ipv4Pattern = 
      /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = 
      /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}

let b_url = "";

if (checkIpAddress(window.location.hostname) || ''){
  b_url = "http://"+ window.location.hostname+":8000/api"
}else{
  b_url = "https://"+ window.location.hostname+"/api"
}

const axiosInstance = axios.create({
  baseURL: b_url,
});


const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getTokenFromLocalStorage();

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    localStorage.setItem("sessionLoggedOut", "false");
    
    const ignoredEndpoints = [
      "/login",
      "/resetpassword/request",
      "/resetpassword"
    ];

    const isIgnoredEndpoint = ignoredEndpoints.some(endpoint => response.config.url.includes(endpoint));

    if (!isIgnoredEndpoint) {
      console.log("session reset");
      const sessionDuration = localStorage.getItem("sessionTime");
      const newExpiryTime = Date.now() + (sessionDuration ? sessionDuration * 1000 : 0);
      localStorage.setItem("expiryTime", newExpiryTime.toString());
    }

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestUrl = error.config.url;
        
      if (requestUrl.includes("/logout")) {
        window.location.href = "/";
      }
      const isSessionLoggedOut = localStorage.getItem("sessionLoggedOut") === "true";
      const sessionDurationExists = localStorage.getItem("sessionTime") !== null;
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

      const referrer = document.referrer;
      const appDomain = window.location.origin;

      const safeCreateURL = (urlString) => {
        try {
          return new URL(urlString);
        } catch (e) {
          console.error('Invalid URL:', urlString);
          return null;
        }
      };

      const referrerUrl = referrer ? safeCreateURL(referrer) : null;
      const appDomainUrl = safeCreateURL(appDomain);
      const isExternalReferrer = referrerUrl && appDomainUrl && referrerUrl.hostname !== appDomainUrl.hostname;

      if (!isAuthenticated && isSessionLoggedOut && sessionDurationExists) {
        if (isExternalReferrer) {
          window.location.href = "/";
        } else {
          const { detail } = error.response.data || {};

          if (["Invalid Main Token", "The Token is expired", "User is not active"].includes(detail)) {
            console.log("Error: Invalid Token");
            localStorage.removeItem('token');
            localStorage.removeItem('permissions');
            localStorage.setItem("isAuthenticated", "false");
            localStorage.removeItem('expiryTime');
            localStorage.setItem("sessionLoggedOut", "true");
            console.log("logged out 1");
            showModal();
          }
        }
      } else {
          if (!["/login", "/resetpassword/request", "/resetpassword"].some(endpoint => requestUrl.includes(endpoint))) {
          const { detail } = error.response.data || {};
          const expiryTime = localStorage.getItem('expiryTime');
          if ((["Invalid Main Token", "The Token is expired", "User is not active"].includes(detail))) {
              console.log("Error: Invalid Token");
              localStorage.removeItem('token');
              localStorage.removeItem('permissions');
              localStorage.setItem("isAuthenticated", "false");
              localStorage.removeItem('expiryTime');
              localStorage.setItem("sessionLoggedOut", "true");
              console.log("logged out 2");
              showModal();
            
          }
        }
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
