<template>
	<div class="ompOrder">
	  <div class="orderRecord">
      <div class="menu_bar">
        <div class="deivceTop">
          <device-selected class="changeDep" v-on:deviceDetail="handleDeviceDetail" v-on:departmentDetail='handleDepartment' @showSearch="showSearch" :deviceName="departmentDetail ? departmentDetail.departmentName : '未选择'">
          </device-selected>
          <div class="changeMore" @click="changeMore" :class="activestyle">{{checkMore}} <span class="iconfont icon-shaixuan"></span></div>
          <div @click="backToHomepage" class="backTo"><img src="../../assets/icon/backHome.png" alt=""></div>
        </div>
        <div class="tab_wrapper">
          <tab default-color="#fff" active-color="#fff" bar-active-color="#456de6" :line-width="5" custom-bar-width="40px">
            <tab-item
              :selected="unprocessed"
              @on-item-click="tabClick(0)"
              style="background: #000"
              v-if="userActionMap['wechat_work_sheet']['actions'].indexOf('处理运维工单') >= -1">
              待处理工单
            </tab-item>
            <tab-item
              @on-item-click="tabClick(2)"
              style="background: #000"
              :selected="history">
              历史工单记录
            </tab-item>
          </tab>
        </div>
      </div>
      <div class="MoreDataP" v-if="showMore">
        <div class="deviceName">设备名称 <input type="text" placeholder="请输入设备名称" v-model="deviceName"></div>
        <div class="deviceCode">设备编号 <input type="text" placeholder="请输入设备编号" v-model="deviceCode"></div>
        <div class="deviceName">部件名称 <input type="text" placeholder="请输入部件名称" v-model="componentName"></div>
        <div class="deviceCode">部件编号 <input type="text" placeholder="请输入部件编号" v-model="componentCode"></div>
        <div>工单类型</div>
        <div class="runStatusBtn">
          <button type="button" v-for="(each, index) in workSheetType" :class="{'active':ind === index, 'default':ind !== index}" @click="changeBgc(index)">{{each}}</button>
        </div>
        <div v-if="historyShow">我参与的工单</div>
        <div class="runStatusBtn" v-if="historyShow">
          <button type="button" v-for="(each, index) in workSheetOfMine" :class="{'active':indMy === index, 'default':indMy !== index}" @click="changeMy(index)">{{each}}</button>
        </div>
        <div class="BtnGroup">
          <div class="btn-reset" @click="reset">重置</div>
          <div class="btn-over"  @click="overBtn">完成</div>
        </div>
        <!-- <div class="mask" v-show="show3" @click="showVuePopup3(false)"></div> -->
      </div>
      <div class="number">共{{number}}条记录</div>
      <div v-if="index === 0" class="sw">
        <x-table :cell-bordered="false" style="background-color:#fff;">
          <thead>
          <tr>
            <th>设备/部件</th>
            <th>工单类型</th>
            <th @click="sort('date', sort1, 1)">上报时间&ensp;<font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in workSheetList" :key="key">
              <td v-if="item.deviceName">{{item.deviceName}}</td>
              <td v-else-if="item.componentName">{{item.componentName}}</td>
              <td v-else>----</td>
              <td>
                <span v-if="item.workSheetType == 1">点巡检</span>
                <span v-else-if="item.workSheetType == 2">更换</span>
              </td>
              <td>{{item.workSheetTime | formatDate}}</td>
              <td><button class="process_btn" @click="workSheetDetail(item,type='unprocessed')">处理</button></td>
            </tr>
          </tbody>
        </x-table>
      </div>
      <div v-else class="xw">　　
      　<x-table :cell-bordered="false" style="background-color:#fff;">
          <thead>
            <tr>
              <th>设备/部件</th>
              <th>工单类型</th>
              <th @click="sort('date', sort1, 1)">上报时间&ensp;<font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
              <th>处理状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in historyWorkSheetList" :key="key" @click="workSheetDetail(item,type='processed')">
              <td v-if="item.componentName">{{item.componentName}}</td>
              <td v-else>{{item.deviceName}}</td>
              <td>
                <span v-if="item.workSheetType == 1">点巡检工单</span>
                <span v-else-if="item.workSheetType == 2">更换工单</span>
                <span v-else-if="item.workSheetType == 3">提醒工单</span>
                <span v-else>未知类型</span>
              </td>
              <td>{{item.workSheetTime | formatDate}}</td>
              <td>
                <span v-if="item.handleState == 1" style="color:red">未处理</span>
                <span v-if="item.handleState == 2" style="color:#456de6">已处理</span>
              </td>
            </tr>
          </tbody>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon, Tab, TabItem, XTable, Tabbar, TabbarItem, ButtonTab, ButtonTabItem} from 'vux';
import request from '../../config/request.js';
import DeviceSelected from "../common/device-selected-detail-device";
// import BScroll from "better-scroll";

export default {
  components: {
    Icon,
    Tab,
    TabItem,
    XTable,
    Tabbar,
    TabbarItem,
    ButtonTab,
    ButtonTabItem,
    DeviceSelected,
    // BScroll
  },
   data () {
    return {
      list: [],
      historyRecord: [],
      index: 0,
      changeBlack: 1,
      sortType: 'status',
      sort1: false,
      sort2: false,
      sort3: false,
      userActionMap:{},
      //展示部门列表
      showDep: false,
      //部门列表数据
      departments: ['一级部门', '二级部门', '三级部门'],
      radioValue: ['一级部门'],
      checkDep: '一级部门',
      //展示部门更多筛选
      showMore: false,
      checkMore:'筛选',
      departmentDetail: '',
      showSearch: '',
      workSheetType: ['全部','点巡检','更换'],
      workSheetOfMine: ['全部','我提交的工单','完结的工单'],
      ind: 0,
      indMy:0,
      show3: false,
      activestyle: '',
      unprocessedWorkSheet:[],
      unprocessed:true,
      history:false,
      userInfo:{},
      historyShow:false,

      deviceName:'',
      deviceCode:'',
      componentName:'',
      componentCode:'',
      workSheetList:[],
      historyWorkSheetList:[],
      unfinishCatch:[],
      historyCatch:[],
      myWorkSheetList:[],
      mySubmitWorkSheet:[],
      myFinishedWorkSheet:[],
      allWorkSheet:[],
      list2:[],
      number:0,
      workSheetTotal:0,
      toDealWorkSheetNum:0,
      mySubmitWorkSheetNum:0,
      myFinishedWorkSheetNum:0,
    }
  },
  mounted(){
    // this.$nextTick(() => {
    //   this.Scroll = new BScroll(this.$refs.MoreDataP,{click: true, tap: true});
    // });
  },
  methods: {
    tabClick (param) {
      this.index = param;
      if(param == 0){
        this.historyShow = false;
        this.list2 = this.workSheetList;
        this.number = this.workSheetList.length;
      }else if(param == 2){
        this.historyShow = true;
        this.list2 = this.historyWorkSheetList;
        this.number = this.historyWorkSheetList.length;
      }
    },

    // 排序
    sort(type, sorted, sortnumber) {
      if (sorted === false) {
        this.sort1 = true;
        this.sortType = 'workSheetTime';
        this.list2.sort(this.compare(this.sortType));
      } else {
        this.sort1 = false;
        this.sortType = 'workSheetTime';
        this.list2.sort(this.compare2('workSheetTime'));
      }
    },
    compare(attr) {
      return function(a,b){
         var x = a[attr];
         var y = b[attr];
         return ((x>y)?-1:(x<y)?1:0)
      }
    },
    compare2(attr) {
      return function(a,b){
         var x = a[attr];
         var y = b[attr];
         return ((x<y)?-1:(x>y)?1:0)
      }
    },
    change(attr) {
      this.changeBlack = attr;
     },
    changeBgc: function (index) {
      this.ind = index
    },

    changeMy: function (index) {
      this.indMy = index
    },
    // showVuePopup3(flag) {
    //   if (flag === false){
    //     this.showMore = false;
    //     this.activestyle = ''
    //   }
    //   this.show3 = flag;
    //   },
    //切换部门
    changeDep: function () {
      this.showDep = true;
      this.showMore = false;
    },
    //
    changeM (val, label) {
      if (this.checkDep != this.radioValue){
        if(val[0]){
          this.showDep = false;
        }
        this.checkDep = val[0];
      }
    },
    //返回首页
    backToHomepage: function () {
      this.$router.push({name:'homepage'});
    },
    //展开更多
    changeMore: function () {
      this.showMore = true;
      this.showDep = false;

      this.show3 = true;
      this.activestyle = 'changeM'
    },

    // 筛选工单
    overBtn: function () {
      if(this.index == 0){
        this.unfinishCatch = []
        for(var item of this.unprocessedWorkSheet){
          if(!!this.deviceName){
            if(!item.deviceName){
              continue;
            }else if(!!this.deviceName && (item.deviceName).indexOf(this.deviceName) < 0){
              continue;
            }
          }

          if(!!this.deviceCode){
            if(!item.deviceCode){
              continue;
            }else if(!!this.deviceCode && (item.deviceCode).indexOf(this.deviceCode) < 0){
              continue;
            }
          }

          if(!!this.componentName){
            if(!item.componentName){
              continue;
            }else if(!!this.componentName && (item.componentName).indexOf(this.componentName) < 0){
              continue;
            }
          }

          if(!!this.componentCode){
            if(!item.componentCode){
              continue;
            }else
            if(!!this.componentCode && (item.componentCode).indexOf(this.componentCode) < 0){
              continue;
            }
          }

          if(this.ind !=0 && this.ind != item.workSheetType){
            continue;
          }
          this.unfinishCatch.push(item)
        }
        this.workSheetList = this.unfinishCatch;
        this.showMore = false;
      }else if(this.index == 2){
        var dataList = [];
        if(this.indMy == 0){
          dataList = this.allWorkSheet;
        }else if(this.indMy == 1){
          dataList = this.mySubmitWorkSheet;
        }else if(this.indMy == 2){
          dataList = this.myFinishedWorkSheet;
        }

        this.historyCatch = [];
        for(var item of dataList){
          if(!!this.deviceName && item.deviceName.indexOf(this.deviceName) <0){
            continue;
          }
          if(!!this.deviceCode && item.deviceCode.indexOf(this.deviceCode) <0){
            continue;
          }
          if(!!this.componentName && item.componentName.indexOf(this.componentName) <0){
            continue;
          }
          if(!!this.componentCode && item.componentCode.indexOf(this.componentCode) <0){
            continue;
          }
          if(this.ind != '0' && parseInt(this.ind) != item.workSheetType){
            continue;
          }
          this.historyCatch.push(item)
        }
        this.historyWorkSheetList = this.historyCatch;
        this.number = this.historyWorkSheetList.length;
        this.showMore = false;
      }
    },

    handleDeviceDetail: function(deviceDetail){
        this.$store.commit('changeDeviceMessage',deviceDetail);
        this.getDeviceDetail();
    },

    // 部门选择
    handleDepartment: function(departmentDetail){
      // this.$router.push({
      //   name:'workSheetHomePage',
      //   query:{
      //     departmentId:departmentDetail.id
      //   }
      // })
    },

    // 获取要跳转的页面
    getPageName: function(){
      var pageName = this.$route.query.page;
      if(pageName == 'history'){
        this.index = 2;
        this.history = true;
        this.unprocessed = false;
        this.historyShow =true;
        this.historyWorkSheetList = this.list2 = this.$route.query.data;
        this.number = this.historyWorkSheetList.length;
        this.indMy = this.$route.query.index;
      }else{
        this.index = 0;
        this.history = false;
        this.unprocessed = true;
        this.historyShow =false;
        this.historyWorkSheetList = this.list2 = this.$route.query.allData;
      }
    },

    // 运维工单总量
    loadWorkSheetInfo: function(){
      this.$http(this.$API.workSheetInfo, {},true).then((data)=>{
        this.allWorkSheet = data.workSheets;
        this.list2 = this.allWorkSheet;
        this.workSheetTotal = this.allWorkSheet.length;
      })
    },
    // 部门下未完成工单
    loadUndealWorkSheets: function(){
      this.$http(this.$API.loadToDealWorkSheet, {},true).then((data)=>{
        if(data){
          this.unprocessedWorkSheet = this.workSheetList = data.workSheets;
        }else{
          this.unprocessedWorkSheet = this.workSheetList = []
        }
        if(this.index == 0){
          this.list2 = this.unprocessedWorkSheet;
          this.number = this.unprocessedWorkSheet.length;
        }
        this.toDealWorkSheetNum = this.unprocessedWorkSheet.length;
      })
    },

    // 历史工单记录
    getHistoryWorkSheet: function(){
      var params = {
        departmentId: this.userInfo.department
      }
      this.$http(this.$API.loadHistoryWorkSheet, params, true).then((data)=>{
        this.historyRecord = data;
      })
    },
    // 我回复过的工单
    getMyWorkSheets: function(){
      this.$http(this.$API.loadMyWorkSheet,{},true).then((data)=>{
        this.myWorkSheetList = data.workSheets
      })
    },

    workSheetDetail: function(item,type){
      this.$router.push({
        name:'workOrderDetails',
        query:{
          item:item,
          type:type
        }
      })
    },

    // 添加工单处理
    chooseLeader: function(data){
      this.$router.push({
        name: 'submitWorkOrder',
        query:{
          workSheet:data
        }
      })
    },

    // 我提交工单
    loadMyWorkSheets: function(){
      this.$http(this.$API.mySubmitWorkSheets, {},true).then((data)=>{
        if(data){
          this.mySubmitWorkSheet = data.workSheets
        }
        this.mySubmitWorkSheetNum = this.mySubmitWorkSheet.length;
      })
    },
    // 我完结的工单
    loadFinishedWorkSheets: function(){
      this.$http(this.$API.myFinishedWorkSheets, {},true).then((data)=>{
        if(data){
          this.myFinishedWorkSheet = data.workSheets
        }
        this.myFinishedWorkSheetNum = this.myFinishedWorkSheet.length;
      })
    },

    reset:function(){
      this.deviceName = '';
      this.deviceCode = '';
      this.componentName = '';
      this.componentCode = '';
    }
  },
  created: function(){
    this.userInfo = request.getUserInfo();
    if (!this.userInfo || this.userInfo.roleAction.length <= 0) {
        return;
    };

    for (let item of this.userInfo.roleAction) {
      this.userActionMap[item.pageId] = item;
    };

    this.loadUndealWorkSheets();
    this.getPageName();
    // this.getHistoryWorkSheet();
    this.getMyWorkSheets();
    this.loadMyWorkSheets();
    this.loadFinishedWorkSheets();
    this.loadWorkSheetInfo();
      }

}
</script>

<style lang="less" scoped>
  @import '../../styles/iconfont.css';
  .deivceTop{
    width: 100%;
    height: 50px;
    background: #22233f;
    text-align: center;
    .changeDep{
        width: 40%;
        height: 50px;
        font-size: 20px;
        line-height: 50px;
        /*padding: 10px 0 0 10px;*/
        color: #ffffff;
    }
    .backTo{
      position: absolute;
      right: 11px;
    }
    .changeMore{
        width: 40%;
        height: 50px;
        font-size: 16px;
        line-height: 50px;
        /*padding: 10px 0 0 10px;*/
        color: #ffffff;
        span{
          font-size: 17px;
        }
    }
    div{
      width: 20%;
      float: left;
      height: 50px;
      vertical-align: middle;
      img{
          width: 20px;
          height: 20px;
          padding: 20% 0;
      }
    }
}
  .DepData{
      position: absolute;
      width: 100%;
      z-index: 99;
    }
  .DepDataStyle{
      height: 50px;
      width: 90%;
      margin: 0 5%;
      font-size: 20px;
      text-align: left;
      line-height: 50px;
      color: #ffffff;
      border-bottom: rgba(255,255,255,0.2) 1px solid;
      .selectImg{
        width: 30px;
        height: 30px;
        float: right;
        margin: 10px;
      }
    }
  .MoreDataP{
    background: #2a2c52;
    position: fixed;
    width: 100%;
    z-index: 1000;
    top: 1.333rem;
    padding-bottom: 20px;
    overflow:auto;
    height:90%;

    .deviceName{
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    .deviceCode{
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    div{
      font-size: 16px;
      line-height: 40px;
      color: #ffffff;
      margin: 10px;
      input{
        margin-left: 20px;
        text-align: left;
        color:rgba(255,255,255,.5);
        font-size: 16px;
        &::-webkit-input-placeholder{
          color:rgba(255,255,255,.5);
          font-size: 14px;
        }
      }
    }
  }
  .active{
    background-color: #3967DC;
    color: #fff;
  }
  .default{
    background-color: #ddd;
    color: #000;
  }
  .runStatusBtn button{
    font-size: 16px;
    padding: 4px 10px;
    border: none;
    border-radius: 4px;
    /*width: 84px;*/
    width: 40%;
    margin: 0 10px;
  }
  .runStatusBtn button:focus{outline: none}
  .mask {
      position: absolute;
      top: 97%;
      width: 100%;
      left: -10px;
      height: -webkit-fill-available;
      background-color: #2a2c52;
      transition: all 0.2s ease-in;
      z-index: 999;
      height: 1rem;
      margin-bottom: 0 !important;
  }
  .change{
    color: #3967DC!important;
  }
  .BtnGroup{
    display: flex;
    height: 30px;
    line-height: 30px;
    width: fit-content;
    margin-top: 20px! important;
    float: right;
  }
  .btn-reset{
    background: #3967DC;
    padding: 0 15px;
    margin: 0!important;
    height: 30px;
    line-height: 30px!important;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
    border-right: 1px #22233f solid;
  }
  .btn-over{
    background: #3967DC;
    padding: 0 15px;
    margin: 0!important;
    height: 30px;
    line-height: 30px!important;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
  }
  .vux-popup-mask.vux-popup-show{
      z-index: unset !important;
    }
  *{
      -ms-touch-action: unset !important;
      touch-action: unset !important;
    }
  .orderRecord
  {
    height: 100%;
    position: absolute;
  }
  .btnList{
    display: flex;
    padding-left: 0.07rem;
    margin: 0.2rem 0;
  }
  .btnList button{
    margin-left: 0.21rem;
    border: none;
    border-radius: 10px;
    background: #000;
    color: #fff;
    padding: 4px 6px;
  }
  .vux-table.vux-table-no-cell-bordered{
    background-color: #22233f!important;
    color: #fff;
  }
  .vux-table:after{
    border: none;
  }
  .orderRecord{
    background: #22233f;
    width: 100%;
  }
  .weui-tabbar{
    position: fixed;
    background: #22233f;
    color: #fff;
  }
  #allOrder{
    background: #456de6;
  }
  .vux-button-group > a{
    margin: 0 0.05rem;
    color: #fff!important;
    background: #000!important;
  }
  .vux-button-group > a.vux-button-tab-item-first{
    border-radius: 15px!important;
    padding: 0 6px;
  }
  .vux-button-group > a.vux-button-tab-item-first:after{
    border: none!important;
  }
  .vux-button-group > a.vux-button-tab-item-middle{
    border-radius: 15px!important;
    padding: 0 6px;
  }
  .vux-button-group > a.vux-button-tab-item-middle:after{
    border: none!important;
  }
  .vux-button-group > a.vux-button-tab-item-last{
    border-radius: 15px!important;
    padding: 0 6px;
    margin-right: 5px;
  }
  .vux-button-group > a.vux-button-tab-item-last:after{
    border: none!important;
  }
  .vux-button-group > a.vux-button-group-current {
      background: #456de6!important;
  }
  .weui-tabbar:before{
    border: none;
  }
  .weui-tabbar__item{
    background: #000;
    padding: 0.3rem 0 0.2rem;
  }

  .colorChange {
    background-color: #22233f;
  }
  .number{
    position: fixed;
    top: 100px;
    line-height: 30px;
    color: #fff;
    padding-left: 15px;
    width: 100%;
  }
  table thead{
    background-color: rgba(0,0,0,0.3)
  }
</style>
<style>
    .vux-tab-container{
      /*position: fixed !important;*/
      /*top: 44px !important;*/
      z-index: 99;
    }
    .BtnGroup{
      display: flex;
      height: 30px;
      line-height: 30px;
      width: fit-content;
      margin-top: 20px!important;
      float: right;
    }
    .btn-reset{
      background: #3967DC;
      padding: 0 15px;
      margin: 0!important;
      height: 30px;
      line-height: 30px!important;
      border-bottom-left-radius: 15px;
      border-top-left-radius: 15px;
      border-right: 1px #22233f solid;
    }
    .btn-over{
      background: #3967DC;
      padding: 0 15px;
      margin: 0!important;
      height: 30px;
      line-height: 30px!important;
      border-bottom-right-radius: 15px;
      border-top-right-radius: 15px;
    }
    .vux-popup-mask.vux-popup-show{
      z-index: unset !important;
    }
    *{
      -ms-touch-action: unset !important;
      touch-action: unset !important;
    }
    body{
        background-color: #22233f;
        height: 100%;
        width: 100%;
    }
    .main_wrap{
        margin: 0 auto;
        height: 100%;
        width: 100%;
        padding-bottom: unset !important;
    }
    .contentWrap{
        /*height: 80%;*/
      padding-top: 40px;
    }
    .footer{
        position: fixed;
        bottom:0;
        left: 0;
        right:0;
        width: 100%;
        touch-action: none !important;
        /*padding-bottom: 5px;*/
    }
    .footer .weui-grid:after{
        border-bottom: none;
    }
    .footer .weui-grids:before{
        border-top: none;
    }
    .weui-grid{
        padding:0px 10px 0px 10px !important;
    }
    .footer .add_wrap{
        margin-bottom: 10px;
        text-align: center;
    }
    .footer .add_wrap button{
        border-radius: 20px;
        font-size: 16px;
        height: 45px;
        width: 50%;
        border: none;
        background-color: #456de6;
        color:#fff;

    }
    .footer .weui-grid__label{
        color: #fff;
    }

    .vux-tab{
        background-color: #22233f !important;
    }
    .vux-swiper{
        color: #fff;
    }
    .vux-swiper-item{
        overflow:auto;
    }
    .vux-tab-ink-bar{
        background: #456de6 !important;
    }
    .weui-tabbar{
        background-color: #22233f !important;
    }
    .sw{
      /* margin-top:50px; */
    }
    .process_btn{
      background-color: #22233f;
      border: 1px solid #456de6;
      color: #456de6;
      padding: 5px;
    }
    .tab_wrapper{
      /* position: fixed;
      z-index: 999;
      top:0px; */
    }
    .menu_bar{
      position:fixed;
      top:0px;
      width: 100%;
      z-index:999;
    }
    .sw,.xw{
      margin-top: 131px;
    }
</style>
