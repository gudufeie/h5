<template>
  <div class="changePassword">
    <div class="main">
      <p><span>原密码</span><input class="inputStyle" type="password" placeholder="填写原密码" v-model="oldPassword"/></p>
      <p><span>新密码</span><input class="inputStyle" type="password" placeholder="填写新密码" v-model="newPassword"/></p>
      <p><span>确认密码</span><input class="inputStyle" type="password" placeholder="再次填写新密码" v-model="password"/></p>
      <div class="btn" @click="saveOut">保存</div>
    </div>
  </div>
</template>
<script>
  import { XHeader } from 'vux'
  export default {
    components: {
      XHeader
    },
    name: "changePassword",
    data: function () {
      return {
        //当前企业
        enterpriseName: '',
        //输入原始密码
        oldPassword: '',
        //输入新密码
        newPassword: '',
        //再次输入新密码
        password: ''
      }
    },
    created: function () {},
    mounted(){},
    methods: {
      //修改密码
      saveOut: function () {
        //获取修改信息
        let data = {
           oldPassword: this.oldPassword,
           newPassword: this.newPassword,
           password: this.password,
         };
        if (this.$route.query.type) {
          data.openId = JSON.parse(localStorage.getItem('openId'));
          data.nickName = JSON.parse(localStorage.getItem('nickName')) || '';
        }else if(this.$route.query.openId){
            data.openId = JSON.parse(this.$route.query.openId)
        }
        let that = this;
        if (this.oldPassword === this.newPassword){
          alert("请您输入与原密码不一致的新密码");
          return;
        }else if (this.newPassword !== this.password){
          alert("请保持两次密码一致");
          return;
        }
        this.$http(this.$API.updatePassword, data, true).then((res) => {
          if (res) {
            that.$store.commit('saveUser', res);
            that.showDefaultPage();
          }
        });
      },
      showDefaultPage: function () {
          this.$router.push({name: 'personality'});
      },
    },
  }
</script>
<style lang="less" scoped>
  .changePassword {
    background: #22233f;
    height: 100vh;
    padding:20px 10px;

    .changePasswordText{
      color: #000;
    }
    .main {
      background: #22233f;
      color: #ffffff;
      font-size: 18px;
      vertical-align: middle;
      p{
        line-height: 50px;
        padding:0px;
        margin: 0px;
        display: flex;
        align-items: center;
      }
      span{
        width: 25%;
        margin: 0 2.5%;
      }
      .inputStyle{
        float: right;
        width: 65%;
        margin-right: 5%;
        font-size: 16px;
        text-align: left;
        border-bottom: 1px rgba(0,0,0,0.2) solid;
        color: #ffffff;
      }
      .inputStyle:focus{
        border-bottom: 1px #3967DC solid;
      }
      .inputStyle::placeholder{
        color: rgba(255,255,255,0.5);
      }
      .btn{
        height: 50px;
        margin: 100px 20px 0 20px;
        line-height: 50px;
        text-align: center;
        border: #3967DC 1px solid;
        border-radius: 25px;
        color: #3967DC;
        font-size: 16px;
      }
    }
  }
</style>
