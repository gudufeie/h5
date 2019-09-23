<template>
  <div class="login">
    <img src="../../assets/icon/login-bg.png" class="bg" slot="icon">
    <div class="main">
      <ul>
        <li class="phone">
          <div class="icon"><img :src="phoneIcon"></div>
          <input class="phoneNum" type="number" oninput="if(value.length>11)value=value.slice(0,11)" placeholder="请输入手机号"
                 v-model="phoneNum" v-bind:style="phoneStyle">
          <input class="userName" placeholder="请输入手机号或用户名"
                 v-model="userName" v-bind:style="userStyle">
        </li>
        <li class="code">
          <div class="icon"><img :src="codeIcon"></div>
          <input class="codeNum" type="number" oninput="if(value.length>6)value=value.slice(0,6)" placeholder="请输入验证码"
                 v-model="codeNum" v-bind:style="codeStyle">
          <input class="password" type="password" placeholder="请输入密码"
                 v-model="password" v-bind:style="passwordStyle">
          <span class="codeTime" @click="getCode" v-bind:style="codeTimeStyle">{{isNaN(codeTimer) ? codeTimer : '已发送(' + codeTimer + 's)'}}</span>
        </li>
      </ul>
      <div class="loginType"  @click="changeType">{{loginType}}</div>
      <div class="btn" @click="loginFn">登录</div>
    </div>
  </div>
</template>

<script>
  import { XHeader } from 'vux'
  import imgPerson from '../../assets/icon/person.png'
  import imgPassword from '../../assets/icon/password.png'
  import imgPhone from '../../assets/icon/phone.png'
  import imgCode from '../../assets/icon/code.png'
  export default {
    components: {
      XHeader
    },
    name: "login",
    data: function () {
      return {
        //验证码时间
        codeTimer: '获取验证码',
        //输入的验证码
        codeNum: '',
        //输入的手机号
        phoneNum: '',
        //输入的手机号或用户名
        userName: '',
        //输入的密码
        password: '',
        //切换登录方式，默认为手机号密码登录
        loginType: '验证码登录',
        phoneStyle: {
          display: 'none',
        },
        codeStyle: {
          display: 'none',
        },
        codeTimeStyle: {
          display: 'none',
        },
        userStyle: {
          display: 'block',
        },
        passwordStyle: {
          display: 'block',
        },
        phoneIcon: imgPerson,
        codeIcon: imgPassword
      }
    },
    created: function () {
      this.$store.commit('changeMode', 0);
      const that = this;
      if (this.$route.query.openId) {
        if (this.$route.query.status == 'true') {
            this.$http(this.$API.getUserInfo, {}).then((res) => {
              if (res) {
                that.$store.commit('saveUser', res);
                if (this.$route.query.deviceId && this.$route.query.deviceId !== 'null') {
                  this.$router.push({name: 'componentCheck', query: {deviceId: this.$route.query.deviceId}})
                } else {
                  that.showDefaultPage(res);
                }
              }else {
                that.status = true;
              }
          })
        } else {
          this.status = true;
        }
      }else if(this.$route.query.stop=='1'){
          this.status = true;
      } else {
        this.$http(this.$API.getWxCode, {callbackUrl: location.href}, true).then((res) => {
          if (res) {
            location.href = res;
          }
        });
      }
    },
    methods: {
      //获取验证码
      getCode: function () {
        let that = this;
        //判断手机号是否为11位以下
        if (this.phoneNum == '' || this.phoneNum.length < 11) {
          this.$commom.alert('请输入正确的手机号码');
          return;
        }
        let params = {
          phone: this.phoneNum
        };
        this.$http(this.$API.sendLoginSms, params, true).then((res) => {
          if (res) {
            that.codeTimer = 60;
            const timer = setInterval(function () {
              if (that.codeTimer <= 0) {
                that.codeTimer = '获取验证码';
                clearInterval(timer);
                return;
              }
              that.codeTimer -= 1;
            }, 1000)
          }
        });
      },
      //登录
      loginFn: function () {
        if (this.loginType == '账号密码登录') {
          //手机验证码登录
          let data = {
          phone: this.phoneNum,
          code: this.codeNum,
        };
          if (this.$route.query.type) {
            data.openId = JSON.parse(localStorage.getItem('openId'));
            data.nickName = JSON.parse(localStorage.getItem('nickName')) || '';
        }else if(this.$route.query.openId){
            data.openId = this.$route.query.openId
        }
          let that = this;
          this.$http(this.$API.login, data, true).then((res) => {
            if (res) {
              that.$store.commit('saveUser', res);
              that.showDefaultPage(res);
          }
        });
        } else if (this.loginType == '验证码登录') {
          //手机密码登录
          if (this.password == '' || this.userName == ''){
            this.$commom.alert("请输入正确的用户名和密码");
            return false;
          }
          let data = {
           account: this.userName,
           password: this.password,
         };
          if (this.$route.query.type) {
            data.openId = JSON.parse(localStorage.getItem('wechat_id'));
            data.nickName = JSON.parse(localStorage.getItem('wechat_name')) || '';
        }else if(this.$route.query.openId){
            data.openId = this.$route.query.openId;
        }
          let that = this;
          this.$http(this.$API.loginAccountOrPhone, data, true).then((res) => {
            if (res) {
              that.$store.commit('saveUser', res);
              that.showDefaultPage(res);
          }
        });
        }
      },
      showDefaultPage: function (userInfo) {
        if (!userInfo || !userInfo.roleAction || userInfo.roleAction.length <= 0) {
          this.$commom.alert("用户没有微信权限");
          return;
        }
        let userActionMap = {};
        for (let item of userInfo.roleAction) {
          userActionMap[item.pageId] = item;
        }
        if (userActionMap['wechat_data'] != null) {
          this.$router.push({
            //跳转的路径
            name: 'homepage',
            query:{
            orgName: userInfo.orgName,
          }
          });
        } else if (userActionMap['wechat_run'] != null) {
          this.$router.push({name: 'run'});
        } else if (userActionMap['wechat_manage'] != null) {
          this.$router.push({name: 'manage'});
        }
      },
      //切换登录方式
      changeType: function(){
        if (this.loginType == '账号密码登录') {
          this.loginType = '验证码登录';
          this.phoneStyle.display = 'none';
          this.codeStyle.display = 'none';
          this.codeTimeStyle.display = 'none';
          this.userStyle.display = 'block';
          this.passwordStyle.display = 'block';
          this.phoneIcon = imgPerson;
          this.codeIcon = imgPassword;
        }else if (this.loginType == '验证码登录') {
          this.loginType = '账号密码登录';
          this.userStyle.display = 'none';
          this.passwordStyle.display = 'none';
          this.phoneStyle.display = 'block';
          this.codeStyle.display = 'block';
          this.codeTimeStyle.display = 'block';
          this.phoneIcon = imgPhone;
          this.codeIcon = imgCode;
        }
      }
    },
    mounted() {

    }
  }
</script>
<style lang="less" scoped>
  .login {
    background: #232644;
    height: 100vh;
    .bg {
      display: block;
      width: 375px;
      height: 272px;
    }
    .main {
      background: #232644;
      padding: 0 40px;
      ul {
        li {
          height: 42px;
          border: 1px solid #495889;
          border-radius: 4px;
          display: flex;
          align-items: center;
          font-size: 14px;
          .icon {
            width: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          input {
            font-size: 14px;
            color: #ffffff;
            padding: 10px;
            width: 100%;
          }
          input::placeholder{
            text-align: left;
          }
        }
        .phone {
          img {
            width: 16px;
            height: 16px;
          }
        }
        .code {
          position: relative;
          margin-top: 16px;
          img {
            width: 15px;
            height: 18px;
          }
          input {
            width: 100%;
            padding: 10px;
          }
          input::placeholder{
            text-align: left;
          }
          span{
            float: right;

          }
          .codeTime {
            color: #ffffff;
            border-bottom: 1px solid #ffffff;
            position: absolute;
            right: 2px;
          }
        }
      }
      .btn {
        margin-top: 19px;
        padding: 11px 0;
        text-align: center;
        background: #3967DC;
        border-radius: 4px;
        color: #ffffff;
        font-size: 16px;
      }
      .loginType{
        margin-top: 10px;
        padding: 5px 0;
        text-align: right;
        color: #ffffff;
        font-size: 14px;
      }
    }
  }
</style>
