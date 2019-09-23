<template>
    <div class="main_wrap">
        <div class="content_wrap">
            <div class="componentTop">
              <div style="padding-left: 15px" class="changeMore" @click="changeMore">{{changePlaceholder}} <font-awesome-icon :icon="['fa','chevron-down']" size="lg" /></div>
              <div @click="backToHomepage"><img src="../../assets/icon/backHome.png" alt=""></div>
            </div>
            <div class="MoreDataP" v-if="showMore">
              <div class="runStatusBtn">
                <button type="button" v-for="(each, index) in runstatus" :class="{'active':ind === index, 'default':ind !== index}" @click="changeBgc(index)">{{each}}</button>
              </div>
              <div class="BtnGroup">
                <div class="btn-reset" @click="reset">重置</div>
                <div class="btn-over"  @click="overBtn">完成</div>
              </div>
            </div>
            <div class="dataTable">
              <div class="number">共{{number}}条记录</div>
                <x-table :cell-bordered="false">
                    <thead>
                    <tr>
                        <th>设备名称</th>
                        <th>
                          最后点巡检时间
                          <font-awesome-icon :icon="['fa','sort']" size="lg"  @click="leapfrogSort('create_time', sort2)"/>
                        </th>
                        <th>结果</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in deviceCheckRecordDatas" :key='index' @click="workSheetDetail(item)">
                        <td>{{item.name}}</td>
                        <td>{{item.create_time | formatDate}}</td>
                        <td v-if="item.check_result == 1">正常</td>
                        <td v-else-if="item.check_result == 2" style="color:#456de6">轻微故障</td>
                        <td v-else-if="item.check_result == 3" style="color:#919128">中度故障</td>
                        <td v-else style="color:red">重度故障</td>
                    </tr>
                    </tbody>
                </x-table>
            </div>
        </div>
        <shortcut-menu></shortcut-menu>
    </div>
</template>
<script>
import { XHeader, Icon, Group, PopupPicker, XTable} from 'vux'
import DeviceSelected from "../common/device-selected-detail-device"
import ShortcutMenu from "../../components/common/shortcut_menu.vue"
export default {
    components: {
        XHeader,
        Icon,
        PopupPicker,
        Group,
        XTable,
        DeviceSelected,
        "shortcut-menu":ShortcutMenu
    },
    data(){
        return {
            deviceId:'',
            list: [['A', 'B', 'C']],
            value5: ['A'],
            deviceInfo:{},
            deviceCheckRecordDatas:[],
            deviceCheckRecordDatasInfo:[],
            showMore: false,
            changePlaceholder: '点巡检结果',
            runstatus: ['全部','正常','轻微故障','中度故障','重故障'],
            ind: 0,
            departmentDetail: '',
            sort2:false,
            sortType:'create_time',
            number:0,
        }
    },
   created:function(){
    this.getRouterData()
   },
   methods: {
      getRouterData() {
        if(this.$route.query.deviceId){
            this.deviceId = this.$route.query.deviceId;
            let param ={
                deviceId: this.deviceId
            };

            this.$http(this.$API.loadDeviceCheckRecordByDeviceId, param, true).then((data)=>{
              this.deviceCheckRecordDatas = data;
              this.deviceCheckRecordDatasInfo = data;
              this.number = data.length;
            })
        }
      },
      workSheetDetail:function(config){
            this.$router.push({
            name: `workSheetDetail`,
            query: {
                CheckInfo:config,
                queryName: true,
                name: 'deviceRecord'
            }
        })
        },
      //展开更多
      changeMore: function () {
        this.showMore = true;
        this.show = true;
    },
      //返回首页
      backToHomepage: function () {
        this.$router.push({name:'homepage'});
      },
      changeBgc: function (index) {
        this.ind = index
      },
      showVuePopup3(flag) {
        if (flag === false){
          this.showMore = false;
          this.activestyle = ''
        }
        this.show3 = flag;
      },
      reset: function(){
        this.deviceNameChoose = '';
        this.deviceCodeChoose = '';
        this.ind = 0;
      },
      overBtn: function () {
        this.showMore = false;
        let indCls = this.runstatus[this.ind];
        let runStatus = -1;
        if (indCls == '全部'){
          runStatus = -1;
        }else if(indCls == '正常'){
          runStatus = 1;
        }else if(indCls == '轻微故障'){
          runStatus = 2;
        }else if(indCls == '中度故障'){
          runStatus = 3;
        }else if(indCls == '重故障'){
          runStatus = 4;
        }
        let data = this.deviceCheckRecordDatasInfo;
        this.deviceCheckRecordDatas = [];
        for(let key in data){
            if(runStatus == data[key].check_result || runStatus == -1){
                let dic = {};
                dic["name"] = data[key].name;
                dic["create_time"] = data[key].create_time;
                dic["check_result"] = data[key].check_result;
                this.deviceCheckRecordDatas.push(dic);
          }
        }
        this.number = this.deviceCheckRecordDatas.length;
      },
      leapfrogSort(type, sorted) {
        if (sorted === false) {
          this.sort2 = true;
          this.sortType = type;
          this.deviceCheckRecordDatas.sort(this.compare(type));
        }else{
          this.sort2 = false;
          this.sortType = type;
          this.deviceCheckRecordDatas.sort(this.compare2(type));
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
    }
}
</script>
<style>
    @import '../../styles/iconfont.css';
    .componentTop{
      display: flex;
      line-height: 50px;
      font-size: 16px;
      background: rgba(0,0,0,0.2);
        color: #ffffff;
    }
    .componentTop div{flex: 1}
    .componentTop div:last-child{text-align: right;padding-right: 15px}
    .componentTop img{
      width: 18px;
      height: 18px;
    }
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
    .selector{
        text-align: center;
        font-size: 16px;
        color:#fff;
        background-color: rgba(0, 0, 0, 0.3)
    }
    .selector .deviceSelect{
        height: 100%;
        width: 50%;
        color: #fff;
        background-color: #22233f;
        font-size: 20px;
        border: none;
    }
    .selector .weui-cells{
        padding:0px;
         background-color: rgba(0, 0, 0, 0.3);
    }
    .vux-cell-box{
        background-color: none !important;
    }
    .selector .vux-no-group-title::before{
        border-top: none !important;
    }
    .vux-no-group-title{
        margin-top: 0px !important;
        background-color: none;
        height: 100% !important;
    }
    .weui-cells:after{
        border-bottom: none !important;
    }
    .vux-popup-picker-select{
        text-align: center !important;
    }
    .dataTable{
        padding:0px 10px;
        color: #fff;
    }
    .vux-table:after{
        border-top: none !important;
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
    width: 28%;
    margin: 10px;
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

  .BtnGroup{
    display: flex;
    height: 30px;
    line-height: 30px;
    width: fit-content;
    margin-top: 20px!important;
    float: right;
    color: #fff;
    font-size: 16px;
    margin-right: 10px;
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
  .vux-popup-mask.vux-popup-show{
    top: 52%!important;
  }

  .vux-button-group > a.vux-button-tab-item-first:after{
    color: #3967DC !important;
    border: unset;
  }
  .vux-button-group > a.vux-button-group-current{
    background: #3967DC !important;
  }
  .vux-button-group > a.vux-button-tab-item-middle:after{
    border: unset !important;
  }
  .vux-button-group > a.vux-button-tab-item-first:after{
    color: #3967DC !important;
    border: unset;
  }
  .vux-button-group > a.vux-button-tab-item-last:after{
    color: #3967DC !important;
    border: unset;
  }
</style>

<style lang="less" scoped>
    * {
      -webkit-overflow-scrolling: touch;
    }
    .MoreDataP{
    background: #2a2c52;
    position: fixed;
    width: 100%;
    z-index: 110;
    height: auto;
    top: 50px;
    padding-bottom: 0.533333rem;
  }
  .number{
    line-height: 30px;
    border-bottom: 1px solid rgba(255,255,255,0.5);
    padding-left: 15px;
    color: #fff;
  }
</style>


