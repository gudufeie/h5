<template>
  <div class="invent-manage">
    <div class="search-box" v-show="infoShow">
      <div class="search-input" :class="{searchType:seekText}">
        <input
          type="search"
          placeholder="选择分类查询"
          @click="inputText($event)"
          @blur="cancel"
          v-model="searchText"
          @keyup.enter="seekData"
        >
      </div>
      <div class="search-btn" v-show="seekText" @click="cancel">取消</div>
    </div>
    <div class="invent-content" v-if="infoShow">
      <ul>
        <li @click="listShow(data)" v-for="(data,index) in list" :key="index">
          <div class="invent-content-left">
            <img :src="data.imageUrl">
            <p>{{data.name}}</p>
            <p class="gray">{{data.code}}</p>
          </div>
          <div class="invent-content-right">
            <p class="invent-right-title">分类名称: {{data.catName}}</p>
            <p class="invent-right-text">{{data.description}}</p>
            <p class="invent-right-foot">
              <span class="gray">库存数量:
                <b class="white">{{data.stockNum}}</b>
              </span>
              <span class="gray">安全库存:
                <b class="white">{{data.safeNum}}</b>
              </span>
              <span class="gray">待使用:
                <b class="white">{{data.waitUse}}</b>
              </span>
            </p>
          </div>
        </li>
      </ul>
    </div>

    <div class="invent-info-list" v-else>
      <InfoList :listShow="listShow" @offShow="infoShow = true"></InfoList>
    </div>
    <IcFooter></IcFooter>
  </div>
</template>

<script>
import IcFooter from "../../common/ic-footer";
import InfoList from "./inventoryinfo";
import { Search } from "vux";
import http from "@/daos/data_report_dao";
export default {
  name: "InventoryManage",
  data() {
    return {
      keyName: null,
      infoShow: true,
      seekText: false,
      searchText: "",
      list: [],
      listCopy: []
    };
  },
  components: {
    Search,
    IcFooter,
    InfoList
  },
  watch: {},
  methods: {
    seekData() {
      this.list = [];
      if (this.searchText == "") return (this.list = this.listCopy);
      this.listCopy.map(res => {
        if (res.catName.indexOf(this.searchText) != -1) {
          this.list.push(res);
        }
      });
    },
    //部件点击
    listShow(val) {
      this.infoShow = !this.infoShow;
      if (val) {
        this.$store.commit("setRadio", val);
      } else {
        this.updateList();
      }
    },
    //搜索取消按钮
    cancel() {
      this.seekText = false;
      this.searchText = "";
    },
    //搜索点击事件
    inputText(e) {
      e.target.focus();
      this.seekText = true;
    },
    updateList() {
      var id = this.$route.query.id;
      var url = this.$API.inventItem;
      this.$http(url, { deviceId: id }, true).then(res => {
        this.list = res;
        this.listCopy = res;
      });
    }
  },
  mounted() {
    if (this.$route.query.name == "listInfo") {
      this.infoShow = false;
    }
    //列表获取
    this.updateList();
  }
};
</script>

<style scoped lang="less">
.invent-manage {
  position: relative;
  height: 100%;
}
.search-box {
  position: fixed;
  width: 100%;
  top: 0;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1c1d37;
  border-bottom: #495889 1px solid;
  z-index: 999;
  .search-input {
    width: 90%;
    height: 30px;
    input {
      width: 100%;
      background: white;
      border-radius: 3px;
      padding-left: 5px;
      height: 100%;
    }
  }
  .search-btn {
    width: 30px;
    color: #0bb00c;
    margin-left: 10px;
  }
}
.invent-content {
  margin-top: 60px;
  width: 100%;
  height: 100vh;
  padding-bottom: 52px;
  background: #1c1e37;
  color: white;
  box-sizing: border-box;
  overflow: auto;
  li {
    border-bottom: solid #3e4b75 1px;
    padding: 10px 0 10px 0;
    display: flex;
    width: 95%;
    margin: auto;
    .invent-content-left {
      img {
        width: 50px;
        height: 50px;
      }
      p {
        width: 60px;
        margin-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .invent-content-right {
      width: 100%;
      .invent-right-title {
        font-size: 14px;
      }
      .invent-right-text {
        display: -webkit-box;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-top: 8px;
      }
      .invent-right-foot {
        margin-top: 8px;
      }
    }
  }
}

.gray {
  color: #b2b9c1;
}

.white {
  color: white;
}
.invent-info-list {
  background: #1c1e37;
  height: 100vh;
  overflow: auto;
}
.searchType {
  width: 83% !important;
}
</style>
