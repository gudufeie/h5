<template>
    <div class="main_wrap">
        <div class="department">
            <department-selected
                :selectedDepartment="curDepartment"
                @department_selected="departmentSelected"
            ></department-selected>
        </div>
        <div class="content_wrap">
            <div class="chart">
              <div id="myChart" :style="{width: '100%', height: '100%'}"></div>
            </div>
            <div class="menus">
                <div class="spotCheck">
                    <div
                    @click="spotCheckView"
                    v-if="userActionMap['wechat_manage']['actions'].indexOf('查看点巡检记录')>=0 || userActionMap['wechat_manage']['actions'].indexOf('添加点巡检')>=0">
                        <p><img src="../../assets/icon/camera2.png" style="width:30%"><span>点巡检</span></p>
                        <p>{{spotCheckNum}}</p>
                        <p>可执行</p>
                    </div>
                </div>
                <div class="changeManage">
                    <div @click="changeRecordView"
                    v-if="userActionMap['wechat_manage']['actions'].indexOf('查看更换记录')>=0 || userActionMap['wechat_manage']['actions'].indexOf('添加更换记录')>=0">
                        <p><img src="../../assets/icon/change2.png" style="width:30%"><span>更换</span></p>
                        <p>{{replaceRecordNum}}</p>
                        <p>可执行</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { Grid, GridItem, XHeader } from 'vux'
const echarts = require('echarts');
import request from '../../config/request.js';
import DepartmentSelected from "../common/service-department-select"

export default {
    components: {
        XHeader,
        Grid,
        GridItem,
        DepartmentSelected
    },
    data(){
        return {
            // spotCheckMonth: [['2019-01-01', 50],['2019-02-01', 110],['2019-03-01', 50],['2019-04-01', 110],['2019-05-01', 50],['2019-06-01', 110],['2019-07-01', 50],['2019-07-02', 110],['2019-07-05', 200],['2019-08-01', 80],['2019-09-01', 70],['2019-10-01', 80],['2019-11-01', 70],['2019-12-01', 80],['2020-01-01', 80]],
            spotCheckMonth: [],
            // replaceRecordMonth: [['2019-01-01', 50],['2019-02-01', 110],['2019-03-01', 50],['2019-04-01', 110],['2019-05-01', 50],['2019-06-01', 110],['2019-07-01', 40],['2019-07-02', 30],['2019-07-05', 170],['2019-08-01', 90],['2019-09-01', 50],['2019-10-01', 80],['2019-11-01', 70],['2019-12-01', 80],['2020-01-01', 80]],
            replaceRecordMonth: [],
            userActionMap: {},
            spotCheckNum: 0,
            replaceRecordNum: 0,
            url:'',
            curDepartment: null,
            departmentId:1
        }
    },
    created: function(){
        this.getDomin();
        let userInfo = request.getUserInfo();
        if (!userInfo || userInfo.roleAction.length <= 0) {
            return;
        }
        for (let item of userInfo.roleAction) {
            this.userActionMap[item.pageId] = item;
        }
    },
    methods:{
        getDomin: function(){
            this.url = window.location.protocol +'//'+ window.location.host
        },
        spotCheckView: function(){
          window.location.href = this.url + '/#/operaionManage/spotCheck?department='+JSON.stringify(this.curDepartment);
        },
        changeRecordView: function(){
            window.location.href = this.url + '/#/manage/deviceDetailManage/addReplace?department='+JSON.stringify(this.curDepartment);
        },

        // 统计最近七天处理的数量
        getRecordsData: function(){
            this.replaceRecordMonth = [];
            this.spotCheckMonth = [];
            this.$http(this.$API.getReplaceRecordByMonth, {departmentId:this.departmentId}, true).then((res)=>{
                if(res){
                    for(var item of res){
                        this.replaceRecordMonth.push([item.createTime, parseInt(item.count)]);
                    }
                }
            this.drawLine();
            })
            //运维工单信息
            this.$http(this.$API.getCheckRecordByMonth, {departmentId:this.departmentId}, true).then((res)=>{
                if(res){
                    for(var item of res){
                        this.spotCheckMonth.push([item.createTime, parseInt(item.count)]);
                    }
                }
            this.drawLine();
            })
        },
        
        // 获取点巡检和更换可操作的数量
        getToDealNum: function(){
            //点巡检设备数目
            this.$http(this.$API.getCheckConfigNum, {departmentId:this.departmentId}, true).then((res)=>{
                if(res){
                this.spotCheckNum = res.count;
                }
            })
            //更换设备数目
            this.$http(this.$API.getReplaceConfigCount, {departmentId:this.departmentId}, true).then((res)=>{
                if(res){
                this.replaceRecordNum = res.count;
                }
            })
        },

        departmentSelected: function(params) {
            this.curDepartment = params.department;
            this.departmentId = this.curDepartment.id;
            this.getRecordsData();
            this.getToDealNum();
        },
        drawLine(){
          // 基于准备好的dom，初始化echarts实例
          let myChart = echarts.init(document.getElementById('myChart'));
          myChart.setOption({
              color: '#fff',
              animation: false,
              title: {
                left: 'center',
              },
              legend: {
                data:['点巡检工作记录','更换工作记录']
              },
              grid: {
                  top: 110,
                  left: 20,
                  right: 15,
                  height: 160,
                  containLabel:true
              },
              tooltip: {
                  triggerOn: 'none',
                  position: function (pt) {
                      return [pt[0], 130];
                  }
              },
              xAxis: {
                  type: 'time',
                  // boundaryGap: [0, 0],
                  axisLine:{
                      lineStyle:{
                        color:'#fff'
                    }
                  },
                  axisLabel: {
                    color: '#fff',
                  },
                  axisPointer: {
                      value: '2019-08-01',
                      snap: true,
                      color: '#fff',
                      lineStyle: {
                          color: '#004E52',
                          opacity: 0.5,
                          width: 2
                      },
                      label: {
                          show: true,
                          formatter: function (params) {
                              return echarts.format.formatTime('yyyy-MM-dd', params.value);
                          },
                          backgroundColor: '#004E52'
                      },
                      handle: {
                          show: true,
                          color: '#004E52'
                      }
                  },
                  splitLine: {
                      show: false
                  },
              },
              yAxis: {
                  type: 'value',
                  axisTick: {
                      inside: true
                  },
                  splitLine: {
                      show: false
                  },
                  axisLine:{
                      lineStyle:{
                        color:'#fff'
                    }
                  },
                  axisLabel: {
                      inside: true,
                      formatter: '{value}\n',
                      color: '#fff',
                  },
                  z: 10
              },
              dataZoom: [{
                  type: 'inside',
                  throttle: 50
              }],
              series: [
                  {
                      name:'点巡检工作记录',
                      type:'line',
                      smooth: true,
                      symbol: 'circle',
                      symbolSize: 5,
                      sampling: 'average',
                      itemStyle: {
                          normal: {
                              color: '#8ec6ad'
                          }
                      },
                      stack: 'a',
                      data: this.spotCheckMonth
                  },
                  {
                      name:'更换工作记录',
                      type:'line',
                      smooth:true,
                      stack: 'a',
                      symbol: 'circle',
                      symbolSize: 5,
                      sampling: 'average',
                      itemStyle: {
                          normal: {
                              color: '#d68262'
                          }
                      },
                      data: this.replaceRecordMonth
                  }

              ]
          })
        }
    }
}
</script>
<style>
    /** { touch-action: none; }*/
    body{
        background-color: #22233f;
        height: 100%;
        width: 100%;
    }
    .main_wrap{
        margin: 0 auto;
        height: 100%;
        width: 100%;
    }

    .content_wrap{
        width: 100%;
        height: 100%;
        color:#fff;
    }
    .vux-slider .vux-icon-dot{
        background-color: #fff;
    }
    .content .vux-icon-dot.active{
        background: #456de6;
    }

    .divide_line{
        height: 20px;
    }
    .echart div{
        background-color: #22233f !important;
    }
    #app, .content{
      height: 100%;
      width: 100%;
    }
    .chart{
      width:100%;
      height: 60%;
    }
    .menus{
        display: flex;
        width:100%;
        height: 40%;
    }
    .menus .spotCheck{
        flex:1;
        border-radius: 10px;
        padding: 20px;
    }
    .spotCheck div{
        background-color: #456de6;
        padding: 10px;
        border-radius: 10px;
    }
    .changeManage div{
        background-color: #456de6;
        padding: 10px;
        border-radius: 10px;
    }
    .menus .changeManage{
        padding: 20px;
        flex:1;
        border-radius: 10px;
    }
    .spotCheck p:nth-child(1){
        display:flex;
        align-items: center;
        font-size: 18px;
        line-height: 60px;
    }
    .spotCheck p:nth-child(1) img{
        margin-right: 10px;
    }
    .spotCheck p:nth-child(2){
        font-size: 28px;
    }
    .spotCheck p:nth-child(3){
        font-size: 16px;
    }

    .changeManage p:nth-child(1){
        display:flex;
        align-items: center;
        font-size: 18px;
        line-height: 60px;
    }
    .changeManage p:nth-child(1) img{
        margin-right: 10px;
    }
    .changeManage p:nth-child(2){
        font-size: 28px;
    }
    .changeManage p:nth-child(3){
        font-size: 16px;
    }
    #myChart>div:first-child>canvas{
      width: 96%!important;
      margin: 0 2%!important;
    }

    .department{
        color:#ffffff;
        width: 100%;
        padding: 11px 0;
        background: #03061c;
        text-align: center;
        position: absolute;
        z-index: 99;
        top: 0;
    }
</style>


