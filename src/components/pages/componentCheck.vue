<template>
    <div class="main_wrap">
        <div class="content_wrap">
            <div class="info_wrap">
                <table>
                    <tr>
                        <td class="name">设备名称</td>
                        <td>{{name}}</td>
                    </tr>
                    <tr>
                        <td class="name">设备编号</td>
                        <td>{{code}}</td>
                    </tr>
                    <tr>
                        <td class="name">运行状态</td>
                        <td v-if="runStatus == 1">运行</td>
                        <td v-else-if="runStatus == -1">----</td>
                        <td v-else>停止</td>
                    </tr>
                    <tr>
                        <td class="name">异常状态</td>
                        <td v-if="errorStatus == '1'">正常</td>
                        <td v-else-if="errorStatus == '0'">异常</td>
                        <td v-else-if="errorStatus == '2'">停用</td>
                        <td v-else>-</td>
                    </tr>
                    <tr>
                        <td class="name">所在部门</td>
                        <td>{{departmentName}}</td>
                    </tr>
                    <tr>
                        <td class="name">状态</td>
                        <td></td>
                        <td v-if="status == 1"><button class="status0" @click="addDeviceCheck">可执行</button></td>
                        <td v-if="status == 2"><button class="status1">不需要</button></td>
                        <td v-if="status == 3"><button class="status2" @click="spotCheckDetailDevice">已完成</button></td>
                    </tr>
                </table>
            </div>
            <div class="dataTable">
                <x-table :cell-bordered="false">
                    <thead>
                    <tr>
                        <th>部件名称</th>
                        <th>最后点巡检时间</th>
                        <th>状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in cpmponentCheckDatas" :key="'check1-'+index" @click="addComponentCheck(item)" v-show="item.checkResult == 1">
                        <td>{{item.componentName}}</td>
                        <td>{{item.lastCheckTime | formatDate}}</td>
                        <td style="color:red">可执行</td>
                    </tr>
                    <tr v-for="(item,index) in cpmponentCheckDatas" :key="'check2-'+index" @click="spotCheckDetail(item)" v-show="item.checkResult == 3">
                        <td>{{item.componentName}}</td>
                        <td>{{item.lastCheckTime | formatDate}}</td>
                        <td>已完成</td>
                    </tr>
                    <tr v-for="(item,index) in cpmponentCheckDatas" :key="'check3-'+index" v-show="item.checkResult == 2">
                        <td>{{item.componentName}}</td>
                        <td>{{item.lastCheckTime | formatDate}}</td>
                        <td>不需要</td>
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
        "shortcut-menu":ShortcutMenu,
    },
    data(){
        return {
            name:'',
            deviceId:'',
            deviceInfo:'',
            runStatus:'',
            errorStatus:'',
            status:'',
            departmentName: '',
            code:'',
            cpmponentCheckDatas:[],
            CheckResult:'',
            checkTime:'',
            checkId: '',
            departmentId:''
        }
    },
    created() {
     this.getRouterData()
    },
    methods: {
        getRouterData() {
            if(this.$route.query.deviceId){
              let id = this.$route.query.deviceId;
              this.$http(this.$API.loadDeviceInfo, {deviceId:id}, true).then((res) => {
                if(res){
                  this.departmentName = res.departmentName
                  this.departmentId = res.departmentId
                  this.deviceId = res.id
                  this.name = res.deviceName
                  this.runStatus = res.runStatus
                  this.errorStatus = res.execptionStatus
                  this.status = res.checkResult
                  this.code = res.deviceCode
                  this.checkId = res.checkId
                  this.getComponentReplaceConfig();
                }
              });
            }else {
                this.deviceInfo = this.$route.query.deviceInfo
                this.deviceId = this.deviceInfo.id
                this.$http(this.$API.loadDeviceInfo, {deviceId:this.deviceId}, true).then((res) => {
                if(res){
                  this.departmentName = res.departmentName
                  this.departmentId = res.departmentId
                  this.deviceId = res.id
                  this.name = res.deviceName
                  this.runStatus = res.runStatus
                  this.errorStatus = res.execptionStatus
                  this.status = res.checkResult
                  this.code = res.deviceCode
                  this.checkId = res.checkId
                  this.getComponentReplaceConfig();
                    }
                });
            }
        },

        getComponentReplaceConfig: function(){
            let params = {
                deviceId: this.deviceId
            }
            this.$http(this.$API.checkRecordList, params, true).then((res) => {
                this.cpmponentCheckDatas = res.resultList;
            })
        },

        // 部件添加点巡检记录
        addComponentCheck:function(config){
            this.$router.push({
            name: `addComponentCheck`,
            query: {
                componentId: config.componentId,
                componentName: config.componentName,
                deviceName: this.name,
                deviceCode: this.code,
                deviceId: this.deviceId,
                departmentName: this.departmentName,
                departmentId: this.departmentId
                }
            })
        },
        spotCheckDetail:function(config){
            this.$router.push({
                name: `workSheetDetail`,
                query: {
                    id: config.checkId,
                    checkTime: config.lastCheckTime,
                    queryName: false,
                    name: 'componentCheck'
                    }
                })
        },
        // 添加设备点巡检
        addDeviceCheck: function(){
          let config={
            deviceName: this.name,
            deviceCode: this.code,
            id: this.deviceId,
          }
          this.$router.push({
              name: `addDeviceCheck`,
              query: {
                  deviceInfo:config,
                  departmentId: this.departmentId,
                  departmentName: this.departmentName,
              }
          })
        },
        //查看设备点巡检信息
        spotCheckDetailDevice:function(){
          let config = {
            checkId: this.checkId,
            checkTime:this.checkTime
          };
          this.$router.push({
          name: `workSheetDetail`,
          query: {
              id: config.checkId,
              checkTime: config.checkTime,
              queryName: false,
              name: 'deviceCheck'
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
        background-color: rgba(0, 0, 0, 0.3)
    }
    table{
        width:100%;
        line-height: 40px;
        font-size: 14px;
        color:#fff;
        border-color: rgba(255, 255, 255, 0.5)
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
        width: 60px;
    }
    .status2{
        color:#456de6;
        border:1px solid #456de6;
        float:right;
        background-color:#22233f;
        height: 30px;
        width: 60px;
    }

    .status1{
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
</style>


