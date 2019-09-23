import request from '../config/request.js';
import host from '../config/host';

const loadProductData = function (params,callback) {
  request.postData(
    host.pcHostUrl+'/factory/dataReport/loadProductData.json',
    params,callback
  )
};

const loadRealTimeChart = function (params,callback) {
  request.postData(
    host.pcHostUrl+'/factory/dataReport/loadRealtimeChart.json',
    params,callback
  )
};

const loadProductChartByDay = function (params,callback) {
  request.postData(
    host.pcHostUrl+'/factory/dataReport/loadProductChartByDay.json',
    params,callback
  )
};

const loadProductChartByMonth = function (params,callback) {
  request.postData(
    host.pcHostUrl+'/factory/dataReport/loadProductChartByMonth.json',
    params,callback
  )
};

const loadProductChartByYear = function (params,callback) {
  request.postData(
    host.pcHostUrl+'/factory/dataReport/loadProductChartByYear.json',
    params,callback
  )
};



const inventSave = function(params,callback){
	request.postData(
    host.pcHostUrl+'/checkConfig/loadCheckRecords.json',
    params,callback
  )
}


export default {
  loadProductData,loadRealTimeChart,
  loadProductChartByDay,loadProductChartByMonth,
  loadProductChartByYear,inventSave
}
