<template>
    <div class="main_wrap">
      <div class="deivceTop" style="position: fixed;top: 0;z-index: 110;">
        <device-selected class="changeDep" v-on:deviceDetail="handleDeviceDetail" v-on:departmentDetail='handleDepartment' @showSearch="showSearch" :deviceName="departmentDetail ? departmentDetail.departmentName : '未选择'">
        </device-selected>
        <div class="changeMore" @click="changeMore" :class="activestyle">{{checkMore}} <span class="iconfont icon-shaixuan"></span></div>
        <div @click="backToHomepage" class="backTo"><img src="../../assets/icon/backHome.png" alt=""></div>
      </div>
      <div class="MoreDataP" v-if="showMore">
        <div class="deviceName">设备名称 <input type="text" placeholder="请输入设备名称" v-model="deviceNameSpot"></div>
        <div class="deviceCode">设备编号 <input type="text" placeholder="请输入设备编号" v-model="deviceCodeSpot"></div>
        <div class="deviceName">部件名称 <input type="text" placeholder="请输入部件名称" v-model="componentName"></div>
        <div class="deviceCode">部件编号 <input type="text" placeholder="请输入部件编号" v-model="componentCode"></div>
        <div>工单状态</div>
        <div class="runStatusBtn">
          <button type="button" v-for="(each, index) in runstatus" :class="{'active':ind === index, 'default':ind !== index}" @click="changeBgc(index)">{{each}}</button>
        </div>
        <div class="BtnGroup">
          <div class="btn-reset" @click="reset">重置</div>
          <div class="btn-over"  @click="overBtn">完成</div>
        </div>
        <div class="mask" v-show="show3" @click="showVuePopup3(false)"></div>
      </div>
      <div class="contentWrap">
        <x-table :cell-bordered="false">
            <thead>
              <tr>
                  <td>设备/部件</td>
                  <td>最后提醒时间<font-awesome-icon :icon="['fa','sort']" size="lg"/></td>
                  <td>工单状态</td>
                  <td>处理状态</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in errorWorkSheetDatas" :key="index" @click="exceptionDetail(item)">
                  <td>{{!!item.componentName?item.componentName:item.deviceName}}</td>
                  <td>{{item.updateTime | formatDate}}</td>
                  <td v-if="item.handleType == 1">上报</td>
                  <td v-else-if="item.handleType == 2">转办</td>
                  <td v-else-if="item.handleType == 3">解决</td>
                  <td v-else-if="item.handleType == 4">驳回</td>
                  <td v-if="item.workSheetType == 1" style="color:#456de6">已解决</td>
                  <td v-else style="color:red">未解决</td>
              </tr>
            </tbody>
        </x-table>
      </div>
    </div>
</template>
<script>
import { Icon, Grid, GridItem,XTable,ButtonTab, ButtonTabItem} from 'vux'
import { constants } from 'crypto';
import ScanSpot2 from "../../assets/icon/camera1.png"
import ScanSpot1 from "../../assets/icon/camera2.png"
import ChangeManage1 from "../../assets/icon/change2.png"
import ChangeManage2 from "../../assets/icon/addChange.png"
import request from '../../config/request.js';
import DeviceSelected from "../common/device-selected-detail-device"

export default {
    components: {
        Icon,
        Grid,
        GridItem,
        XTable,
        DeviceSelected,
        ButtonTab,
        ButtonTabItem
    },
  //   props: [
  //   //机器名
  //   "deviceName"
  // ],
  data(){
      return {
          nowColor:'',
          departmentId:'',
          spotCheckImg:ScanSpot2,
          changeManageImg:ChangeManage1,
          showCheckDatasInfo:[],
          depatrmentName: '',
          showCheckRecordDatas:[
            {
              name:'测试de',
              create_time:15432324324234,
              status:1,
              check_result:2
            }
            ],
          errorWorkSheetDatas:[],
          userActionMap: {},
          tabShow0:false,
          tabShow1:false,
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
          sort1: false,
          sort2: false,
          sortType: 'lastCheckTime',
          runstatus: ['全部', '上报', '转办', '解决', '驳回'],
          ind: 0,
          show3: false,
          activestyle: '',
          deviceNameSpot: '',
          deviceCodeSpot: '',
          componentName:'',
          componentCode:'',
          errorWorkSheetList:[]

      }
  },
  created:function(){
      let userInfo = request.getUserInfo();
      if (!userInfo || userInfo.roleAction.length <= 0) {
          return;
      }
      for (let item of userInfo.roleAction) {
      this.userActionMap[item.pageId] = item;
      }
      this.getUserInfo()
  },
  mounted: function(){
    this.handleDepartment();
  },
  methods:{
      // 获取登陆用户信息
      getUserInfo:function(){
          this.$http(this.$API.getUserInfo,{},true).then((res)=>{
            console.log(res.department)
              this.departmentId = 44
              this.$http(this.$API.loadExecWorkSheet,{departmentId:this.departmentId},true).then((data)=>{
              console.log('dddddd',data)
                this.errorWorkSheetDatas = this.errorWorkSheetList = data.workSheets
              })
          })
      },

      changeBgc: function (index) {
        this.ind = index
      },
      showVuePopup3(flag) {
      if (flag === false){
        this.showMore = false;
        this.activestyle = ''
      }
      this.show3 = flag;
      },

    //切换部门
    changeDep: function () {
      this.showDep = true;
      this.showMore = false;
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
      this.activestyle = 'change'
    },

    handleDeviceDetail: function(deviceDetail){
        this.$store.commit('changeDeviceMessage',deviceDetail);
        this.getDeviceDetail();
    },
    handleDepartment: function(departmentDetail){
    },
    overBtn: function () {
      this.errorWorkSheetDatas = [];
      for(var item of this.errorWorkSheetList){
        if(!!this.deviceNameSpot && item.deviceName.indexOf(this.deviceNameSpot) < 0){
          continue;
        }
        if(!!this.deviceCodeSpot && item.deviceCode.indexOf(this.deviceCodeSpot) < 0){
          continue;
        }
        if(!!this.componentName && item.componentName.indexOf(this.componentName) < 0){
          continue;
        }
        if(!!this.componentCode && item.componentCode.indexOf(this.componentCode) < 0){
          continue;
        }
        if(this.ind != 0 && item.handleType != this.ind){
          continue;
        }
        this.errorWorkSheetDatas.push(item)
      }
      this.showMore = false;
      this.activestyle = ''
    },

    // 筛选重置
    reset: function(){
      this.deviceNameSpot = '',
      this.deviceCodeSpot = '',
      this.componentName = '',
      this.componentCode = ''
    },
    exceptionDetail: function(item){
      this.$router.push({
        name:'remindManage',
        query:{
          workSheetInfo:item
        }
      })
    }
  },
}
</script>
<style  lang="less" scoped>
  @import '../../styles/iconfont.css';
  .deivceTop{
    width: 100%;
    height: 50px;
    background-color: #22233f;
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
    z-index: 110;
    height: auto;
    top: 50px;
    padding-bottom: 20px;
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
        height: 40px;
        line-height: 40px;
        color: #ffffff;
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
    width: 25%;
    margin: 0 10px;
  }
  .runStatusBtn button:focus{outline: none}
  .mask {
      /*position: fixed;*/
      /*width: 70%;*/
      /*left: 56px;*/
      /*bottom: 15px;*/
      /*border-radius: 20px;*/
      position: absolute;
      top: 97%;
      width: 100%;
      left: -10px;
      /* bottom: 15px; */
      /* border-radius: 20px; */
      height: -webkit-fill-available;
      background-color: rgba(0, 0, 0, 0.3);
      /*background-color: red;*/
      transition: all 0.2s ease-in;
      z-index: 999;
  }
  .change{
    color: #3967DC !important;
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
    table{
      color:#fff !important;
      margin-top: 13px;
    }
</style>


