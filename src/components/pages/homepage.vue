<template>
  <div class="homepage">
    <div class="main">
      <div class="enterprise">{{enterpriseName}}</div>
      <swiper style="width:100%;margin:0 auto;" auto loop height="85px" dots-class="custom-bottom" dots-position="center">
        <swiper-item v-for="(site, index) in sites" :key="index">
          <div @click="toDetail(index)">
            <span class="swiperSpan">{{site.content}}</span>
            <img class="swiperImg" src="../../assets/icon/lookFunction.png" alt="">
            <img class="toRight" src="../../assets/icon/toRight.png">
          </div>
        </swiper-item>
      </swiper>
      <div class="functionManage">
        <ul>
          <li v-if="userActionMap['wechat_run']" @click="deviceManage">
            <div>
              <img :src="settingManageIcon?settingManageIcon:require('../../assets/icon/setting-manage.png')" alt="">
              <span>设备管理</span>
            </div>
          </li>
          <li v-if="userActionMap['wechat_manage']" @click="operationManage">
            <div>
              <img :src="operationManageIcon?operationManageIcon:require('../../assets/icon/operation-manage.png')" alt="">
              <span>运维管理</span>
            </div>
          </li>
          <li v-if="userActionMap['wechat_work_sheet']" @click="workSheetManage">
            <div>
              <img :src="workSheetIcon?workSheetIcon:require('../../assets/icon/work-sheet.png')">
              <span>工单管理</span>
            </div>
          </li>
          <li v-if="userActionMap['wechat_leapfrog_remind']" @click="errorManage">
            <div>
              <img style="width:35%;height:45%;" :src="remindIcon?remindIcon:require('../../assets/icon/remindIcon.png')" alt="">
              <span>异常管理</span>
            </div>
          </li>
          <li v-if="userActionMap['wechat_organization_manage']" @click="structManage">
            <div>
              <img :src="structureIcon?structureIcon:require('../../assets/icon/structure.png')" alt="">
              <span>组织架构管理</span>
            </div>
          </li>
          <li v-if="userActionMap['wechat_data']" @click="produceManage">
            <div>
              <img :src="productManageIcon?productManageIcon:require('../../assets/icon/product-manage.png')" alt="">
              <span>生产管理</span>
            </div>
          </li>
          <li>
            <div @click="userCenter">
              <img :src="personalityIcon?personalityIcon:require('../../assets/icon/personality.png')" alt="">
              <span>个人中心</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  // 引入组件
  import { Swiper,SwiperItem} from 'vux'
  import request from '../../config/request.js';
  import settingManageIcon from '../../assets/icon/setting-manage.png'
  import operationManageIcon from '../../assets/icon/operation-manage.png'
  import workSheetIcon from '../../assets/icon/work-sheet.png'
  import remindIcon from '../../assets/icon/remindIcon.png'
  import structureIcon from '../../assets/icon/structure.png'
  import productManageIcon from '../../assets/icon/product-manage.png'
  import personalityIcon from '../../assets/icon/personality.png'
  export default {
    components: {
      Swiper,
      SwiperItem,
    },
    name: "homepage",
    data: function () {
      return {
        //初始化图片
        settingManageIcon: settingManageIcon,
        operationManageIcon: operationManageIcon,
        workSheetIcon: workSheetIcon,
        remindIcon: remindIcon,
        structureIcon: structureIcon,
        productManageIcon: productManageIcon,
        personalityIcon: personalityIcon,
        //当前企业
        enterpriseName: '',
        //功能
        functionContent: [],
        //代办数据
        sites: [],
        index: 0,
        userActionMap:{},
      }
    },
    created: function () {
      let userInfo = request.getUserInfo();
      if (!userInfo || userInfo.roleAction.length <= 0) {
        return;
      }
      this.getCheckData();
      this.getRepalceData();
      this.getWorksheetData();

      for (let item of userInfo.roleAction) {
        this.userActionMap[item.pageId] = item;
      }
      this.enterpriseName = userInfo.orgName
    },
    methods: {
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
      structManage: function(){
        this.$router.push({name: 'structure'});
      },
      produceManage: function(){
        this.$router.push({name: 'produce'});
      },
      userCenter: function(){
        this.$router.push({name: 'personality'});
      },
      //点击跳转到对应事件页面
      toDetail: function(index){
        let departmentInfo = {
          departmentName:'全企业',
          id:'1'
        }
        for(let key in this.sites[index]){
          if(key == "checkNum"){
            this.$router.push(
              {
                name: 'spotCheck',
                query:{
                  department:JSON.stringify(departmentInfo)
                }
              });
          }else if(key == "replaceNum"){
            this.$router.push(
              {
                name: 'addReplace',
                query:{
                  department:JSON.stringify(departmentInfo)
                }
              });
          }else if(key == "workNum"){
            this.$router.push({name: 'historyWorkOrder'});
          }else if(key == "errorNum"){
            this.$router.push({name: 'remindHomePage'});
          }
        }
      },
      
      getCheckData: function(){
        this.$http(this.$API.getCheckMatters,{},true).then((data)=>{
          let dic = {};
          dic["content"] = '今日需点巡检 '+ data.checkNum +' 设备/部件';
          dic["checkNum"] = data.checkNum;
          this.sites.push(dic);
        })
      },
      getRepalceData: function(){
        this.$http(this.$API.getReplaceMatters,{},true).then((data)=>{
          let dic = {};
          dic["content"] = '今日需更换 '+ data.replaceNum +' 设备/部件';
          dic["replaceNum"] = data.replaceNum;
          this.sites.push(dic);
        })
      },
      getWorksheetData: function(){
        this.$http(this.$API.getWorkSheetMatters,{},true).then((data)=>{
          let dic = {};
          dic["content"] = '今日需处理 '+ data.workNum +' 工单';
          dic["workNum"] = data.workNum;
          this.sites.push(dic);
          // dic["content"] = '今日需处理 '+ data.errorNum +' 异常提醒';
          // dic["errorNum"] = data.errorNum;
          // this.sites.push(dic);
        })
      }
    },
  }

</script>
<style lang="less" scoped>
  .homepage {
    background: #22233f;
    height: 100vh;
    .homepageText{
      color: #000;
    }
    .main {
      background: #22233f;
      .enterprise{
        height: 50px;
        font-size: 20px;
        background: rgba(0,0,0,0.4);
        text-align: center;
        line-height: 50px;
        color: #ffffff;
        margin-bottom: 20px;
      }
      .vux-slider{
        background: rgba(0,0,0,0.4);
      }
      .swiperSpan{
        font-size: 16px;
        color: #ffffff;
        line-height: 80px;
        margin-left: 10px;
      }
      .swiperImg{
        width: 40px;
        height: 40px;
        float: left;
        margin: 20px 0 20px 30px;
        /*margin-left: 30px;*/
      }
      .toRight{
        width: 10px;
        height: 10px;
        float: right;
        margin: 35px 30px 35px 0;
      }
      .functionManage{
        margin-top: 20px;
        background: rgba(0,0,0,0.4);
        min-height: 400px;
        ul{
          display: table-row;
          li{
            width: 23.3%;
            height: 100px;
            float: left;
            margin: 20px 5%;
            text-align: center;
            border: none;
            div{
              text-align: center;
              width: 100%;
              height: 100%;
              color: #ffffff;
            }
            img{
              width: 50%;
              height: 44%;
              padding: 10% 25%;
            }
          }

        }
      }
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
          }
        }
        .phone {
          img {
            width: 15px;
            height: 22px;
          }
        }
        .code {
          margin-top: 16px;
          img {
            width: 20px;
            height: 16px;
          }
          input {
            width: 148px;
            padding: 10px;
          }
          .codeTime {
            color: #ffffff;
            border-bottom: 1px solid #ffffff;
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
