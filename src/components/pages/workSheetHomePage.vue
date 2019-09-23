<template>
  <div class="workSheetHomePage">
    <div class="main">
      <div class="introduce">运维工单处理进度</div>
      <div class="vux-circle-demo">
        <div class="home-scircle">
          <img src="../../assets/icon/icon1.gif" alt="">
          <div class="home-scirle-inner">{{ percent }}%</div>
        </div>
        <!-- <div style='width:80%;height:80%;margin: 30px 10%;'>
          <x-circle
            :percent="percent"
            :stroke-width="6"
            :trail-width="6"
            :stroke-color="['#36D1DC', '#5B86E5']"
            trail-color="#ececec">
            <span style="color:#36D1DC">{{ percent }}%</span>
          </x-circle>
        </div> -->
      </div>
      <div class="description">
        <div class="workSheetNum"  @click="toWorkSheet">
          <div class="confirmNumStyle">{{workSheetTotal}}</div>
          <div>运维工单总量</div>
        </div>
        <div class="toDoNum"   @click="toToDo">
          <div class="confirmNumStyle">{{toDealWorkSheetNum}}</div>
          <div>待处理运维工单量</div>
        </div>
        <div class="submitNum"   @click="toSubmit">
          <div class="confirmNumStyle">{{mySubmitWorkSheet}}</div>
          <div>我提交工单量</div>
        </div>
        <div class="finishNum"   @click="toFinish">
          <div class="confirmNumStyle">{{myFinishedWorkSheet}}</div>
          <div>完结工单量</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Swiper,SwiperItem,XCircle,XHeader  } from 'vux';
  import request from '../../config/request.js';
  export default {
    components: {
      Swiper,
      SwiperItem,
      XCircle,
      XHeader
    },
    name: "workSheetHomePage",
    data: function () {
      return {
        //工单功能
        workSheetInfo: [{title: '运维工单', handle: '处理工单', record: '历史工单记录'}, {title: '报警工单', handle: '处理工单', record: '报警工单记录'}, {title: '预警工单', handle: '处理工单', record: '预警工单记录'}],
        //工单代办事项
        sites: [{imgUrl:require('../../assets/icon/look-function.png'), content:'设备点检'},{imgUrl:'', content:'设备xun'},{imgUrl:'', content:'设检'},{imgUrl:'', content:'点检'},{imgUrl:'', content:'备点检'}],
        //组织架构人员
        structurePerson: [],
        //组织架构名称
        structureNames: [],
        //
        index: 0,
        percent: 0,
        //工单数据
        workSheetTotal:0,
        toDealWorkSheetNum:0,
        mySubmitWorkSheet:0,
        myFinishedWorkSheet:0,
        workSheetList:0,
        toDealWorkSheetList:0,
        mySubmitWorkSheetList:0,
        myFinishedWorkSheetList:0,
        userInfo:{},
        historyRecord:[]
      }
    },
    created: function () {
      this.userInfo = request.getUserInfo();
      this.loadWorkSheetInfo();
      this.loadMyWorkSheets();
      this.loadFinishedWorkSheets();
    },
    methods: {
      //搜索公司
      searchCompany: function(){
        alert("待开发中");
      },
      getMenuIndex: function(index){
        if(index == 0){
          this.$router.push({name: 'workSheetManage'});
        }
      },
      //点击跳转到对应的页面
      toWorkSheet: function () {
        this.$router.push(
          {
            name: 'historyWorkOrder',
            query: {
              page: 'history',
              data: this.workSheetList,
              index:0
            }
          });
      },
      toToDo: function () {
        console.log('5555555',this.toDealWorkSheetList,this.workSheetList)
        this.$router.push(
          {
            name: 'historyWorkOrder',
            query: {
              page: 'unprocessed',
              data: this.toDealWorkSheetList,
              allData: this.workSheetList
            }
            });
      },
      toSubmit: function () {
        this.$router.push(
          {
            name: 'historyWorkOrder',
            query: {
              page: 'history',
              data: this.mySubmitWorkSheetList,
              index:1
            }
        });
      },
      toFinish: function () {
        this.$router.push(
          {
            name: 'historyWorkOrder',
            query: {
              page: 'history',
              data:this.myFinishedWorkSheetList,
              index:2
            }
          });
      },

      // 部门下所有工单
      loadWorkSheetInfo: function(){
        this.$http(this.$API.workSheetInfo, {},true).then((data)=>{
          if(data.workSheets.length > 0){
            this.workSheetList = data.workSheets;
            this.workSheetTotal = data.workSheets.length;
            this.loadUndealWorkSheets();
          }else{
            this.percent = 0
          }
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

    // 待处理工单
    loadUndealWorkSheets: function(){
      this.$http(this.$API.loadToDealWorkSheet, {},true).then((data)=>{
        if(data ){
          this.toDealWorkSheetList = data.workSheets;
          this.toDealWorkSheetNum = data.workSheets.length;
          this.percent =((this.workSheetTotal-this.toDealWorkSheetNum)/this.workSheetTotal).toFixed(2)*100;
        }else{
          this.percent = 100
        }
      })
    },

    // 我提交的工单
    loadMyWorkSheets: function(){
      this.$http(this.$API.mySubmitWorkSheets, {},true).then((data)=>{
        if(data){
          this.mySubmitWorkSheetList = data.workSheets;
          this.mySubmitWorkSheet = data.workSheets.length
        }
      })
    },

    // 我完结的工单
    loadFinishedWorkSheets: function(){
      this.$http(this.$API.myFinishedWorkSheets, {},true).then((data)=>{
        if(data){
          this.myFinishedWorkSheetList = data.workSheets
          this.myFinishedWorkSheet = data.workSheets.length
        }
      })
    },
    },
  }

</script>

<style lang="less" scoped>
  .workSheetHomePage {
    background: #22233f;
    height: 100vh;
    .main{
      .introduce{
        /*padding: 20px auto;*/
        color: #fff;
        height: 60px;
        font-size: 20px;
        line-height: 60px;
        text-align: center;
      }
      .description{
        color: #ffffff;
        width: 90%;
        margin: 0 5%;
        .workSheetNum{
          width: calc(~"50% - 1px");
          float: left;
          text-align: center;
          padding: 10px 0;
          border-right: 1px rgba(255,255,255,0.2) solid;
          border-bottom: 1px rgba(255,255,255,0.2) solid;
        }
        .toDoNum{
          width: calc(~"50% - 1px");
          float: left;
          text-align: center;
          padding: 10px 0;
          border-left: 1px rgba(255,255,255,0.2) solid;
          border-bottom: 1px rgba(255,255,255,0.2) solid;
        }
        .submitNum{
          width: calc(~"50% - 1px");
          float: left;
          text-align: center;
          padding: 10px 0;
          border-right: 1px rgba(255,255,255,0.2) solid;
          border-top: 1px rgba(255,255,255,0.2) solid;
        }
        .finishNum{
          width: calc(~"50% - 1px");
          float: left;
          text-align: center;
          padding: 10px 0;
          border-left: 1px rgba(255,255,255,0.2) solid;
          border-top: 1px rgba(255,255,255,0.2) solid;
        }
        .confirmNumStyle{
          color: #3967DC;
          font-size: 20px;
        }
      }
      .vux-circle-demo {
        padding-top: 20px;
        text-align: center;
      }
      .vux-circle-demo > div {
        margin: 0 auto;
      }
    }
  }
  .home-scircle{
    width: 80%;
    margin: 0 auto 30px!important;
    position: relative;
    img{
      width: 100%;
      display: block;
    }
    .home-scirle-inner{
      position: absolute;
      left: 50%;
      top: 50%;
      width: 240px;
      height: 240px;
      margin-left: -120px;
      margin-top: -120px;
      background: url('../../assets/icon/icon2.png') no-repeat;
      background-size: 100% 100%;    
      display: flex;
      justify-content: center;
      align-items: center;  
      font-size: 52px;
      color: #fff;
    }
     
  }
</style>

<style lang="less">
.workSheetHomePage{
  .vux-circle-content{
    font-size: 50px;   
    font-weight: bold;
    span{
       color: #fff!important;
    }
  }
}
</style>