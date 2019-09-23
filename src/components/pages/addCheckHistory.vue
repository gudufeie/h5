<template>
    <div class="addCheckHistory">
      <div class="order">
        <div class="item">
          <span class="title">操作人</span>
          <span class="value">{{user.name}}</span>
        </div>
        <div class="item">
          <span class="title">添加时间</span>
          <span class="value">{{'' | getTime}}</span>
        </div>
        <div class="item">
          <span class="title">巡检结果</span>
          <div class="box" @click="show = !show">
            <span class="value">{{menus[valueIndex]}}</span>
            <img src="../../assets/icon/toRight.png">
          </div>
        </div>
      </div>
      <div class="text">
        <div class="title">描述</div>
        <textarea name="" v-model="text" placeholder="请输入巡检描述" maxlength="500"></textarea>
      </div>
      <div class="imgList">
        <div class="title">图片</div>
        <div class="list">
          <div class="imgBox" v-for="(item,index) in imgList" :key="index">
            <img :src="item">
            <img src="../../assets/icon/delect.png" class="delect" @click="delectImg(index)">
          </div>
          <div class="upload" v-show="imgList.length < 6">
            <img src="../../assets/icon/upLoad.png">
            <input type="file" @change="uploadImg" accept="image/*" capture="camera">
          </div>
        </div>
      </div>
      <div class="btn" @click="addCheckHistory">提交</div>
      <div v-transfer-dom>
        <loading :show="loading" text="正在上传"></loading>
      </div>
      <div v-transfer-dom>
        <toast v-model="uploadFalse" type="text" text="上传失败" :time="1000" width="20em"></toast>
      </div>
      <actionsheet v-model="show" :menus="menus" @on-click-menu="click"></actionsheet>
    </div>
</template>

<script>
  import { Actionsheet,Toast,Loading,TransferDomDirective as TransferDom } from 'vux'
	export default {
    directives: {
      TransferDom
    },
    components: {
      Actionsheet,
      Toast,
      Loading
    },
		name: "addCheckHistory",
    data(){
		  return {
        //巡检结果index
        valueIndex: 0,
        show: false,
        menus: ['正常','异常'],
        //描述
        text: '',
        //上传图片列表
        imgList: [],
        uploadFalse: false,
        loading: false
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
      deviceMessage () {
        //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
        if(!this.$store.state.deviceMessage){
          this.$store.commit('changeDeviceMessage',JSON.parse(localStorage.getItem('deviceMessage')));
        }
        return this.$store.state.deviceMessage;
      }
    },
    created: function() {

    },
    methods: {
      click: function( key ){
        this.valueIndex = key;
      },
      //上传图片
      uploadImg: function(e){
        let formData = new FormData();
        let that = this;
        let config = {
          withCredentials: true,
          headers: {'Content-Type': 'multipart/form-data'}
        }
        formData.append('file', e.target.files[0]);
        this.loading = true
        this.$axios.post(this.$API.upload,formData,config).then( (res) => {
          if(res.data.success){
            that.imgList.push(res.data.data);
            this.loading = false
          } else {
            this.loading = false
            this.uploadFalse = true
          }
        });
      },
      //删除图片
      delectImg: function(index){
        this.imgList.splice(index,1);
      },
      //添加巡检记录
      addCheckHistory: function(){
        if(this.text == ''){
          this.$commom.alert('请输入描述');
          return;
        }
        // if(this.imgList.length <= 0){
        //   this.$commom.alert('请至少上传一张图片');
        //   return;
        // }
        let data = {
          deviceId: this.deviceMessage.deviceId,
          description: this.text,
          pictures: this.imgList.join(','),
          checkResult: this.valueIndex == 0 ? 1 : 0
        }
        let that = this;
        this.$http(this.$API.addCheckRecord,data,true).then( (res) => {
          if(res){
            this.$commom.alert('添加成功');
            that.$router.go(-1);
          }
        });
      }
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
  }           /* IE浏览器 */
  .addCheckHistory{
    background: #1c1f37;
    color: #ffffff;
    height: 100vh;
    padding-top: 16px;
    .order{
      background: #03061C;
      margin-bottom: 16px;
      .item{
        padding: 12px 16px;
        border-bottom: 1px solid #353746;
        display: flex;
        justify-content: space-between;
        .title{
          color: #DADADA;
        }
        .value{
          font-size: 14px;
        }
        .box{
          display: flex;
          align-items: center;
          img{
            width: 5px;
            height: 11px;
            margin-left: 8px;
          }
        }
      }
      .item:last-child{
        border-bottom: none;
      }
    }
    .text{
      background: #03061C;
      padding: 12px 16px;
      margin-bottom: 16px;
      .title{
        font-size: 14px;
        margin-bottom: 10px;
      }
      textarea{
        color: #03061C;
        width: 100%;
        height: 93px;
        background: #ECEFF3;
        border-radius: 4px;
        padding: 10px 13px;
        box-sizing: border-box;
      }
    }
    .imgList{
      background: #03061C;
      padding: 12px 16px;
      margin-bottom: 28px;
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
    .btn{
      margin: 0 40px;
      padding: 11px 0;
      text-align: center;
      background: #3967DC;
      border-radius: 4px;
      font-size: 16px;
    }
  }
</style>
