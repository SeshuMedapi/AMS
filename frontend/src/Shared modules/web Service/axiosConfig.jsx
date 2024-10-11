import axios from "axios";

let b_url = "";

if (checkIpAddress(window.location.hostname) || ''){
  b_url = "http://"+ window.location.hostname+":8001/api"
}else{
  b_url = "https://"+ window.location.hostname+"/api"
}

const axiosInstance = axios.create({
  baseURL: b_url,
});