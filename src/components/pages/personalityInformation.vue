<template>
  <div class="personality">
    <div class="main">
      <div class="personStyle" v-bind:style="user">用户名 <span>{{userInfo.account}}</span></div>
      <div class="personStyle" @click="changeName" v-bind:style="name">姓名
        <img src="../../assets/icon/toRight.png" alt=""><span>{{userInfo.name}}</span></div>
      <div class="personStyle" @click="changeNum" v-bind:style="number">手机号
        <img src="../../assets/icon/toRight.png" alt=""><span>{{userInfo.phone}}</span></div>
      <input class="userEdit" type="text" :placeholder="userInfo.name" v-bind:style="userNameStyle" v-model="userInfo.name">
      <input class="userEdit" type="number" :placeholder="userInfo.num" oninput="if(value.length>11)value=value.slice(0,11)" v-bind:style="userNumStyle" v-model="userInfo.phone">
    </div>
    <div class="btn" v-bind:style="btnSave" @click="saveUserInfo">保存</div>


  </div>
</template>

<script>
  import { XHeader } from 'vux'
  export default {
    components: {

    },
    name: "personality",
    data: function () {
      return {
        //顶部文本信息
        topInformation: '个人信息',
        //用户信息
        userInfo: '',
        //绑定顶部信息样式
        personality: '',
        //绑定用户信息样式
        user: {
          display: 'block',
        },
        //绑定用户姓名样式
        name: {
          display: 'block',
        },
        //绑定用户手机号样式
        number: {
          display: 'block',
        },
        //绑定修改用户名样式
        userNameStyle: {
          display: 'none',
        },
        //绑定修改手机号样式
        userNumStyle: {
          display: 'none',
        },
        //绑定保存按钮样式
        btnSave: {
          display: 'none',
        },
      }
    },

    //生命周期里接收参数
    created: function () {
      //接受参数关键代码
      this.userInfo = this.$route.query.userInfo;
    },

     mounted(){

      },
    methods: {
      //更换姓名
      changeName: function () {
        this.topInformation = '更改姓名';
        this.user.display = 'none';
        this.name.display = 'none';
        this.number.display = 'none';
        this.userNameStyle.display = 'block';
        this.userNumStyle.display = 'none';
        this.btnSave.display = 'block';
      },
      //更换手机号
      changeNum: function () {
        this.topInformation = '更改手机号';
        this.user.display = 'none';
        this.name.display = 'none';
        this.number.display = 'none';
        this.userNumStyle.display = 'block';
        this.userNameStyle.display = 'none';
        this.btnSave.display = 'block';
      },
      //修改用户信息
      saveUserInfo: function () {
        let data = {
           name: this.userInfo.name,
           phone: this.userInfo.phone,
         };
        if (this.$route.query.type) {
          data.openId = JSON.parse(localStorage.getItem('openId'));
          data.nickName = JSON.parse(localStorage.getItem('nickName')) || '';
        }else if(this.$route.query.openId){
            data.openId = JSON.parse(this.$route.query.openId)
        }
        let that = this;
        this.$http(this.$API.updateUserInfo, data, true).then((res) => {
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
  .personality {
    background: #22233f;
    height: 100vh;
    .personalityText{
      color: #000;
    }
    .main {
      // background: rgba(0,0,0,0.3);
      padding:20px 0px;
      .personStyle{
        line-height: 60px;
        width: 90%;
        margin: 0 5%;
        font-size: 18px;
        text-align: left;
        color: #ffffff;
        border-bottom: rgba(255,255,255,0.2) 1px solid;
        span{
          float: right;
          margin-right: 18px;
          color: rgba(255,255,255,0.5);
        }
        img{
          width: 10px;
          height: 20px;
          float: right;
          margin: 20px 0;
        }
      }
      .userEdit{
        line-height: 40px;
        font-size: 18px;
        width: 90%;
        text-align: left;
        margin: 0px 5%;
        color: #ffffff;
        border-bottom: rgba(255,255,255,0.5) 1px solid;
      }
      .userEdit::placeholder{
        color: rgba(255,255,255,0.5);
      }
    }
    .btn{
      height: 50px;
      margin: 100px 20px 0px 20px;
      border: #456de6 1px solid;
      line-height: 50px;
      color: #456de6;
      font-size: 16px;
      text-align: center;
      border-radius: 25px;
    }
  }
</style>
