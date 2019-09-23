<template>
  <div class="device-selected">
    <div class="header">
      <!-- <div @click="showSearch">
        <icon type="search" class="search-icon"></icon>
      </div> -->
      <div class="header-content"  @click="openPoup">
        <div class="name">{{deviceName ? deviceName: '未选择'}}</div>
      </div>
    </div>
    <popup v-model="show" height="94%">
      <div class="popup">
        <!-- <div class="search-box">
          <search
            style="position:relative;"
            placeholder="可搜索设备"
            v-model="keyName"
            @on-submit="searchByDeviceName"
            @on-clear="searchByDeviceName"
            @on-cancel="cancelSearch"
            ref="search"
          ></search>
        </div> -->
        <div class="mainBox">
          <!-- <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit"> -->
            <div class="listBox">
              <div class="title">一级部门</div>
              <div class="list" v-if="first.length > 0">
                <div
                  class="item"
                  v-for="(item,index) in first"
                  :key="index"
                  @click="changeFirst(item.id,index)"
                >
                  <span class="text">{{item.departmentName}}</span>
                  <template v-if="index == firstValue">
                    <img src="../../assets/icon/selected-active.png">
                  </template>
                  <template v-else>
                    <img src="../../assets/icon/selected.png">
                  </template>
                </div>
              </div>
            </div>
            <div class="listBox">
              <div class="title">二级部门</div>
              <div class="list" v-if="second.length > 0">
                <div
                  class="item"
                  v-for="(item,index) in second"
                  :key="index"
                  @click="changeSecond(item.id,index)"
                >
                  <span class="text">{{item.departmentName}}</span>
                  <template v-if="index == secondValue">
                    <img src="../../assets/icon/selected-active.png">
                  </template>
                  <template v-else>
                    <img src="../../assets/icon/selected.png">
                  </template>
                </div>
              </div>
            </div>
            <div class="listBox">
              <div class="title">三级分支</div>
              <div class="list" v-if="three.length > 0">
                <div
                  class="item"
                  v-for="(item,index) in three"
                  :key="index"
                  @click="changeThree(item.id,index)"
                >
                  <span class="text">{{item.departmentName}}</span>
                  <template v-if="index == threeValue">
                    <img src="../../assets/icon/selected-active.png">
                  </template>
                  <template v-else>
                    <img src="../../assets/icon/selected.png">
                  </template>
                </div>
              </div>
            </div>
            <!-- <div class="listBox">
              <div class="title">选择设备</div>
              <div class="list" v-if="deviceList.length > 0">
                <div
                  class="item"
                  v-for="(item,index) in deviceList"
                  :key="index"
                  @click="changeDevice(index)"
                >
                  <span class="text">{{item.deviceName}}</span>
                  <template v-if="index == deviceIndex">
                    <img src="../../assets/icon/selected-active.png">
                  </template>
                  <template v-else>
                    <img src="../../assets/icon/selected.png">
                  </template>
                </div>
              </div>
            </div> -->
          <!-- </mescroll-vue> -->
        </div>
        <div class="footer">
          <div class="btn" @click="clickDevice">完成</div>
        </div>
      </div>
    </popup>
    <actionsheet v-model="exitVisible" :menus="menus" style="color: #000;" @on-click-menu="clickMenu" show-cancel>
    </actionsheet>
  </div>
</template>

<script>
import { Popup,Actionsheet,Icon } from "vux";
import MescrollVue from "mescroll.js/mescroll.vue";

import { watch } from "fs";
export default {
  name: "device-selected",
  components: {
    Popup,
    MescrollVue,
    Actionsheet,
    Icon
  },
  props: [
    //机器名
    "deviceName"
  ],
  data() {
    return {
      //弹出层状态
      show: false,
      //一级架构
      first: [],
      //选中的一级index
      firstValue: 0,
      //二级架构
      second: [],
      //选中的二级index
      secondValue: 0,
      //三级架构
      three: [],
      //选中的三级index
      threeValue: 0,
      //设备列表
      deviceList: [],
      //选中的设备index
      deviceIndex: 0,
      //我的组织架构列表
      listMyOrgStruct: [],
      departmentId: null,
      exitVisible: false,
      menus: {
        exit: '<span style="color:red;">退出</span>'
      },
      keyName: null,
      historySelectedId: {
        first: 0,
        second: 0,
        third: 0
      }
    };
  },
  created: function() {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter();
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave();
    next();
  },
  methods: {
    showExit() {
      this.$router.push({name: 'homepage'})
    },
    clickMenu(key) {
      if(key == 'exit') {
        this.$http(this.$API.logout, {}, true).then((res) => {
          if (res) {
            this.$router.push({path: '/login'})
          }
        });
      }
    },
    showSearch() {
      this.$emit('showSearch')
    },
    // mescrollInit(mescroll) {
    //   this.mescroll = mescroll;
    // },
    // upCallback(page, mescroll) {
    //   let that = this;
    //   let params = {
    //     id: this.departmentId,
    //     pageNum: page.num,
    //     pageSize: page.size,
    //     name: this.keyName
    //   };
    //   this.$http(this.$API.listDevice, params, true, "", true).then(res => {
    //     // if(res){
    //     //   res.unshift({deviceName: '全部'});
    //     //   that.deviceList = res;
    //     // }
    //     if (res) {
    //       let data = res.content;
    //       if (page.num === 1) {
    //         data.unshift({ deviceName: "全部" });
    //         this.deviceList = [];
    //       }
    //       this.deviceList = this.deviceList.concat(data);
    //       this.$nextTick(() => {
    //         mescroll.endSuccess(data.length);
    //       });
    //     } else {
    //       this.mescroll.endErr();
    //     }
    //   });
    // },
    //打开选择器
    openPoup: function() {
      let that = this;

      let selectedObj = JSON.parse(localStorage.getItem('historySelected'))

      if(selectedObj) {
        that.firstValue = selectedObj.first
        that.secondValue = selectedObj.second
        that.threeValue = selectedObj.third
      } else {
        that.firstValue = that.secondValue = that.threeValue = 0
      }

      this.$http(this.$API.listMyOrgStruct, {}, true).then(res => {
        if (res) {
          that.show = true;
          let list = that.getChild(-1, res);
          that.listMyOrgStruct = list;
          that.departmentId = list[0].id;
          const firstArray = [{ departmentName: "全企业", id: list[0].id }];
          firstArray.push(...list[0].secondDepartmentList);
          that.first = firstArray;
          this.getAll();
        }
      });
    },
    //改变一级部门
    changeFirst: function(departmentId, index) {
      this.firstValue = index;
      this.secondValue = this.threeValue = 0;
      if (index != 0) {
        let secondArray = [{ departmentName: "全部", id: departmentId }];
        let threeArray = [{ departmentName: "全部", id: departmentId }];
        let list = this.first[index].secondDepartmentList;
        if (list) {
          secondArray.push(...list);
          for (var i = 0; i < list.length; i++) {
            if (!list[i].secondDepartmentList) {
              break;
            }
            threeArray.push(...list[i].secondDepartmentList);
          }
        }
        this.second = secondArray;
        this.three = threeArray;
      } else {
        this.getAll();
      }

      this.historySelectedId.first = index
      localStorage.setItem('historySelected',JSON.stringify(this.historySelectedId))

      this.departmentId = departmentId;
    },
    //改变二级部门
    changeSecond: function(departmentId, index) {
      this.secondValue = index;
      this.threeValue = 0;
      let threeArray = [{ departmentName: "全部", id: departmentId }];
      if (index != 0) {
        if (this.second[index].secondDepartmentList) {
          threeArray.push(...this.second[index].secondDepartmentList);
        }
      } else {
        if (this.second[index].secondDepartmentList) {
          threeArray.push(...list[index].secondDepartmentList);
        }
      }

      this.historySelectedId.second = index
      localStorage.setItem('historySelected',JSON.stringify(this.historySelectedId))

      this.three = threeArray;
      this.departmentId = departmentId;
    },
    //改变三级部门
    changeThree: function(departmentId, index) {
      this.historySelectedId.third = index
      localStorage.setItem('historySelected',JSON.stringify(this.historySelectedId))

      this.threeValue = index;
      this.departmentId = departmentId;
    },
    // 获取设备
    getDevice: function(departmentId){
      let that = this;
      let url = `${this.$API.listDevice}?id=${departmentId}&pageNum=${pageNum}&pageSize=${pageSize}`
      this.$http(this.$API.listDevice + '/'+ departmentId,{},true).then( (res) => {
        if(res){
          res.unshift({deviceName: '全部'});
          that.deviceList = res;
        }
      });
    },
    //改变设备index
    changeDevice: function(index) {
      this.deviceIndex = index;
    },
    //确定选择设备
    clickDevice: function() {
      this.show = false;
      console.log(this.three[this.threeValue]);
      console.log(this.second[this.secondValue]);
      console.log(this.first[this.firstValue]);
      if (this.threeValue != 0) {
        this.deviceName = this.three[this.threeValue].departmentName
        // this.$emit("departmentDetail", this.three[this.threeValue]);
      } else {
        // 如果二级分支选择了部门,保存二级部门id,如果二级分支没有选择部门，看一级
        if (this.secondValue != 0) {
          this.deviceName = this.second[this.secondValue].departmentName
          // this.$emit("departmentDetail", this.second[this.secondValue]);
        } else {
          if(this.firstValue == 0){
            this.deviceName = this.first[this.firstValue].departmentName
            // this.$emit('departmentDetail', '');
          }else{
            // this.$emit('departmentDetail', this.first[this.firstValue]);
          }
          // this.$emit("departmentDetail", this.first[this.firstValue]);
        }
      }
      // 如果三级分支选择了部门,保存三级部门id,如果三级分支没有选择部门，看二级
      // if (this.threeValue != 0) {
      //   this.$emit("departmentDetail", this.three[this.threeValue]);
      // } else {
      //   // 如果二级分支选择了部门,保存二级部门id,如果二级分支没有选择部门，看一级
      //   if (this.secondValue != 0) {
      //     this.$emit("departmentDetail", this.second[this.secondValue]);
      //   } else {
      //     if(this.firstValue == 0){
      //       this.$emit('departmentDetail', '');
      //     }else{
      //       this.$emit('departmentDetail', this.first[this.firstValue]);
      //     }
      //     this.$emit("departmentDetail", this.first[this.firstValue]);
      //   }
      // }
    },
    //根据父集id查list
    getChild: function(parentId, list) {
      let array = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].parentId == parentId) {
          let array2 = this.getChild(list[i].id, list);
          if (array2.length > 0) {
            list[i].secondDepartmentList = array2;
          }
          array.push(list[i]);
        }
      }
      return array;
    },
    //获取所有二级三级部门
    getAll: function() {
      let secondList = this.listMyOrgStruct[0].secondDepartmentList;
      let secondArray = [
        { departmentName: "全部", id: this.listMyOrgStruct[0].id }
      ];
      let threeArray = [
        { departmentName: "全部", id: this.listMyOrgStruct[0].id }
      ];
      for (var i = 0; i < secondList.length; i++) {
        if (!secondList[i].secondDepartmentList) {
          break;
        }
        secondArray.push(...secondList[i].secondDepartmentList);
        for (var j = 0; j < secondList[i].secondDepartmentList.length; j++) {
          if (!secondList[i].secondDepartmentList[j].secondDepartmentList) {
            break;
          }
          threeArray.push(
            ...secondList[i].secondDepartmentList[j].secondDepartmentList
          );
        }
      }
      this.second = secondArray;
      this.three = threeArray;
    },
    // search device's name
    // searchByDeviceName() {
    //   this.threeValue = 0
    //   this.$refs.search.setBlur()
    //   this.mescroll.resetUpScroll()
    // },
    // //cancel search
    // cancelSearch() {
    //   this.keyName = ''
    //   this.mescroll.resetUpScroll()
    // }
  }
};
</script>

<style lang="less" scoped>
.device-selected {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    /*z-index: 99;*/
    width: 40%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #22233f;
    font-size: 20px;
    line-height: 50px;
    /*z-index: 1000;*/
    .header-content {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 20px;
        height: 11px;
        margin-left: 15px;
      }
    }
    .search-icon {
      position: absolute;
      top: 50%;
      left: 10px;
      margin-top: -6px;
      font-size: 16px;
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
    .name {
      font-size: 16px;
      max-width: 200px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    // img {
    //   width: 5px;
    //   height: 11px;
    //   margin-left: 15px;
    // }
  }
  .vux-popup-dialog {
    background: #333651;
  }
  .popup {
    height: 100%;
    .search-box {
      position: fixed;
      top: 40px;
      width: 100%;
      background-color: #333651;
      z-index: 999;
      /deep/ .vux-search-box {
        .weui-search-bar {
          background-color: #333651;
          .weui-search-bar__form {
            height: 30px;
            border-radius: 3px;
            line-height: 30px;
          }
        }
      }
    }
    .mainBox {
      height: auto;
      padding-bottom: 77px;
      box-sizing: border-box;
      margin: 0 14px;
      .title {
        color: #75b3ff;
        padding: 10px 0;
        border-bottom: 1px solid #444657;
        background: #333651;
      }
      /*以fixed的方式固定mescroll的高度*/
      // .mescroll {
      //   position: fixed;
      //   top: 42px;
      //   bottom: 46px;
      //   height: auto;
      // }
      .list {
        width: 100%;
        .item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          padding: 11px 0;
          border-bottom: 1px solid #444657;
          span {
            display: inline-block;
            width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
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
        background: #3967dc;
        border-radius: 4px;
        margin-right: 16px;
      }
    }
  }
}
</style>
