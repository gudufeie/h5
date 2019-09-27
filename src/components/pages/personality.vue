<template>
  <div class="personality">
    <div class="main">
      <div class="personStyle" @click="personalityInformation"><a>个人信息</a>
        <img src="../../assets/icon/toRight.png" alt=""></div>
      <div class="personStyle" @click="changePassword"><a>密码修改</a>
        <img src="../../assets/icon/toRight.png" alt=""></div>
      <!--<div class="personStyle" @click="enterpriseSwitch"><a>企业切换</a>-->
        <!--<img src="../../assets/icon/toRight.png" alt=""><span>SWOT</span>-->
      <!--</div>-->
    </div>
    <div class="btn" @click="loginOutFn">退出登录</div>
    <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  export default {
    components: {
      XHeader
    },
    name: "personality",
    data: function () {
      return {
        userInfo: {},
        enterprises: [],
      }
    },
    created: function () {
      this.getUserInfo();
    },
     mounted(){
      },
    methods: {
      //获取个人信息
      getUserInfo: function () {
        let data = {};
        if (this.$route.query.type) {
          data.openId = JSON.parse(localStorage.getItem('wechat_id'));
          data.nickName = JSON.parse(localStorage.getItem('wechat_name')) || '';
        }else if(this.$route.query.openId){
            data.openId = JSON.parse(this.$route.query.openId);
        }
        this.$http(this.$API.getUserInfo, data, true).then((res) => {
          if (res) {
              this.userInfo=res;
          }
        });
      },
      //退出登录
      loginOutFn: function () {
        let data = {};
        if (this.$route.query.type) {
          data.openId = JSON.parse(localStorage.getItem('wechat_id'));
          data.nickName = JSON.parse(localStorage.getItem('wechat_name')) || '';
        }else if(this.$route.query.openId){
            data.openId = JSON.parse(this.$route.query.openId);
        }
        let that = this;
        this.$http(this.$API.logout, data, true).then((res) => {
            if (res) {
              that.showDefaultPage();
          }
        });
      },
      showDefaultPage: function () {
        this.$router.push({
          name: 'login',
        });
      },
      //路由跳转到修改密码路由跳转到个人信息
      personalityInformation: function () {
        this.$router.push({
          name: 'personalityInformation',
          query:{
            userInfo: this.userInfo,
          }
        })
      },
      //路由跳转到修改密码
      changePassword: function () {
        this.$router.push({
          name: 'changePassword',
        })
      },
      //路由跳转到企业切换
      enterpriseSwitch: function () {
        this.$router.push({
          name: 'enterpriseSwitch',
          query:{
            enterprises: this.enterprises,
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .personality {
    background: #22233f;
    height: 100vh;
    .personalityText{
      color: #000;
    }
    .main {
      .personStyle{
        line-height: 60px;
        width: 90%;
        margin: 0 5%;
        font-size: 18px;
        text-align: left;
        color: #ffffff;
        border-bottom: rgba(255,255,255,0.2) 1px solid;
        a{
          color: #ffffff;
        }
        span{
          float: right;
          margin-right: 20px;
          color: rgba(255,255,255,0.5);
        }
        img{
          width: 10px;
          height: 20px;
          float: right;
          margin: 20px 0;
        }
      }
    }
    .btn {
        height: 50px;
        margin: 100px 20px 0 20px;
        line-height: 50px;
        text-align: center;
        background: #3967DC;
        border-radius: 20px;
        color: #ffffff;
        font-size: 16px;
    }
  }
</style>
