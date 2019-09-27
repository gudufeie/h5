<template>
  <div class="addReplaceManage">
    <div class="main">
      <div class="deivceTop">
        <organization 
          class="changeDep"
          :selectDepartment="selectDepartment"
          @department_select="handleDepartment">
        </organization>
        <div class="changeMore" @click="changeMore">{{checkMore}} <span class="iconfont icon-shaixuan"></span></div>
        <div class="scan" @click="scanAdd"><span class="iconfont">&#xe648;</span></div>
        <div @click="backToHomepage" class="backTo"><span class="iconfont">&#xe610;</span></div>
      </div>
      <div class="MoreDataP" v-if="showMore">
        <div class="deviceName">设备名称 <input type="text" placeholder="请输入设备名称" v-model="deviceNameChoose"></div>
        <div class="deviceCode">设备编号 <input type="text" placeholder="请输入设备编号" v-model="deviceCodeChoose"></div>
        <div class="BtnGroup">
          <div class="btn-reset" @click="reset">重置</div>
          <div class="btn-over"  @click="overBtn">完成</div>
        </div>
        <div class="mask" v-show="show3" @click="showVuePopup3(false)"></div>
      </div>
      <div class="tabTop">
        <tab active-color='#fff' custom-bar-width="100%" bar-active-color="#456de6" v-model="tabIndex">
          <tab-item
            v-if="userActionMap['wechat_manage']['actions'].indexOf('添加更换记录')>=0"
            class="vux-center"
            @on-item-click="replaceManage"
            selected>更换管理
          </tab-item>
          <tab-item
            v-if="userActionMap['wechat_manage']['actions'].indexOf('查看更换记录')>=0"
            class="vux-center"
            @on-item-click="replaceRecord">更换记录
          </tab-item>
        </tab>
      </div>
      <div class='dataNum'>共{{number}}条记录</div>
      <div class="tableTitleManage" v-if="scanShow == true">
        <span>设备名称</span>
        <span>设备编码</span>
        <span>
          更换周期
          <font-awesome-icon :icon="['fa','sort']" size="lg" @click="leapfrogSort('maintain_time', sort1, 1)"/>
        </span>
        <span>
          剩余天数
          <font-awesome-icon :icon="['fa','sort']" size="lg" @click="leapfrogSort('left_date', sort2, 1)"/>
        </span>
        <span>操作</span>
      </div>
      <div class="tableTitleRecord"  v-if="scanShow == false">
        <span>设备名称</span>
        <span>设备编号</span>
        <span>
          更换时间
          <font-awesome-icon :icon="['fa','sort']" size="lg"  @click="leapfrogSort('createTime', sort3, 2)"/>
        </span>
        <span>操作人</span>
      </div>
      <div class="footer">
        <tabbar style="color: #ffffff;font-size:14px;">
          <tabbar-item
            @on-item-click="spotCheck"
            style="background-color:rgba(0,0,0,0.2)"
            v-if="userActionMap['wechat_manage']['actions'].indexOf('添加点巡检')>=0 || userActionMap['wechat_manage']['actions'].indexOf('查看点巡检记录')>=0">
            <img slot="icon" src='../../assets/icon/camera2.png'>
            <img slot="icon-active" src='../../assets/icon/camera1.png'>
            <span slot="label" style="font-size:16px;color:#fff">点巡检</span>
          </tabbar-item>
          <tabbar-item
            @on-item-click="changeManage"
            selected
            v-if="userActionMap['wechat_manage']['actions'].indexOf('查看更换记录')>=0 || userActionMap['wechat_manage']['actions'].indexOf('添加更换记录')>=0">
            <img slot="icon" src='../../assets/icon/change2.png'>
            <img slot="icon-active" src='../../assets/icon/addChange.png'>
            <span slot="label" style="font-size:16px;color:#fff">更换</span>
          </tabbar-item>
        </tabbar>
      </div>
    </div>
    <div class="dataContentAdd" ref="dataContent">
        <div class="deviceTable">
          <mescroll-vue :class="scrollName" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
            <x-table :cell-bordered="false" class="deviceData"  v-bind:style="manageDeviceStyle">
              <tr v-for="(record,index) in replaceManageData" :key="index" @click="getDeviceReplaceDetail(record)">
                <td>{{record.device_name}}</td>
                <td>{{record.code}}</td>
                <td>{{record.maintain_time == 0?'-':record.maintain_time}}
                  <span v-if="record.maintain_time_unit == 1">天</span>
                  <span v-else-if="record.maintain_time_unit == 2">周</span>
                  <span v-else-if="record.maintain_time_unit == 3">月</span>
                  <span v-else-if="record.maintain_time_unit == 4">年</span>
                  <span else></span>
                </td>
                <td>{{record.left_date}}天</td>
                <td>
                  <button class="replaceBtn" v-if="record.left_date < 0" style="border-color:red">可执行</button>
                  <button class="replaceBtn" v-else>可执行</button>
                </td>
              </tr>
            </x-table>
            <x-table :cell-bordered="false" class="componentData"  v-bind:style="replaceRecordStyle">
              <tr v-for="(record,index) in replaceRecordData" :key="index" @click="toDeviceInfo(record)">
                <td @click="componentReplaceRecord(record)">{{record.deviceName}}</td>
                <td>{{record.deviceCode}}</td>
                <td v-if="record.createTime">{{record.createTime | formatDate}}</td>
                <td v-else></td>
                <td @click="deviceReplaceRecord(record)">{{record.operatorName}}</td>
              </tr>
            </x-table>
          </mescroll-vue>
        </div>
    </div>
  </div>
</template>

<script>
  import { Tab,TabItem,XTable,Tabbar,TabbarItem,Search,Swiper,SwiperItem } from 'vux'
  import request from '../../config/request.js';
  import DeviceSelected from "../common/device-selected-detail-device"
  import BScroll from "better-scroll";
  import MescrollVue from "mescroll.js/mescroll.vue";
  import Organization from "../common/organization"
  let _this = null;
  export default {
    components: {
      Tab,
      TabItem,
      XTable,
      Tabbar,
      TabbarItem,
      Search,
      Swiper,
      SwiperItem,
      DeviceSelected,
      BScroll,
      MescrollVue,
      Organization
    },
    name: "addReplaceManage",
    data: function () {
      return {
        replaceConfigNum:0,
        replaceRecordNum:0,
        number:0,
        //更换管理数据
        replaceManageData:[],
        replaceManageDataInfo:[],
        //更换记录数据
        replaceRecordData:[],
        replaceRecordDataInfo:[],
        //更换管理样式
        manageDeviceStyle:  {
          display: 'block',
        },
        //更换记录样式
        replaceRecordStyle: {
          display: 'none',
        },
        //排序初始化
        departmentId:0,
        departmentInfo:{},
        userActionMap: {},
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
        showSearch: '',
        runstatus: ['全部', '运转', '停止', '异常', '模块异常', '无'],
        ind: 0,
        show3: false,
        sort1: false,
        sort2: false,
        sort3: false,
        sortType: 'stockNum',
        deviceNameChoose: '',
        deviceCodeChoose: '',
        url:'',
        selectDepartment:{},
        tabIndex:0,
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
      }
    },
    created: function () {
      let localUrl = location.href.split('#')[0];
      // 调用微信扫一扫功能
      this.$http(this.$API.getWxSign,{url:encodeURIComponent(localUrl)}, true).then((res) => {
        if (res) {
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
          // config 信息验证失败会执行error函数,如签名过期导致验证失败,
          // 具体错误信息可以打开config的debug模式查看,也可以在返回的res参数中查看,对于SPA可以在这里更新签名
          });
        }
      });

      _this = this;
      this.getDomin();
      // this.getDeviceReplaceConfig();
      // this.getDeviceReplaceRecord();
      let userInfo = request.getUserInfo();
      if (!userInfo || userInfo.roleAction.length <= 0) {
          return;
      }

      this.departmentInfo = JSON.parse(this.$route.query.department);
      this.departmentId = this.departmentInfo.id;
      localStorage.setItem('curDepartment',JSON.stringify(this.departmentInfo))
      
      for (let item of userInfo.roleAction) {
        this.userActionMap[item.pageId] = item;
      }
      // this.getReplaceConfigNum();
      // this.getReplaceReocrdNum();
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
    mounted(){
      this.$nextTick(() => {
          this.Scroll = new BScroll(this.$refs.mescroll,{click: true, tap: true});
      });
      this.selectDepartment = this.departmentInfo
    },
    methods: {
      getDomin: function(){
        this.url = window.location.protocol +'//'+ window.location.host
      },
      spotCheck: function(){
        // this.$router.push({name: 'spotCheck'})
        window.location.href = this.url + '/#/operaionManage/spotCheck?department='+ JSON.stringify(this.departmentInfo);

      },
      changeManage: function(){
        // this.$router.push({name: 'addReplace'})
        window.location.href = this.url +  '/#/manage/deviceDetailManage/addReplace?department='+ JSON.stringify(this.departmentInfo);

      },
      //更换管理
      replaceManage: function () {
        this.scrollName = 'me_scroll',
        this.manageDeviceStyle.display = 'block';
        this.replaceRecordStyle.display = 'none';
        this.scanShow = true;
        this.deviceNameChoose = '';
        this.deviceCodeChoose = '';
        this.getReplaceConfigNum();
      },
      //更换记录
      replaceRecord: function () {
        this.scrollName = 'record_scroll',
        this.manageDeviceStyle.display = 'none';
        this.replaceRecordStyle.display = 'block';
        this.scanShow = false;
        this.deviceNameChoose = '';
        this.deviceCodeChoose = '';
        this.getReplaceReocrdNum();
        this.mescroll.resetUpScroll(true);
      },
      leapfrogSort(type, sorted, sortnumber) {
        if (sortnumber === 1){
          if (sorted === false) {
            this.sort1 = true;
            this.sort2 = true;
            this.sortType = type;
            this.replaceManageData.sort(this.compare(type));
          }else{
            this.sort1 = false;
            this.sort2 = false;
            this.sortType = type;
            this.replaceManageData.sort(this.compare2(type));
          }
        } else {
          if (sorted === false) {
            this.sort3 = true;
            this.sortType = type;
            this.replaceRecordData.sort(this.compare(type));
          }else{
            this.sort3 = false;
            this.sortType = type;
            this.replaceRecordData.sort(this.compare2(type));
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

      //更换设备
      updateDevice: function (device) {
        //更换设备
        this.$router.push({
          name:'addDeviceReplace',
          query:{
            device: device
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
            deviceName: this.deviceNameChoose,
            deviceCode: this.deviceCodeChoose,
            pageNum: page.num,
            pageSize: page.size,
          };
          this.$http(this.$API.loadDeviceReplaceConfig, params, true).then(res => {
            if (res.content) {
              this.number = res.totalElements;
              let data = [];
              for(var item of res.content){
                if(!!item){
                  data.push(item)
                }
              }
              if (page.num === 1) {
                this.replaceManageData = [];
              }
              this.replaceManageData = this.replaceManageData.concat(data);
              this.replaceManageDataInfo = this.replaceManageData;
              this.$nextTick(() => {
                if(res.pageNum === res.totalPages){
                  mescroll.endSuccess(res.content.length,false);
                }else{
                  mescroll.endSuccess(res.content.length);
                }
              });
            } else {
              this.mescroll.endErr();
            }
          });
        }else if(this.tabIndex == 1){
          let params = {
            departmentId:this.departmentId,
            deviceName: this.deviceNameChoose,
            deviceCode: this.deviceCodeChoose,
            pageNum: page.num,
            pageSize: page.size,
          };
          this.$http(this.$API.loadDeviceReplaceRecord, params, true).then(res => {
            if (res.content) {
              this.number = res.totalElements;
              let data = res.content;
              if (page.num === 1) {
                this.replaceRecordData = [];
              }
              this.replaceRecordData = this.replaceRecordData.concat(data);
              this.replaceRecordDataInfo = this.replaceRecordData;
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

      // 获取部门下所有设备的更换设置
      getDeviceReplaceConfig: function(){
        let param = {
          departmentId:0
        }
        this.$http(this.$API.loadDeviceReplaceConfig, param, true).then((data)=>{
          this.replaceManageData = data;
          this.replaceManageDataInfo = data;
        })
      },

      // 点击进入部件更换
      getDeviceReplaceDetail: function(device){
        this.$router.push({
          name:'componentReplace',
          query:{
            device:device
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

      // 获取部门下所有设备的更换记录
      getDeviceReplaceRecord: function(){
        let param = {
          departmentId:0
        }
        this.$http(this.$API.loadDeviceReplaceRecord, param, true).then((data)=>{
          this.replaceRecordData = data;
          this.replaceRecordDataInfo = data;
        })
      },
      // 获取设备下所有部件的更换记录
      componentReplaceRecord: function(config){
        this.$router.push({
          name:'componentReplaceList',
          query:{
            deviceInfo:config
          }
        })
      },
      deviceReplaceRecord: function(config){
        this.$router.push({
          name:'deviceReplaceList',
          query:{
            deviceId:config.deviceId
          }
        })
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
            window.location.href = _this.url + '/#/manage/deviceDetailManage/componentReplace?deviceId=' + id;
          }
        })
        }).catch((err)=>{
          console.log(err)
        });
      },
      //返回首页
      backToHomepage: function () {
        this.$router.push({name:'homepage'});
      },
      handleDeviceDetail: function(deviceDetail){
          this.$store.commit('changeDeviceMessage',deviceDetail);
          this.getDeviceDetail();
      },

      // 部门筛选并分页
      handleDepartment: function(departmentDetail){
        this.departmentInfo = departmentDetail;
        this.selectDepartment = this.departmentInfo
        this.departmentId = departmentDetail.id;
        this.mescroll.triggerDownScroll();
        // if(this.tabIndex == 0){
        //   this.getReplaceConfigNum();
        // }else{
        //   this.getReplaceReocrdNum();
        // }
        localStorage.setItem('curDepartment',JSON.stringify(this.departmentInfo))
      },

      //展开更多
      changeMore: function () {
        this.showMore = true;
        this.showDep = false;

        this.show3 = true;
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

      // 筛选重置
      reset: function () {
        this.deviceNameChoose = '';
        this.deviceCodeChoose = '';
      },

      // 筛选
      overBtn: function () {
        this.showMore = false;
        this.mescroll.resetUpScroll(true);
        // if(this.tabIndex == 0){
        //   this.getReplaceConfigNum();
        // }else{
        //   this.getReplaceReocrdNum();
        // }
      },

    // 获取点巡检和更换可操作的数量
      getReplaceConfigNum: function(){
        let param = {
          departmentId:this.departmentId,
          deviceName: this.deviceNameChoose,
          deviceCode: this.deviceCodeChoose,
        }
        //点巡检设备数目
        this.$http(this.$API.getReplaceConfigCount,param, true).then((res)=>{
            if(res){
            this.replaceConfigNum = res.count;
            }
            if(this.tabIndex == 0){
              this.number = this.replaceConfigNum;
            }
        })
      },

      getReplaceReocrdNum: function(){
        let param = {
          departmentId:this.departmentId,
          deviceName: this.deviceNameChoose,
          deviceCode: this.deviceCodeChoose,
        }
        //更换设备数目
        this.$http(this.$API.getDeviceReplaceRecordNum, param, true).then((res)=>{
            if(res){
            this.replaceRecordNum = res.count;
            }
            if(this.tabIndex == 1){
              this.number = this.replaceRecordNum
            }
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  @import '../../styles/iconfont.css';
  .deivceTop{
    width: 100%;
    height: 50px;
    background: rgba(0,0,0,0.3);
    position: fixed;
    top: 0px;
    z-index: 110;
    .changeDep{
        width: 28%;
        height: 50px;
        font-size: 20px;
        padding: 0 0 0 10px;
        color: #ffffff;
    }
    .backTo{
      width: 20%;
      color:#fff;
      line-height: 50px;
      position: absolute;
      right:0px;
      .iconfont{
        font-size: 18px;
      }
    }
    .scan{
      width: 20%;
      color:#fff;
      line-height: 50px;
    }
    .changeMore{
        width: 28%;
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
    z-index: 999;
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
  .addReplaceManage {
    background: #22233f;
    height: 100vh;
    overflow-y: hidden;
    .addReplaceManageText {
      background-color: #fff;
      display: block;
      width: 100%;
      text-align: center;
      font-size: 20px;
      padding: 10px 0;
      /*height: 272px;*/
      .backIcon{
        position: absolute;
        width: 15px;
        height: 25px;
        top: 14px;
        left: 20px;
      }
      .searchImg{
        position: absolute;
        width: 20px;
        height: 20px;
        top: 14px;
        right: 20px;
      }
    }
    .searchIcon{
      width: 25px;
      height: 25px;
      position: absolute;
      top: 80px;
      left: 45px;

    }
    .search{
      height: 50px;
      margin: 20px 5%;
      width: 90%;
      background: rgba(0,0,0,0.3);
      /*border: #00ffff 1px solid;*/
      line-height: 50px;
      color: rgba(255,255,255,0.8);
      text-align: center;
      border-radius: 25px;
    }
    .search::placeholder{
      color: rgba(255,255,255,0.8);
    }

    .main {
      /*background: rgba(0,0,0,0.4);*/
      background: rgba(0,0,0,0.3);
      .tabTop{
        width: 100%;
        display: flex;
        background: #22233f;
        position: fixed;
        top: 45px;
        z-index: 50;
        /*height: 40px;*/
        div{
          width: 100%;
          float: left;
          text-align: center;
          color: #fff;
          background: #22233f;
          font-size: 14px;
          line-height: 40px;
        }
      }

      .vux-tab-bar-inner{
          background:#456de6 !important;
          width:100%;
        }

      .vux-tab-ink-bar{
          border-bottom: 1px solid  #1C1F37;
      }
      .vux-table:after{
        border-bottom: unset;
      }
      table{
        background: #22233f;
        color: #ffffff;
        button{
          border-radius: 2px;
          color: #3967DC;
          background-color: transparent;
          border: 1px #3967dc solid;
        }

      }

      .weui-tabbar{
        background: rgba(0,0,0,0.3);
      }
      .weui-tabbar:before{
        border-top: none;
        height: 0;
      }
      .weui-bar__item_on{
        background: #22233f;
      }
      .footer{
        background: #22233f;
        display: flex;
        height: 45px;
        // padding-top: 10px;
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index:50;
        .footerTab{
          position: fixed;
          padding: 0;
          width: 100%;
          height: 60px;
          .vux-tab-container{
            height: 60px;
            .vux-tab{
              height: 60px;
              .footerTabber{
                height: 60px;
                line-height: 0;
                img{
                  width: 20px;
                  height: 20px;
                }
                div{
                  height: 30px;
                  line-height: 20px;
                }
          }
          }

          }
        }
      }
      .swiper-container{
        height: 100px;
        margin: 10px 0;
        background: rgba(0,0,0,0.3);
        .swiper-slide{
        color: #ffffff;
        height: 50%;
        img{
          width: 10%;
          margin: 20px 0;
        }
        div{
          display: flex;
        }
        .toRight{
          margin: 0;
          width: 20px;
          height: 20px;
          position: absolute;
          top: 40px;
          right: 20px;
        }
       }
      }
      .functionManage{
        display: flex;
        margin: 20px 0;
        background: rgba(0,0,0,0.4);
        color: #ffffff;
        .workSheetFunction{
          width: 28%;
          margin: 20px 2%;
          float: left;
          text-align: center;
          img{
            width: 40px;
            height: 40px;
          }
        }
      }
      .workSheetSample{
        margin: 20px 0;
        padding: 10px;
        background: #efeff4;
        .workSheetSampleTop{
          height: 20px;
          font-size: 20px;
          line-height: 20px;
          text-align: left;
          padding-left: 20px;
        }
        .workSheetSampleContent{
          display: flex;
          margin: 10px;
          height: 60px;
          /*border: #0bb00c 1px solid;*/
          div{
            height: 30px;
            float: left;
            width: 50%;
            padding: 15px;

            img {
              width: 20px;
              height: 20px;
              padding-right: 10px;
              vertical-align: middle;
            }
            span{
              font-size: 14px;
              line-height: 30px;
            }
          }
        }
      }
    }
  }
  .tabTop .vux-tab-selected{
    border-bottom: 2px solid #456de6;
  }
  .tabTop .vux-center{
    border:unset;
  }

  .me_scroll {
    top: 160px;
    position: fixed;
    bottom: 130px;
    height: 60%;
  }
  .record_scroll{
    top: 160px;
    position: fixed;
    bottom: 130px;
    height: 60%;
  }
  .deviceTable{
    transform:unset ! important;
  }
  .dataNum{
    position: fixed;
    width: 100%;
    top:89px;
    line-height: 30px;
    color: #fff;
    text-align: left;
    padding-left: 15px;
  }
  
</style>
<style>
  .organization .header{
    padding:18px 10px;
    width: 28%;
    overflow:hidden !important;
    text-overflow:ellipsis !important;
    white-space:nowrap !important;
    word-break:keep-all !important;
  }
  .vux-popup-mask.vux-popup-show{
    z-index: unset !important;
  }
  *{
    -ms-touch-action: unset !important;
    touch-action: unset !important;
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
  .tableTitleManage{
    position: fixed;
    top: 120px;
    width: 100%;
    z-index: 99;
    color: #fff;
    height: 40px;
    line-height: 40px;
    display: flex;
    background: #18182c;
  }
  .tableTitleManage span{
    flex: 1;
    text-align: center;
  }
  .tableTitleRecord{
    position: fixed;
    top: 120px;
    width: 100%;
    z-index: 99;
    color: #fff;
    height: 40px;
    line-height: 40px;
    background: #18182c;
    display: flex;
  }
  .tableTitleRecord span{
    flex: 1;
    text-align: center;
  }
  .dataContentAdd{
    color:#fff;
    height: 55%;
    margin-top: 3.5rem;
    overflow: hidden;
    pointer-events: auto;
  }
  .dataContentAdd .vux-table tr{display: flex;}
  .dataContentAdd .vux-table tr>td{flex: 1;text-align: center}
  .replaceBtn{
    background-color: #22233f;
    border: 1px solid #456de6;
    color:#fff;
    padding: 5px 10px;;
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

</style>
