<template>
    <div class="main_wrap">
        <div class="content_wrap">
            <div class="componentTop">
              <div style="padding-left: 15px" class="changeMore" @click="changeMore">筛选 <span class="iconfont icon-shaixuan"></span></div>
              <div @click="backToHomepage"><img src="../../assets/icon/backHome.png" alt=""></div>
            </div>
            <div class="MoreData" v-if="showMore">
              <div class="deviceName">部件名称 <input type="text" placeholder="请输入部件名称" v-model="componentName"></div>
              <div class="deviceCode">部件编号 <input type="text" placeholder="请输入部件编号" v-model="componentCode"></div>
              <div>结果</div>
              <div class="runStatusBtn">
                <button type="button" v-for="(each, index) in runstatus" :class="{'active':ind === index, 'default':ind !== index}" @click="changeBgc(index)">{{each}}</button>
              </div>
              <div v-if="showMore" class="setBtn">
                <div class="btnGroup">
                  <button class="reserBtn" @click="reset">重置</button>
                  <button class="overBtn" @click="overBtn">完成</button>
                </div>
              </div>
            </div>
            <!-- <div @click="slideClassify">部件分类 <span>{{componentCls}} <font-awesome-icon :icon="['fa','chevron-down']" size="lg" /></span></div> -->
            <!-- <div :class="styles" ref="category" style="width: 100%;height: 200px;padding: 10px 0;overflow: hidden;position: absolute">
              <div>
                <group>
                  <radio :options="classify" v-model="radioValue" @on-change="change"></radio>
                </group>
              </div>
            </div> -->
            <!-- <div v-if="showMore" :class="maskStyle" v-show="show" @click="showVuePopup(false)"></div> -->
            <div class="dataTable">
              <div class="number">共{{number}}条记录</div>
                <x-table :cell-bordered="false">
                    <thead>
                    <tr>
                        <th>部件名称</th>
                        <th>分类</th>
                        <th style="width:130px">
                          最后点巡检时间
                          <font-awesome-icon :icon="['fa','sort']" size="lg"  @click="leapfrogSort('create_time', sort2)"/>
                        </th>
                        <th>结果</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in componentCheckDatas" :key='index' @click="workSheetDetail(item)">
                        <td>{{item.componentName}}</td>
                        <td>{{item.cateName}}</td>
                        <td>{{item.create_time | formatDate}}</td>
                        <td v-if="item.check_result == 1">正常</td>
                        <td v-else-if="item.check_result == 2">轻微故障</td>
                        <td v-else-if="item.check_result == 3">中度故障</td>
                        <td v-else>重度故障</td>
                    </tr>
                    </tbody>
                </x-table>
            </div>
        </div>
        <shortcut-menu></shortcut-menu>
    </div>
</template>
<script>
import { Icon, Group, PopupPicker, XTable, Search, Cell,Radio} from 'vux'
import { constants } from 'crypto';
import DeviceSelected from "../common/device-selected-detail-device"
import ShortcutMenu from "../../components/common/shortcut_menu.vue"
import BScroll from "better-scroll";
export default {
    components: {
        Icon,
        PopupPicker,
        Group,
        XTable,
        Search,
        Cell,
        DeviceSelected,
        "shortcut-menu":ShortcutMenu,
        BScroll,
        Radio
    },
    data(){
        return {
            deviceId:'',
            list: [['A', 'B', 'C']],
            value5: ['A'],
            results: [],
            value:'',
            componentCheckDatas:[],
            componentCheckDatasInfo: [],
            //展示部门更多筛选
            showMore: false,
            checkMore:'筛选',
            departmentDetail: '',
            sort1: false,
            sort2: false,
            sortType: 'lastCheckTime',
            runstatus: ['全部', '正常', '轻微故障', '中度故障', '重度故障'],
            ind: 0,
            show3: false,
            deviceNameSpot: '',
            deviceCodeSpot: '',
            //部件分类
            componentCls: '请选择部件分类',
            //部件名称
            componentName: '',
            //部件编号
            componentCode: '',
            //部件分类信息展示 默认不展示
            showClassifyInfo: false,
            //分类信息
            classify: [],
            classifyInfo: [],
            radioValue: '',
            imgStyle: {
              display: 'block',
            },
            show: false,
            styles: 'category',
            btnStyle: 'setBtn',
            maskStyle: 'mask',
            radioShow: [],
            number:0
        }
    },
   created() {
    this.getRouterData()
    },
    methods: {
        getRouterData() {
            this.deviceId = this.$route.query.deviceId;
            this.loadCheckRecord()
        },
        workSheetDetail:function(config){
            this.$router.push({
            name: `workSheetDetail`,
            query: {
                CheckInfo:config,
                queryName: true,
                name: 'componentRecord'
            }
          })
        },
        // 获取设备下所有部件的点巡检记录
        loadCheckRecord: function(){
            var param = {
                deviceId: this.deviceId
            };
            this.$http(this.$API.loadComponentCheckRecord, param, true).then((res)=>{
                this.componentCheckDatas = res;
                this.componentCheckDatasInfo = res;
                this.number = res.length;
                if(res){
                  for (var i = 0; i < res.length; i++) {
                      this.radioShow.push(true);
                      if(this.classify.indexOf(res[i].cateName) == -1){
                        this.classify.push(res[i].cateName);
                        this.classifyInfo.push({catId:res[i].catId, cateName:res[i].cateName});
                      }
                  }
                }
            })
        },
        //返回首页
        backToHomepage: function () {
          this.$router.push({name:'homepage'});
        },
        //展开更多
        changeMore: function () {
          this.showMore = true;
          this.show = true;
        },
        reset: function(){
          this.componentName = '';
          this.componentCode = '';
          this.componentCls = '请选择部件分类';
          this.ind = 0;
        },
        overBtn: function () {
          this.showMore = false;
          let componentName = this.componentName;
          let componentCode = this.componentCode;
          let componentCls = this.componentCls;
          let data = this.componentCheckDatasInfo;
          this.componentCheckDatas = [];
          for(let key of data) {
            if (!!componentName && key.componentName.indexOf(componentName) < 0) {
              continue;
            }
            if (!!componentCode && key.componentCode.indexOf(componentCode) < 0) {
              continue;
            }
            if(this.ind != 0 && this.ind != key.check_result){
              continue;
            }
            this.componentCheckDatas.push(key)
          }
          this.number = this.componentCheckDatas.length;
        },
        slideClassify: function () {
          this.show = true;
          this.showClassifyInfo = true;
          this.styles = 'category2';
          this.btnStyle = 'setBtn2';
          this.maskStyle = 'mask2';
          this.componentCls = '';
          this.radioValue = '';
          this.Scroll = new BScroll(this.$refs.category,{click: true, tap: true});
        },
        change(val, label) {
            this.componentCls = val;
            this.styles = 'category';
            this.btnStyle = 'setBtn';
            this.maskStyle = 'mask';
            this.imgStyle.display = "none";
            this.showClassifyInfo = false;
        },
        leapfrogSort(type, sorted) {
              if (sorted === false) {
                this.sort2 = true;
                this.sortType = type;
                this.componentCheckDatas.sort(this.compare(type));
              }else{
                this.sort2 = false;
                this.sortType = type;
                this.componentCheckDatas.sort(this.compare2(type));
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
        showVuePopup(flag) {
          if (flag === false){
            this.change();
            this.showMore = false;
          }
          this.show = flag;
        },
        initscroll(){
            new BScroll(this.$refs.category)
          },
        changeBgc: function (index) {
          this.ind = index
        },
    },
      mounted(){
      this.$nextTick(() => {
            this.Scroll = new BScroll(this.$refs.category,{click: true, tap: true});

            let bscrollDom = this.$refs.bscroll;
            this.aBScroll = new BScroll(bscrollDom,{});
        })
      },
}
</script>
<style>
    @import '../../styles/iconfont.css';
    * { touch-action: none; }
    .componentTop{
      display: flex;
      line-height: 50px;
      font-size: 16px;
      color: #ffffff;
    }
    .componentTop div{flex: 1}
    .componentTop div:last-child{text-align: right;padding-right: 15px}
    .componentTop img{
      width: 18px;
      height: 18px;
    }
    .bscroll{
      width: 100%;
      height: 78%;
      overflow: hidden;
      position: fixed;
    }
    .invent-box{
      width:100%;
      height: 85%;
      background-color: rgba(0, 0, 0, 0.3);
    }
    .thead, .invent-item{
      height: 40px;
      line-height: 40px;
      display: flex;
    }
    .thead div, .invent-item span{flex: 1;text-align: center}


    .category{
      visibility: hidden;
      z-index: -10;
    }
    .category2{
      height: 100%;
      color: #ffffff;
      position: fixed;
      top: 9rem;
      z-index: 999;
    }

    .setBtn{
      z-index: 200;
      background: #22233f;
      width: 100%;
      height: 50px;
      text-align: -webkit-right;
      padding: 20px 0 15px;
      margin-top: 60px !important;
    }
    .setBtn2{
      z-index: 999;
      position: absolute;
      top: 12rem;
      background: #22233f;
      width: 100%;
      height: 50px;
      text-align: -webkit-right;
      padding: 20px 0 15px;
    }

    .btnGroup{
      display: flex;
      height: 30px;
      line-height: 30px;
      margin: 10px 0;
      width: fit-content;
      margin-right: 5px;
    }
    .reserBtn{
      background: #3967DC;
      padding: 0 20px;
      border:none;
      border-bottom-left-radius: 15px;
      border-top-left-radius: 15px;
      border-right: 1px #22233f solid;
      color:#fff;
      font-size: 16px;

    }
    .overBtn{
      background: #3967DC;
      padding: 0 20px;
      border:none;
      border-bottom-right-radius: 15px;
      border-top-right-radius: 15px;
      margin-right:20px;
      color:#fff;
      font-size: 16px;
    }

    .weui-cells{
      background-color: #1e1f3c !important;
    }
    .mask {
        position: absolute;
        top: 80%;
        width: 100%;
        height: -webkit-fill-available;
        background-color: rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease-in;
        z-index: 999;
    }
    .mask2 {
        position: absolute;
        top: 64%;
        width: 100%;
        height: -webkit-fill-available;
        background-color: rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease-in;
        z-index: 999;
    }
    .weui-cells:before, .weui-cells:after{border: none!important;}
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
        /* font-size: 14px; */
    }
    .vux-table:after{
        border-top: none !important;
    }
    .weui-search-bar{
        background-color: #22233f !important;
    }
    .vux-search-fixed{
        background-color: #22233f !important;
    }
    .weui-search-bar__cancel-btn{
        color: #fff !important;
        font-size: 16px;
    }
    .weui-search-bar__box{
        background-color: rgba(255, 255, 255, 0.3) !important;
    }
    .search_bar{
        color:#fff !important;
        height: 60px;
        text-align: center;
        font-size: 16px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .search_input{
        background-color: rgba(255, 255, 255, 0.3);
        height: 80%;
        width: 100%;
        border-radius: 20px;
    }
    ::-webkit-input-placeholder{
        color: #fff !important;
        font-size: 18px;
        line-height: 100%;
        text-align: center;
    }
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
       color: #fff !important;
        font-size: 18px;
        line-height: 100%;
        text-align: center;
    }
    ::-moz-placeholder { /* Mozilla Firefox 19+ */
       color: #fff !important;
        font-size: 18px;
        line-height: 100%;
        text-align: center;
    }
    :-ms-input-placeholder { /* Internet Explorer 10-11 */
       color: #fff !important;
        font-size: 18px;
        line-height: 100%;
        text-align: center;
    }
    ::-ms-input-placeholder { /* Microsoft Edge */
       color: #fff !important;
        font-size: 18px;
        line-height: 100%;
        text-align: center;
    }
  .vux-tab-container{
      /*position: fixed !important;*/
      /*top: 44px !important;*/
      z-index: 99;
    }
    .BtnGroup{
      display: flex;
      height: 30px;
      line-height: 30px;
      width: fit-content;
      margin-top: 20px!important;
      float: right;
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
      z-index: unset !important;
    }
    *{
      -ms-touch-action: unset !important;
      touch-action: unset !important;
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
        padding-bottom: unset !important;
    }
    .contentWrap{
        /*height: 80%;*/
      padding-top: 40px;
    }
    .footer{
        position: fixed;
        bottom:0;
        left: 0;
        right:0;
        width: 100%;
        touch-action: none !important;
        /*padding-bottom: 5px;*/
    }
    .footer .weui-grid:after{
        border-bottom: none;
    }
    .footer .weui-grids:before{
        border-top: none;
    }
    .weui-grid{
        padding:0px 10px 0px 10px !important;
    }
    .footer .add_wrap{
        margin-bottom: 10px;
        text-align: center;
    }
    .footer .add_wrap button{
        border-radius: 20px;
        font-size: 16px;
        height: 45px;
        width: 50%;
        border: none;
        background-color: #456de6;
        color:#fff;

    }
    .footer .weui-grid__label{
        color: #fff;
    }

    .vux-tab{
        background-color: #22233f !important;
    }
    .vux-swiper{
        color: #fff;
    }
    .vux-swiper-item{
        overflow:auto;
    }
    .vux-tab-ink-bar{
        background: #456de6 !important;
    }
    .weui-tabbar{
        background-color: #22233f !important;
    }

</style>
<style   lang="less" scoped>
  .MoreData{
      background: #22233f;
      position: absolute;
      width: 100%;
      height: auto;
      top: 50px;
      z-index: 999;
      padding-bottom: 20px;
      .showClassifyInfo{
        margin: 0;
        height: 120px;
        overflow: auto;
      }

      .deviceName{
        border-bottom: 1px solid rgba(255,255,255,0.2);
      }
      .deviceCode{
        border-bottom: 1px solid rgba(255,255,255,0.2);
      }
      div{
        font-size: 16px;
        line-height: 40px;
        color: #ffffff;
        margin: 10px;
        input{
          margin-left: 20px;
          text-align: left;
          color:rgba(255,255,255,.5);
          font-size: 16px;
          &::-webkit-input-placeholder{
            color:rgba(255,255,255,.5);
            font-size: 14px;
          }
        }
      }
      span{
        float: right;
        height: 40px;
        line-height: 40px;
        /*width: 50%;*/
        color: rgba(255,255,255,0.5);
        img{
          width: 20px;
          height: 20px;
          margin: 15px 0;
          float: right;
        }
      }
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
    /*width: 84px;*/
    width: 25%;
    margin: 0 10px;
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
  .number{
    line-height: 30px;
    width:100%;
    border-bottom: 1px solid rgba(255,255,255,0.5);
    color:#fff;
  }

</style>


