<template>
  <div class="myDevice">
    <device-selected v-on:deviceDetail="handleDeviceDetail"  v-on:departmentDetail='handleDepartment' :deviceName="departmentDetail ? departmentDetail.departmentName : '未选择'"></device-selected>
    <div class="thead">
      <div class="item name">设备名称</div>
      <div class="item time" @click="sortTime">添加时间
        <span class="caret-wrapper">
          <i class="sort-caret ascending" :class="{checkColor: sortStatus !== 1}"></i>
          <i class="sort-caret descending" :class="{checkColor: sortStatus === 1}"></i>
        </span>
      </div>
      <div class="item value" @click="show = true">巡检结果 <img src="../../assets/icon/down.png" class="down"></div>
    </div>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <ul class="tbody">
        <li class="item" v-for=" (item, index) in checkList " :key="index" @click="handleDeviceDetail(item)">
          <span class="name">{{item.deviceName}}</span>
          <span class="time">{{item.time}}</span>
          <span class="value">{{item.checkStatus == 1 ? '正常' : '异常'}}</span>
        </li>
      </ul>
    </mescroll-vue>
    <actionsheet v-model="show" :menus="menus" @on-click-menu="click"></actionsheet>
  </div>
</template>

<script>
  import DeviceSelected from "../common/device-selected"
  import { Actionsheet } from 'vux'
  import MescrollVue from "mescroll.js/mescroll.vue"

  export default {
    components: {
      Actionsheet,
      DeviceSelected,
      MescrollVue
    },
    name: "myDevice",
    data() {
      return {
        checkList: [],
        show: false,
        menus: ['全部','正常','异常'],
        sortStatus: 1,
        key: 0,
        mescroll: null,
        mescrollDown: {},
        departmentDetail:null,
        mescrollUp: {
          callback: this.upCallback,
          page: {
            num: 0,
            size: 10
          },
          htmlNodata: '<p class="upwarp-nodata">-- 暂无更多的数据 --</p>',
          noMoreSize: 5,
          toTop: {
            src: "./static/mescroll-totop.png",
            offset: 1000
          }
        },
       isCurId:''

      }
    },
    methods: {
      mescrollInit(mescroll) {
        this.mescroll = mescroll;
      },
      upCallback(page, mescroll) {
        //status '': 全部 1: 正常 0: 异常
        let status

        if(this.key == 0){
          status = ''
        }else if(this.key == 1){
          status = 1
        }else{
          status = 0
        }
        let departmentId =''
        // if(this.isCurId){
        //   departmentId=this.isCurId
        // }else{
        //   departmentId = this.curId
        // }
        if(this.curId==null){
         const url = `${this.$API.listMyCheckRecord}?checkResult=${status}&selectTime=${this.sortStatus}&pageNum=${page.num}&pageSize=${page.size}`
        }else{
           departmentId=this.curId
           const url = `${this.$API.listMyCheckRecord}?checkResult=${status}&selectTime=${this.sortStatus}&pageNum=${page.num}&pageSize=${page.size}&departmentId=${departmentId}`
        }
        this.$http(url, {}, true, "", true).then(res => {
          if (res) {
            let data = res;
            if (page.num === 1) {
              this.checkList = [];
            }
            this.checkList = this.checkList.concat(data);
            this.$nextTick(() => {
              mescroll.endSuccess(data.length);
            });
          } else {
            this.mescroll.endErr();
          }
        });
      },
      click( key ){
        this.key = key
        this.mescroll.resetUpScroll();
      },
      handleDeviceDetail: function(deviceDetail){
        this.$store.commit('saveDetail',deviceDetail);
        this.$router.push({name: 'checkHistoryDetail'});
      },
      //1降序 默认不传就升序或者传其他都是升序
      sortTime() {
        this.sortStatus = this.sortStatus === 1?0:1
        this.mescroll.resetUpScroll();
      },
      handleDepartment: function(departmentDetail){
        this.isCurId = departmentDetail.id
        // this.departmentDetail=departmentDetail
        // this.mescroll.resetUpScroll();
      },
    },
    computed: {
      curId () {
        //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
              if(!this.$store.state.curId){
                  this.$store.commit('checkId',JSON.parse(localStorage.getItem('curId')));
              }
        return this.$store.state.curId;
      },
    },
	}
</script>

<style lang="less" scoped>
  .myDevice{
    color: #ffffff;
    background: #1C1F37;
    height: 100vh;
    .selected{
      width: 100%;
      padding: 11px 0;
      background: #03061C;
      text-align: center;
      position: fixed;
      z-index: 99;
    }
    .thead{
      position: fixed;
      top: 39px;
      z-index: 99;
      display: flex;
      width: 100%;
      padding: 10px 0;
      background: #1C1F37;
      border-bottom: 1px solid #495889;
      .item{
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: 0 10px;
      }
      .item.name{
        width: 30%;
      }
      .item.time{
        position: relative;
        width: 40%;
        .caret-wrapper {
          width: 20px;
          height: 20px;
          display: inline-flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          flex-direction: column;
          -webkit-box-align: center;
          align-items: center;
          overflow: initial;
          position: relative;
        }
        .sort-caret.ascending {
          border-bottom-color: #c0c4cc;
          top: 0;
        }
        .sort-caret.descending {
          border-top-color: #c0c4cc;
          bottom: -2px;
        }
        .descending.checkColor {
          border-top-color: red;
        }
        .ascending.checkColor {
          border-bottom-color: red;
        }
        .sort-caret {
          width: 0;
          height: 0;
          border: 5px solid transparent;
          position: absolute;
          left: 7px;
        }
      }
      .item.value{
        width: 30%;
      }
      .down{
        width: 11px;
        height: 6px;
        margin-left: 7px;
      }
    }
    /*以fixed的方式固定mescroll的高度*/
    .mescroll {
      position: fixed;
      top: 77px;
      bottom: 0;
      height: auto;
    }
    // .mainBox{
    //   height: 100%;
    //   padding-top: 77px;
    //   box-sizing: border-box;
    //   overflow: auto;
    .tbody {
      .item{
        padding: 11px 0;
        margin: 0 10px;
        border-bottom: 1px solid #323444;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        .name{
          width: 30%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .time{
          width: 40%;
        }
        .value{
          width: 30%;
        }
      }
    }
    // }
  }
</style>
