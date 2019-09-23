<template>
<div>
    <div class="main_wrap" v-show="mainPageShow">
        <div class="content_wrap">
            <div class="device_info">
                <p>设备名称<span>{{deviceInfo.deviceName}}</span></p>
                <p>设备编号<span>{{deviceInfo.deviceCode}}</span></p>
                <p>所在部门<span>{{departmentName}}</span></p>
                <p>操作人<span>{{operator}}</span></p>
            </div>
            <div class="devide_line">
                <p>填写点巡检结果</p>
            </div>
            <div class="check_out">
                <p>
                    <group>
                        <popup-radio title="点巡检结果" :options="spotChectResults" v-model="spotChectResult"></popup-radio>
                    </group>
                </p>
                <div class="describe_picture">
                    <div class="describe">
                        <p style="line-height:50px;">
                            <span><img style="width:3%;margin-right:5px;" src="../../assets/icon/star.png"></span>描述
                        </p>
                        <textarea rows="10" cols="20" placeholder="请输入点检描述" v-model="text"></textarea>
                    </div>
                    <div class="shoot_picture">
                        <p style="line-height:50px;">
                            <!-- <span><img style="width:3%;margin-right:5px;" src="../../assets/icon/star.png"></span> -->
                            设备拍摄
                        </p>
                    </div>
                    <div class="imgList">
                        <div class="list">
                            <div class="imgBox" v-for="(item,index) in imgList" :key="index">
                                <img :src="item">
                                <img src="../../assets/icon/delect.png" class="delect" @click="delectImg(index)">
                            </div>
                            <div class="upload" v-if="imgList.length < 6">
                                <img src="../../assets/icon/upLoad.png">
                                <s-upload @model="onChange" />
                                <!-- <input type="file" @change="uploadImg" accept="image/*"  capture="camera"> -->
                            </div>
                        </div>
                    </div>
                    <div v-transfer-dom>
                        <loading :show="loading" text="正在上传"></loading>
                    </div>
                    <div v-transfer-dom>
                        <toast v-model="uploadFalse" type="text" text="上传失败" :time="1000" width="20em"></toast>
                    </div>
                        <!-- <actionsheet v-model="show" :menus="menus" @on-click-menu="click"></actionsheet> -->
                    </div>
                <div class="choose_report">
                    <x-switch v-model="choose" title="是否上报工单" @on-change="chooseValue()"></x-switch>
                </div>
            </div>
            <div class="report_work_sheet" v-show="choose">
                <div class="devide_line">
                    <p>上报工单</p>
                </div>
                <div style="padding-left:10px;padding-right:10px;" @click="chooseCheckerPage">
                    <p class="chooseCheck">
                        <img style="width:3%;margin-right:5px;" src="../../assets/icon/star.png">选择负责人
                        <span style="float:right;margin-right:10px;">{{chooseChecker}}></span>
                    </p>
                </div>
                <div class="work_sheet_decribe">
                    <p style="line-height:60px;"><span><img style="width:3%;margin-right:5px;" src="../../assets/icon/star.png"></span>描述</p>
                    <textarea rows="10" cols="20" placeholder="请输入工单描述" v-model="sheetText"></textarea>
                </div>
            </div>
            <div class="button_wrap">
                <button class="submit_btn" @click="addCheckHistory">提交</button>
            </div>
        </div>
        <shortcut-menu></shortcut-menu>
    </div>
    <div>
        <choose-checker :options="checkersOptions" v-show="chooseCheckerShow" @getCharger="chooseCharger"></choose-checker>
    </div>
</div>
</template>
<script>
import { Icon, Cell, Group,XInput, PopupPicker,PopupRadio, XSwitch,Loading,Actionsheet,TransferDom, Toast  } from 'vux'
import { stringify } from 'querystring';
import ChooseChecker from "../pages/chooseChecker.vue";
import ShortcutMenu from "../../components/common/shortcut_menu.vue";
import Upload from "../common/upload.vue";
import qs from 'qs';

export default {
    components: {
        Icon,
        Cell,
        Group,
        XInput,
        PopupPicker,
        PopupRadio,
        XSwitch,
        Loading,
        Actionsheet,
        Toast,
        "choose-checker":ChooseChecker,
        "shortcut-menu":ShortcutMenu,
        "s-upload":Upload
    },
    directives: {
        TransferDom
    },
    data(){
        return {
            spotChectResult: '正常',
            spotChectResults: ['正常', '轻微故障', '中度故障','重故障'],
            choose:false,
            //上传图片列表
            imgList: [],
            uploadFalse: false,
            loading: false,
            deviceInfo:'',
            departmentName:'',
            departmentId:'',
            text:'',
            valueIndex:'',
            deviceId:'',
            leaders:[],
            sheetText:'',
            checkersOptions:{},
            chooseCheckerShow:false,
            mainPageShow: true,
            checkers:[],
            leader:'',
            chooseChecker:'',
            //操作人
            operator:''
        }
    },
    methods:{
      chooseValue:function(value){

      },
      onChange:function(fileUrl){
        this.uploadImg(fileUrl)
      },
      //上传图片
      uploadImg: function(fileUrl){
        let that = this;       
         let config = {
            withCredentials: true,
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
          }
        const options = {
          file:fileUrl
        }
        this.loading = true
        this.$axios.post(this.$API.upload,qs.stringify(options),config).then( (res) => {
          if(res.data.success){
            this.imgList.unshift(res.data.data);
            this.loading = false
          } else {
            this.loading = false;
            this.uploadFalse = true
          }
        }).catch(()=>{
          this.$commom.warning('图片上传失败，请重新选择');
          this.loading = false;
          this.uploadFalse = true
        });
      },
      //删除图片
      delectImg: function(index){
        this.imgList.splice(index,1);
      },
      click: function( key ){
        this.valueIndex = key;
      },
      //添加巡检记录
      addCheckHistory: function(){
        if(this.text == ''){
          this.$commom.alert('请输点检入描述');
          return;
        }
        if(this.choose == true && !!!this.leader){
            this.$commom.alert('无上报人，无法上报');
            this.choose = false
            return;
        }
        if(this.choose == true && this.sheetText == ''){
          this.$commom.alert('请输工单入描述');
          return;
        }
        // if(this.imgList.length <= 0){
        //   this.$commom.alert('请至少上传一张图片');
        //   return;
        // }
        if(this.spotChectResult == '正常'){
            this.valueIndex = 1
        }else
        if(this.spotChectResult == '轻微故障'){
            this.valueIndex = 2
        }else
        if(this.spotChectResult == '中度故障'){
            this.valueIndex = 3
        }else{
            this.valueIndex = 4
        }

        let data = {
          deviceId: (this.deviceId).toString(),
          description: this.text,
          pictures: this.imgList.join(','),
          checkResult: this.valueIndex,
          departmentId: this.departmentId,
          leaderId: this.leader,
          sheetType:1,
          sheetDescribe: this.sheetText
        };
        
        let that = this;
        this.$http(this.$API.addDeviceCheckRecord, data, true).then((res) => {
          if(res){
            this.$commom.alert('添加成功');
            this.$router.push({
                name: 'spotCheck'
            })
          }
        });
      },

    //   获取设备信息
      getDeviceInfo: function(){
        this.deviceInfo = this.$route.query.deviceInfo;
        this.departmentName = this.$route.query.departmentName;
        this.departmentId = this.$route.query.departmentId;
        this.deviceId = this.deviceInfo.id;

        this.$http(this.$API.getUserInfo, true).then((res) => {
          if(res){
            this.operator = res.name;
          }
        });
      },

    //   获取审核人
      getLeaderList: function(){
          this.$http(this.$API.getLeader, {},true).then((res)=>{
              this.checkers = res
          })
      },
      chooseCheckerPage: function(){
          this.chooseCheckerShow = true;
          this.mainPageShow = false;
          this.checkersOptions = {
              checkers:this.checkers
          }
      },
      //   获取负责人
      chooseCharger: function(chargeId,checkerName){
          this.leader = chargeId;
          this.chooseChecker = checkerName;
          this.mainPageShow = true;
          this.chooseCheckerShow =false;
      }
    },
    created: function(){
        this.getDeviceInfo()
        this.getLeaderList()
    }
}
</script>
<style  lang="less" scoped>
  .imgList{
      margin-bottom: 10px;
      .title{
        font-size: 14px;
        margin-bottom: 10px;
      }
      .list{
        display: flex;
        img{
            width: 43px;
            height: 43px;
          }
        .imgBox{
          margin-right: 16px;
          position: relative;
          .delect{
            width: 13px;
            height: 12px;
            position: absolute;
            top: -6px;
            right: -6px;
          }
        }
        .upload{
          position: relative;
          input{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
          }
        }
      }
    }
</style>
<style>
    body{
        background-color: #22233f;
        height: 100%;
        width: 100%;
    }
    .main_wrap{
        overflow: scroll;
        /*position: absolute;*/
        top:0;
        bottom: 0;
        left:0;
        right:0;
        -webkit-overflow-scrolling: touch;
        margin: 0 auto;
        /*height: 100%;*/
        width: 100%;
    }
    .vux-header{
        background-color: #fff !important;
    }
    .vux-header-title{
        color: #000 !important;
    }

    .content_wrap{
       text-align: left;
    }
    .content_wrap .device_info{
        margin-top: 20px;
        margin-bottom: 20px;
        padding:0px 10px;
    }
    .content_wrap .device_info p{
        line-height: 40px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
    }

    .device_info p span{
        color: #fff;
        margin-left: 20px;
    }

    .content_wrap .check_out{
        padding:0px 10px;
    }

    .content_wrap .check_out p{
        line-height: 40px;
        color: #fff;
        font-size: 16px;
    }
    .content_wrap .button_wrap{
        text-align: center;
        padding:20px 0px;
    }
    .submit_btn{
        height: 40px;
        width: 90%;
        border: 1px solid #456de6;
        font-size: 16px;
        color: #456de6;
        margin-top: 10px;
        border-radius: 20px;
        background-color: #22233f;
    }
    .devide_line{
        background-color: rgba(255, 255, 255, 0.2);
        height: 40px;
        padding:0px 10px;
        font-size: 16px;
        color:rgba(255, 255, 255, 0.8)
    }
    .devide_line p{
        line-height: 40px;
    }
    .check_out .weui-cells{
        background-color: #22233f;
        padding: 0px;
        margin-top: 0px;
    }
     .check_out .weui-cells:before{
         border-top: none !important;
    }
    .check_out .weui-cells::after{
         border-top-color: rgba(255, 255, 255, 0.4);
    }
    .check_out .describe{
        width: 100%;
    }
    .check_out .describe textarea{
        width: 100%;
        border: 1px solid;
        border-color: rgba(255, 255, 255, 0.4);
        border-radius: 10px;
        background-color: #22233f;
        color:#fff;
    }
    .describe textarea::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
    }

    .check_out .shoot_picture{
        margin-top: 10px;
    }
    .camera{
        height: 60px;
        width: 60px;
        text-align: left;
    }
    .check_out .describe_picture{
        border-bottom: 1px solid;
        border-color: rgba(255, 255, 255, 0.4)
    }

    .choose_report{
        padding:20px 0px;
        color:#fff;
        font-size:16px;
    }
    .report_work_sheet .weui-cells{
        background-color: #22233f;
        padding: 0px;
        margin-top: 10px;
        color:#fff;
        height:60px;
    }
    .report_work_sheet .weui-cells:before{
         border-top: none !important;
    }
    .work_sheet_decribe{
        padding:0px 10px;
        color:#fff;
        font-size: 16px;
    }
    .work_sheet_decribe textarea{
        width: 100%;
        border: 1px solid;
        border-color: rgba(255, 255, 255, 0.4);
        border-radius: 10px;
        background-color: #22233f;
        color:#fff;
    }
    .work_sheet_decribe textarea::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.5);
        font-size: 16px;
    }
    .chooseCheck{
        line-height: 50px;
        color:#fff;
        font-size: 16px;
    }
    .weui-cells_checkbox{
        background-color: #22233f !important;
        color:#fff;
    }
    .vux-popup-dialog{
        z-index:999 !important;
    }
</style>


