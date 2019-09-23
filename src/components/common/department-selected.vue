<template>
  <div class="department-selected">
    <div class="header">
      <div class="header-content">
        <div @click="openPopup">{{curDepartment ? curDepartment.departmentName : '未选择'}}</div>
        <img src="../../assets/icon/toRight.png" @click="openPopup">
      </div>
      <img src="../../assets/icon/setting.png" class="exit" @click="showExit">
    </div>
    <popup v-model="show" height="94%" :show-mask="false">
      <div class="popup">
        <div class="mainBox">
          <div class="listBox" v-for="(levelItem,index) in levelList" :key="index"
               v-show="levelItem.level<=curLevel+1&&levelItem.departmentList&&levelItem.departmentList.length>0">
            <div class="title">{{levelItem.title}}</div>
            <div class="list">
              <div class="item" v-for="(item,index) in levelItem.departmentList" :key="index"
                   @click="selectDepartment(item,levelItem.level)">
                <span class="text">{{item.departmentName}}</span>
                <template v-if="levelItem.selectedDepartment&&item.id==levelItem.selectedDepartment.id">
                  <img src="../../assets/icon/selected-active.png">
                </template>
                <template v-else>
                  <img src="../../assets/icon/selected.png">
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="btn" @click="confirm()">完成</div>
        </div>
      </div>
    </popup>
    <actionsheet v-model="exitVisible" :menus="menus" style="color: #000;" @on-click-menu="clickMenu" show-cancel>
    </actionsheet>
  </div>
</template>

<script>
  import {Popup,Actionsheet} from 'vux'
  import {watch} from 'fs';
  export default {
    name: "department-selected",
    components: {
      Popup,
      Actionsheet
    },
    props: [
      'selectedDepartment'
    ],
    data(){
      return {
        //弹出层状态
        show: false,
        //一级架构
        curLevel: 0,
        rootDepartment: null,
        levelList: [
          {level: 0, title: '一级部门', departmentList: [], selectedDepartment: null},
          {level: 1, title: '二级部门', departmentList: [], selectedDepartment: null},
          {level: 2, title: '三级分支', departmentList: [], selectedDepartment: null}
        ],
        departmentMap: {},
        curDepartment: null,
        exitVisible: false,
        menus: {
          exit: '<span style="color:red;">退出</span>'
        }
      }
    },
    created: function () {
      this.loadOrgData();
    },
    methods: {
      buildDepartmentTree: function (departmentList) {
        if (!departmentList || departmentList.length <= 0) {
          return;
        }
        //找到根节点，生产部门映射表departmentMap
        for (let department of departmentList) {
          this.departmentMap[department.id] = department;
          if (department.parentId === '-1') {
            this.rootDepartment = department;
          }
        }
        for (let department of departmentList) {
          let parent = this.departmentMap[department.parentId];
          if (!parent) {
            continue;
          }
          if (!parent.departmentList) {
            parent.departmentList = [];
          }
          parent.departmentList.push(department);
        }
        this.levelList[0].departmentList = this.rootDepartment.departmentList;
      },
      initSelected: function () {
        if (!this.selectedDepartment) {
          if (this.levelList[0].departmentList.length > 0) {
            this.selectDepartment(this.levelList[0].departmentList[0], 0);
          }
          return;
        }
        let list = [];
        let curDepartment = this.selectedDepartment;
        list.unshift(this.departmentMap[curDepartment.id]);
        while (curDepartment.parentId !== '-1') {
          curDepartment = this.departmentMap[curDepartment.parentId];
          if (curDepartment.parentId === '-1') {
            break;
          }
          list.unshift(curDepartment);
        }
        for (let index = 0; index < list.length; index++) {
          this.selectDepartment(list[index], index);
        }
      },
      loadOrgData: function () {
        let that = this;
        this.$http(this.$API.listMyOrgStruct, {}, true).then((res) => {
          if (res) {
            that.buildDepartmentTree(res);
            that.initSelected();
            that.confirm();
          }
        });
      },
      //打开选择器
      openPopup: function () {
        this.show = true;
        if (!this.rootDepartment) {
          this.loadOrgData();
        }
      },
      selectDepartment: function (department, level) {
        this.curLevel = level;
        this.levelList[level].selectedDepartment = department;
        if (level + 1 >= this.levelList.length) {
          return;
        }
        if (department.parentId === '-1') {
          let departmentList = [];
          if (this.rootDepartment.departmentList) {
            for (let first of this.rootDepartment.departmentList) {
              if (!first.departmentList) {
                continue;
              }
              for (let second of first.departmentList) {
                departmentList.push(second);
              }
              this.levelList[level + 1].departmentList = departmentList;
            }
          }
          departmentList.unshift({departmentName: '全部', id: '-1'});
        } else {
          this.levelList[level + 1].departmentList = [];
          if (department.departmentList) {
            for (let item of department.departmentList) {
              this.levelList[level + 1].departmentList.push(item);
            }
          }
          this.levelList[level + 1].departmentList.unshift({departmentName: '全部', id: '-1'});
        }
      },
      confirm: function () {
        this.show = false;
        let selectedDepartment = null;
        for (let level of this.levelList) {
          if (!level.selectedDepartment || level.selectedDepartment.id === '-1') {
            continue;
          }
          selectedDepartment = level.selectedDepartment;
        }
        if (selectedDepartment) {
          selectedDepartment = JSON.parse(JSON.stringify(selectedDepartment));
          selectedDepartment.departmentList = null;
          this.curDepartment = selectedDepartment;
        }
        this.$emit('department_selected', {department: selectedDepartment});
      },
      showExit() {
        this.exitVisible = true
      },
      clickMenu(key) {
        if(key == 'exit') {
          
          this.$http(this.$API.logout, {}, true).then((res) => {
            if (res) {
              this.$router.push({path: '/login'})
            }
          });
        }
      }
    },
  }
</script>

<style lang="less" scoped>
  .department-selected {
    .header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      padding: 13px 0;
      background: #03061C;
      font-size: 16px;
      line-height: 16px;
      .header-content {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 5px;
          height: 11px;
          margin-left: 15px;
        }
      }
      .exit {
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -8px;
        margin-right: 10px;
        width: 16px;
        height: 16px;
      }
    }
    .vux-popup-dialog {
      background: #333651;
    }
    .popup {
      height: 85%;
      width:100%;
      .mainBox {
        height: 100%;
        width:100%;
        padding-bottom: 77px;
        box-sizing: border-box;
        overflow: auto;
        padding:0 14px;
        .title {
          color: #75B3FF;
          padding: 10px 0;
          border-bottom: 1px solid #444657;
          background: #333651;
        }
        .list {
          .item {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            padding: 11px 0;
            border-bottom: 1px solid #444657;
            img {
              width: 13px;
              height: 13px;
            }
          }
        }
      }
      .footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 23px 0;
        background: #333651;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .btn {
          padding: 6px 29px;
          background: #3967DC;
          border-radius: 4px;
          margin-right: 16px;
        }
      }
    }
  }
</style>
