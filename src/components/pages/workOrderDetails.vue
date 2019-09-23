<template>
  <div class="orderDetail">
    <div>
      <img :src=picture alt="暂无图片">
    </div>
    <div class="deviceInfo">
      <div>
        <ul class="info">
          <li>
            <span class="title">设备名称</span> <span class="titleContent">{{workSheetInfo.deviceName}}</span>
          </li>
          <li>
            <span class="title">设备编号</span> <span class="titleContent">{{workSheetInfo.deviceCode}}</span>
          </li>
          <li v-if="workSheet.componentName">
            <span class="title">部件名称</span> <span class="titleContent">{{workSheet.componentName}}</span>
          </li>
          <li v-if="workSheet.componentCode">
            <span class="title">部件编号</span> <span class="titleContent">{{workSheet.componentCode}}</span>
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
           <span class="titleContent" v-if="workSheet.work_sheet_type == 1">点巡检</span>
           <span class="titleContent" v-if="workSheet.work_sheet_type == 2">更换</span>
          </li>
        </ul>
      </div>
      <div class="line"></div>
      <div class="deviceContent" ref="deviceContent">
        <div class="timeLine" v-for="(item, index) in workSheetDetail" :key="index">
          <img v-if="item.handle_type === 3" class="timeImg" src="../../assets/icon/finished.png" alt="上报">
          <img v-if="item.handle_type === 1" class="timeImg" src="../../assets/icon/report.png" alt="转办">
          <img v-if="item.handle_type === 2" class="timeImg" src="../../assets/icon/transfer.png" alt="解决">
          <img v-if="item.handle_type === 4" class="timeImg" src="../../assets/icon/reject.png" alt="驳回">
          <div class="timeleft">
            <p>{{item.update_time | formatDate}}</p>
          </div>
          <div class="timemiddle">
            <div class="container" v-if="index != workSheetDetail.length-1"></div>
            <p>{{item.name}}</p>
            <p>{{item.description}}</p>
          </div>
          <div class="timeright">
            <p v-if="index == workSheetDetail.length-1">提交</p>
            <p v-else-if="item.handle_type == 1">上报</p>
            <p v-else-if="item.handle_type == 2">转办</p>
            <p v-else-if="item.handle_type == 3">解决</p>
            <p v-else-if="item.handle_type == 4">驳回</p>
          </div>
        </div>
      </div>
      <div class="process_wrap" v-if="buttonShow">
        <button @click="chooseLeader">工单处理</button>
      </div>
    </div>
    <shortcut-menu></shortcut-menu>
  </div>
</template>

<script>
  import { Flexbox, FlexboxItem} from 'vux';
  import ShortcutMenu from "../../components/common/shortcut_menu.vue";
  import BScroll from "better-scroll";

  export default {
    components: {
      Flexbox,
      FlexboxItem,
      "shortcut-menu":ShortcutMenu,
      BScroll
    },
     data () {
      return {
        buttonShow:false,
        show2: false,
        workSheetInfo:{},
        workSheetDetail:{},
        workSheet:{},
        type:'',
        picture:''
      }
    },
    created: function(){
      this.getRouterInfo();
    },
    mounted:function(){
      this.$nextTick(() => {
          this.Scroll = new BScroll(this.$refs.deviceContent,{click: true, tap: true});
      });
    },
    methods: {
      showVuePopup(flag) {
        this.show2 = flag
      },
      getRouterInfo: function(){
        this.workSheetInfo = this.$route.query.item;
        this.type = this.$route.query.type;
        if(this.type == 'processed'){
          this.buttonShow = false;
        }else{
          this.buttonShow = true;
        }

        // 工单处理记录
        this.$http(this.$API.getWorkSheetPeocessInfo,{id:this.workSheetInfo.id},true).then((data)=>{
          console.log('工单记录',data)
          this.workSheetDetail = data;
        })

        // 工单处理详情
        this.$http(this.$API.getWorkSheetInfo,{id:this.workSheetInfo.id},true).then((data)=>{
          console.log('工单记录111',data[0])
          if(data.length >0){
            this.workSheet =data[0]
            if(this.workSheet.picture.length > 0){
              this.picture = this.workSheet.picture.split(',')[0]
            }
          }
        })

      },
      chooseLeader: function(){
        this.$router.push({
          name: 'submitWorkOrder',
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
    background: #22233f;
    height: auto;
    position: absolute;
    width:100%;
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
