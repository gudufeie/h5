<template>
    <div class="replaceDetail">
      <swiper :height="'211px'">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in pictureList" :key="index"  @click.native="show(index,$event)"><img :src="item | checkImgUrl"></swiper-item>
      </swiper>
      <div class="info_wrap">
          <table>
              <tr>
                  <td class="name">设备名称</td>
                  <td v-if="device.name">{{device.name}}</td>
                  <td v-else>{{device.deviceName}}</td>
              </tr>
              <tr>
                  <td class="name">设备编号</td>
                  <td v-if="device.code">{{device.code}}</td>
                  <td v-else>{{device.deviceCode}}</td>
              </tr>
              <tr v-if="type == 'component'">
                  <td class="name">部件名称</td>
                  <td>{{component.name}}</td>
              </tr>
              <tr v-if="type == component">
                  <td class="name">部件编号</td>
                  <td>{{component.name}}</td>
              </tr>
              <tr>
                  <td class="name">所在部门</td>
                  <td v-if="component.cat_name">{{component.cat_name}}</td>
                  <td v-else>{{device.departmentName}}</td>
              </tr>
              <tr>
                  <td class="name">操作人</td>
                  <td>{{operator}}</td>
              </tr>
              <tr>
                  <td class="name">更换时间</td>
                  <td>{{changeTime | formatDate}}</td>
              </tr>
          </table>
      </div>
      <div class="spotCheckDescribe">
          <span style="color:rgba(255,255,255,0.5)">更换描述</span>
          <p style="margin-top:10px;">{{checkDescribe}}</p>
      </div>
      <div class="workOrderDescribe" v-if="sheetDescription">
          <span style="color:rgba(255,255,255,0.5)">工单描述</span>
          <p style="margin-top:10px;">{{sheetDescription.description}}</p>
      </div>
      <div class="processStatus" v-if="sheetDescription">
          <span style="color:rgba(255,255,255,0.5)">处理状态</span>
          <span v-if="sheetDescription.handleStatus == 1" style="margin-left:20px;">已解决</span>
          <span v-if="sheetDescription.handleStatus == 2" style="margin-left:20px;">已解决</span>
      </div>
      <div class="deviceContent" ref="deviceContent">
          <div class="timeLine" v-for="(item, index) in workSheetList" :key="index">
          <img v-if="item.handleType === 3" class="timeImg" src="../../assets/icon/finished.png" alt="上报">
          <img v-if="item.handleType === 1" class="timeImg" src="../../assets/icon/report.png" alt="转办">
          <img v-if="item.handleType === 2" class="timeImg" src="../../assets/icon/transfer.png" alt="解决">
          <img v-if="item.handleType === 4" class="timeImg" src="../../assets/icon/reject.png" alt="驳回">
          <div class="timeleft">
              <p>{{item.updateTime | formatDate}}</p>
          </div>
          <div class="timemiddle">
              <div class="container" v-if="index != workSheetList.length-1"></div>
              <p>{{item.operatorName}}</p>
              <p>{{item.description}}</p>
          </div>
          <div class="timeright">
              <p v-if="index == workSheetList.length-1">提交</p>
              <p v-else-if="item.handleType == 1">上报</p>
              <p v-else-if="item.handleType == 2">转办</p>
              <p v-else-if="item.handleType == 3">解决</p>
              <p v-else-if="item.handleType == 4">驳回</p>
          </div>
          </div>
      </div>
      <actionsheet v-model="deleteShow" :menus="menus" @on-click-menu="deleteImg" show-cancel></actionsheet>
    </div>
</template>

<script>
  import { Swiper, SwiperItem, Actionsheet } from 'vux'
	export default {
    components: {
      Swiper,
      SwiperItem,
      Actionsheet
    },
		name: "replaceDetail",
    data(){
		  return {
        menus: {
          delete: '<span style="color:red">删除</span>'
        },
        curImgUrls: [],
        curIndex: null,
        deleteShow: false,
        name:'',
        CheckInfo:'',
        departmentName:'',
        componentId:'',
        componentName:'',
        componentCode:'',
        deviceName:'',
        deviceCode:'',
        checkTime:'',
        checkResult:'',
        checkDescribe:'',
        sheetDescription:'',
        dealStatus:'',
        pictures:[],
        checkRecordId:'',
        device:{},
        component:{},
        type:'',
        operator:'',
        changeTime:'',
        pictureList:'',
        deviceId:'',
        workSheetList:[]
      }
    },
    created: function(){
      this.getRecordInfo()
    },
    methods: {
      show(index,event) {
        event.preventDefault()
        // this.loop = setTimeout(()=>{
          this.deleteShow = true
          this.curIndex = index
        // },800);
      },
      clearLoop() {
        clearInterval(this.loop);
      },
      deleteImg(menuKey, menuItem) {
        const arr = [...this.detail.pictures]

        if(menuKey == 'delete') {
          arr.splice(this.curIndex,1)

          const data = {
            delType: 2,
            url: arr,
            targetId: this.detail.id
          }
          
          this.$http(this.$API.deleteCheckImg,data,true).then( (res) => {
            if(res){
             this.detail.pictures.splice(this.curIndex,1)
             this.$store.commit('saveDetail',this.detail)
            }
          });
        }
      },
      getRecordInfo: function(){
        var data = this.$route.query;
        this.deviceId = data.deviceId;
        this.device = data.device;
        this.component = data.component
        this.type = data.type

        if(this.type == 'device'){
          this.getDeviceInfo()
          this.checkDescribe = this.device.description;
          this.sheetDescription = this.device.workSheet;
          this.operator = this.device.operatorName;
          this.changeTime = this.device.create_time;
          this.pictureList =this.device.pictures;
        }else{
          this.getDeviceInfo()
          this.checkDescribe = this.component.description;
          this.sheetDescription = this.component.workSheet;
          this.operator = this.component.operator;
          this.changeTime = this.component.update_time;
          this.pictureList =this.component.pictures;
        }

        if(this.pictureList){
          this.pictureList = this.pictureList.split(',')
        }
      },

      // 获取设备信息
      getDeviceInfo: function(){
        this.$http(this.$API.loadDeviceInfo,{deviceId:this.deviceId}, true).then((data)=>{
          this.device = data;
          this.getWorkSheet(this.device.checkId);
        })
      },

      getWorkSheet: function(id){
          this.$http(this.$API.getCheckWorkSheet,{checkId:id},true).then((data)=>{
              this.workSheetList = data
          })
        }
    },
    computed: {
      detail () {
        //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
        if(!this.$store.state.detail){
          this.$store.commit('saveDetail',JSON.parse(localStorage.getItem('detail')));
        }
        return this.$store.state.detail;
      }
    }
	}
</script>

<style lang="less" scoped>
  .replaceDetail{
    background: #1c1f37;
    height: 100vh;
    overflow: auto;
    img {
      object-fit: cover;
    }
    .order{
      margin: 0 16px;
      padding: 10px 0;
      border-bottom:  1px solid #323444;
      color: #ffffff;
      .name{
        font-size: 16px;
      }
      .time{
        margin: 6px 0;
      }
    }
    .detail{
      font-size: 14px;
      margin: 0 16px;
      padding-top: 10px;
      letter-spacing: 2.82px;
      text-indent: 1rem;
    }
  }
  .info_wrap{
        padding:10px;
    }
    table{
        width:100%;
        line-height: 40px;
        font-size: 14px;
        color:#fff;
        border-bottom: 1px solid;
        border-color: rgba(255, 255, 255, 0.5)
    }
    table .name{
        color: rgba(255, 255, 255, 0.5);
        width: 25%;
    }
    .spotCheckDescribe,.workOrderDescribe,.processStatus{
        color: #fff;
        font-size: 16px;
        padding:30px 10px;
        border-bottom: 1px solid;
        border-color:rgba(255, 255, 255, 0.5);
    }


    .orderDetail{
    background: #22233f;
    height: auto;
    position: absolute;
  }
  .deviceInfo{
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .info{
    line-height: 0.7rem;
    font-size: 16px;
    margin-bottom: 1rem;
  }
  .title{
    color: #ddd;
    margin-right: 0.5rem;
  }
  .titleContent{
    color: #fff;
  }
  .line{
    border-bottom: 1px solid #ddd;
    margin: 0.5rem auto;
  }

  .timeLine{
    display: flex;
    color: #fff;
    /* // margin-top: 1rem; */
    position: relative;
  }
  .timeleft{
    flex: 2;
    line-height: 1rem;
    padding: 0 0.2rem;
  }
  .timemiddle{
    flex: 3;
    border-left: 1px dashed #fff;
    line-height: 1rem;
    padding-left: 1rem;
  }
  .timeright{
    flex: 1;
    line-height: 1rem;
    text-align: right;
  }
  .timeImg{
    width: 25px;
    height: 25px;
    position: absolute;
    left: 29%;
     /* margin-top: 5px;
     bottom: 2rem; */
  }
  .deviceContent{
    padding:20px;
  }
  .deviceContent .timeLine:last-child .timemiddle{
    border: none;
  }

  .slide-enter-active {
      animation-name: slideInUp;
      animation-duration: 0.2s;
      animation-fill-mode: both;
  }
  .slide-leave-active {
      animation-name: slideOutDown;
      animation-duration: 0.2s;
      animation-fill-mode: both;
  }
  @keyframes slideInUp {
      0% {
          transform: translate3d(0, 100%, 0);
          visibility: visible;
      }

      to {
          transform: translateZ(0);
      }
  }
  @keyframes slideOutDown {
      0% {
          transform: translateZ(0);
      }

      to {
          visibility: hidden;
          transform: translate3d(0, 100%, 0);
      }
  }
  .delay-leave-active {
      -webkit-animation-delay: 0.2s;
      -moz-animation-delay: 0.2s;
      -o-animation-delay: 0.2s;
      animation-delay: 0.2s;
  }

  .flex-demo {
    text-align: center;
    color: #fff;
    background-color: #323465;
    border-radius: 4px;
    background-clip: padding-box;
    height: 125px;
    /* line-height: 125px; */
    img{
      width: 40px;
      height: 40px;
      margin-bottom: 5px;
    }
    .lineImg1{
      margin-top: 35px;
    }
    .lineImg2{
      margin-top: 20px;
    }
  }
  .process_wrap{
    padding:10px;
    text-align:center;
  }
  .process_wrap button{
    height: 45px;
    width:70%;
    background-color: #456de6;
    border-radius: 20px;
    border:none;
    color:#fff;
    font-size: 16px;
    left:15%;
  }
  .container{
    width: 0;
    height: 0;
    border: 10px solid;
    border-color: transparent transparent #456de6 transparent;
    position: relative;
    right: 48px;
    top: 45px;
  }
</style>
