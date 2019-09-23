<template>
  <div class="device-selected">
    <div class="header">
      <div class="header-content"  @click="openPoup">
        <div class="name">
          {{deviceName ? deviceName: '未选择'}}
          <img style="margin-left: 5px" src="../../assets/icon/down.png" alt="">
        </div>
      </div>
    </div>
    <popup v-model="show">
      <div class="popupDevice">
        <div class="mainBoxDevice">
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
            <div class="listBox">
               <button class="btn" type="btn" @click="clickDevice">完成 </button>
            </div>
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

// import { watch } from "fs";
export default {
  name: "device-selected",
  components: {
    Popup,
    MescrollVue,
    Actionsheet,
    Icon
  },
  props:{
    options:{
      type: Object
    }
  },
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
      departmentInfo:{},
      menus: {
        exit: '<span style="color:red;">退出</span>'
      },
      keyName: null,
      historySelectedId: {
        first: 0,
        second: 0,
        third: 0
      },
      deviceName:'全企业'
    };
  },
  watch:{
    options: function(){ 
      this.departmentInfo = this.options.departmentInfo
      this.deviceName = this.departmentInfo.departmentName
    },
  },
  created: function() {
  },
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

      if(that.first.length > 0){
        that.show = true;
        if(this.three.length == 0){
          this.changeFirst(this.departmentId,that.firstValue)
          // this.getAll();
        }
      }else{
        this.$http(this.$API.listMyOrgStruct, {}, true).then(res => {
        if (res) {
          that.show = true;
          let list = that.getChild(-1, res);
          that.listMyOrgStruct = list;
          that.departmentId = list[0].id;
          const firstArray = [{ departmentName: "全企业", id: list[0].id }];
          firstArray.push(...list[0].secondDepartmentList);
          that.first = firstArray;
          this.changeFirst(this.departmentId,that.firstValue)
          that.secondValue = selectedObj.second
          this.changeSecond(this.departmentId,that.secondValue)
          that.threeValue = selectedObj.third
          // this.getAll();
          }
        });
      }
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
    //改变设备index
    changeDevice: function(index) {
      this.deviceIndex = index;
    },
    //确定选择设备
    clickDevice: function() {
      this.show = false;
      if (this.threeValue != 0) {
        this.$emit("departmentDetail", this.three[this.threeValue]);
        this.deviceName = this.three[this.threeValue].departmentName;
      } else {
        // 如果二级分支选择了部门,保存二级部门id,如果二级分支没有选择部门，看一级
        if (this.secondValue != 0) {
          this.$emit("departmentDetail", this.second[this.secondValue]);
          this.deviceName = this.second[this.secondValue].departmentName;
        } else {
          if(this.firstValue == 0){
            this.$emit('departmentDetail', this.first[this.firstValue]);
            this.deviceName = this.first[this.firstValue].departmentName;
          }else{
            this.$emit('departmentDetail', this.first[this.firstValue]);
            this.deviceName = this.first[this.firstValue].departmentName;
          }
          this.$emit("departmentDetail", this.first[this.firstValue]);
          this.deviceName = this.first[this.firstValue].departmentName;
        }
      }
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
  }
};
</script>

<style lang="less" scoped>
  .header {
     border-bottom: unset !important;
  }
  .device-selected{
    .header-content {
      font-size: 14px;
      img {
        width: 20px;
        height: 11px;
        margin-left: 15px;
      }
    }
  }

  .deivceTop .vux-popup-dialog{
    height: 45% !important;
    top: 50px;
    bottom: unset!important;
    background: #22233f!important;
    font-size: 14px;
    .popupDevice{
      width: 100%;
      .mainBoxDevice{
        width: 100%;
        display: block;
        .list {
          .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1rem;
            img {
              width: 13px;
              height: 13px;
              float: right;
            }
          }
        }
        .listBox:last-child{
          display: block;
          text-align: right;
          padding: 30px;
          .btn{
            padding: 6px 18px;
            border-radius: 4px;
            border: navy;
            background-color: #3967DC;
            color: #fff;
          }
        }
      }
    }
  }
</style>
