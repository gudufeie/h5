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
      <div class="structurePersonStyle"  v-for="(person,index) in personList">
        <div class="structurePersonNameStyle">{{person.name}}</div>
        <div class="structurePersonPositionStyle" v-if="person.leader == 1">领导</div>
        <div class="structurePersonPositionStyle" v-else>员工</div>
      </div>
    </div>
    <shortcut-menu></shortcut-menu>
  </div>
</template>

<script>

  // 引入slider组件
  import Swiper from "swiper";
  import 'swiper/dist/css/swiper.min.css';
  import { Flexbox, FlexboxItem, Search } from 'vux';
  import ShortcutMenu from "../../components/common/shortcut_menu.vue";

  export default {
    components: {
      Flexbox,
      FlexboxItem,
      Search,
      "shortcut-menu":ShortcutMenu
    },
    name: "structure",
    data: function () {
      return {
        //五级组织架构名称
        structureTopName: '岗位工',
        //组织架构人员
        structurePerson: [{name: '张希', position: '岗位工'},{name:'王五', position: '岗位工'}],
        //弹窗初始化
        show4: false,
        results: [],
        value: '',
        personList:[],
      }
    },
    created: function () {
      let id = this.$route.query.id;
      let name = this.$route.query.name;
      this.structureTopName = name;
      this.$http(this.$API.loadOrganStructure,{departmentId: id}, true).then((res)=>{
          this.structurePerson = this.personList = res.users;
        })
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
        this.$router.push({name: 'remindHomePage'});
      },
      produceManage: function(){
        this.$router.push({name: 'produce'});
      },
      userCenter: function(){
        this.$router.push({name: 'personality',
            query:{id:id}});
      },
      redo: function (){
        this.show4 = false;
      },
      //弹窗显示方法
      showVuePopup4(flag) {
        this.show4 = flag;
      },

      onSubmit () {
        this.personList = [];
        if(!!this.structurePerson){
          for(var structure of this.structurePerson){
            if(!!this.value && structure.name.indexOf(this.value) < 0){
              continue;
            }
            this.personList.push(structure)
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
      height: calc(~'100% - 90px');
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      .structurePersonStyle{
        height: 60px;
        width: 90%;
        margin: 0 5%;
        text-align: left;
        color: #ffffff;
        border-bottom: rgba(255,255,255,0.2) 1px solid;
        .structurePersonNameStyle{
          height: 40px;
          font-size: 16px;
          line-height: 40px;
        }
        .structurePersonPositionStyle{
          height: 20px;
          font-size: 14px;
          line-height: 20px;
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
          width: 10px;
          height: 22px;
          float: right;
          margin: 19px 0;
        }
      }
    }
    .bottomBtn{
    width: fit-content;
    border: 1px solid #ddd;
    padding: 6px 15px;
    position: fixed;
    bottom: 10px;
    left: 10px;
    border-radius: 15px;
    background: #22233f;
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
</style>
