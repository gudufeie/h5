<template>
<div>
    <div class="main_wrap" v-show="mainPageShow">
        <div class="content_wrap">
            <div class="device_info">
                <p>更换人<span>{{user.name}}</span></p>
                <p>更换时间<span>{{'' | getTime}}</span></p>
                <p>设备名称<span>{{deviceInfo.device_name}}</span></p>
                <p>设备编号<span>{{deviceInfo.code}}</span></p>
                <p>部件名称<span>{{component.componentName}}</span></p>
                <p>部件分类<span>{{component.catName}}</span></p>
                <p>部件规格<span>{{component.stockName}}</span></p>
            </div>
            <div class="check_out">
                <div class="describe_picture">
                    <div class="describe">
                        <p style="line-height:50px;">
                            <span><img style="width:3%;margin-right:5px;" src="../../assets/icon/star.png"></span>描述
                        </p>
                        <textarea rows="10" cols="20" placeholder="请输入点检描述" v-model="text" :disabled='isDelay'></textarea>
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
                        <div class="upload" v-show="imgList.length < 6">
                            <img src="../../assets/icon/upLoad.png">
                            <s-upload @model="onChange" />
                            <!-- <input v-if="!isDelay" type="file" @change="uploadImg" accept="image/*" capture="camera"> -->
                        </div>
                      </div>
                    </div>
                    <div v-transfer-dom>
                        <loading :show="loading" text="正在上传"></loading>
                    </div>
                    <div v-transfer-dom>
                        <toast v-model="uploadFalse" type="text" text="上传失败" :time="1000" width="20em"></toast>
                    </div>
                </div>
                <div class="choose_report">
                    <x-switch v-model="choose" title="是否上报工单" @on-change="chooseValue()"></x-switch>
                </div>
            </div>
            <div class="report_work_sheet" v-show="choose">
                <div class="devide_line">
                    <p>上报工单</p>
                </div>
                <div style="padding-left:10px;padding-right:10px;">
                    <p class="chooseCheck" @click="chooseCheckerPage">
                        <img style="width:3%;margin-right:5px;" src="../../assets/icon/star.png">选择负责人
                        <span style="float:right;margin-right:10px;"><span>{{chooseChecker}}</span>></span>
                    </p>
                </div>
                <div class="work_sheet_decribe">
                    <p style="line-height:60px;"><span><img style="width:3%;margin-right:5px;" src="../../assets/icon/star.png"></span>描述</p>
                    <textarea rows="10" cols="20" placeholder="请输入工单描述" v-model="sheetText"></textarea>
                </div>
            </div>
            <div class="button_wrap">
                <button class="submit_btn" @click="addReplaceRecord">提交</button>
            </div>
        </div>
        <div class="delay">
          <div class="title">延后更换</div>
          <div class="delay-body">
            <input class="date-box" v-model="delayTime" @click="showDate" placeholder="请选择日期" onfocus="this.blur()"/>
            <div class="delay-btn" @click="deplayReplace">确定</div>
          </div>
        </div>
    </div>
    <div>
        <choose-checker :options="checkersOptions" v-show="chooseCheckerShow" @getCharger="chooseCharger"></choose-checker>
    </div>
    <shortcut-menu></shortcut-menu>
    <toast v-model="uploadFalse" :text="toastText" type="text" :time="1000" width="20em"></toast>
</div>
</template>
<script>
import { Icon, Cell, Group,XInput, PopupPicker,PopupRadio, XSwitch,Loading,Actionsheet, Datetime, Toast,TransferDom } from 'vux'
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
        Datetime,
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
            choose:false,
            //上传图片列表
            imgList: [],
            uploadFalse: false,
            loading: false,
            deviceInfo:'',
            depatrmentName:'',
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
            time:'',
            isReport:0,
            chooseChecker:'',
            component:{},
            toastText:null,
            delayTime: null,
            isDelay: false,
            replaceConfig:{},
        }
    },
    computed: {
      user () {
          //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
          if(!this.$store.state.user){
            this.$store.commit('saveUser',JSON.parse(localStorage.getItem('user')));
          }
          return this.$store.state.user;
        },
    },
     watch: {
      delayTime() {
        if(this.delayTime) {
          this.isDelay = true
        } else {
          this.isDelay = false
        }
      }
    },
    //页面离开的时候
    beforeRouteLeave(to, from, next){
      this.$vux.datetime.hide()
      next()
    },
    methods:{
      chooseValue:function(value){
            if(this.choose == false){
              this.isReport = 0
            }else{
              this.isReport = 1
            }
      },

      onChange:function(fileUrl){
          this.uploadImg(fileUrl)
      },

      //上传图片
      uploadImg: function(fileUrl){
        let that = this;
        console.log('1')         
         let config = {
            withCredentials: true,
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
          }
        const options = {
          file:fileUrl
        }
        this.loading = true
        this.$axios.post(this.$API.upload,qs.stringify(options),config).then((res) => {
          console.log('3')
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
      //添加更换记录
      addReplaceRecord: function(){
        if(this.isDelay) {
          return
        }
        if(this.text == ''){
          this.$commom.alert('请输入描述');
          return;
        }

        if(this.choose == true && !!!this.leader){
            this.$commom.alert('无上报人，无法上报');
            this.choose = false
            return;
        }
        // if(this.imgList.length <= 0){
        //   this.$commom.alert('请至少上传一张图片');
        //   return;
        // }

        var date = new Date();
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var H = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
        this.time = Y+M+D+H+m;

        let data = {
          time: this.time,
          deviceId: this.deviceInfo.device_id,
          componentId:this.component.componentId,
          description: this.text,
          picts: this.imgList.join(','),
          leader: this.leader,
          workSheetType:2,
          isReport:this.isReport,
          sheetDescription: this.sheetText
        };
        let that = this;

        this.$http(this.$API.addReplaceRecord, data, true).then((res) => {
          if(res){
            this.$commom.alert('添加成功');
            this.$router.push({
                name: 'addReplace'
            })
          }
        });
      },
      getDeviceInfo: function(){
        this.deviceInfo = this.$route.query.device;
        this.component = this.$route.query.component;
      },
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
      chooseCharger: function(chargeId,checkName){
          this.leader = chargeId;
          this.mainPageShow = true;
          this.chooseCheckerShow =false;
          this.chooseChecker = checkName
      },

      //更换时间
      showDate() {
        let that = this
        this.replaceConfig = this.$route.query.component
        //获取当前的日期
        let date = new Date()
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
        let nowDaterror = Y + M + D
        var nowDate =''
        let idData={
          id:this.replaceConfig.id
        }
        this.$http(this.$API.delayedReplaceDate,idData,true).then(res=>{
          if(res){
              nowDate = res;
              this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'YYYY-MM-DD',
                startDate: nowDate,
                onConfirm (value) {
                  that.delayTime = value;
                  this.isDelay = true
                  if(DateDiff(nowDate,that.delayTime) < parseInt(that.replaceConfig.leftDay)) {
                    that.$commom.alert(`选择要更换的时间为${that.delayTime},将会提前更换`);
                  }
                },
                onHide(type) {
                  if(type === 'cancel') {
                    that.delayTime = '';
                    this.isDelay = true;
                  }
                }
              })
          }else{
              this.$vux.datetime.show({
                cancelText: '取消',
                confirmText: '确定',
                format: 'YYYY-MM-DD',
                startDate: nowDaterror,
                onConfirm (value) {
                  that.delayTime = value;
                  this.isDelay = true
                  if(DateDiff(nowDaterror,that.delayTime) < parseInt(that.replaceConfig.leftDay)) {
                    that.$commom.alert(`选择要更换的时间为${that.delayTime},将会提前更换`);
                  }
                },
                onHide(type) {
                  if(type === 'cancel') {
                    this.isDelay = true;
                    that.delayTime = '';
                  }
                }
              })
          }
        })
         //计算天数差的函数  
        function  DateDiff(startDate, endDate){
          let dateStart = new Date(startDate)
          let dateEnd = new Date(endDate)
          let difValue = Math.abs((dateEnd - dateStart) / (1000 * 60 * 60 * 24))
          return  Math.round(difValue)
        }
      },

      //延后更换
      deplayReplace() {
        if(!this.delayTime) {
          this.toastText = '请选择要延后的时间'
          this.uploadFalse = true
          return
        }

        let data = {
          id: this.replaceConfig.id,
          replaceTime: this.delayTime
        }

        this.$http(this.$API.delayedReplace,data,true).then(res => {
          if(res) {
            this.$commom.alert(`延长至${this.delayTime}更换`);
            this.$router.push({ name : 'addReplace'});
          } else {
            this.$commom.alert('延后失败');
          }
        })
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
    .delay {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #03061C;
      .title {
        font-size: 16px;
        margin: 10px;
        color:#fff;
      }
      .delay-body {
        margin: 15px;
        height: 36px;
        line-height: 36px;
        margin-bottom: 50px;
        .date-box {
          display: inline-block;
          padding-left: 10px;
          width: 40%;
          height: 100%;
          line-height: 30px;
          border-radius: 2px;
          font-size: 16px;
          background-color: #ECEFF3;
          color: #666;
        } 
        .delay-btn {
          color:#fff;
          float: right;
          height: 30px;
          padding: 0 15px;
          margin-top: 3px;
          line-height: 30px;
          text-align: center;
          background: #03061C;
          border-radius: 4px;
          border: 1px solid #ccc;
          font-size: 10px;
        }
        .title{
          color:#fff;
          font-size: 18px;
        }
      }
    }
</style>
<style lang="less" scoped>
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
      padding: 0px 10px;
        line-height: 50px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.5)
    }

    .device_info p span{
        color: #fff;
        float: right;
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
        margin-bottom: 120px;
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

</style>


