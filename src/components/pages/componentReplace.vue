<template>
    <div class="main_wrap">
        <div class="content_wrap">
            <div class="info_wrap">
                <table>
                    <tr>
                        <td class="name">设备名称</td>
                        <td>{{deviceInfo.device_name}}</td>
                    </tr>
                    <tr>
                        <td class="name">设备编号</td>
                        <td>{{deviceInfo.code}}</td>
                    </tr>
                    <tr>
                        <td class="name">所在部门</td>
                        <td>{{deviceInfo.department_name}}</td>
                    </tr>
                    <tr>
                        <td class="name">更换周期</td>
                        <td>{{deviceInfo.maintain_time == 0?'-':deviceInfo.maintain_time}}
                            <span v-if="deviceInfo.maintain_time_unit ==1">天</span>
                            <span v-else-if="deviceInfo.maintain_time_unit ==2">周</span>
                            <span v-else-if="deviceInfo.maintain_time_unit ==3">月</span>
                            <span v-else-if="deviceInfo.maintain_time_unit ==4">年</span>
                            <span v-else></span>
                        </td>
                    </tr>
                    <tr>
                        <td class="name">剩余天数</td>
                        <td v-if="deviceInfo.left_date == '-1'">-</td>
                        <td v-else>{{deviceInfo.left_date}}天</td>
                    </tr>
                    <tr>
                        <td class="name">更换状态</td>
                        <td></td>
                        <td v-if="deviceInfo.maintain_time == 0"><button class="status2">不需要</button></td>
                        <td v-else><button class="status0" @click="updateDevice">可执行</button></td>
                    </tr>
                </table>
            </div>
            <div class="dataTable">
                <x-table :cell-bordered="false">
                    <thead>
                    <tr>
                        <th>部件</th>
                        <th>分类</th>
                        <th>规格</th>
                        <th>更换周期</th>
                        <th>剩余天数</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in componentReplaceDatas" :key="'replace-'+index">
                        <td>{{item.componentName}}</td>
                        <td>{{item.catName}}</td>
                        <td>{{item.stockName}}</td>
                        <td>{{item.maintainTime}}
                            <span v-if="item.maintainTimeUnit == 1">天</span>
                            <span v-else-if="item.maintainTimeUnit == 2">周</span>
                            <span v-else-if="item.maintainTimeUnit == 3">月</span>
                            <span v-else-if="item.maintainTimeUnit == 4">年</span>
                            <span else></span>
                        </td>
                        <td>{{item.leftDay}}天</td>
                        <td v-if="item.maintainTime == 0">不需要</td>
                        <td class="status1" v-else @click="addComponentReplace(item)">可执行</td>
                    </tr>
                    </tbody>
                </x-table>
            </div>
        </div>
        <shortcut-menu></shortcut-menu>
    </div>
</template>
<script>
import { XTable} from 'vux';
import ShortcutMenu from "../../components/common/shortcut_menu.vue";

export default {
    components: {
        XTable,
        ShortcutMenu
    },
    data(){
        return {
            name:'',
            deviceId:'',
            deviceInfo:'',
            runStatus:'',
            errorStatus:'',
            status:'',
            depatrmentName: '',
            code:'',
            componentReplaceDatas:[],
            CheckResult:'',
            checkTime:'',
        }
    },
   created() {
    this.getRouterData()
    },
    methods: {
        getRouterData() {
          if(this.$route.query.deviceId){
            let id = this.$route.query.deviceId;
            this.$http(this.$API.getDeviceReplaceConfigByDeviceId, {deviceId:id}, true).then((res) => {
              if(res){
                this.deviceInfo ={
                  department_name: res.department_name,
                  device_name:res.device_name,
                  code:res.code,
                  device_id:res.device_id,
                  time:res.time,
                  left_date: res.left_date,
                  maintain_time:res.maintain_time,
                  maintain_time_unit:res.maintain_time_unit
                };
                this.getDeviceReplaceConfig(res.device_id);
              }
            });
          }else{
            this.deviceInfo = this.$route.query.device;
            this.getDeviceReplaceConfig(this.deviceInfo.device_id);
          }
        },

        getDeviceReplaceConfig: function(deviceId){
            let params = {
              deviceId: parseInt(deviceId)
            }
            this.$http(this.$API.loadComponentReplaceConfig, params, true).then((data)=>{
                this.componentReplaceDatas = data
            })
        },
        // 部件添加更换记录
        addComponentReplace:function(config){
            this.$router.push({
            name: `addComponentReplace`,
            query: {
                device:this.deviceInfo,
                component: config
                }
            })
        },
        //更换设备
        updateDevice: function () {
          //更换设备
          let device = {
              id: this.deviceInfo.id,
              name: this.deviceInfo.device_name,
              code: this.deviceInfo.code,
              device_id: this.deviceInfo.device_id
          }
          this.$router.push({
            name:'addDeviceReplace',
            query:{
              device: device
            }
          })
        },
    }
}
</script>
<style scoped>
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
        padding-bottom: 50px;
    }
    .info_wrap{
        padding:10px;
        background: rgba(0, 0, 0, 0.3)
    }
    table{
        width:100%;
        line-height: 40px;
        font-size: 14px;
        color:#fff;
    }
    table .name{
        color: rgba(255, 255, 255, 0.5);
        width: 25%;
    }
    .status0{
        color:red;
        border:1px solid red;
        float:right;
        background-color:#22233f;
        height: 30px;
        width: 50px;
    }
    .status1{
        color:#456de6;
        text-decoration: underline;
    }
    .status2{
        color:#fff;
        border:1px solid #fff;
        float:right;
        background-color:#22233f;
        height: 30px;
        width: 60px;
    }
    .dataTable{
        padding:0px 10px;
        color: #fff;
        font-size: 16px;
    }
    .vux-table:after{
        border-top: none !important;
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
    .info_wrap table td{
        overflow: unset !important;
    }
</style>


