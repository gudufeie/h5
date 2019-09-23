<template>
  <div class="invent-info">
    <div class="invent-info-top contentWidth">
      <p>入库说明</p>
      <input
        type="text"
        placeholder="请输入入库说明"
        class="invent-input-msg"
        v-model="subData.value"
        style="padding-left: 5px;"
      >
      <p>入库数量</p>
      <input
        type="number"
        placeholder="输入入库数量"
        class="invent-input-num"
        v-model="subData.num"
        style="padding-left: 5px;height:30px;"
      >
      <div class="invent-style">
        <div class="invent-style-text" @click="selectBtn">
          <span>{{typeMsg}}</span>
          <span class="invent-style-ico" :class="selectShow?'onSelect':'offSelect'"></span>
        </div>
        <div :class="{'invent-info-select':selectShow}" v-show="selectShow">
          <selectInfo
            :data="inventTypeList"
            :statu="statu"
            @typeText="typeText"
            @exit="exit"
            @next="next"
            :nextText="nextText"
            v-show="ss"
          ></selectInfo>
        </div>
      </div>
    </div>
    <div class="hx"></div>
    <div class="invent-info-bottom contentWidth">
      <div class="invent-info-bottom-head">
        <img :src="data.imageUrl" v-show="data.imageUrl">
        <div class="invent-info-bottom-head-right">
          <p>部件名称: &nbsp;{{list.name}}</p>
          <p>部件编号: &nbsp;{{list.code}}</p>
          <p :class="{'redText':list.stockNum<=list.safeNum}">库存数量: &nbsp;{{list.stockNum}}</p>
          <p>安全库存: &nbsp;{{list.safeNum}}</p>
          <p>待使用: &nbsp;{{list.waitUse}}</p>
        </div>
      </div>
      <div class="invent-info-bottom-middle">
        <p>分类名称:&nbsp; {{list.catName}}</p>
        <p>{{list.description}}</p>
      </div>
      <div class="invent-info-bottom-btn">
        <button class="exit" @click="quit">取消</button>
        <button class="sure" @click="subInvent">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import selectInfo from "./inventorySelect";
import http from "@/daos/data_report_dao";
import { Toast } from "vux";
import axios from "axios";
import host from "@/config/host";
export default {
  name: "InventoryInfo",
  data() {
    return {
      selectShow: false,
      statu: 0,
      data: {},
      list: {},
      typeMsg: "请选择规格",
      subData: {
        num: null,
        value: ""
      },
      typeValue: [],
      nextText: [],
      inventTypeList: [],
      ss: true
    };
  },
  components: {
    selectInfo,
    Toast
  },
  props: ["listShow"],
  watch: {},
  computed: {},
  methods: {
    exit() {
      this.selectShow = false;
      this.nextText = [];
    },
    next(res) {
      this.ss = false;
      this.ss = true;
      this.nextText = res;
    },
    //保存
    subInvent() {
      if (!this.subData.num)
        return this.$vux.toast.show({ text: "请输入数量", type: "warn" });
      if (this.typeValue.length == 0)
        return this.$vux.toast.show({ text: "请选择规格", type: "warn" });
      var self = this;
      var i = this.typeValue.length - 1;
      var stoId = this.typeValue[i];
      var data = {
        componentId: this.data.id,
        operateType: 1,
        operateNum: this.subData.num,
        stockCatId: stoId.id,
        remark: this.subData.value
      };
      this.$http(this.$API.saveStockOperator, data, true).then(res => {
        if (res) {
          this.$vux.toast.show({
            text: "保存成功",
            type: "onHide"
          });
          this.quit();
        }
      });
      // http.inventSave(data, res => {
      //   if (res.repertory) {
      //     this.$vux.toast.show({
      //       text: "保存成功",
      //       type: "onHide"
      //     });
      //     this.quit();
      //   }
      // });
    },
    //选择规格
    selectBtn() {
      if (this.selectShow) {
        this.selectShow = false;
        this.nextText = [];
      } else {
        this.selectShow = true;
        this.statu++;
        this.typeMsg = "请选择规格";
        this.typeValue = [];
      }
    },
    //规格显示
    typeText(val) {
      this.typeValue = val;
      if (this.typeMsg == "请选择规格") {
        this.typeMsg = "";
      }
      var list = "";
      val.map(res => {
        list = res.catName + "/";
      });
      this.typeMsg += list;
    },
    //获取详情
    getList(val) {
      this.$http(this.$API.inventDetail + `?id=${val.id}`, {}, true).then(
        res => {
          this.list = res;
        }
      );
    },
    //取消
    quit() {
      if (this.$route.query.name == "listInfo") {
        window.history.back();
      } else {
        this.listShow("");
      }
    }
  },
  created() {
    this.data = this.$store.state.radioObj;
    this.getList(this.data);
	//规格获取
	this.$http(`${this.$API.getCategoryList}?parentId=${0}`,{},true).then(res => {
		this.inventTypeList = res;
	})
  }
};
</script>

<style scoped lang="less">
.invent-info {
  color: white;
  margin: auto;
  padding: 10px 0 52px 0;
}
.contentWidth {
  width: 95%;
  margin: auto;
}
.invent-info-top {
  margin-top: 20px;
  p {
    margin: 8px 0 8px 0;
  }
  .invent-style {
    position: relative;
    .invent-style-text {
      height: 30px;
      background: white;
      padding-left: 5px;
      border-radius: 3px;
      margin-top: 10px;
      color: #495889;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .invent-style-ico {
        display: inline-block;
        width: 15px;
        height: 15px;
        background: url(../../../assets/icon/pulldown.png);
        background-size: 100% 100%;
        margin-right: 10px;
      }
      .onSelect {
        animation: onsel 0.3s;
        transform: rotate(180deg);
      }
      .offSelect {
        animation: offsel 0.3s;
      }
      @keyframes offsel {
        from {
          transform: rotate(-180deg);
        }
        to {
          transform: rotate(0);
        }
      }
      @keyframes onsel {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(-180deg);
        }
      }
    }
  }
  input {
    width: 100%;
    border-radius: 3px;
    background: white;
  }
  .invent-input-msg {
    box-sizing: border-box;
    padding: 5px 0 90px 0;
  }
  .invent-input-num {
    box-sizing: border-box;
    height: 23px;
  }
}
.invent-info-bottom-head {
  display: flex;
  border-bottom: 1px solid #585860;
  padding-bottom: 10px;
  margin-bottom: 5px;
  img {
	width: 100px;
	height: 100px;
    margin-right: 10px;
  }
  .invent-info-bottom-head-right {
    p {
      padding-top: 3px;
    }
  }
}
.hx {
  height: 6px;
  width: 100%;
  background: #333;
  margin: 10px 0 10px 0;
}
.invent-info-bottom-middle > p {
  padding-bottom: 10px;
}
.invent-info-bottom-btn {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .exit {
    border: 1px solid white;
    background: transparent;
  }
  .sure {
    background: #169bd5;
    border: 0;
  }
  button {
    width: 45%;
    height: 45px;
    border-radius: 3px;
    color: white;
  }
}
.invent-info-select {
  position: absolute;
  top: 35px;
  left: 0;
  background: white;
  width: 100%;
  color: black;
  overflow-y: auto;
  box-shadow: 0 0px 1px #e6e6e6;
  animation: sss 0.2s ease;
  height: 150px;
  border-radius: 2px;
}

@keyframes sss {
  from {
    height: 0;
  }
  to {
    height: 150px;
  }
}
.redText {
  color: red;
}
</style>