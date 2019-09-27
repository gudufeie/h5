<template>
  <div class="deviceInfomation">
    <div class="deivceTop" style="position: fixed;top: 0;z-index: 110;">
      <device-selected 
        class="changeDep" 
        v-on:deviceDetail="handleDeviceDetail" 
        v-on:departmentDetail='handleDepartment' 
        @showSearch="showSearch" 
        :deviceName="departmentDetail ? departmentDetail.departmentName : '未选择'">
      </device-selected>
      <div class="changeMore" @click="changeMore">{{checkMore}} <span class="iconfont icon-shaixuan"></span></div>
      <div @click="backToHomepage"><img src="../../assets/icon/backHome.png" alt=""></div>
    </div>
    <div class="MoreDataP" v-if="showMore">
      <div class="deviceName">设备名称 <input type="text" placeholder="请输入设备名称" v-model="deviceNameChoose"></div>
      <div class="deviceCode">设备编号 <input type="text" placeholder="请输入设备编号" v-model="deviceCodeChoose"></div>
      <div>运行状态</div>
      <div class="runStatusBtn">
        <button type="button" v-for="(each, index) in runstatus" :class="{'active':ind === index, 'default':ind !== index}" @click="changeBgc(index)">{{each}}</button>
      </div>
      <div class="BtnGroup">
        <div class="btn-reset" @click="reset">重置</div>
        <div class="btn-over"  @click="overBtn">完成</div>
      </div>
      <div class="mask" v-show="show3" @click="showVuePopup3(false)"></div>
    </div>
    <div class="deviceNum">共{{deviceNum}}条记录</div>
    <div class="table-title">
      <span>设备名称</span>
      <span>设备编号</span>
      <span @click="leapfrogSort('run', sort2)">是否运行 <font-awesome-icon :icon="['fa','sort']" size="lg" /></span>
      <span>设备状态</span>
    </div>
    <div class="dataContent" ref="dataContent">
      <div class="deviceTable">
        <mescroll-vue class="me_scroll" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
          <x-table :cell-bordered="false" class="deviceData" v-if="deviceInfoShow">
              <tr v-for="(deviceInfo,index) in device" :key="index" @click="getIndex(deviceInfo)">
                <td>{{deviceInfo.deviceName}}</td>
                <td>{{deviceInfo.code}}</td>
                <td>{{deviceInfo.run == 0?'停止':deviceInfo.run == 1?'运行':'-'}}</td>
                <td>{{deviceInfo.status ==1?'无':deviceInfo.status ==2?'运转':deviceInfo.status ==1?'停止':deviceInfo.status ==1?'异常':deviceInfo.status ==1?'模块异常':'-'}}</td>
              </tr>
          </x-table>
          <x-table :cell-bordered="false" class="componentData" v-if="componentInfoShow">
            <thead>
              <tr>
                <th>部件名称</th>
                <th>部件编号</th>
                <th>库存数量</th>
                <th>安全库存</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(componentInfo,index) in component" :key="index">
                <td>{{componentInfo.componentName}}</td>
                <td>{{componentInfo.componentCode}}</td>
                <td>{{componentInfo.componentRun}}</td>
                <td>{{componentInfo.componentState}}</td>
              </tr>
            </tbody>
          </x-table>
        </mescroll-vue>
      </div>
    </div>
    <ic-footer></ic-footer>
  </div>
</template>
<script>
import IcFooter from "../common/ic-footer"
import DeviceSelected from "../common/device-selected-detail-device"
import { XTable, Grid, GridItem, XHeader,Checklist} from 'vux'
import deviceMan2 from '../../assets/icon/deviceManage2.png';
import deviceMan1 from '../../assets/icon/device.png';
import deviceConfig2 from '../../assets/icon/deviceConfig2.png';
import deviceConfig1 from '../../assets/icon/deviceConfig.png';
import deviceAlarm1 from '../../assets/icon/alarm2.png';
import deviceAlarm2 from '../../assets/icon/deviceAlarm2.png';
import componentManage1 from '../../assets/icon/bese_compon.png';
import componentManage2 from '../../assets/icon/beseComponent.png';
import dataGenerate1 from '../../assets/icon/data_generate.png';
import dataGenerate2 from '../../assets/icon/dataGenerate.png';
import DeviceDao from '../../daos/device_dao'
import BScroll from "better-scroll";
import MescrollVue from "mescroll.js/mescroll.vue"
export default {
  data(){
    return {
      deviceManageImg:deviceMan1,
      deviceConfigImg:deviceConfig2,
      deviceAlarmImg:deviceAlarm2,
      componentManageImg:componentManage2,
      DataGenerateImg:dataGenerate2,
      headName:'设备管理',
      deviceInfoShow:true,
      componentInfoShow:false,
      //展示部门列表
      showDep: false,
      //部门列表数据
      departments: ['一级部门', '二级部门', '三级部门'],
      radioValue: ['一级部门'],
      checkDep: '一级部门',
      //展示部门更多筛选
      showMore: false,
      checkMore:'筛选',
      //设备列表数据
      device:[],
      deviceInfo:[],
      component:[],
      //设备参数详情
      deviceDetail: '',
      //扫码设备参数
      deviceComponent: {
          code: '',
          deviceName: ''
      },
      departmentDetail: '',
      showSearch: '',
      sort2: false,
      sortType: 'run',
      runstatus: ['全部', '无','运转', '停止', '异常', '模块异常'],
      ind: 0,
      show3: false,
      deviceNameChoose: '',
      deviceCodeChoose: '',
      departmentId:0,
      deviceNum:0,
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
  components:{
    XTable,
    Grid,
    GridItem,
    XHeader,
    Checklist,
    DeviceSelected,
    IcFooter,
    BScroll,
    MescrollVue
  },
  computed: {
    deviceMessage () {
      //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
            if(!this.$store.state.deviceMessage){
                this.$store.commit('changeDeviceMessage',JSON.parse(localStorage.getItem('deviceMessage')));
            }
      return this.$store.state.deviceMessage;
    },
    user () {
      //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
      if(!this.$store.state.user){
        this.$store.commit('saveUser',JSON.parse(localStorage.getItem('user')));
      }
      return this.$store.state.user;
    },
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
  methods:{
    getDeviceNum: function(){
      console.log('5555',this.ind)
      if(this.ind.length == 0){
        this.ind == 0
      }
      let param = {
        departmentId: this.departmentId,
        deviceName:this.deviceNameChoose,
        deviceCode:this.deviceCodeChoose,
        runStatus:this.ind
      }
      this.$http(this.$API.getDeviceNum, param, true).then((res) => {
      if (res) {
        let deviceInfo = res.deviceInfo;
        // 1、无 - a- 2、运转- b-3、停止- c-4、异常-  d-5、模块异常 - e-
        if(!!!deviceInfo.a){
          deviceInfo.a = 0
        }
        if(!!!deviceInfo.b){
          deviceInfo.b = 0
        }
        if(!!!deviceInfo.c){
          deviceInfo.c = 0
        }
        if(!!!deviceInfo.d){
          deviceInfo.d = 0
        }
        if(!!!deviceInfo.e){
          deviceInfo.e = 0
        }
        this.deviceNum = parseInt(deviceInfo.a) + parseInt(deviceInfo.b) + parseInt(deviceInfo.c) + parseInt(deviceInfo.d) + parseInt(deviceInfo.e);
        }
      });
    },
    deviceManage:function(){
      this.deviceInfoShow=true;
      this.componentInfoShow=false;
      this.deviceManageImg=deviceMan1;
      this.componentManageImg=componentManage2;
    },
    deviceConfig:function(){

    },
    deviceAlarm:function(){

    },
    componnetManage:function(){
      this.mescroll.triggerDownScroll();
      this.deviceInfoShow=false;
      this.componentInfoShow=true;
      this.deviceManageImg=deviceMan2;
      this.componentManageImg=componentManage1;
    },

    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },

    upCallback(page, mescroll) {
      if(this.ind == 0){
        this.ind = ''
      }
      let params = {
        departmentId:this.departmentId,
        deviceName: this.deviceNameChoose,
        deviceCode: this.deviceCodeChoose,
        runStatus: this.ind,
        pageNum: page.num,
        pageSize: page.size,
      };
      this.$http(this.$API.getDeviceList, params, true).then(res => {
        if (res) {
          let data = res;
          if (page.num === 1) {
            this.deviceInfo = [];
          }
          this.deviceInfo = this.deviceInfo.concat(data);
          this.device = this.deviceInfo;
          this.$nextTick(() => {
            mescroll.endSuccess(data.length);
          });
        } else {
          this.mescroll.endErr();
        }
      });
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
      this.$router.push({
        name: 'deviceInfo',
        query:{
          deviceInfo: index
        }
      });
      },
    handleDeviceDetail: function(deviceDetail){
        this.$store.commit('changeDeviceMessage',deviceDetail);
        this.getDeviceDetail();
    },
    handleDepartment: function(departmentDetail){
      this.departmentId = departmentDetail.id;
      this.mescroll.resetUpScroll(true);
      this.getDeviceNum();
    },

    reset: function(){
      this.deviceNameChoose = '';
      this.deviceCodeChoose = '';
      this.ind = 0;
    },
    overBtn: function () {
      this.showMore = false;
      this.mescroll.resetUpScroll(true);
      this.getDeviceNum();
    },
    leapfrogSort(type, sorted) {
      if (sorted === false) {
        this.sort2 = true;
        this.sortType = type;
        this.device.sort(this.compare(type));
      }else{
        this.sort2 = false;
        this.sortType = type;
        this.device.sort(this.compare2(type));
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
    changeBgc: function (index) {
      this.ind = index
    },
    showVuePopup3(flag) {
      if (flag === false){
        this.showMore = false;
      }
      this.show3 = flag;
    },

    getDeviceList: function(){
      this.$http(this.$API.getDeviceList, true).then((res) => {
        if (res) {
          this.deviceInfo = this.device = res;
          }
      });
    }
  },
  created:function(){
    if (this.$route.query.deviceNameChoose) {
     this.departmentDetail = this.$route.query.deviceNameChoose
    }
    this.getDeviceNum();
  },
  mounted(){
    this.$nextTick(() => {
        this.Scroll = new BScroll(this.$refs.mescroll,{click: true, tap: true});
      });
  },

}
</script>
<style lang="less" scoped>
  @import '../../styles/iconfont.css';
  .vux-popup-mask.vux-popup-show{
    top: 52% !important;
    z-index: unset !important;
  }
  *{
    -ms-touch-action: unset !important;
    touch-action: unset !important;
  }
  .deviceInfomation{
    background: rgba(0,0,0,0.3);
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

  .deviceData{
    width: 100%;
    table-layout:fixed;
  }

  .deviceData td{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .componentData{
    width: 100%;
    table-layout:fixed;
  }

  .componentData td{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .me_scroll {
    top: 120px;
  }
  .mescroll {
    position: fixed;
    bottom: 130px;
    height: 75%;
  }
  .deviceTable{
    transform:unset ! important;
  }
</style>
<style scoped lang="less">
  #app, .content{
    width: 100%!important;
    height: 100%!important;
  }

  .vux-button-group > a.vux-button-tab-item-first:after{
    color: #3967DC !important;
    border: unset;
  }
  .vux-button-group > a.vux-button-group-current{
    background: #3967DC !important;
  }
  .vux-button-group > a.vux-button-tab-item-middle:after{
    border: unset !important;
  }
  .vux-button-group > a.vux-button-tab-item-first:after{
    color: #3967DC !important;
    border: unset;
  }
  .vux-button-group > a.vux-button-tab-item-last:after{
    color: #3967DC !important;
    border: unset;
  }
  body{
    background-color: #22233f;
  }

  .deviceInfomation{
    margin:0 auto;
    height: 100%;
    width: 100%;
    background-color: #22233f;
  }

  .dataContent{
    padding-left: 10px;
    padding-right: 10px;
    color:#fff;
    height: 79%;
    margin-top: 2.4rem;
    overflow: hidden;
  }

  .dataContent .vux-table tr{display: flex;}
  .dataContent .vux-table tr>td{flex: 1;text-align: center}

  .menuBar{
    background-color:rgba(0,0, 0, 0.4);
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 999;
  }
  .menuBar .weui-grid__label{
    color:#fff;
  }
  .menuBar .weui-grids:before{
    border-top: none;
  }
  .menuBar .weui-grid{
  }

  .activeLine{
    background: unset!important;
  }
  .table-title{
    position: fixed;
    top: 80px;
    width: 100%;
    z-index: 99;
    color: #fff;
    height: 40px;
    line-height: 40px;
    background: #18182c;
    display: flex;
  }
  .table-title span{
    flex: 1;
    text-align: center;
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
  table{
    width: 100%;
    table-layout:fixed;
  }

  table td{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .deviceNum{
    width: 100%;
    position: fixed;
    top: 50px;
    line-height: 30px;
    color: #fff;
    padding-left: 15px;
    background-color: #22233f;
  }
</style>


