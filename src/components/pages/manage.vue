<template>
  <div class="content_wrap">
    <div class="mainManage">
      <div id="container" style="height: 100%;overflow: hidden"></div>
      <div class="showPie">
          <div id="myChart" :style="{width: '100%', height: '100%'}"></div>
      </div>
      <div class="showInformation">
        <div class="normalDevice">
          <div><img src="../../assets/icon/dot.png" alt="">运转设备</div>
          <div class="normalData">{{deviceInfo.b}}</div>
        </div>
        <div class="oddDevice">
          <div><img src="../../assets/icon/dot.png" alt="">全部设备</div>
          <div class="oddData">{{deviceNum}}</div>
        </div>
      </div>
      <div class="footers">
        <div v-if="userActionMap['wechat_run']['actions'].indexOf('设备列表') >= 0" class="footer" @click="toDetail(index=1)"><img src="../../assets/icon/device.png" alt=""> 设备列表  <span>{{deviceNum}}</span></div>
        <div v-if="userActionMap['wechat_run']['actions'].indexOf('部件管理') >= 0" class="footer" @click="toDetail(index=2)"><img src="../../assets/icon/compManage.png" alt=""> 部件管理  <span>{{componentNum}}</span></div>
        <div v-if="userActionMap['wechat_run']['actions'].indexOf('生产数据') >= 0" class="footer" @click="toDetail(index=3)"><img src="../../assets/icon/dataProduce.png" alt=""> 生产数据
          <!--<span class="produceData">+{{produceNum}}</span>-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { XHeader,Grid, GridItem ,ButtonTab, ButtonTabItem  } from 'vux'
import request from '../../config/request.js';

export default {
  components: {
    XHeader,
    Grid,
    GridItem,
    ButtonTab,
    ButtonTabItem,
  },
  data(){
    return {
      deviceInfo:{
        run:'',
        abnormal:'',
        moduleAbnormal:'',
        noneNum:'',
        stopNum:'',
        errNum: ''
      },
      // deviceNum: this.run + this.abnormal + this.moduleAbnormal + this.noneNum + this.stopNum,
      deviceNum: '',
      componentNum:'',
      produceNum:'',
      radio:'',
      userActionMap:{},
    }
  },
  created: function(){
    let userInfo = request.getUserInfo();
      if (!userInfo || userInfo.roleAction.length <= 0) {
        return;
      }

    for (let item of userInfo.roleAction) {
      this.userActionMap[item.pageId] = item;
    }

    let param = {
      departmentId: 1,
      departmentName:'',
      departmentCode:'',
      runStatus:0,
      componentName:'',
      componentCode:''
    }
    this.$http(this.$API.getDeviceNum,param, true).then((res) => {
      this.deviceInfo = res.deviceInfo;

      // 1、无 - a- 2、运转- b-3、停止- c-4、异常-  d-5、模块异常 - e-
      if(!!!this.deviceInfo.a){
        this.deviceInfo.a = 0
      }
      if(!!!this.deviceInfo.b){
        this.deviceInfo.b = 0
      }
      if(!!!this.deviceInfo.c){
        this.deviceInfo.c = 0
      }
      if(!!!this.deviceInfo.d){
        this.deviceInfo.d = 0
      }
      if(!!!this.deviceInfo.e){
        this.deviceInfo.e = 0
      }

      if (res) {
        this.deviceNum = parseInt(this.deviceInfo.a) + parseInt(this.deviceInfo.b) + parseInt(this.deviceInfo.c) + parseInt(this.deviceInfo.d) + parseInt(this.deviceInfo.e);
        this.componentNum = res.componentNum;
        this.produceNum = res.produceNum;
        if(this.deviceNum == 0){
          this.radio = 0
        }else{
          this.radio = (parseInt(this.deviceInfo.b) / this.deviceNum).toFixed(3) * 100;
        }
        this.drawLine(this.deviceInfo.b,this.deviceInfo.d,this.deviceInfo.e,this.deviceInfo.a,this.deviceInfo.c,this.radio)
    }
  });
  },
  mounted(){
    // this.drawLine(this.deviceInfo.run,this.deviceInfo.abnormal,this.deviceInfo.moduleAbnormal,this.deviceInfo.noneNum,this.deviceInfo.stopNum,this.radio);
  },
  methods:{

    toDetail: function (index) {
      if(index == 1){
         this.$store.commit('changeMode',0);
        this.$router.push({name:'deviceDetailManage',query:{name:'deviceManage'}});
      }
      if(index == 2){
         this.$store.commit('changeMode', 1);
        this.$router.push({name:'inventoryTree',query:{name:'componentManage'}});
      }
      if(index == 3){
         this.$store.commit('changeMode', 2);
        this.$router.push({name:'produce',query:{name:'produceData'}});
      }
    },
    // run:运行,abnormal:异常,moduleAbnormal:模块异常,noneNum:无,stopNum:停止运转
    drawLine(run,abnormal,moduleAbnormal,noneNum,stopNum,radio){
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
           color:['#456de6','#d81e06','#d98807','#45d8e6','#45a3e6'],//配置颜色
           tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            graphic:[{
                type:'text',
                left:'center',
                top:'40%',
                style:{
                    text:radio.toFixed(1)+'%\n',
                    fill:'#fff',
                    fontSize:40,
                    fontWeight: 700,
                }
            },{
                type:'text',
                left:'center',
                top:'66%',
                style:{
                    text:'正常运行',
                    fill:'#fff',
                    fontSize:18,
                }
            }],
           series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['70%', '90%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'inner',
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '14',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true
                        }
                    },
                    data:[
                        {value:run, name:'运转'},
                        {value:abnormal, name:'异常'},
                        {value:moduleAbnormal, name:'模块异常'},
                        {value:noneNum, name:'无'},
                        {value:stopNum, name:'停止'}
                    ]
                }
            ]
        });
    }
  }
}
</script>
<style lang="less" scoped>
  .content_wrap{
    background: #22233f;
    height: 100%;
    width: 100%;
    position: fixed;
    .showPie{
      top: 0;
      position: absolute;
      margin: 10% auto;
      width: 100%;
      height: 40%;
      div{
        background-color: unset !important;
      }
    }
    .showInformation{
      width: 100%;
      color: #ffffff;
      position: absolute;
      bottom: 30%;
      text-align: center;
      height: 60px;
      margin-bottom: 30px;
      .normalDevice{
        float: left;
        width: 40%;
        margin: 0 4%;
        height: 60px;
        border:1px rgba(255,255,255,0.2) solid;
        border-radius: 10px;
        div{
          width: 40%;
          float: left;
          margin: 0 4%;
        }
        .normalData{
          font-size: 20px;
          line-height: 60px;
        }
        img{
          width: 20px;
          margin: 10px calc(~"50% - 10px");
        }

      }
      .oddDevice{
        float: right;
        width: 40%;
        height: 60px;
        margin: 0 4%;
        border:1px rgba(255,255,255,0.2) solid;
        border-radius: 10px;
        div{
          width: 40%;
          float: left;
          margin: 0 4%;

        }
        .oddData{
          font-size: 20px;
          line-height: 60px;
        }
        img{
          width: 20px;
          margin: 10px calc(~"50% - 10px");
        }
      }
    }
    .footers{
      position: absolute;
      width: 100%;
      bottom: 5%;
    }
    .footer{
      border-bottom: 1px rgba(255,255,255,0.2) solid;
      height: 50px;
      font-size: 20px;
      line-height: 50px;
      color: #ffffff;
      margin: 0 10px;
      position: unset;
      width: 95%;
      img{
        height: 20px;
        width: 20px;
        padding-right: 20px;
      }
      span{
        float: right;
        font-size: 16px;
        color: rgba(255,255,255,0.5);
      }
      .produceData{
        color: red;
      }
    }
  }
  .vux-circle-demo {
  padding-top: 20px;
  text-align: center;
  /*background: rgba(0,0,0,0.3);*/
}
  .vux-circle-demo > div {
  margin: 0 auto;
}
  .showPie{
    text-align: -webkit-center;
  }
</style>
<style>
  #app, .content{
    width: 100%!important;
    height: 100%!important;
  }
  .mainManage{
      width: 100%;
      height: 100%;
      position: relative;
  }
  .content_wrap{
    height: 100%;
    width: 100%;
    margin: 0px auto;
    background-color: #22233f;
  }
  .header_title{
    text-align: center;
    background-color: #fff;
  }
  .header_title p{
    line-height:40px;
    font-size: 20px;

  }
  .menu_bar{
    background-color: rgba(0,0, 0, 0.3);
  }
  .menu_bar .weui-grid__label{
    color:#fff;
  }
  .devide_line{
    height: 30px;
  }
  .menu_bar .weui-grid:after{
    border-bottom: none;
  }
  .contnet_display{
    background-color: rgba(0,0, 0, 0.3);
    height: 200px;
    padding:20px 15px;
  }
  .content_title{
    color: #fff;
    font-size: 20px;
    margin-bottom: 20px;
  }
  .content_title a{
    color:#456de6;
  }
  .menu_tab{
    color:#fff;
  }
  .device_config{
    background-color: rgba(0,0, 0, 0.3);
    padding: 15px 15px;
  }
  .config_menu{
  background-color: rgba(0,0, 0, 0.4);
  }
  .config_menu .weui-grid__label{
    color:#fff;
  }
  .config_menu .weui-grid:after{
    border-bottom: none;
  }
  .config_menu .weui-grids:before{
    border-top: none;
  }
  .device_alarm{
    background-color: rgba(0,0, 0, 0.3);
    padding: 15px 15px;
  }
  .alarm_menu{
    display: flex;
    background-color: rgba(0,0, 0, 0.4);
  }
  .alarm_menu .weui-grid__label{
    color:#fff;
  }
  .alarm_menu .alarm_left{
    flex:1;
  }
  .alarm_menu .alarm_right{
    flex:4;
    color:#fff;
  }
  .alarm_right div:nth-child(2){
    display:flex;
    align-items: center;
    /* justify-content: center; */
  }
  .alarm_right div:nth-child(1){
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 20px;
  }
  .alarm_right span:nth-child(1){
    margin-right: 20px;
  }
  .alarm_menu .weui-grid:after{
    border-bottom: none;
  }
  .alarm_menu .weui-grids:before{
    border-top: none;
  }
</style>


