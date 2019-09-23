<template>
    <div class="main_wrap">
        <div class="content_wrap">
            <div>
              <img
                style="width: 100%;max-height:350px;margin-right:5px;"
                :src=pictures
                alt="暂无图片"
              >
            </div>
            <div class="info_wrap">
                <table>
                    <tr>
                        <td class="name">设备名称</td>
                        <td>{{deviceName}}</td>
                    </tr>
                    <tr>
                        <td class="name">设备编号</td>
                        <td>{{deviceCode}}</td>
                    </tr>
                    <tr v-if="componentName">
                        <td class="name">部件名称</td>
                        <td>{{componentName}}</td>
                    </tr>
                    <tr v-if="componentCode">
                        <td class="name">部件编号</td>
                        <td>{{deviceCode}}</td>
                    </tr>
                    <tr>
                        <td class="name">所在部门</td>
                        <td>{{departmentName}}</td>
                    </tr>
                    <tr>
                        <td class="name">点巡检结果</td>
                        <td v-if="checkResult == 1">正常</td>
                        <td v-else-if="checkResult == 2">轻微故障</td>
                        <td v-else-if="checkResult == 3">中度故障</td>
                        <td v-else>重度故障</td>
                    </tr>
                    <tr>
                        <td class="name">点巡检时间</td>
                        <td v-if="checkTime">{{checkTime | formatDate}}</td>
                    </tr>
                </table>
            </div>
            <div class="spotCheckDescribe">
                <span style="color:rgba(255,255,255,0.5)">点巡检描述</span>
                <p style="margin-top:10px;">{{checkDescribe}}</p>
            </div>
            <div class="workOrderDescribe" v-if="sheetDescription">
                <span style="color:rgba(255,255,255,0.5)">工单描述</span>
                <p style="margin-top:10px;">{{sheetDescription}}</p>
            </div>
            <div class="processStatus" v-if="dealStatus">
                <span style="color:rgba(255,255,255,0.5)">处理状态</span>
                <span v-if="dealStatus == 1" style="margin-left:20px;">已解决</span>
                <span v-if="dealStatus == 2" style="margin-left:20px;">已解决</span>
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
                    <p>{{item.actOperatorName}}</p>
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
        </div>
    </div> 
</template>
<script>
import { XTable} from 'vux'
import { constants } from 'crypto';
import BScroll from "better-scroll";

export default {
    components: {
        XTable,
        BScroll
    },
    data(){
        return {
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
            workSheetList:{}
        }
    },
   created() {
    this.getRouterData()
    },
    mounted:function(){
      this.$nextTick(() => {
          this.Scroll = new BScroll(this.$refs.deviceContent,{click: true, tap: true});
      });
    },
    methods: {
        getRouterData() {
            var param = {}
            this.CheckInfo = this.$route.query
            if(!this.CheckInfo.queryName){
                this.checkRecordId = this.CheckInfo.id   
                this.getWorkSheet(this.checkRecordId);        
                this.checkTime = this.CheckInfo.checkTime
                if(this.CheckInfo.name == 'componentCheck'){
                    param = {
                        id: this.checkRecordId,
                        type: 1
                    }
                }else if(this.CheckInfo.name == 'deviceCheck'){
                    param = {
                        id: this.checkRecordId,
                        type: 0
                    }
                }
                // 获取点巡检记录详情
                this.$http(this.$API.loadCheckDetail, param, true).then((res)=>{
                    this.deviceName = res.deviceName
                    this.deviceCode = res.code
                    this.departmentName = res.departmentName
                    this.componentName = res.componentName
                    this.componentCode = res.componentCode
                    this.checkResult = res.checkStatus
                    this.checkDescribe = res.description
                    if(res.pictures.length >0){
                        this.pictures = res.pictures[0]
                    }
                    if(res.sheetDescription && res.detailStatus){
                        this.sheetDescription =res.sheetDescription
                        this.dealStatus = res.detailStatus
                    }
                })
            }else{ 
                //获取点巡检记录详情
                this.checkRecordId = this.CheckInfo.CheckInfo.id  
                this.getWorkSheet(this.checkRecordId);         
                this.deviceId = this.CheckInfo.CheckInfo.device_id
                this.checkTime = this.CheckInfo.CheckInfo.create_time
                if(this.CheckInfo.name == 'componentRecord'){
                    param ={
                        id: this.checkRecordId,
                        type: 1
                    }
                }else if(this.CheckInfo.name == 'deviceRecord'){
                    param ={
                        id: this.checkRecordId,
                        type: 0
                    }
                }
                this.$http(this.$API.loadCheckDetail, param, true).then((res)=>{
                    this.deviceName = res.deviceName
                    this.deviceCode = res.code
                    this.departmentName = res.departmentName
                    this.componentName = res.componentName
                    this.componentCode = res.componentCode
                    this.checkResult = res.checkStatus
                    this.checkDescribe = res.description
                    if(res.pictures.length >0){
                        this.pictures = res.pictures[0]
                    }
                    if(res.sheetDescription && res.detailStatus){
                        this.sheetDescription =res.sheetDescription
                        this.dealStatus = res.detailStatus
                    }
                })
            }
        },

        getWorkSheet: function(id){
            this.$http(this.$API.getCheckWorkSheet,{checkId:id},true).then((data)=>{
                this.workSheetList = data
            })
        }
    }
}
</script>
<style lang="less" scoped>
    body{
        background-color: #22233f;
        height: 100%;
        width: 100%;
    }
    .main_wrap{
        margin: 0 auto;
        height: 100%;
        width: 100%;
        padding-bottom: 20px;
    }
    .content_wrap{
        height: 100%;
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


