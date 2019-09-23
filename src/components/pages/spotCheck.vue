<template>
    <div class="main_wrap">
      <div class="deivceTop" style="position: fixed;top: 0;z-index: 110;background-color:rgba(0,0,0,0.3)">
        <device-selected 
          ref = 'selectDepart'
          class="changeDep" 
          :options='selectDepartment'
          v-on:deviceDetail="handleDeviceDetail" 
          v-on:departmentDetail='handleDepartment' 
          :deviceName="departmentDetail ? departmentDetail.departmentName : '未选择'">
        </device-selected>
        <div class="changeMore" @click="changeMore">{{checkMore}} <span class="iconfont icon-shaixuan"></span></div>
        <div @click="backToHomepage" class="backTo"><img src="../../assets/icon/backHome.png" alt=""></div>
      </div>
      <div class="MoreDataP" v-if="showMore">
        <div class="deviceName">设备名称 <input type="text" placeholder="请输入设备名称" v-model="deviceNameSpot"></div>
        <div class="deviceCode">设备编号 <input type="text" placeholder="请输入设备编号" v-model="deviceCodeSpot"></div>
        <div class="BtnGroup">
          <div class="btn-reset" @click="reset">重置</div>
          <div class="btn-over"  @click="overBtn">完成</div>
        </div>
        <div class="mask" v-show="show3" @click="showVuePopup3(false)"></div>
      </div>
      <div class="contentWrap">
        <tab :line-width=3 line-color="#456de6" active-color='#fff' v-model="tabIndex" default-color="#fff">
            <tab-item
                class="vux-center"
                :selected="demo2 === item"
                v-for="(item, index) in tltles"
                @on-item-click="tabSelect(index)"
                :key="index"
                >{{item}}
            </tab-item>
        </tab>
        <div class='dataNum'>共{{number}}条记录</div>
        <swiper v-model="tabIndex" :show-dots="false"  style="height: 45px;">
            <swiper-item>
                <x-table :cell-bordered="false">
                    <thead>
                    <tr>
                        <td v-for="(item, index) in headNames" :key="index" style="width: 33.3%;text-align: center">
                          {{item}}
                          <font-awesome-icon :icon="['fa','sort']" size="lg" v-if="item == '最后点巡检时间' && tabIndex == 0" @click="leapfrogSort('lastCheckTime', sort1, 1)"/>
                          <font-awesome-icon :icon="['fa','sort']" size="lg" v-if="item == '最后点巡检时间' && tabIndex == 1" @click="leapfrogSort('create_time', sort2, 2)"/>
                        </td>
                    </tr>
                    </thead>
                </x-table>
            </swiper-item>
        </swiper>
      </div>
      <div class="dataContentSpot" ref="dataContent">
          <div class="deviceTable">
            <mescroll-vue :class="scrollName" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <x-table :cell-bordered="false" class="deviceData"  v-show="tabIndex == 0">
                <tr v-for="(item, index) in showCheckDatas" :key="index"  @click="componentCheckInfo(item)">
                  <td>{{item.deviceName}}</td>
                  <td>{{item.lastCheckTime}}</td>
                  <td style="color:red">可执行</td>
                </tr>
            </x-table>
            <x-table :cell-bordered="false" class="componentData"  v-show="tabIndex == 1">
              <tr v-for="(item, index) in showCheckRecordDatas" :key="'add-'+index" @click="toDeviceInfo(item)">
                  <td>{{item.name}}</td>
                  <td v-if="item.create_time">{{item.create_time | formatDate}}</td>
                  <td v-else></td>
                  <td v-if="item.check_result == 1">正常</td>
                  <td v-else-if="item.check_result == 2" style="color:#456de6">轻微故障</td>
                  <td v-else-if="item.check_result == 3" style="color:#919128">中度故障</td>
                  <td v-else-if="item.check_result == 4" style="color:red">重度故障</td>
                  <td v-else>----</td>
              </tr>
            </x-table>
            </mescroll-vue>
          </div>
      </div>
      <div class="footer">
        <div class="add_wrap" v-if="scanShow" @click="scanAdd">
            <button>扫码添加</button>
        </div>
        <grid :show-lr-borders="false" :show-vertical-dividers="false">
            <grid-item label='点巡检'
            @on-item-click="spotCheckClick"
            v-if="userActionMap['wechat_manage']['actions'].indexOf('添加点巡检')>=0 || userActionMap['wechat_manage']['actions'].indexOf('查看点巡检记录')>=0">
                <img slot="icon" :src="spotCheckImg">
            </grid-item>
            <grid-item
                label='更换'
                style="background-color:rgba(0,0,0,0.2)"
                @on-item-click="changeManageClick"
                v-if="userActionMap['wechat_manage']['actions'].indexOf('查看更换记录')>=0 || userActionMap['wechat_manage']['actions'].indexOf('添加更换记录')>=0">
                <img slot="icon" :src="changeManageImg">
            </grid-item>
        </grid>
      </div>
    </div>
</template>
<script>
import { Icon, Grid, GridItem ,Tab, TabItem ,Swiper,SwiperItem,XTable,ButtonTab, ButtonTabItem} from 'vux'
import { constants } from 'crypto';
import ScanSpot2 from "../../assets/icon/camera1.png"
import ScanSpot1 from "../../assets/icon/camera2.png"
import ChangeManage1 from "../../assets/icon/change2.png"
import ChangeManage2 from "../../assets/icon/addChange.png"
import request from '../../config/request.js';
import DeviceSelected from "../common/device-selected-detail-device"
import BScroll from "better-scroll";
import MescrollVue from "mescroll.js/mescroll.vue"
let _this = null

export default {
    components: {
        Icon,
        Grid,
        GridItem,
        Tab,
        TabItem,
        Swiper,
        SwiperItem,
        XTable,
        DeviceSelected,
        ButtonTab,
        ButtonTabItem,
        BScroll,
        MescrollVue
    },
  data(){
    return {
      nowColor:'',
      departmentId:'',
      tabIndex: 0,
      tltles: [],
      demo2: '添加点巡检',
      spotCheckImg:ScanSpot2,
      changeManageImg:ChangeManage1,
      showCheckDatas:[],
      showCheckDatasInfo:[],
      departmentName: '',
      showCheckRecordDatas:[],
      showCheckRecordDatasInfo:[],
      headNames:[],
      addCheckTitles:['设备名称','最后点巡检时间','状态'],
      CheckRecordTitles:['设备名称','最后点巡检时间','结果'],
      userActionMap: {},
      tabShow0:false,
      tabShow1:false,
      scanShow:true,
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
      sort1: false,
      sort2: false,
      sortType: 'lastCheckTime',
      runstatus: ['全部', '正常', '轻微故障', '中度故障', '重度故障'],
      ind: 0,
      show3: false,
      activestyle: '',
      deviceNameSpot: '',
      deviceCodeSpot: '',
      selectDepartment:{},
      url:'',
      scrollName:'me_scroll',
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
      departmentId:0,
      departmentInfo:{},
      number:0,
      checkConfigNum:0,
      checkRecordNum:0
    }
  },
  created:function(){
    let localUrl = location.href.split('#')[0];
    this.$http(this.$API.getWxSign,{url:encodeURIComponent(localUrl)}, true).then((res) => {
      if (res){
        wx.config({
          debug: false,
          appId: res.appId, // 必填,公众号的唯一标识
          timestamp: res.timestamp, // 必填,生成签名的时间戳
          nonceStr: res.nonceStr, // 必填,生成签名的随机串
          signature: res.signature, // 必填,签名
          jsApiList: ['scanQRCode'] // 必填,需要使用的JS接口列表
        });
          /* 处理失败验证 */
        wx.error(function (res) {
        // config 信息验证失败会执行error函数,如签名过期导致验证失败,具体错误信息可以打开config的debug模式查看,也可以在返回的res参数中查看,对于SPA可以在这里更新签名
        });
      }
    });

    _this = this
    this.getDomin();
    let userInfo = request.getUserInfo();
    if (!userInfo || userInfo.roleAction.length <= 0) {
        return;
    }
    this.departmentInfo = JSON.parse(this.$route.query.department);
    this.departmentId = this.departmentInfo.id;

    for (let item of userInfo.roleAction) {
      this.userActionMap[item.pageId] = item;
    }

    if(this.userActionMap['wechat_manage']['actions'].indexOf('添加点巡检') >= 0){
        this.tltles.push('添加点巡检')
    }
    if(this.userActionMap['wechat_manage']['actions'].indexOf('查看点巡检记录') >= 0){
        this.tltles.push('点巡检记录')
    }
    this.loadData();
    this.getUserInfo();
    this.getCheckConfigNum();
    this.getCheckRecordNum();
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
    this.selectDepartment ={
      departmentInfo:this.departmentInfo
    }
  },
  methods:{
    getDomin: function(){
      this.url = window.location.protocol +'//'+ window.location.host;
    },

    getUserInfo: function(){
      this.$http(this.$API.getUserInfo,{},true).then((res)=>{
        this.departmentName = res.departmentName;
      })
    }, 
    // 判断点击的Tab
    tabSelect:function(config){
        this.tabIndex = config
        if(this.tabIndex ==0){
          this.scrollName = 'me_scroll';
          this.headNames = this.addCheckTitles;
          this.scanShow = true;
          this.deviceNameSpot = '';
          this.deviceCodeSpot = '';
          this.getCheckConfigNum();
        }else{
          this.scrollName = 'record_scroll';
          this.headNames = this.CheckRecordTitles;
          this.scanShow = false;
          this.deviceNameSpot = '';
          this.deviceCodeSpot = '';
          this.getCheckRecordNum();
          this.mescroll.resetUpScroll(true);
        }
    },
    // 设置表头内容
    loadData:function(){
        this.headNames = this.addCheckTitles;
    },

    // 查看设备点巡检记录
    deviceCheckRecord:function(config){
        this.$router.push({
            name: `deviceCheckRecord`,
            query: {
                deviceId:config.device_id
            }
        })
    },

    // 查看部件点巡检记录
    componentCheckRecord:function(config){
        this.$router.push({
        name: `componentCheckRecord`,
        query: {
            deviceId:config.device_id,
          }
        })
    },

    toDeviceInfo: function(item){
      this.$router.push({
        name: `deviceInfo`,
        query: {
            deviceInfo: item
          }
        })
    },

    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },

    upCallback(page, mescroll) {
      if(this.tabIndex == 0){
        let params = {
          departmentId:this.departmentId,
          deviceName:this.deviceNameSpot,
          deviceCode:this.deviceCodeSpot,
          pageNum: page.num,
          pageSize: page.size,
        };
        this.$http(this.$API.deviceCheckRecordList, params, true).then(res => {
          if (res.content) {
            let data = res.content;
            if (page.num === 1) {
              this.showCheckDatas = [];
            }
            this.showCheckDatas = this.showCheckDatas.concat(data);
            this.showCheckDatasInfo = this.showCheckDatas;
            this.$nextTick(() => {
              if(res.pageNum === res.totalPages){
                mescroll.endSuccess(data.length,false);
              }else{
                mescroll.endSuccess(data.length);
              }
            });
          } else {
            this.mescroll.endErr();
          }
        });
      }else if(this.tabIndex == 1){
        let params = {
          departmentId:this.departmentId,
          deviceName:this.deviceNameSpot,
          deviceCode:this.deviceCodeSpot,
          pageNum: page.num,
          pageSize: page.size
        };
        this.$http(this.$API.loadDeviceCheckRecords, params, true).then(res => {
          if (res.content) {
            let data = res.content;
            if (page.num === 1) {
              this.showCheckRecordDatas = [];
            }
            this.showCheckRecordDatas = this.showCheckRecordDatas.concat(data);
            this.showCheckRecordDatasInfo = this.showCheckRecordDatas;
            this.$nextTick(() => {
              if(res.pageNum === res.totalPages){
                mescroll.endSuccess(data.length,false);
              }else{
                mescroll.endSuccess(data.length);
              }
            });
          } else {
            this.mescroll.endErr();
          }
        });
      }
    },
    // 获取当前登陆人的设备点巡检设置
    loadDeviceCheckRecord: function(){
      let param = {
        departmentId:0
      }
      this.$http(this.$API.deviceCheckRecordList, param, true).then((res)=>{
        this.showCheckDatas = res;
        this.showCheckDatasInfo = res;
      })
    },

    // 获取当前登陆人的设备点巡检记录
    loadDeviceCheckRecordList: function(){
      let param = {
        departmentId:0
      }
      this.$http(this.$API.loadDeviceCheckRecords, param, true).then((res)=>{
          this.showCheckRecordDatas = res;
          this.showCheckRecordDatasInfo = res;
      })
    },

    spotCheckClick: function(){
        this.spotCheckImg = ScanSpot2;
        this.changeManageImg = ChangeManage1;
        // this.$router.push({name: 'spotCheck'})
        window.location.href = this.url + '/#/operaionManage/spotCheck?department='+ JSON.stringify(this.departmentInfo);
    },
    changeManageClick: function(){
        this.spotCheckImg = ScanSpot1
        this.changeManageImg = ChangeManage2
        window.location.href = this.url + '/#/manage/deviceDetailManage/addReplace?department='+ JSON.stringify(this.departmentInfo);
        // this.$router.push({name: 'addReplace'})
    },

    // 设备下所有部件点巡检记录
    componentCheckInfo: function(config){
        this.$router.push({
            name: `componentCheck`,
            query: {
              deviceInfo:config,
            }
        })
    },
    showVuePopup3(flag) {
      if (flag === false){
        this.showMore = false;
        this.activestyle = ''
      }
      this.show3 = flag;
    },
    // 添加设备点巡检
    addDeviceCheck: function(config){
        this.$router.push({
            name: `addDeviceCheck`,
            query: {
                deviceInfo:config,
                departmentId: config.departmentId,
                departmentName: this.departmentName,
                // operator: this.showCheckRecordDatas[0].operator
            }
        })
    },
    spotCheckDetail:function(config){
        this.$router.push({
        name: `workSheetDetail`,
        query: {
            id: config.checkId,
            checkTime: config.lastCheckTime,
            queryName: false,
            name: 'deviceCheck'
            }
        })
    },
    // 查询部门下所有设备
    dataProduce:function(){

    },
    loadDeviceList: function(){
      this.$http(this.$API.getUserInfo,{},true).then((res)=>{
          this.departmentId = res.department;
          var param =  {
              departmentId: this.departmentId,
              };
          DeviceDao.loadDevice(param,res=>{
          })
      })
    },
    //切换部门
    changeDep: function () {
      this.showDep = true;
      this.showMore = false;
    },
    //
    change (val, label) {
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
    },
    //跳转到设备信息页面
    getIndex:function(index){
      this.$router.push({name: 'deviceInfo'});

      },
    handleDeviceDetail: function(deviceDetail){
        this.$store.commit('changeDeviceMessage',deviceDetail);
        this.getDeviceDetail();
    },

    // 部门筛选
    handleDepartment: function(departmentDetail){
      this.departmentInfo = departmentDetail;
      this.selectDepartment ={
        departmentInfo:departmentDetail
      }
      this.departmentId = departmentDetail.id;
      this.mescroll.triggerDownScroll();
      if(this.tabIndex == 0){
        this.getCheckConfigNum();
      }else{
        this.getCheckRecordNum();
      }
    },

    // 条件筛选
    overBtn: function () {
      this.showMore = false;
      this.mescroll.resetUpScroll(true);
      if(this.tabIndex == 0){
        this.getCheckConfigNum();
      }else{
        this.getCheckRecordNum();
      }
    },

    reset:function(){
      this.deviceNameSpot = '';
      this.deviceCodeSpot = '';
    },

    leapfrogSort(type, sorted, sortnumber) {
      if (sortnumber === 1){
        if (sorted === false) {
          this.sort1 = true;
          this.sortType = type;
          this.showCheckDatas.sort(this.compare(type));
        }else{
          this.sort1 = false;
          this.sortType = type;
          this.showCheckDatas.sort(this.compare2(type));
        }
      }else {
        if (sorted === false) {
          this.sort2 = true;
          this.sortType = type;
          this.showCheckRecordDatas.sort(this.compare(type));
        }else{
          this.sort2 = false;
          this.sortType = type;
          this.showCheckRecordDatas.sort(this.compare2(type));
        }
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
    //扫码添加
    scanAdd: function () {
      let strUrl = '';
      wx.ready(()=>{
        wx.scanQRCode({ // 微信扫一扫接口
        desc: 'scanQRCode desc',
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          //扫码之后返回设备信息，获取设备id，跳转对应页面
          strUrl = res.resultStr;
          let name="state";
          let reg = new RegExp('(^|&)' + name + '=([^&]*)(#|$)', 'i');
          let r = strUrl.substr(1).match(reg);
          let id = '';
          if (r != null) {
            id =  r[2].split("#")[0];
          }
          window.location.href = _this.url + '/#/operaionManage/spotCheck/componentCheck?deviceId=' + id;
         }
      })
      }).catch((err)=>{
        console.log(err)
      });
    },
    // 获取点巡检和更换可操作的数量
    getCheckConfigNum: function(){
      let param = {
        departmentId:this.departmentId,
        deviceName:this.deviceNameSpot,
        deviceCode:this.deviceCodeSpot,
      }
      //点巡检设备数目
      this.$http(this.$API.getCheckConfigNum,param, true).then((res)=>{
          if(res){
          this.checkConfigNum = res.count;
          }
          if(this.tabIndex == 0){
            this.number = this.checkConfigNum;
          }
      })
    },
    getCheckRecordNum: function(){
      let param = {
        departmentId:this.departmentId,
        deviceName:this.deviceNameSpot,
        deviceCode:this.deviceCodeSpot,
      }
      //点巡检设备数目
      this.$http(this.$API.getDeviceCheckRecordNum, param, true).then((res)=>{
        if(res){
        this.checkRecordNum = res.count;
        }
        if(this.tabIndex == 1){
          this.number = this.checkRecordNum;
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
    top: 165px;
    position: fixed;
    bottom: 130px;
    height: 50%;
  }

  .record_scroll{
    top: 165px;
    position: fixed;
    bottom: 130px;
    height: 60%;
  }
  .deviceTable{
    transform:unset ! important;
  }
  table{
    width: 100%;
    table-layout:fixed;
    margin-top:0px !important;
  }

  table td{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  table thead{
    background-color: rgba(0, 0, 0, 0.3);
  }

  .dataNum{
    line-height: 30px;
    color: #fff;
    text-align: left;
    padding-left: 15px;
  }
</style>
<style>
    .vux-tab-container{
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
      padding-top: 50px !important;
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
    .dataContentSpot{
    color:#fff;
    height: 60%;
    overflow: hidden;
    pointer-events: auto;
  }
  .dataContentSpot .vux-table tr{display: flex;}
  .dataContentSpot .vux-table tr>td{flex: 1;text-align: center}
</style>


