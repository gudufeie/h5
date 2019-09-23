<template>
  <div class="orderDetail">
    <div class="deviceInfo">
      <div>
        <ul class="info">
          <li>
            <span class="title">设备名称</span> <span class="titleContent">{{workSheetInfo.deviceName}}</span>
          </li>
          <li>
            <span class="title">设备编号</span> <span class="titleContent">{{workSheetInfo.deviceCode}}</span>
          </li>
          <li>
            <span class="title">部件名称</span> <span class="titleContent">{{workSheetInfo.componentName}}</span>
          </li>
          <li>
            <span class="title">部件编号</span> <span class="titleContent">{{workSheetInfo.componentCode}}</span>
          </li>
          <li>
           <span class="title">所在部门</span> <span class="titleContent">{{workSheet.department_name}}</span>
          </li>
          <li>
            <span class="title">运行状态</span>
            <span class="titleContent" v-if="workSheet.run_status  == 0">无</span>
            <span class="titleContent" v-if="workSheet.run_status  == 1">运转</span>
            <span class="titleContent" v-if="workSheet.run_status  == 2">停止</span>
            <span class="titleContent" v-if="workSheet.run_status  == 3">异常</span>
            <span class="titleContent" v-if="workSheet.run_status  == 4">模块异常</span>
          </li>
          <li>
           <span class="title">工单类型</span>
           <span class="titleContent" v-if="workSheetInfo.workSheetType == 1">点巡检</span>
           <span class="titleContent" v-else-if="workSheetInfo.workSheetType == 2">更换</span>
           <span class="titleContent" v-else>未知类型</span>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="deviceContent">
        <div class="timeLine" v-for="(item, index) in workSheetDetail" :key="index">
          <img v-if="item.type === '1'" class="timeImg" src="../../assets/icon/circle.png">
          <img v-if="item.type === '2'" class="timeImg" src="../../assets/icon/circleRed.png">
          <div class="timeleft">
            <p>{{item.create_time | formatDate}}</p>
          </div>
          <div class="timemiddle">
            <p>{{item.operatorName}}</p>
            <p v-if="item.type === '2'" style="color:red">{{item.description}}</p>
            <p v-else>{{item.description}}</p>
          </div>
          <div class="timeright">
            <p v-if="item.handle_type == 1">上报</p>
            <p v-else-if="item.handle_type == 2">转办</p>
            <p v-else-if="item.handle_type == 3" style="color:#456de6">解决</p>
            <p v-else-if="item.handle_type == 4" style="color:red">驳回</p>
            <p v-else style="color:red">未处理</p>
          </div>
        </div>
      </div>
      <div class="process_wrap" v-if="buttonShow">
        <button @click="exceptionProcess">异常提醒处理</button>
      </div>
    </div>
    <shortcut-menu></shortcut-menu>
  </div>
</template>

<script>
  import { Flexbox, FlexboxItem} from 'vux'
  import ShortcutMenu from "../../components/common/shortcut_menu.vue"
  export default {
    components: {
      Flexbox,
      FlexboxItem,
      "shortcut-menu":ShortcutMenu
    },
     data () {
      return {
        buttonShow:false,
        show2: false,
        workSheetInfo:{
          deviceName:'dfgsfdgs',
          deviceCode:'dfgfdsgfdsg',

        },
        workSheetDetail:[],
        workSheet:{},
        type:'',
        workSheetInfo:{},
      }
    },
    created: function(){
      this.getWorkSheetInfo();
    },
    methods: {
      showVuePopup(flag) {
        this.show2 = flag
      },
      getWorkSheetInfo: function(){
        this.workSheetInfo = this.$route.query.workSheetInfo;
        if(this.workSheetInfo.handleState == 2){
          this.buttonShow = false;
        }else{
          this.buttonShow = true;
        }
        this.$http(this.$API.loadExceptWorkSheetRecord,
                  {workSheetId:this.workSheetInfo.id},true).then((data)=>{
                    this.workSheetDetail = data.workSheetHandles
                  })

         // 工单处理详情
        this.$http(this.$API.getWorkSheetInfo,{id:this.workSheetInfo.id},true).then((data)=>{
          if(data.length >0){
            this.workSheet =data[0]
          }
        })
      },
      exceptionProcess: function(){
        this.$router.push({
          name: 'submitRemindRecord',
          query:{
            workSheet:this.workSheetInfo
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  * { touch-action: none; }

  .orderDetail{
    width: 100%;
    background: #22233f;
    height: auto;
    position: absolute;
  }
  .deviceInfo{
    padding: 0.5rem;
    margin-bottom: 1rem;
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
    // margin-top: 1rem;
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
    // margin-top: 5px;
    // bottom: 2rem;
  }
  .deviceContent{
    // padding-top: 0.5rem;
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
    /*line-height: 125px;*/
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
    padding:10px 10px 0px 10px;
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
</style>
