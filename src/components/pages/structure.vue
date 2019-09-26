<template>
  <div class="structure">
    <search
      :results="results"
      v-model="value"
      position="absolute"
      auto-scroll-to-top
      @on-submit="onSubmit"
      ref="search">
    </search>
    <div class="main">
      <div class="structurePersonStyle"  v-for="(person,index) in personList" :key="index">
        <div class="structurePersonNameStyle">{{person.name}}</div>
        <div class="structurePersonPositionStyle" v-if="person.leader == 1">领导</div>
        <div class="structurePersonPositionStyle" v-else>员工</div>
      </div>
      <div class="structureNameStyle"  v-for="(structureName,index) in structureList" :key="index" @click="seocondStructure(index)">
        <img src="../../assets/icon/fileFolder.png" alt="">
        {{structureName.departmentName}}
        <img class="toRight" src="../../assets/icon/toRight.png" alt="">
      </div>
    </div>
    <div class="tree">
      <organization :selectDepartment="curDepartment"></organization>
    </div>
    <shortcut-menu></shortcut-menu>
  </div>
</template>

<script>
  // 引入slider组件
  import Swiper from "swiper";
  import 'swiper/dist/css/swiper.min.css';
  import { Flexbox, FlexboxItem, Search  } from 'vux';
  import ShortcutMenu from "../../components/common/shortcut_menu.vue";
  import Organization from "../../components/common/organization.vue";

  export default {
    components: {
      Flexbox,
      FlexboxItem,
      Search ,
      "shortcut-menu":ShortcutMenu,
      Organization
    },
    name: "structure",
    data: function () {
      return {
        treeData: {},
        //组织架构人员
        structurePerson: [],
        //组织架构名称
        structureNames: [],
        //弹窗初始化
        show4: false,
        results: [],
        value: '',
        personList:[],
        structureList:[],
        curDepartment:{}
      }
    },
    created: function () {
      this.$http(this.$API.loadOrganStructure,{departmentId: -1}, true).then((res)=>{
        this.structurePerson = this.personList = res.users;
        this.structureNames = this.structureList = res.departments;
      })
      this.getOrganization()
    },

     mounted(){
       this.curDepartment = {
        name:'全企业',
        id:1
       }
      },
    methods: {
      getOrganization: function(){
          this.$http(this.$API.getMyOrganization,{},true).then((data)=>{
              let a = data[0]
              this.treeData = a
          })
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
        this.$router.push({name: 'remindHomePage'});
      },
      produceManage: function(){
        this.$router.push({name: 'produce'});
      },
      userCenter: function(){
        this.$router.push({name: 'personality'});
      },
      redo: function (){
        this.show4 = false;
      },
      //搜索公司
      searchCompany: function(){
        // alert("待开发中");
      },
      //弹窗显示方法
      showVuePopup4(flag) {
        this.show4 = flag;
      },
      seocondStructure: function(ind){
        let strName = this.structureNames;
        let id = strName[ind].id;
        let name = strName[ind].departmentName;
        this.$router.push(
          {
            name: 'structureSecond',
            query:{
              id:id,
              name:name
          }
        });
      },

      onSubmit () {
        this.personList = [];
        this.structureList = [];
        if(!!this.structurePerson){
          for(var structure of this.structurePerson){
            if(!!this.value && structure.name.indexOf(this.value) < 0){
              continue;
            }
            this.personList.push(structure)
          }
        }

        if(!!this.structureNames){
          for(var structure of this.structureNames){
            if(!!this.value && structure.departmentName.indexOf(this.value) < 0){
              continue;
            }
            this.structureList.push(structure)
          }
        }
      },
    },
  }

</script>

<style lang="less" scoped>
  .structure {
    background: #22233f;
    height: 100vh;
    .structureText {
      background-color: #fff;
      display: block;
      width: 100%;
      text-align: center;
      font-size: 16px;
      padding: 10px 0;
      /*height: 272px;*/
    }
    .searchIcon{
      width: 25px;
      height: 25px;
      position: absolute;
      top: 35px;
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
      height: calc(~'100% - 90px');
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .structurePersonStyle{
        height: 60px;
        width: 90%;
        margin: 0 5%;
        padding: 10px 0;
        text-align: left;
        color: #ffffff;
        border-bottom: rgba(255,255,255,0.2) 1px solid;
        .structurePersonNameStyle{
          height: 30px;
          margin: 5px 0;
          font-size: 16px;
          line-height: 30px;
        }
        .structurePersonPositionStyle{
          height: 30px;
          font-size: 14px;
          line-height: 30px;
          color: rgba(255,255,255,0.5);
        }
      }
      .structureNameStyle{
        height: 60px;
        width: 90%;
        margin: 0 5%;
        text-align: left;
        font-size: 16px;
        line-height: 60px;
        color: #ffffff;
        border-bottom: rgba(255,255,255,0.2) 1px solid;
        img{
          width: 22px;
          height: 17px;
          float: left;
          margin: 21px 10px;
        }
        .toRight{
          float: right;
          margin: 25px 0;
          width: 10px;
          height: 10px;
        }
      }
    }
    .slide-enter-active {
        animation-name: slideInUp;
        animation-duration: 0.2s;
        animation-fill-mode: both;
    }
    .slide-leave-active {
        animation-name: slideOutDown;
        animation-duration: 0.2s;
        animation-fill-mode: both;
    }
    @keyframes slideInUp {
        0% {
            transform: translate3d(0, 100%, 0);
            visibility: visible;
        }

        to {
            transform: translateZ(0);
        }
    }
    @keyframes slideOutDown {
        0% {
            transform: translateZ(0);
        }

        to {
            visibility: hidden;
            transform: translate3d(0, 100%, 0);
        }
    }
    .delay-leave-active {
        -webkit-animation-delay: 0.2s;
        -moz-animation-delay: 0.2s;
        -o-animation-delay: 0.2s;
        animation-delay: 0.2s;
    }
    .flex-demo {
      text-align: center;
      color: #fff;
      background-color: #323465;
      border-radius: 4px;
      background-clip: padding-box;
      height: 125px;
      /*line-height: 125px;*/
      img{
        width: 40px;
        height: 40px;
        margin-bottom: 5px;
      }
      .lineImg1{
        margin-top: 35px;
      }
      .lineImg2{
        margin-top: 20px;
      }
    }
  }
.structure /deep/ .vux-search-box{
    background-color: #22233f !important;
    position:static !important;
  }
  .structure /deep/ .weui-search-bar, .weui-search-bar_focusing{
    background-color:#22233f !important;
  }
  .structure /deep/ .weui-search-bar__cancel-btn{
    color:#fff !important;
  }
  .tree{
    position: absolute;
    top: 100px;
    width: 100%;
  }
</style>
