<template>
    <div class="deviceDetailRun">
      <device-selected v-on:deviceDetail="handleDeviceDetail" v-on:departmentDetail='handleDepartment' :deviceName="deviceComponent.deviceName || deviceMessage.deviceName"></device-selected>
      <div class="mainBox">
        <div class="detail">
          <ul>
            <li>
              <span>设备编号</span>
              <span class="code">{{deviceComponent.code || deviceMessage.code}}</span>
            </li>
            <li v-if="deviceDetail" v-for="(item, index) in deviceDetail.parameters" :key="index">
              <span>{{item.name + '（' + item.unit + '）'}}</span>
              <span>{{item.value}}</span>
            </li>
            <li>
              <span>运行状态</span>
              <span v-if="deviceDetail">{{deviceDetail.runStatus == 1 ? '运行' : deviceDetail.runStatus == 0 ? '停止' : ''}}</span>
            </li>
            <li>
              <span>异常状态</span>
              <span v-if="deviceDetail">{{deviceDetail.status == 1 ? '正常' : deviceDetail.status == 0 ? '故障': deviceDetail.status == 2 ? '停用' : ''}}</span>
            </li>
            <li>
              <span>所在部门</span>
              <span v-if="deviceDetail">{{deviceDetail.departmentName}}</span>
            </li>
          </ul>
        </div>
        <div class="list">
          <div class="thead">
            <div class="name">部件</div>
            <div class="time">最后巡检时间</div>
            <div class="statu">状态</div>
          </div>
          <div class="tbody">
            <ul>
              <li class="item"  v-for="(item,index) of componentList" :key="index">
                <span class="name">{{item.componentName}}</span>
                <span class="time">{{item.lastCheckTime?item.lastCheckTime:'--'}}</span>
                <span class="staus" :class="{'success': item.checkResult=== -1,'error': item.checkResult=== 0}" @click="item.checkResult==1?'':showDialog(item)">{{item.checkResult===0?'需要巡检':item.checkResult===-1?'不需巡检':'已巡检'}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="btn CheckHistoryBtn" @click="toCheckHistory">查看巡检记录</div>
        <div class="btn CheckHistoryBtn" @click="toDeviceDetailManage">查看设备管理详情</div>
        <!-- <div class="btn addCheckHistoryBtn" @click="toAddCheckHistory">添加巡检记录</div> -->
      </div>
      <div class="dialogBox" v-transfer-dom>
        <x-dialog v-model="dialogShow">
          <div class="header">
            {{curComponentName}}
          </div>
          <div class="body">
            <div class="title-list">
              <checklist :label-position="labelPosition" :max="1" required :options="commonList" v-model="status" @on-change="changeStatus"></checklist>
            </div>
            <div class="content">
              <div class="content-item">
                <span class="label">更换时间：</span>
                <div class="date" @click.passive="showDate" onfocus="this.blur()">{{replaceTime?replaceTime:'选择日期'}}</div>
              </div>
              <div class="content-item">
                <span class="label">{{status == -1?'更换原因':'巡检描述'}}：</span>
                <div>
                  <textarea cols="30" rows="8" class="textarea" v-model="replaceReason" :placeholder="status == -1?'请输入更换原因':'请输入巡检描述'"></textarea>
                </div>
              </div>
            </div>
            <div class="imglist">
              <div class="imgBox" v-for="(item,index) in imgList" :key="index">
                <img :src="item">
                <img src="../../assets/icon/delect.png" class="delect" @click="delectImg(index)">
              </div>
              <div class="upload" v-show="imgList.length < 4">
                <img src="../../assets/icon/upLoadB.png">
                <input type="file" @change="uploadImg" accept="image/*" capture="camera" v-show="status.length > 0">
              </div>
            </div>
          </div>
          <div class="footer">
            <span class="btn cancel" @click="cancelReplace">取消</span>
            <span class="btn sure" @click="submitReplace">确定</span>
          </div>
        </x-dialog>
        <div v-transfer-dom>
          <loading :show="loading" text="正在上传"></loading>
        </div>
        <div v-transfer-dom>
          <toast v-model="uploadFalse" type="text" :text="toastText" :time="1000" width="20em"></toast>
        </div>
      </div>
    </div>
</template>

<script>
  import DeviceSelected from "../common/device-selected"
  import { XDialog, XButton, Group, XSwitch, TransferDomDirective as TransferDom, CheckIcon,Datetime,Checklist,XTable,Loading,Toast} from 'vux'

	export default {
    directives: {
      TransferDom
    },
    components: {
      DeviceSelected,
      XDialog,
      CheckIcon,
      Datetime,
      Group,
      Checklist,
      XTable,
      Loading,
      Toast
    },
		name: "deviceDetailRun",
    data(){
		  return {
        //设备参数详情
        deviceDetail: '',
              //扫码设备参数
              deviceComponent: {
                  code: '',
                  deviceName: ''
              },
        dialogShow: false,
        isReplace: false,
        replaceTime: null,
        replaceReason: null,
        //上传图片列表
        imgList: [],
        commonList: [{key: '1',value: '部件正常，巡检完成'},{key: '0',value: '部件异常，已修复，不需更换'},{key: '-1',value: '部件异常，需要更换'}],
        status: [],
        labelPosition: 'left',
        isStatus: true,
        componentList: [],
        curComponentName: '--',
        curId: null,
        loading: false,
        uploadFalse: false,
        toastText: '上传失败'
      }
    },
     //页面离开的时候
    beforeRouteLeave(to, from, next){
      this.$vux.datetime.hide()
      next()
    },
    computed: {
      deviceMessage () {
        //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
              if(!this.$store.state.deviceMessage){
                  this.$store.commit('changeDeviceMessage',JSON.parse(localStorage.getItem('deviceMessage')));
              }
        return this.$store.state.deviceMessage;
      },
      user () {
        //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
        if(!this.$store.state.user){
          this.$store.commit('saveUser',JSON.parse(localStorage.getItem('user')));
        }
        return this.$store.state.user;
      },
    },
    methods: {
      //查看巡检记录
      toCheckHistory: function(){
        this.$router.push({ name : 'checkHistory' });
      },
      //  查看设备管理详情
        toDeviceDetailManage: function(){
            this.$router.push({ name : 'deviceDetailManage', query: {deviceId: this.$route.query.deviceId || this.deviceMessage.deviceId} });
        },
      //添加巡检记录
      toAddCheckHistory: function(){
        const list = this.user.roleAction;
        let status = false;
        for(var i=0; i<list.length; i++){
          if(list[i].pageId == 'wechat_run'){
            if(list[i].actions.indexOf('添加巡检记录') != -1){
              status = true;
              break;
            }
          }
        }
        if(status){
          this.$router.push({ name : 'addCheckHistory' });
        }else{
          this.$commom.alert('您没有权限添加巡检记录');
        }
      },
      handleDeviceDetail: function(deviceDetail){
        this.$store.commit('changeDeviceMessage',deviceDetail);
        this.getDeviceDetail();
      },
      handleDepartment: function(departmentDetail){
        this.$router.push({name: 'run'});
        sessionStorage.setItem("produce_department", JSON.stringify(departmentDetail));
      },
      //获取设备参数
        getDeviceDetail: function(){
            // 判断是否为扫码
            if (this.$route.query.deviceId) {
                this.$http(this.$API.getDeviceDetails ,{deviceId: this.$route.query.deviceId},true).then( (res) => {
                    if(res){
                        //组参数替换
                        this.deviceComponent.code = res.code;
                        this.deviceComponent.checkDesc = res.checkDesc;
                        this.deviceComponent.createTime = res.createTime;
                        this.deviceComponent.departmentName = res.departmentName;
                        this.deviceComponent.deviceId = res.deviceId;
                        this.deviceComponent.deviceName = res.deviceName;
                        this.deviceComponent.id = res.id;
                        this.deviceComponent.run = res.run;
                        this.deviceComponent.status = res.status;
                        localStorage.setItem('deviceMessage', JSON.stringify(this.deviceComponent));
                        //设备详情
                        this.deviceDetail = res.deviceDetailDTO;
                    //    底部菜单
                        let data = {};
                        data.openId = this.$route.query.openId;
                        this.$http(this.$API.getUserByOpenId, data, true).then((res) => {
                            if (res) {
                                this.$store.commit('saveUser', res);
                                if (!res || !res.roleAction || res.roleAction.length <= 0) {
                                    this.$commom.alert("用户没有微信权限");
                                    return;
                                }
                            }
                        });
                    }
                });
            } else {
                this.$http(this.$API.getDeviceDetail + '/' + this.deviceMessage.deviceId,{},true).then( (res) => {
                    if(res){
                        this.deviceDetail = res;
                    }
                });
            }

            this.$http(this.$API.checkRecordList,{
                deviceId: this.$route.query.deviceId || this.deviceMessage.deviceId
            },true).then( (res) => {
                if(res){
                    this.componentList = res
                }
            });
        },
      //切换
      changeStatus(val) {
        if(val[0] != '-1') {
          this.isStatus = true
          this.replaceTime = null
          this.replaceReason = null
        } else {
          this.isStatus = false
        }
      },
      //更换时间
      showDate(ev) {
        if(!this.isStatus) {
          let that = this

          let date = new Date()
          let Y = date.getFullYear() + '-'
          let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
          let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
          let nowDate = Y + M + D

          this.$vux.datetime.show({
            cancelText: '取消',
            confirmText: '确定',
            format: 'YYYY-MM-DD',
            startDate: nowDate,
            onConfirm (value) {
              that.replaceTime = value
            },
            onHide(type) {
              if(type === 'cancel') {
                that.replaceTime = ''
              }
            }
          })
        }
      },
      //上传图片
      uploadImg: function(e){
        let formData = new FormData();

        let config = {
          withCredentials: true,
          headers: {'Content-Type': 'multipart/form-data'}
        }

        formData.append('file', e.target.files[0]);
        this.loading = true
        this.$axios.post(this.$API.upload,formData,config).then( (res) => {
          if(res.data.success){
            this.imgList.push(res.data.data);
            this.loading = false
          } else {
            this.loading = false
            this.toastText = '上传失败'
            this.uploadFalse = true
          }
        });
      },
      //删除图片
      delectImg: function(index){
        this.imgList.splice(index,1);
      },
      //取消
      cancelReplace() {
        this.dialogShow = false
        this.isReplace = false
        this.replaceTime = null
        this.replaceReason = null
        this.imgList = []
        this.status = []
      },
      //确定
      submitReplace() {
        if(this.status.length == 0) {
          this.toastText = '请选择部件状态'
          this.uploadFalse = true
          return;
        }

        if(this.status[0] == '-1') {
          if(!this.replaceTime){
            this.toastText = '请选择更换时间'
            this.uploadFalse = true
            return;
          }
        }

        if(!this.replaceReason){
          this.toastText = `请输入${this.status == -1?'更换原因':'巡检描述'}`
          this.uploadFalse = true
          return;
        }

        // if(this.imgList.length <= 0){
        //   this.toastText = '请至少上传一张图片'
        //   this.uploadFalse = true
        //   return;
        // }

        let data = {
          replaceReason: this.replaceReason,
          imageUrl: this.imgList,
          checkResult: this.status[0],
          linkId: this.curId,
          replaceTime: this.replaceTime
        }

        this.$http(this.$API.checkComponent,data,true).then( (res) => {
          this.dialogShow = false
          if(res){
            this.cancelReplace()
            this.getDeviceDetail()
            this.$commom.alert('添加成功')
          }
        });
      },
      //展示模态框
      showDialog(data) {
        this.dialogShow = true
        this.curComponentName = data.componentName
        this.curId = data.id
      }
    },
    created(){
      this.getDeviceDetail();
    }
	}
</script>

<style lang="less" scoped>
  textarea::-webkit-input-placeholder{
    color: #BABABA;
  }    /* 使用webkit内核的浏览器 */
  textarea:-moz-placeholder{
    color: #BABABA;
  }                  /* Firefox版本4-18 */
  textarea:-moz-placeholder{
    color: #BABABA;
  }                  /* Firefox版本19+ */
  textarea:-moz-placeholder{
    color: #BABABA;
  }
  .deviceDetailRun{
    min-height: 100vh;
    overflow: hidden;
    background: #1C1F37;
    color: #FFFFFF;
    .selected{
      width: 100%;
      padding: 11px 0;
      background: #03061C;
      text-align: center;
      position: absolute;
    }
    .mainBox{
      padding-top: 39px;
      .detail{
        li{
          margin: 0 16px;
          padding: 11px 0;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #323444;
          .code{
            width: 270px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            text-align: right;
          }
        }
      }
      .list {
        margin-top: 20px;
        padding: 0 16px;
        .thead {
          display: flex;
          justify-content: space-around;
          padding-bottom: 4px;
          border-bottom: 1px solid #323444;
          .name {
            width: 120px;
          }
          .time {
            width: 120px;
          }
        }
        .tbody {
          .item {
            display: flex;
            justify-content: space-around;
            padding: 6px 0;
            border-bottom: 1px solid #323444;
            .name {
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            .name {
              width: 130px;
            }
            .time {
              width: 120px;
            }
            .success {
              color: #66FF00;
            }
            .error {
              color: red;
            }
          }
        }
      }
      .btn{
        margin: 0 43px;
        padding: 11px 0;
        background: #3967DC;
        border-radius: 4px;
        text-align: center;
      }
      .btn.CheckHistoryBtn{
        margin-top: 50px;
      }
      .btn.addCheckHistoryBtn{
        margin-top: 16px;
      }
    }
  }
  .dialogBox {
    .header {
      line-height: 34px;
      font-size: 14px;
      border-bottom: 1px solid #ccc;
    }
    .weui-dialog {
      border-radius: 10px;
    }
    .body {
      text-align: left;
      font-size: 14px;
      .title-list {
        line-height: 40px;
        /deep/ .weui-cells {
          font-size: 14px;
          .vux-checklist-label-left:nth-child(2) {
            border-top: 1px solid rgba(242, 242, 242, 1);
            border-bottom: 4px solid rgba(242, 242, 242, 1);
          }
          .vux-checklist-label-left:nth-child(3) {
            border-bottom: 1px solid rgba(242, 242, 242, 1);
            color: red;
          }
          .weui-cell:before {
            border-top: none;
          }
          &:after {
            border-bottom: none;
          }
        }
      }
      .content {
        padding: 0 14px;
        height: 220px;
        border-bottom: 4px solid rgba(242, 242, 242, 1);
        .content-item {
          margin-top: 10px;
          font-size: 14px;
          .label {
            line-height: 32px;
          }
          .date {
            float: right;
            width: 140px;
            height: 32px;
            line-height: 32px;
            padding-left: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
            color: #666;
          }
          textarea {
            width: 96%;
            padding-left: 8px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 12px;
            color: #666;
          }
        }
      }
      .imglist {
        padding: 10px 20px;
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
          img {
            width: 43px;
            height: 43px;
          }
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
    .footer {
      border-top: 4px solid rgba(242, 242, 242, 1);
      text-align: center;
      .btn {
        display: inline-block;
        padding: 10px 40px;
        margin: 10px;
        border: 1px solid #999;
        border-radius: 2px;
        font-size: 12px;
      }
      .sure {
        color: #fff;
        background-color: #3967DC;
        border-color: #3967DC;
      }
    }
  }
</style>
