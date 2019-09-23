<template>
    <div class="checkHistoryDetail">
      <swiper :height="'211px'" style="border-bottom: 1px solid #ccc;">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in detail.pictures" :key="index" @click.native="show(index,$event)"><img :src="item | checkImgUrl" ></swiper-item>
      </swiper>
      <div class="order">
        <div class="name">操作人 ／ {{detail.operatorName}}</div>
        <div class="time">添加时间 ／ {{detail.time}}</div>
        <div class="value">巡检结果 ／ {{detail.checkStatus == 1 ? '正常' : '异常'}}</div>
      </div>
      <div class="detail">{{detail.description}}</div>
      <actionsheet v-model="deleteShow" :menus="menus" @on-click-menu="deleteImg" show-cancel></actionsheet>
    </div>
</template>

<script>
  import { Swiper, SwiperItem, Actionsheet } from 'vux'
	export default {
    components: {
      Swiper,
      SwiperItem,
      Actionsheet
    },
		name: "checkHistoryDetail",
    data(){
		  return {
        deleteShow: false,
        menus: {
          delete: '<span style="color:red">删除</span>'
        },
        curImgUrls: [],
        curIndex: null,
      }
    },
    methods: {
      show(index,event) {
        event.preventDefault()

        // this.loop = setTimeout(()=>{
          this.deleteShow = true
          this.curIndex = index
        // },800);

      },
      clearLoop() {
        clearInterval(this.loop);
      },
      deleteImg(menuKey, menuItem) {
        const arr = [...this.detail.pictures]

        if(menuKey == 'delete') {
          arr.splice(this.curIndex,1)

          const data = {
            delType: 1,
            url: arr,
            targetId: this.detail.id
          }
          
          this.$http(this.$API.deleteCheckImg,data,true).then( (res) => {
            if(res){
             this.detail.pictures.splice(this.curIndex,1)
             this.$store.commit('saveDetail',this.detail)
            }
          });
        }
      }
    },
    computed: {
      detail () {
        //如果在store里拿不到设备信息，就去本地储存拿，并写入store。
        if(!this.$store.state.detail){
          this.$store.commit('saveDetail',JSON.parse(localStorage.getItem('detail')));
        }
        return this.$store.state.detail;
      }
    }
	}
</script>

<style lang="less" scoped>
  /deep/ .vux-slider > .vux-swiper > .vux-swiper-item {
    text-align: center;
  }
  .checkHistoryDetail{
    background: #1c1f37;
    height: 100vh;
    overflow: auto;
    img {
      width: auto; 
      max-width: 100%;  
      max-height: 100%; 
    }
    .order{
      margin: 0 16px;
      padding: 10px 0;
      border-bottom:  1px solid #323444;
      color: #ffffff;
      .name{
        font-size: 16px;
      }
      .time{
        margin: 6px 0;
      }
    }
    .detail{
      font-size: 14px;
      margin: 0 16px;
      padding-top: 10px;
      letter-spacing: 2.82px;
      text-indent: 1rem;
      color: #ffffff;
    }
  }
</style>
