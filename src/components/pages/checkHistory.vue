<template>
    <div class="checkHistory">
      <div class="timePicker" @click="show">
        <img src="../../assets/icon/toLeft.png">
        <span>{{time}}</span>
        <img src="../../assets/icon/toRight.png">
      </div>
      <div class="mainBox">
        <ul>
          <li v-for="( item, index) in checkHistoryList" :key="index" @click="toCheckHistory(item)">
            <!-- <div class="img-box" :style="{background: ''}"></div> -->
            <img :src="item.pictures[0] | checkImgUrl">
            <div class="detail">
              <div class="title">{{item.operatorName}}  /  {{item.time}}  /  {{item.checkStatus == 1 ? '正常' : '异常'}}</div>
              <div class="value">{{item.description}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import { DatetimePlugin } from 'vux'
	export default {
    components: {
      DatetimePlugin
    },
		name: "checkHistory",
    data(){
		  return {
        //当前时间
        time: '请选择日期',
        //巡检记录列表
        checkHistoryList: []
      }
    },
    computed: {
      deviceMessage () {
        //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
        if(!this.$store.state.deviceMessage){
          this.$store.commit('changeDeviceMessage',JSON.parse(localStorage.getItem('deviceMessage')));
        }
        return this.$store.state.deviceMessage;
      }
    },
    created: function() {
      //设置当前时间
      // const date = new Date();
      // const Y = date.getFullYear() + '-';
      // const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      // const D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      // this.time = Y + M + D;
      // this.getCheckHistory(this.time);
      this.getCheckHistory();
    },
    methods: {
      show: function(){
        const that = this;
        this.$vux.datetime.show({
          value:  that.time, // 其他参数同 props
          cancelText: '取消',
          confirmText: '确定',
          onConfirm (value) {
            that.time = value;
            that.getCheckHistory(value);
          }
        })
      },
      toCheckHistory: function(detail){
        this.$store.commit('saveDetail',detail);
        this.$router.push({name: 'checkHistoryDetail'});
      },
      //根据日期，设备id获取巡检记录
      getCheckHistory: function(date){
        let that = this;
        let parmas = {
          deviceId: this.deviceMessage.deviceId,
          date: date,
        }
        this.$http(this.$API.listCheckRecordByDate,parmas,true).then( (res) => {
          if(res){
            that.checkHistoryList = res;
          }
        });
      }
    }
	}
</script>

<style lang="less" scoped>
  .checkHistory{
    background: #1c1f37;
    color: #ffffff;
    height: 100vh;
    .timePicker{
      background: #03061c;
      display: flex;
      justify-content: center;
      align-items: baseline;
      font-size: 16px;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      min-height: 40px;
      z-index: 99;
      img{
        width: 5px;
        height: 11px;
      }
      span{
        margin: 0 25px;
        padding: 11px 0;
      }
    }
    .mainBox{
      height: 100%;
      padding-top: 43px;
      box-sizing: border-box;
      overflow: auto;
      li{
        margin-bottom: 16px;
        .img-box{
          height: 211px;
        }
        img {
          height: 211px;
          object-fit: cover;
        }
        .detail{
          margin: 0 16px;
          padding: 12px 0;
          border-bottom: 1px solid #353746;
          .title{
            color: #B8B8B8;
          }
          .value{
            line-height: 17px;
            margin-top: 6px;
          }
        }
      }
    }
  }
</style>
