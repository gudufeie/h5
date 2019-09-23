<template>
  <div class="addReplaceManage">
    <!--<img src="../../assets/icon/login-bg.png" class="bg" slot="icon">-->
    <div class="addReplaceManageText">更换管理</div>
    <input class="search" @click="searchRecord" placeholder="搜索">
    <img class="searchIcon" src="../../assets/icon/search.png" alt="">
    <div class="main">
      <tab>
       <tab-item>添加更换记录</tab-item>
       <tab-item selected>更换记录</tab-item>
      </tab>

      <!--<div class="tabTop">-->
        <!--<div>添加更换记录</div>-->
        <!--<div>更换记录</div>-->
      <!--</div>-->
      <x-table>
        <thead>
        <tr>
          <td>设备名称</td>
         <td>设备编码</td>
         <td>更换周期</td>
         <td>剩余天数</td>
         <td>操作</td>
        </tr>
        </thead>
        <tbody>
         <tr v-for="record in records">
           <td>{{record.name}}</td>
           <td>{{record.code}}</td>
           <td>{{record.replacementCycle}}</td>
           <td>{{record.dayRemain}}</td>
           <td>{{record.setting}}</td>
         </tr>
        </tbody>
      </x-table>
      <div class="addFunction">
        <div>手动添加</div>
        <div>扫码添加</div>
      </div>
      <div class="footer">
        <tab class="footerTab">
          <tab-item class="footerTabber" v-for="foot in footer">
            <img src="../../assets/icon/fileFolder.png" alt="">
            <div>{{foot.name}}</div>
          </tab-item>
        </tab>
        <!--<div class="footerElement" v-for="foot in footer">-->
          <!--<img src="../../assets/icon/fileFolder.png" alt="">-->
          <!--<div>{{foot.name}}</div>-->
        <!--</div>-->
      </div>
      <!--<div class="structurePersonStyle"  v-for="person in structurePerson">-->
        <!--<div class="structurePersonNameStyle">{{person.name}}</div>-->
        <!--<div class="structurePersonPositionStyle">{{person.position}}</div>-->
      <!--</div>-->
      <!--<div class="structureNameStyle"  v-for="structureName in structureNames">-->
        <!--<img src="../../assets/icon/fileFolder.png" alt="">-->
        <!--{{structureName.name}}-->
        <!--<img class="toRight" src="../../assets/icon/toRight.png" alt="">-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>

  // 引入slider组件
  import Swiper from "swiper";
  import 'swiper/dist/css/swiper.min.css';
  import 'swiper/dist/js/swiper.min.js';
  import { Tab,TabItem,XTable } from 'vux'
  export default {
    components: {
      Tab,
      TabItem,
      XTable,

    },
    name: "workSheetHomePage",
    data: function () {
      return {
        //工单功能
        workSheetInfo: [{title: '运维工单', handle: '处理工单', record: '历史工单记录'}, {title: '报警工单', handle: '处理工单', record: '报警工单记录'}, {title: '预警工单', handle: '处理工单', record: '预警工单记录'}],
        //工单代办事项
        sites: [{imgUrl:require('../../assets/icon/look-function.png'), content:'设备点检'},{imgUrl:'', content:'设备xun'},{imgUrl:'', content:'设检'},{imgUrl:'', content:'点检'},{imgUrl:'', content:'备点检'}],
        //组织架构人员
        structurePerson: [{name: '张希', position: '董事长'},{name:'王五', position: '总经理'}],
        //组织架构名称
        structureNames: [{name: '润星丰厂(500)'},{name:'德美墨厂(200)'}],
        //更换记录
        records: [{name: '皮带', code: '123456', replacementCycle: '10天', dayRemain: '11', setting: '更换'},
          {name: '皮带', code: '123456', replacementCycle: '10天', dayRemain: '11', setting: '更换'},
          {name: '皮带', code: '123456', replacementCycle: '10天', dayRemain: '11', setting: '更换'},
          {name: '皮带', code: '123456', replacementCycle: '10天', dayRemain: '11', setting: '更换'},

        ],
        //底部菜单功能
        footer: [{name: '点巡检'}, {name: '更换管理'}, {name: '运维数据报表'}]
      }
    },
    created: function () {
      // this.structurePerson = this.$route.query.structurePerson;
      // this.structureNames = this.$route.query.structureNames;
    },

     mounted(){
        var mySwiper = new Swiper('.swiper-container', {
          loop: true,
          // 如果需要分页器
          pagination: '.swiper-pagination',
          // 如果需要前进后退按钮
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          // 如果需要滚动条
          scrollbar: '.swiper-scrollbar',
        })
      },
    methods: {
      //搜索更换记录
      searchRecord: function(){
        alert("待开发中");
      },
    },
  }

</script>

<style lang="less" scoped>
  .addReplaceManage {
    background: #22233f;
    height: 100vh;
    .addReplaceManageText {
      background-color: #fff;
      display: block;
      width: 100%;
      text-align: center;
      font-size: 20px;
      padding: 10px 0;
      /*height: 272px;*/
    }
    .searchIcon{
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
      /*background: rgba(0,0,0,0.4);*/
      .tabTop{
        display: flex;
        background: red;
        height: 40px;
        div{
          width: 50%;
          float: left;
          text-align: center;
          margin-bottom: 20px;
          font-size: 20px;
          line-height: 40px;
        }
      }
      table{
        background: #fff;
        /*width: 90%;*/
        /*margin: 10px 5%;*/
        tr{
          border-bottom: #0bb20c 1px solid;
        }
        td{
          border-bottom: #0bb20c 1px solid;
        }

      }
      .addFunction{
        display: flex;
        margin: 20px 10px;
        height: 40px;
        width: 100%;
        position: absolute;
        bottom: 70px;
        div{
          width: 50%;
          background: red;
          border-radius: 20px;
          text-align: center;
          font-size: 20px;
          margin: 0 20px;
          line-height: 40px;
        }
      }
      .footer{
        background: #fff;
        display: flex;
        height: 40px;
        padding-top: 10px;
        position: absolute;
        width: 100%;
        bottom: 0;
        .footerTab{
          position: fixed;
          padding: 0;
          width: 100%;
          height: 60px;
          .vux-tab-container{
            height: 60px;
            .vux-tab{
              height: 60px;
              .footerTabber{

                height: 60px;
                line-height: 0;
                img{
                  width: 20px;
                  height: 20px;
                }
                div{
                  height: 30px;
                  line-height: 20px;
                }
          }
          }

          }
        }
        .footerElement{
          float: left;
          width: 30%;
          text-align: center;
          padding: 10px;
          div{
            width: 100%;
          }
          img{
            width: 20px;
            height: 20px;

          }
        }
      }
      .swiper-container{
        height: 100px;
        margin: 10px 0;
        background: rgba(0,0,0,0.3);
        .swiper-slide{
        color: #ffffff;
        height: 50%;
        img{
          width: 10%;
          margin: 20px 0;
        }
        div{
          display: flex;
        }
        .toRight{
          margin: 0;
          width: 20px;
          height: 20px;
          position: absolute;
          top: 40px;
          right: 20px;
        }
       }
      }
      .functionManage{
        display: flex;
        margin: 20px 0;
        background: rgba(0,0,0,0.4);
        color: #ffffff;
        .workSheetFunction{
          width: 28%;
          margin: 20px 2%;
          float: left;
          text-align: center;
          img{
            width: 40px;
            height: 40px;
          }
        }
      }
      .workSheetSample{
        margin: 20px 0;
        padding: 10px;
        background: #efeff4;
        .workSheetSampleTop{
          height: 20px;
          font-size: 20px;
          line-height: 20px;
          text-align: left;
          padding-left: 20px;
        }
        .workSheetSampleContent{
          display: flex;
          margin: 10px;
          height: 60px;
          border: #0bb00c 1px solid;
          div{
            height: 30px;
            float: left;
            width: 50%;
            padding: 15px;

            img {
              width: 20px;
              height: 20px;
              padding-right: 10px;
              vertical-align: middle;
            }
            span{
              font-size: 14px;
              line-height: 30px;
            }
          }
          /*.workSheetSampleLeft{*/
            /*float: left;*/
            /*width: 50%;*/
            /*font-size: 20px;*/
            /*line-height: 60px;*/
            /*img {*/
              /*width: 20px;*/
              /*height: 20px;*/
            /*}*/
          /*}*/
          /*.workSheetSampleRight{*/
            /*float: left;*/
            /*width: 50%;*/
          /*}*/
        }
      }
    }
  }
</style>
