<template>
  <div class="chooseChecker">
    <search
      v-model="leaderName"
      position="absolute"
      auto-scroll-to-top
      @on-submit="onSubmit"
      ref="search">
    </search>
    <div class="main">
      <checklist 
        label-position="left" 
        :options="checkerList" 
        v-model="checker" 
        :max='1' 
        v-if="checkers.length> 0">
      </checklist>
      <cell 
        v-for="(item,index) of departmentList" 
        :title="item.departmentName" 
        :key="index"
        @click.native="selectDepart(item)"
        is-link>
      </cell>
    </div>
    <div class="operator_wrapper">
      <button @click="submitChecker">保存</button>
      <button @click="goBack(curDepartment)" v-if="buttonShow">返回</button>
    </div>
    <div v-transfer-dom>
        <loading :show="loading" text="加载中"></loading>
    </div>
  </div>
</template>

<script>

import { Checklist, TransferDom, Loading, Cell,Group, Search } from 'vux';

export default {
  name: "enterprise",
  components: {
    Checklist,
    Loading,
    Cell,
    Group,
    Search
  },
  directives: {
    TransferDom
  },
  props:{
    options:Object
  },
  data: function () {
    return {
      checkers: [],
      checker:[],
      checkerList:[],
      selectDepartList:[],
      curDepartment:{},
      loading: false,
      departmentName:'',
      leaderName:'',
      departmentList:[],
      personList:[],
      buttonShow: false
    }
  },
  created: function () {
    
  },

  watch:{
    options:function(){
      this.loadOrgData();
    }
  },
  methods: {
    //退出登录
    submitChecker: function () {
      var chargerId ='';
      for(var i=0;i<this.checkers.length;i++){
          if(this.checker[0] == this.checkers[i].name){
            chargerId = this.checkers[i].id
          }
        }
      this.$emit('getCharger',chargerId,this.checker[0])
      this.buttonShow = false;
    },

    loadOrgData: function () {
      this.$http(this.$API.loadOrganStructure,{departmentId: -1}, true).then((res)=>{
        this.departmentList = res.departments;
        this.selectDepartList.push(res.departments[0]);
        if(!!res.users){
          this.personList = res.users;
        }else{
          this.personList = []
        }
        this.getLeaders()
      })
    },

    // 提交负责人
    onSubmit(){
      var name= this.leaderName;
      if(!!!name){
        this.$commom.alert('请输入查询人员姓名')
      }
      this.$http(this.$API.searchPerson,{params:name},true).then((data)=>{
        this.personList = data;
        console.log('ren',this.personList)
        this.getLeaders()
      })
    },

    selectDepart: function(item){
      this.buttonShow = true;
      this.selectDepartList.push(item);
      this.$http(this.$API.loadOrganStructure,{departmentId: item.id}, true).then((res)=>{
        if(!!!res.departments.length && !!!res.users.length){
          this.$commom.alert('无负责人和部门可选');
          this.buttonShow = false;
          return;
        }else{
          this.departmentList = res.departments;
          if(!!res.users){
            this.personList = res.users;
          }
          this.getLeaders()
        }
      })
    },

    // 查询负责人
    getLeaders: function(){
      this.checkers = this.personList;
      var checkerList = []
      if(this.checkers.length >0){
        for(var item of this.checkers){
          if(item.leader == 0){
            continue;
          }
          checkerList.push(item.name)
        }
        this.checkerList =checkerList
        this.checker = [checkerList[0]]
      }else{
        this.checkers = []
      }
    },

    // 返回上一页
    goBack: function(config){
      this.curDepartment = this.selectDepartList.pop();
      if(this.curDepartment.parentId == '-1'){
        this.buttonShow = false;
      }

      this.$http(this.$API.loadOrganStructure,{departmentId: this.curDepartment.parentId}, true).then((res)=>{
        this.departmentList = res.departments;
        if(!!res.users){
          this.personList = res.users;
        }else{
          this.personList = [];
        }
        this.getLeaders()
      })
    }
  },
}
</script>

<style lang="less" scoped>
  .chooseChecker {
    background: #22233f;
    height: 100vh;
    color: #ffffff;
    .selected {
      width: 100%;
      padding: 11px 0;
      background: #03061c;
      text-align: center;
      position: absolute;
      z-index: 99;
      top: 0;
    }
    .main {
      background: #22233f;
    }
    .operator_wrapper{
      text-align: center;
      padding: 5% 10% 10% 10%;
      color: #ffffff;
      font-size: 16px;
      button{
        width: 130px;
        height: 40px;
        border-radius: 25px;
        background-color: #456de6;
        border: none;
        color: #ffffff;
        font-size: 16px;
      }
    }
  }
  .main /deep/ .weui-cells{
      color:#fff !important;
    }

  .main /deep/ .weui-cells_checkbox{
    background-color:#22233f;
  }
   .changeDep{
        width: 40%;
        height: 50px;
        font-size: 20px;
        line-height: 50px;
        /*padding: 10px 0 0 10px;*/
        color: #ffffff;
    } 
    .main /deep/ .weui-cell_access{
      background-color: #22233f;
      height: 40px;
      font-size: 16px;
    }

    .chooseChecker /deep/ .vux-search-box{
      background-color: #22233f !important;
      position:static !important;
    }
    .chooseChecker /deep/ .weui-search-bar, .weui-search-bar_focusing{
      background-color:#22233f !important;
    }
    .chooseChecker /deep/ .weui-search-bar__cancel-btn{
      color:#fff !important;
    }
</style>
