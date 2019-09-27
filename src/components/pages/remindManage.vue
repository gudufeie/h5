<template>
    <div class="main_wrap">
      <div class="deivceTop" style="position: fixed;top: 0;z-index: 110;">
        <device-selected class="changeDep" v-on:deviceDetail="handleDeviceDetail" v-on:departmentDetail='handleDepartment' @showSearch="showSearch" :deviceName="departmentDetail ? departmentDetail.departmentName : '未选择'">
        </device-selected>
        <div class="changeMore" @click="changeMore">{{checkMore}} <span class="iconfont icon-shaixuan"></span></div>
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
        <div class='dataNum'>共{{number}}条记录</div>
        <x-table :cell-bordered="false" style="top:20px;">
            <thead>
              <tr>
                  <td style="width:100px">设备/部件</td>
                  <td style="width:110px">最后提醒时间
                    <font-awesome-icon 
                      :icon="['fa','sort']" 
                      size="lg" 
                      @click="sort('updateTime', sort1)"/>
                  </td>
                  <td style="width:80px">工单状态</td>
                  <td>处理状态</td>
              </tr>
            </thead>
            <mescroll-vue class="me_scroll" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
              <x-table :cell-bordered="false">
              <tbody>
                <tr v-for="(item, index) in errorWorkSheetDatas" :key="index" @click="exceptionDetail(item)">
                    <td style="width:100px">{{!!item.componentName?item.componentName:item.deviceName}}</td>
                    <td style="width:110px">{{item.endRemindTime | formatDate}}</td>
                    <td v-if="item.errHandleType == 0" style="width:90px">未处理</td>
                    <td v-else-if="item.errHandleType == 1" style="width:90px">上报</td>
                    <td v-else-if="item.errHandleType == 2" style="width:90px">转办</td>
                    <td v-else-if="item.errHandleType == 3" style="width:90px">解决</td>
                    <td v-else-if="item.errHandleType == 4" style="width:90px">驳回</td>
                    <td v-else style="width:90px">未处理</td>
                    <td v-if="item.errHandleStatus == 1" style="color:#456de6">已解决</td>
                    <td v-else style="color:red">未解决</td>
                </tr>
              </tbody>
              </x-table>
            </mescroll-vue>
        </x-table>
      </div>
    </div>
</template>
<script>
import { Icon, Grid, GridItem,XTable,ButtonTab, ButtonTabItem} from 'vux'
import { constants } from 'crypto';
import request from '../../config/request.js';
import DeviceSelected from "../common/device-selected-detail-device";
import MescrollVue from "mescroll.js/mescroll.vue";
import BScroll from "better-scroll";

export default {
    components: {
        Icon,
        Grid,
        GridItem,
        XTable,
        DeviceSelected,
        ButtonTab,
        ButtonTabItem,
        MescrollVue
    },
  data(){
      return {
        number:0,
        nowColor:'',
        departmentId:0,
        errorWorkSheetDatas:[],
        userActionMap: {},
        showDep: false,
        //展示部门更多筛选
        showMore: false,
        checkMore:'筛选',
        departmentDetail: '',
        showSearch: '',
        sort1: false,
        runstatus: ['全部', '上报', '转办', '解决', '驳回'],
        ind: 0,
        show3: false,
        deviceNameSpot: '',
        deviceCodeSpot: '',
        componentName:'',
        componentCode:'',
        errorWorkSheetList:[],
        mescroll: null,
        mescrollDown: {},
        mescrollUp: {
          that: this,
          callback: this.upCallback,
          page: {
            num: 0,
            size: 20
          },
          htmlNodata: '<p class="upwarp-nodata">-- 暂无更多的数据 --</p>',
          noMoreSize: 5,
          toTop: {
            src: "./static/mescroll-totop.png",
            offset: 1000
          }
        },

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
      // this.getUserInfo()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter();
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave();
    next();
  },
  mounted: function(){
    this.$nextTick(() => {
      this.Scroll = new BScroll(this.$refs.mescroll,{click: true, tap: true});
    });
  },
  methods:{
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },

    upCallback(page, mescroll) {
      let params = {
        departmentId:this.departmentId,
        deviceName:this.deviceNameSpot,
        deviceCode:this.deviceCodeSpot,
        componentName:this.componentName,
        componentCode:this.componentCode,
        handleType:this.ind,
        pageNum: page.num,
        pageSize: page.size,
      };
      this.$http(this.$API.loadExecWorkSheet, params, true).then(res => {
        if (res.content) {
          this.number = res.totalElements;
          let data = res.content;
          if (page.num === 1) {
            this.errorWorkSheetList = [];
          }
          this.errorWorkSheetList = this.errorWorkSheetList.concat(data);
          this.errorWorkSheetDatas = this.errorWorkSheetList;
          this.$nextTick(() => {
            mescroll.endSuccess(data.length);
          });
        } else {
          this.mescroll.endErr();
        }
      });
    },

    changeBgc: function (index) {
      this.ind = index
    },
    showVuePopup3(flag) {
      if (flag === false){
        this.showMore = false;
      }
      this.show3 = flag;
    },

    // 排序
    sort(type, sorted) {
      if (sorted === false) {
        this.sort1 = true;
        this.errorWorkSheetDatas.sort(this.compare(type));
      }else{
        this.sort1 = false;
        this.errorWorkSheetDatas.sort(this.compare2(type));
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
    },

    handleDeviceDetail: function(deviceDetail){
      this.$store.commit('changeDeviceMessage',deviceDetail);
      this.getDeviceDetail();
    },

    // 部门筛选异常工单
    handleDepartment: function(departmentDetail){
      if(departmentDetail.id){
        this.departmentId = departmentDetail.id;
        this.mescroll.triggerDownScroll();
      }
    },

    // 条件筛选异常工单
    overBtn: function () {
      this.showMore = false;
      this.mescroll.resetUpScroll(true);
    },

    // 筛选重置
    reset: function(){
      this.deviceNameSpot = '',
      this.deviceCodeSpot = '',
      this.componentName = '',
      this.componentCode = ''
    },

    // 跳转异常详情
    exceptionDetail: function(item){
      this.$router.push({
        name:'remindManageDetail',
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
  .main_wrap{
    margin: 0 auto;
    height: 100%;
    width: 100%;
    padding-bottom: unset !important;
  }
  .contentWrap{
    padding-top: 20px;
  }
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
    width: 25%;
    margin: 0 10px;
  }
  .runStatusBtn button:focus{outline: none}
  .mask {
    position: absolute;
    top: 97%;
    width: 100%;
    left: -10px;
    height: -webkit-fill-available;
    background-color: rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease-in;
    z-index: 999;
  }
  .me_scroll {
    top: 120px;
    position: fixed;
    bottom: 130px;
    height: 85%;
  }
  table{
    width: 100%;
    table-layout:fixed;
    color:#fff !important;
  }

  table td{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  table thead{
    background-color: #18182c;
  }
  .dataNum{
    position: fixed;
    width: 100%;
    line-height: 30px;
    color: #fff;
    text-align: left;
    padding-left: 15px;
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
</style>


