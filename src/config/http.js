//封装请求
'use strict'
import axios from 'axios'
import qs from 'qs'

// axios.interceptors.request.use(config => {
//   // loading
//   return config
// }, error => {
//   return Promise.reject(error)
// })

// axios.interceptors.response.use(response => {
//   return response
// }, error => {
//   return Promise.resolve(error.response)
// })

const http = function(url, data,status,callback,loadingShow){
  if(!loadingShow) {
    this.$vux.loading.show();
  }

  let httpDefaultOpts = { //http默认配置
    method: 'post',
    url: url,
    timeout: 120000,
    data: qs.stringify(data),
    withCredentials:true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      "Accept": "application/json",
      "Content-Type": "application/json; charset=UTF-8"
    }
  }
  if(status){
    httpDefaultOpts.headers["Content-Type"] = 'application/x-www-form-urlencoded; charset=UTF-8'
  }
  let resData = axios(httpDefaultOpts).then(
    (res) => {
      if(res.data.success){
        this.$vux.loading.hide();
        if(res.data.data){
          return res.data.data;
        }
        return true;
      }else{
        this.$vux.loading.hide();
        if(callback){
          callback();
        }
        if(res.data.description) {
          this.$commom.alert(res.data.description);
        }else if (res.data.code === 6001) {
          this.$commom.alert('获取用户信息失败');
          this.$router.push({name: 'login'})
        }
      }
    }
  ).catch(
    (response) => {
      console.log(response);
      this.$vux.loading.hide();
      this.$commom.alert('服务器异常');
    }
  )
  return resData;
}
export default http;
