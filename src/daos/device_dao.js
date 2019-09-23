import request from '../config/request.js';
import host from '../config/host';

const loadDevice = function (params,callback) {
  request.postData(
    host.pcHostUrl+'/factory/device/loadDevices.json',
    params,callback
  )
};

export default {
    loadDevice
}
