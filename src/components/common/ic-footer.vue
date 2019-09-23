<template>
  <div class="ic-footer">
    <ul>
      <li v-if="userActionMap['wechat_device']" v-bind:class=" activeIndex == 0 ? 'active' : '' " @click="mainPage(0)">
        <img src="../../assets/icon/deviceManage2.png" class="data">
        <span>设备列表</span>
        <div class="activeLine"></div>
      </li>
      <li v-if="userActionMap['wechat_component']" v-bind:class=" activeIndex == 1 ? 'active' : '' " @click="mainPage(1)">
        <img src="../../assets/icon/beseComponent.png" class="run">
        <span>部件管理</span>
        <div class="activeLine"></div>
      </li>
      <!--<li v-if="userActionMap['wechat_data']" v-bind:class=" activeIndex == 2 ? 'active' : '' " @click="mainPage(2)">-->
        <!--<img src="../../assets/icon/dataGenerate.png" class="manage">-->
        <!--<span>生产数据</span>-->
        <!--<div class="activeLine"></div>-->
      <!--</li>-->
    </ul>
  </div>
</template>

<script>

  import request from '../../config/request.js';

  export default {
    name: "ic-footer",
    data(){
      return {
        userActionMap: {
          wechat_device: '1',
          wechat_component: '2',
          wechat_data: '3'
        }
      }
    },
    created: function () {
      let userInfo = request.getUserInfo();
      if (!userInfo || userInfo.roleAction.length <= 0) {
        return;
      }

      for (let item of userInfo.roleAction) {
        this.userActionMap[item.pageId] = item;
      }
      if (this.userActionMap['wechat_device'] != null) {
        this.$store.commit('changeMode', 0);
      } else if (this.userActionMap['wechat_component'] != null) {
        this.$store.commit('changeMode', 1);
      } else if (this.userActionMap['wechat_data'] != null) {
        this.$store.commit('changeMode', 2);
      }
    },
    computed: {
      activeIndex () {
        return this.$store.state.mode;
      }
    },
    methods: {
      mainPage: function (tab) {
        if (this.activeIndex != tab) {
          const urlArray = ['deviceDetailManage', 'inventoryTree', 'produce'];
          this.$store.commit('changeMode', tab);
          this.$router.push({name: urlArray[tab]});

          if (tab === 0){
            this.$router.go(0);
          }

        }
      }
    },
    activated: function () {
      if (this.$route.name == 'deviceDetailManage') {
        this.$store.commit('changeMode', 0);
      } else if (this.$route.name == 'inventoryTree') {
        this.$store.commit('changeMode', 1);
      } else {
        this.$store.commit('changeMode', 2);
      }
    }
  }
</script>

<style lang="less" scoped>
  .ic-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    ul {
      display: flex;
      height: 65px;
      background: #0F1227;
      li {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 2;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        padding:10px 0px;
        img {
          width: 15%;
          height: 60%;
        }
        .activeLine {
          display: none;
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: #177FFF;
        }
        span{
          margin-top:5px;
          font-size:16px;
        }
      }
      li.active {
        background: #1C1F37;
        .activeLine {
          display: block;
        }
      }
    }
  }
</style>
