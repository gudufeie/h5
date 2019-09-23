<template>
  <div class="orderProcess">
    <div v-show="mainPageShow">
      <div class="step1">
        <span class="myicon">* </span>
        <span>工单处理</span>
        <span @click="showVuePopup(true)">{{selectValue}}&ensp;
          <font-awesome-icon
            :icon="['fa','chevron-right']"
            size="lg"
          />
        </span>
      </div>
      <div class="line"></div>
      <div class="step2" v-if="isDisplay === true">
        <span class="myicon">* </span>
        <span>{{selectCategory}}</span>
        <span
          class="step2Span"
          @click="showVuePopup3(true)"
        >{{categoryValue}}&ensp;
          <font-awesome-icon
            :icon="['fa','chevron-right']"
            size="lg"
          />
        </span>
        <div class="line"></div>
      </div>
      <div class="step3">
        <div class="step3-1"><span class="myicon">* </span><span>描述</span></div>
        <div class="step3-2">
          <textarea
            placeholder="请输入描述"
            v-model="description"
          ></textarea>
        </div>
      </div>
      <div class="submitBtn">
        <button
          type="button"
          @click="submitWorkSheet"
        >提交</button>
      </div>
    </div>
    <div class="vue-popup">
      <!-- <div class="mask" v-show="show2" style="cursor:pointer" @click="showVuePopup(false)"></div> -->
      <transition name="slide">
        <div
          class="popup-content"
          v-show="show2"
        >
          <div>
            <group>
              <radio
                :options="processType"
                @on-change="change"
                style="background-color: #323465;color: #fff"
              ></radio>
            </group>
          </div>
          <div class="popup-bottom">
            <button
              type="button"
              @click="showVuePopup(false)"
            >保存</button>
          </div>
        </div>
      </transition>
    </div>

    <div class="vue-popup">
      <!-- <div class="mask" v-show="show3" style="cursor:pointer" @click="showVuePopup3(false)"></div> -->
      <transition name="slide">
        <div
          class="popup-content"
          v-show="show3"
        >
          <div>
            <group style="margin-top: 0">
              <radio
                :options="personlist"
                v-model="categoryValue"
                style="background-color: #323465;color: #fff;height: 200px;overflow: scroll;"
              ></radio>
            </group>
          </div>
          <div class="popup-bottom">
            <button
              type="button"
              @click="showVuePopup3(false)"
            >保存</button>
          </div>
        </div>
      </transition>
    </div>
    <div>
        <choose-checker :options="checkersOptions" v-show="chooseCheckerShow" @getCharger="chooseCharger"></choose-checker>
    </div>
    <shortcut-menu></shortcut-menu>
  </div>

</template>

<script>
import { XHeader, Radio, Group, Flexbox, FlexboxItem, PopupRadio } from "vux";
import ShortcutMenu from "../../components/common/shortcut_menu.vue";
import ChooseChecker from "../pages/chooseChecker.vue";

export default {
  components: {
    Radio,
    Group,
    Flexbox,
    FlexboxItem,
    "shortcut-menu": ShortcutMenu,
    PopupRadio,
    ChooseChecker
  },
  data() {
    return {
      isDisplay: false,
      show2: false,
      show3: false,
      show4: false,
      selectValue: "解决",
      selectCategory: "",
      categoryValue: "",
      personlist: [],
      processType: ["解决", "上报", "驳回", "转办"],
      auditor: [],
      transferer: [],
      workSheetInfo: {},
      departmentId: "",
      reporterList: [],
      transferList: [],
      handleType: 3,
      selectPerson: "",
      description: "",
      userInfo: {},
      checkersOptions:{},
      chooseCheckerShow:false,
      mainPageShow:true,
      leader:''
    };
  },
  methods: {
    getUser: function() {
      this.$http(this.$API.getUserInfo, {}, true).then(user => {
        this.userInfo = user;
      });
    },
    showVuePopup(flag) {
      console.log("处理类型");
      this.show2 = flag;
    },
    showVuePopup3(flag) {
      // this.show3 = flag;
      // if (this.selectValue === "上报") {
      //   this.personlist = this.auditor;
      // } else if (this.selectValue === "转办") {
      //   this.personlist = this.transferer;
      // }
      this.chooseCheckerShow = true;
        this.mainPageShow = false;
        this.checkersOptions = {
            checkers:this.checkers
        }
    },
    showVuePopup4(flag) {
      this.show4 = flag;
    },
    change(value, label) {
      this.selectValue = value;
      if (value === "上报") {
        this.handleType = 1;
        this.selectCategory = "选择审核人";
        this.categoryValue = this.auditor[0];
        this.isDisplay = true;
      } else if (value === "转办") {
        this.handleType = 2;
        this.selectCategory = "选择转办人";
        this.categoryValue = this.transferer[0];
        this.isDisplay = true;
      } else if (value === "解决") {
        this.isDisplay = false;
        this.handleType = 3;
      } else {
        this.isDisplay = false;
        this.handleType = 4;
      }
    },
    // change3(value, label) {
    //   this.selectPerson = value;
    // },
    getWorkSheet: function() {
      this.workSheetInfo = this.$route.query.workSheet;
      this.departmentId = this.workSheetInfo.department_id;
      this.loadTransfer();
    },

    // 获取上报人
    loadReporters: function() {
      this.$http(this.$API.getLeader, {}, true).then(data => {
        if (data) {
          this.reporterList = data;
          for (var report of data) {
            this.auditor.push(report.name);
          }
          this.selectPerson = this.auditor[0];
        } else {
          this.auditor = [];
        }
      });
    },

    // 获取转办人
    loadTransfer: function() {
      this.$http(
        this.$API.loadTransferees,
        { departmentId: this.departmentId },
        true
      ).then(data => {
        if (data) {
          this.transferList = data;
          for (var item of data) {
            this.transferer.push(item.name);
          }
          this.selectPerson = this.transferer[0];
        } else {
          this.transferer = [];
        }
      });
    },

    submitWorkSheet: function() {
      this.selectPerson = this.categoryValue;
      if (!this.description) {
        this.$commom.alert("请填写描述");
        return;
      }
      var operator = "";
      if (this.handleType == 1) {
        if (!this.selectPerson || this.selectPerson == "请选择") {
          this.$commom.alert("请选择上报人");
          return;
        }
        operator = this.leader;
      } else if (this.handleType == 2) {
        if (!this.selectPerson || this.selectPerson == "请选择") {
          this.$commom.alert("请选择转办人");
          return;
        }
        operator = this.leader;
      } else {
        operator = this.userInfo.id;
      }
      var params = {
        workSheetId: this.workSheetInfo.id,
        handleType: this.handleType,
        operator: operator,
        description: this.description
      };
      let that = this;
      this.$http(this.$API.addWorkSheetRecord, params, true).then(data => {
        if (data) {
          this.$commom.alert("添加成功");
          if (this.handleType == 1 || this.handleType == 2) {
            this.$router.push({
              name: "historyWorkOrder",
              query: {
                page: "unprocessed"
              }
            });
          } else {
            this.$router.push({
              name: "historyWorkOrder",
              query: {
                page: "unprocessed"
              }
            });
          }
        }
      });
    },

    chooseCharger: function(chargeId,checkerName){
      this.leader = chargeId;
      this.categoryValue = checkerName;
      this.mainPageShow = true;
      this.chooseCheckerShow =false;
    }
  },
  created: function() {
    this.getWorkSheet();
    this.loadReporters();
    this.getUser();
  }
};
</script>

<style lang="less" scoped>
* {
  touch-action: none;
}
.orderProcess {
  background: #22233f;
  height: 100%;
  width: 100%;
  position: absolute;
}

.step1,
.step2,
.step3-1 {
  height: 80px;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  line-height: 80px;
  padding: 0 4%;
}
.step1 span:last-child,
.step2Span {
  float: right;
  color: #ddd;
}
.line {
  width: 92%;
  margin: 0 4%;
  border-bottom: 1px solid #737373;
}
.in-line {
  width: 100%;
  margin: 0;
}
.myicon {
  color: #c11920;
}
.step3-2 {
  text-align: center;
}
.step3-2 textarea {
  height: 120px;
  width: 90%;
  border-radius: 8px;
  border: 1px solid #737373;
  background: #22233f;
  text-align: left;
  color: #fff;
  padding: 8px;
}
.submitBtn {
  text-align: center;
  margin-top: 50px;
}
.submitBtn button {
  height: 45px;
  width: 90%;
  border-radius: 20px;
  background: transparent;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  border: 1px solid #456de6;
}

.vue-popup {
  .popup-content {
    position: absolute;
    height: 280px;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #323465;
    -webkit-transition: all 0.2s ease-in;
    transition: all 0.2s ease-in;
    z-index: 888;
    .popup-bottom {
      text-align: center;
      height: 60px;
      line-height: 50px;
      font-size: 18px;
      color: #fff;
      /*border-top: 1px solid #737373;*/
      position: absolute;
      width: 100%;
      bottom: 0;
      button {
        height: 40px;
        width: 70%;
        border-radius: 20px;
        background-color: #456de6;
        color: #fff;
        border: none;
      }
    }
  }
}
.popup-content > div > div.weui-cells,
.popup-content > div > div.vux-no-group-title {
  margin-top: 0 !important;
}
.weui-cells.vux-no-group-title::after {
  border: none !important;
}
.mask {
  position: fixed;
  width: 70%;
  left: 56px;
  bottom: 15px;
  border-radius: 20px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0);
  transition: all 0.2s ease-in;
  z-index: 999;
  margin-bottom: 0;
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

.bottomBtn {
  width: fit-content;
  border: 1px solid #ddd;
  padding: 6px 15px;
  position: fixed;
  bottom: 10px;
  left: 10px;
  border-radius: 15px;
  background: #22233f;
}
.bottomBtn button {
  border: none;
  background: #22233f;
  color: #fff;
}
.bottomBtn span {
  color: #fff;
  margin: 0 8px;
}

.flex-demo {
  text-align: center;
  color: #fff;
  background-color: #323465;
  border-radius: 4px;
  background-clip: padding-box;
  height: 125px;
  /*line-height: 125px;*/
  img {
    width: 40px;
    height: 40px;
    margin-bottom: 5px;
  }
  .lineImg1 {
    margin-top: 35px;
  }
  .lineImg2 {
    margin-top: 20px;
  }
}

.vue-popup4 {
  .popup-content {
    position: absolute;
    height: 350px;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #323465;
    -webkit-transition: all 0.2s ease-in;
    transition: all 0.2s ease-in;
    z-index: 888;
    .popup-title {
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      color: #fff;
      border-bottom: 1px solid #737373;
    }
    .popup-body {
      height: 250px;
    }
    .popup-bottom {
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
  }
}
.mask2 {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  height: 50px;
  /*top: 0;*/
  /*height: 100%;*/
  background-color: rgba(0, 0, 0, 0);
  transition: all 0.2s ease-in;
  z-index: 999;
}
</style>
