// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import moment from 'moment';
// import VConsole from 'vconsole'
// var vConsole = new VConsole();
// import 'lib-flexible/flexible.js'
import './assets/js/adapter'
import Navigation from 'vue-navigation'
import './styles/main.css';
import iView from 'iview';

//loading
import  { LoadingPlugin } from 'vux'
Vue.use(LoadingPlugin)
import  { AlertPlugin } from 'vux'
Vue.use(AlertPlugin)
import  { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
import { DatetimePlugin } from 'vux'
Vue.use(DatetimePlugin)
Vue.use(iView)

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'

library.add(fas, far, fab)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

import echarts from 'echarts'  //引入Echarts，
Vue.prototype.$echarts = echarts  //定义为全局变量


// 手机调试工具
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// export default vConsole

Vue.use(Navigation, {router})
//添加Fastclick移除移动端点击延迟
const FastClick = require('fastclick')
FastClick.attach(document.body)
// 挂载公用方法
import { commom } from './config/commom'
Vue.prototype.$commom = commom;
import http from './config/http'
Vue.prototype.$http = http;
//绑定API
import API from './config/server';
Vue.prototype.$API = API;
//绑定请求
import axios from 'axios'
Vue.prototype.$axios = axios;
//绑定后台地址
import host from './config/host'

Vue.config.productionTip = false

//显示当前时间
Vue.filter('getTime', function (value) {
  var date = new Date();
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var H = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
  return Y+M+D+H+m;
})

//如果不是全路径url,拼接图片url
Vue.filter('checkImgUrl', function (value) {
  if(value) {
    if(value.indexOf('http://') >= 0 || value.indexOf('https://') >= 0){
      return value;
    }else{
      return host.hostUrl + '/file/object?fileName=' + value;
    }
  } else {
    return
  }
})

// 时间戳转换为时间
Vue.filter('formatDate', (time) => {
  let formatTime;
  if (time !== null) {
    const date = new Date(time);
    formatTime = moment(date).format('YYYY-MM-DD HH:mm:ss');
  } else {
    formatTime = '-';
  }
  return formatTime;
});
Vue.filter('formatOnlyDate', (time) => {
  const date = new Date(time);
  return moment(date).format('YYYY-MM-DD');
});
Vue.filter('formatOnlyTime', (time) => {
  const date = new Date(time);
  return moment(date).format('HH:mm:ss');
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  router,
  components: { App },
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})


FastClick.prototype.focus = function (targetElement) {
  let length;
  if (targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};
