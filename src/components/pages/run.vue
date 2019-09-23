<template>
  <div class="run">
    <device-selected v-on:deviceDetail="handleDeviceDetail" v-on:departmentDetail='handleDepartment' @showSearch="showSearch" :deviceName="departmentDetail ? departmentDetail.departmentName : '未选择'"></device-selected>
    <div class="search-box" v-if="searchShow">
      <search
        position="absolute"
        auto-scroll-to-top
        ref="search"
        v-if="searchShow"
        @on-submit="searchByDeviceName"
        @on-cancel="cancelSearch"></search>
    </div>

    <div :class="{'thead': true, 't-40': !searchShow, 't-86': searchShow}">
      <div class="name">设备名称</div>
      <div class="code">设备编号</div>
      <div class="item">运行状态</div>
      <div class="item">异常状态</div>
      <!-- <div class="item">巡检</div> -->
    </div>
    <mescroll-vue :class="{'t-80': !searchShow, 't-120': searchShow}" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <ul class="device-list">
        <li
          v-for="(item,index) in deviceList"
          :key="index"
          @click="handleDeviceDetail(item)"
          class="device-item"
        >
          <span class="name">{{item.deviceName}}</span>
          <span class="code">{{item.code}}</span>
          <span class="value">{{item.run == 1 ? '运行' : item.run == 0 ? '停止' : ''}}</span>
          <span class="value">{{item.status == 1 ? '正常' : item.status == 0 ? '故障': item.status == 2 ? '停用' : ''}}</span>
          <!-- <span :class="{'cyan': item.checkStatus === 0,'danger': item.checkStatus === 1}">{{item.checkStatus === 0?'不需':'需要'}}</span> -->
        </li>
      </ul>
      <!-- <p style="text-align: center;margin-top: 10px;color: #ddd;" v-show="haveMore">下拉加载更多...</p> -->
    </mescroll-vue>
    <div class="footer"><div class="checkHistoryBtn" @click="toCheckHistory">查看巡检记录</div></div>
    <ic-footer></ic-footer>
  </div>
</template>

<script>
  import IcFooter from "../common/ic-footer"
  import DeviceSelected from "../common/device-selected"
  import dataReportDao from "@/daos/data_report_dao.js"
  import MescrollVue from "mescroll.js/mescroll.vue"
  import { Search } from 'vux'

  export default {
    components: {
      IcFooter,
      DeviceSelected,
      MescrollVue,
      Search
    },
    name: "run",
    data() {
      return {
        deviceList: null,
        departmentDetail: null,
        curId: null,
        haveMore: true,
        mescroll: null,
        mescrollDown: {},
        mescrollUp: {
          that: this,
          callback: this.upCallback,
          page: {
            num: 0,
            size: 20
          },
          htmlNodata: '<p class="upwarp-nodata">-- 暂无更多的数据 --</p>',
          noMoreSize: 5,
          toTop: {
            src: "./static/mescroll-totop.png",
            offset: 1000
          }
        },
        searchShow: false
      }
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
      mescrollInit(mescroll) {
        this.mescroll = mescroll;
      },
      upCallback(page, mescroll) {
        let params = {
          id: this.curId,
          name: this.keyName,
          pageNum: page.num,
          pageSize: page.size
        };
        this.$http(this.$API.listMyDevice, params, true, "", true).then(res => {
          if (res) {
            let data = res.content;
            if (page.num === 1) {
              this.deviceList = [];
            }
            this.deviceList = this.deviceList.concat(data);
            this.$nextTick(() => {
              mescroll.endSuccess(data.length);
            });
          } else {
            this.mescroll.endErr();
          }
        });
      },
      toCheckHistory: function(){
        this.$store.commit('checkId',this.curId);
        this.$router.push({ name : 'myDevice' });
      },
      handleDeviceDetail: function(deviceDetail){
        this.$store.commit('changeDeviceMessage',deviceDetail);
        this.$router.push({ name : 'deviceDetailRun'});
      },
      handleDepartment: function(departmentDetail){
        sessionStorage.setItem("produce_department", JSON.stringify(departmentDetail));
        this.curId = departmentDetail.id
        this.deviceList = []
        this.departmentDetail = departmentDetail;
        if (departmentDetail.id != 387) {
          this.curId = departmentDetail.id;
        } else {
          this.curId = "";
        }

        if(this.mescroll) {
          this.mescroll.resetUpScroll();
        }
      },
      showSearch() {
        this.searchShow = !this.searchShow
      },
      cancelSearch() {
        this.searchShow = false
      },
      searchByDeviceName() {
        this.mescroll.resetUpScroll();
      }
    },
    created() {
      let strCurrentDepartment = sessionStorage.getItem("produce_department");
      if (strCurrentDepartment) {
        this.handleDepartment(JSON.parse(strCurrentDepartment));
      }
    }
	}
</script>

<style lang="less" scoped>
  .run{
    height: 100vh;
    background: #1C1F37;
    color: #FFFFFF;
    .search-box {
      position: fixed;
      width: 100%;
      top: 42px;
      z-index: 100;
      /deep/ .weui-search-bar {
        background-color: #1C1F37;
      }
    }
    .t-40 {
      top: 40px;
    }
    .t-80 {
      top: 80px;
    }
    .t-86 {
      top: 86px;
    }
    .t-120 {
      top: 120px;
    }
    .thead{
      position: fixed;
      z-index: 99;
      display: flex;
      justify-content: space-around;
      width: 100%;
      padding: 10px 0;
      background: #1C1F37;
      border-bottom: 1px solid #495889;
      color: #6B6F8E;
      .name{
        width: 110px;
        padding-left: 6px;
      }
      .code{
        width: 79px;
      }
      .item{
        width: 60px;
        text-align: center;
      }
    }
    /*以fixed的方式固定mescroll的高度*/
    .mescroll {
      position: fixed;
      bottom: 130px;
      height: auto;
    }
    .device-item {
      padding: 11px 0;
      border-bottom: 1px solid #323444;
      display: flex;
      justify-content: space-around;
      font-size: 12px;
      color: #ddd;
      .name,.code{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .name{
        padding-left: 6px;
        width: 110px;
      }
      .code{
        width: 79px;
      }
      .value{
        width: 60px;
        text-align: center;
      }
      .danger {
        color: red;
      }
      .cyan {
        color: #00FF00;
      }
    }
    .footer{
      width: 100%;
      padding: 16px 0;
      position: fixed;
      bottom: 51px;
      background: #1C1F37;
      .checkHistoryBtn{
        margin: 0 40px;
        padding: 12px 0;
        font-size: 16px;
        color: #FFFFFF;
        text-align: center;
        background: #3967DC;
        border-radius: 4px;
      }
    }
  }
</style>
