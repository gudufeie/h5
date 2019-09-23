import request from '../config/request.js';
import host from '../config/host';

const loadDeviceSpotCheckRecord = function (params,callback) {
    request.postData(
      host.pcHostUrl+'/checkConfig/loadCheckRecords.json',
      params,callback
    )
  };

const getUser = function(callback){
    request.postData(
        host.pcHostUrl+'/user/getUserInfo.json',
        {},callback
    )
}

  export default {
    loadDeviceSpotCheckRecord,getUser
  }