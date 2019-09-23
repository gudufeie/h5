import axios from 'axios'

axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8';
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

const getUserInfo = function () {
  let userInfo = localStorage.getItem("user");
  if (userInfo) {
    userInfo = JSON.parse(userInfo);
  }
  return userInfo;
};

const getData = function (url, success, error) {
  let userInfo = getUserInfo();

  const config = {
    headers: {
      userId: userInfo ? userInfo.userId : ""
    }
  };

  axios.get(url, config)
    .then((response) => {
      if (response.data.status === 0) {
        success(response.data.data);
      } else {
        if (error) {
          error(response.data.description);
        } else {
          console.log(response.data.description || '请求失败');
        }
      }
    })
    .catch((e) => {
      console.log(e);
      if (error) {
        error('网络请求失败');
      }
    })
};

const postData = function (url, data, success, error, headers) {
  const config ={};
  if(headers){
    config.headers=headers;
  }else{
    config.headers={};
  }
  let userInfo = getUserInfo();
  if(data) {
    data.userId = userInfo ? userInfo.id : "";
  }else{
    data = {userId : userInfo ? userInfo.id : ""}
  }

  axios.post(url, data, config)
    .then((response) => {
      if (response.data.status === 0) {
        success(response.data.data);
      } else {
        if (error) {
          error(response.data.description);
        } else {
          console.log(response.data.description || '请求失败');
        }
      }
    })
    .catch((e) => {
      if (error) {
        error('网络请求失败');
      }
    })
};

export default {
  getData,
  postData,
  getUserInfo
}




