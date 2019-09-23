<template>
  <div class="enterprise">
    <input class="search" @click="searchCompany" placeholder="搜索">
    <img src="../../assets/icon/search.png" alt="">
    <div class="main">
      <div class="enterpriseStyle"  v-for="enterprise in enterprises">{{enterprise.name}}</div>
    </div>
    <div class="btn" @click="loginOutFn">保存</div>

  </div>
</template>

<script>
  // 引入slider组件
  import 'swiper/dist/css/swiper.min.css';
  import { XHeader } from 'vux'
  export default {
    components: {
      XHeader
    },
    name: "enterprise",
    data: function () {
      return {
        //企业名称
        enterprises: '',
      }
    },
    created: function () {
      this.enterprises = this.$route.query.enterprises;
    },

     mounted(){

      },
    methods: {
      //搜索公司
      searchCompany: function(){
        alert("待开发中");
      },
      //退出登录
      loginOutFn: function () {
        alert("待开发中");
      },
    },
  }

</script>

<style lang="less" scoped>
  .enterprise {
    background: #22233f;
    height: 100vh;
    .enterpriseText{
      color: #000;
    }
    img{
      width: 25px;
      height: 25px;
      position: absolute;
      top: 80px;
      left: 45px;

    }
    .search{
      height: 50px;
      margin: 20px 5%;
      width: 90%;
      background: rgba(0,0,0,0.3);
      /*border: #00ffff 1px solid;*/
      line-height: 50px;
      color: rgba(255,255,255,0.8);
      text-align: center;
      border-radius: 25px;
    }
    .search::placeholder{
      color: rgba(255,255,255,0.8);
    }
    .main {
      background: rgba(0,0,0,0.4);
      .enterpriseStyle{
        height: 80px;
        width: 90%;
        margin: 0 5%;
        font-size: 20px;
        text-align: left;
        line-height: 80px;
        color: #ffffff;
        border-bottom: rgba(255,255,255,0.2) 1px solid;
      }
    }
    .btn {
      width: 80%;
      margin: 30% 10% 0 10%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: #3967DC;
      border-radius: 25px;
      color: #ffffff;
      font-size: 16px;
    }
  }
</style>
