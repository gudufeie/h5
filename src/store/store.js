import Vue from 'vue'
import Vuex from 'vuex'
import { stat } from 'fs';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  	radioObj:null,//点击对象
    //底部栏index
    mode: 0,
    //设备信息
    deviceMessage: null,
    //记录详情
    detail: null,
    //设备部件列表
    deviceComponent: null,
    //用户信息
    user: null,
    //位置
    position: null,
    //部件信息
    componentData: null,
    pageNum: null,
    departmentData: null
  },
  mutations: {
  	setRadio(state,n){
  		state.radioObj = n
  	},
    changeMode (state, n) {
      // 变更状态
      state.mode = n;
    },
    changeDeviceMessage (state, detail) {
      // 保存查看设备信息
      state.deviceMessage = detail;
      localStorage.setItem('deviceMessage', JSON.stringify(detail));
    },
    saveDetail (state, detail) {
      // 保存查看设备信息
      state.detail = detail;
      localStorage.setItem('detail', JSON.stringify(detail));
    },
    saveDeviceComponent(state, detail) {
      // 保存查看设备信息
      state.deviceComponent = detail;
      localStorage.setItem('deviceComponent', JSON.stringify(detail));
    },
    saveUser(state, detail) {
      // 保存查看设备信息
      state.user = detail;
      localStorage.setItem('user', JSON.stringify(detail));
    },
    savePosition(state,position) {
      state.position = position
    },
    saveComponentData(state,detail) {
      // 保存查看设备信息
      state.componentData = detail;
      localStorage.setItem('componentData', JSON.stringify(detail));
    },
    changeDepartmentData(state,data) {
      state.departmentData = data
    },
    changePageNum(state,pageNum) {
      state.pageNum = pageNum
    },
    checkId(state,curId){
      //保存巡检选厂的id
      state.curId = curId
      localStorage.setItem('curId', JSON.stringify(curId));
    }
  }
})

export default store
