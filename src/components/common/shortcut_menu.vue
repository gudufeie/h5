<template>
    <div class="main_wrapper">
      <div class="vue-popup4">
        <div class="popup4mask" v-show="show4" @click="showVuePopup4(false)"></div>
        <transition name="slide">
            <div class="popup-content" v-show="show4">
                <div class="popup-title"><span>快捷菜单</span></div>
                <div class="popup-body">
                  <flexbox :gutter="0">
                    <flexbox-item v-if="userActionMap['wechat_run']">
                      <div class="flex-demo"  @click="deviceManage">
                        <img class="lineImg1" src="../../assets/icon/devicemanage.png" alt="">
                        <p>设备管理</p>
                      </div>
                    </flexbox-item>
                    <flexbox-item v-if="userActionMap['wechat_manage']">
                      <div class="flex-demo" @click="operationManage">
                        <img class="lineImg1" src="../../assets/icon/mochaITOM.png" alt="">
                        <p>运维管理</p>
                      </div>
                    </flexbox-item>
                    <flexbox-item v-if="userActionMap['wechat_work_sheet']">
                      <div class="flex-demo" @click="workSheetManage">
                        <img class="lineImg1" src="../../assets/icon/workOrderManage.png" alt="">
                        <p>工单管理</p>
                      </div>
                    </flexbox-item>
                  </flexbox>
                  <flexbox :gutter="0">
                    <flexbox-item v-if="userActionMap['wechat_leapfrog_remind']">
                      <div class="flex-demo" @click="errorManage">
                        <img class="lineImg2 leapfrog" src="../../assets/icon/remindIcon.png" alt="">
                        <p>异常管理</p>
                      </div>
                    </flexbox-item>
                    <flexbox-item v-if="userActionMap['wechat_data']">
                      <div class="flex-demo" @click="produceManage">
                        <img class="lineImg2" src="../../assets/icon/production.png" alt="">
                        <p>生产管理</p>
                      </div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="flex-demo" @click="userCenter">
                        <img class="lineImg2" src="../../assets/icon/personalCenter.png" alt="">
                        <p>个人中心</p>
                      </div>
                    </flexbox-item>
                  </flexbox>
                </div>
                <div class="popup-bottom" @click="showVuePopup4(false)"><span>取消</span></div>
            </div>
        </transition>
      </div>
      <div class="bottomBtn">
        <button type="button" @click="$router.back(-1)"><font-awesome-icon :icon="['fa','chevron-left']" size="lg" /></button>
        <span> | </span>
        <button type="button" class="type1" @click="showVuePopup4(true)"><font-awesome-icon :icon="['fa','bars']" size="lg" /></button>
      </div>
    </div>
</template>
<script>
import { FlexboxItem, Flexbox } from 'vux';
import request from '../../config/request.js';
export default {
    data(){
        return {
            show4: false,
            userActionMap:[]
        }
    },
    components: {
        FlexboxItem,
        Flexbox
    },
    created: function(){
      let userInfo = request.getUserInfo();
      if (!userInfo || userInfo.roleAction.length <= 0) {
        return;
      }
      for (let item of userInfo.roleAction) {
        this.userActionMap[item.pageId] = item;
      }
    },
    methods:{
        showVuePopup4(flag) {
          this.show4 = flag;
        },
        deviceManage: function(){
          this.$router.push({name: 'manage'});
        },
        operationManage: function(){
          this.$router.push({name: 'operaionManage'});
        },
        workSheetManage: function(){
          this.$router.push({name: 'workSheetHomePage'});
        },
        errorManage: function(){
          this.$router.push({name: 'remindManage'});
        },
        produceManage: function(){
          this.$router.push({name: 'produce'});
        },
        userCenter: function(){
          this.$router.push({name: 'personality'});
        },
    }
}
</script>
<style>
  .bottomBtn{
    width: fit-content;
    border: 1px solid #ddd;
    padding: 6px 15px;
    position: fixed;
    bottom: 10px;
    left: 10px;
    border-radius: 15px;
    background: #22233f;
    z-index: 999;
   }
   .bottomBtn button{
    border: none;
    background: #22233f;
    color: #fff;
   }
    .bottomBtn span{
    color: #fff;
    margin: 0 8px;
   }

  .vux-popup-mask{
    top: 63%!important;
  }

  .flex-demo .leapfrog{
    width:30px;
  }

  .flex-demo {
    text-align: center;
    color: #fff;
    background-color: #323465;
    border-radius: 4px;
    background-clip: padding-box;
    height: 125px;
  }
  .flex-demo img{
      width: 40px;
      height: 40px;
      margin-bottom: 5px;
    }
  .flex-demo .lineImg1{
      margin-top: 35px;
    }
  .flex-demo .lineImg2{
      margin-top: 20px;
    }
  .vue-popup4 .popup-content {
    position: fixed;
    height: 350px;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #323465;
    -webkit-transition: all 0.2s ease-in;
    transition: all 0.2s ease-in;
    z-index: 11000;
  }
  .vue-popup4 .popup-content .popup-title{
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    color: #fff;
    border-bottom: 1px solid #737373;
  }
  .vue-popup4 .popup-content .popup-body{
    height: 250px;
  }
  .vue-popup4 .popup-content .popup-bottom{
    text-align: center;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    color: #fff;
    border-top: 1px solid #737373;
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  .popup4mask {
      position: fixed;
      width: 100%;
      left: 0;
      bottom: 0;
      height: 50px;
      background-color: rgba(0, 0, 0, 0);
      transition: all 0.2s ease-in;
      z-index: 999;
  }
</style>
