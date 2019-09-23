<template>
  <div class="deviceDetailManage">
      <div class="mainBox">
        <div class="changeMore" @click="changeMore" >{{checkMore}} <span class="iconfont icon-shaixuan"></span></div>
        <div class="MoreDataP" v-if="showMore">
          <div class="deviceName">设备名称 <input v-model="selectName" type="text" placeholder="请输入设备名称"></div>
          <div class="deviceCode">设备编号 <input v-model="selectCode" type="text" placeholder="请输入设备编号"></div>
          <div class="BtnGroup">
            <div class="btn-reset" @click="reset">重置</div>
            <div class="btn-over"  @click="overBtn">完成</div>
          </div>
          <div class="mask" v-show="show3" @click="showVuePopup3(false)"></div>
        </div>
        <div class="content_wrap">
          <div class="number">共{{number}}条记录</div>
          <div class="replaceRecord" ref="replaceRecord">
            <x-table class="tab-swiper vux-center" :cell-bordered="false" :full-bordered="false" :content-bordered="true" style="background-color:#22233f;">
              <thead>
                <tr>
                  <th>设备名称</th>
                  <th @click="sort('update_time', sort2)">更换时间 <font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
                  <th>操作人</th>
                </tr>
              </thead>
              <tbody>
               <tr v-for="(record,index) in replaceRecordList" :key="index" @click="replaceRecordDetail(record)">
                 <td>{{record.name}}</td>
                 <td>{{record.update_time | formatDate}}</td>
                 <td>{{record.operatorName}}</td>
               </tr>
              </tbody>
            </x-table>
          </div>
        </div>
      </div>
      <shortcut-menu></shortcut-menu>
  </div>
</template>

<style>
  #app, .content{
    width: 100%!important;
    height: 100%!important;
  }
  .deviceDetailManage{
    position: fixed;
    height: 100%;
    width: 100%;
    background: #22233f;
    /*padding: 0 3%;*/
    padding-bottom: 20px;
    color: #fff
  }
  .device-selected{height: 50px}

  .mainBox{
    height: 90%;
    overflow: hidden;
    width: 100%;
    color: #fff;
    overflow:auto;
  }
  .detail{
    border-bottom: 1px rgba(255,255,255,0.5) solid;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }
  .detail div{
    color: rgba(255,255,255,0.5);
    font-size: 14px;
    padding: 10px 0;
    margin: 0 10px;
  }
  .detail div span{
    margin-left: 30px;
    color: #ffffff;
  }

  .baseInfo{
    padding-left: 10px;
    margin-top: 20px;
    margin-bottom: 15px;
  }

  .vux-button-group{
    margin-bottom: 15px;
  }
  .vux-button-group > a.vux-button-group-current{
    background: #3967DC!important;
  }
  .vux-button-group > a.vux-button-tab-item-first:after, .vux-button-group > a.vux-button-tab-item-last:after{border: none!important;}

  .vux-table:after{border: none!important;}
  .vux-table thead tr{width: 100%}
  .openmore td:before{border: none!important;}

  .vux-popup-mask{
    top: 63%!important;
  }
  .BtnGroup{
    display: flex;
    height: 30px;
    line-height: 30px;
    width: fit-content;
    margin-top: 20px!important;
    float: right;
  }
  .btn-reset{
    background: #3967DC;
    padding: 0 15px;
    margin: 0!important;
    height: 30px;
    line-height: 30px!important;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
    border-right: 1px #22233f solid;
  }
  .btn-over{
    background: #3967DC;
    padding: 0 15px;
    margin: 0!important;
    height: 30px;
    line-height: 30px!important;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
  }
</style>
<style  lang="less" scoped>
    @import '../../styles/iconfont.css';
  .content_wrap{
    margin-top: 50px;
    .replaceRecord{
      overflow-y: auto;
    }
  }
  .MoreDataP{
    background: #2a2c52;
    position: fixed;
    width: 100%;
    z-index: 110;
    height: auto;
    top: 50px;
    padding-bottom: 20px;
    .deviceName{
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    .deviceCode{
      border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    div{
      font-size: 16px;
      line-height: 40px;
      color: #ffffff;
      margin: 10px;
      input{
        margin-left: 20px;
        text-align: left;
        color:rgba(255,255,255,.5);
        font-size: 16px;
        &::-webkit-input-placeholder{
          color:rgba(255,255,255,.5);
          font-size: 14px;
        }
      }
    }
  }
  .changeMore{
      position:fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      z-index: 220;
      padding-left: 20px;
      height: 50px;
      font-size: 16px;
      line-height: 50px;
      background:#22233f;
      color: #ffffff;
      span{
        font-size: 17px;
      }
  }

  .active{
    background-color: #3967DC;
    color: #fff;
  }
  .default{
    background-color: #ddd;
    color: #000;
  }
  .runStatusBtn button{
    font-size: 16px;
    padding: 4px 10px;
    border: none;
    border-radius: 4px;
    /*width: 84px;*/
    width: 25%;
    margin: 0 10px;
  }
  .runStatusBtn button:focus{outline: none}
  .mask {
      position: absolute;
      top: 97%;
      width: 100%;
      left: -10px;
      height: -webkit-fill-available;
      background-color: rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease-in;
      z-index: 999;
  }
   table{
    width: 100%;
    table-layout:fixed;
  }

  table td{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .number{
    line-height: 30px;
    width: 100%;
    color:#fff;
    border-bottom:1px solid rgba(255,255,255,.5);
    padding-left: 15px;
  }
</style>
<script>
  import BScroll from "better-scroll";
  import {XTable} from 'vux'
  import ShortcutMenu from "../../components/common/shortcut_menu.vue";

  export default {
    components: {
      XTable,
      BScroll,
      ShortcutMenu
    },
    name: "deviceDetailManage",
    data (){
      return {
        deviceId: '',
        show: false,
        deviceReplace:[],
        sort2: false,
        activestyle: '',
        showMore: false,
        checkMore:'筛选',
        selectName:'',
        selectCode:'',
        replaceRecordList:[],
        number:0
      }
    },
    created() {
      this.deviceId =this.$route.query.deviceId;
      this.getDeviceInfo();
    },
    methods: {
      // 获取设备所有更换记录
      getDeviceInfo:function(){
        this.deviceId =this.$route.query.deviceId
        this.$http(this.$API.loadDeviceAllReplaceRecord,{deviceId:this.deviceId},
          true).then((data)=>{
            this.deviceReplace = this.replaceRecordList = data
            this.number = data.length;
          })
      },

      replaceRecordDetail: function(record){
        this.$router.push({
            name:'replaceDetail',
            query:{
                component:'',
                device:record,
                deviceId:this.deviceId,
                type:'device'
            }
        })
      },

      //展开更多
      changeMore: function () {
        this.showMore = true;
        this.showDep = false;

        this.show3 = true;
        this.activestyle = 'change'
      },

      // 筛选
      overBtn: function () {
        var name = this.selectName;
        var code = this.selectCode;
        this.replaceRecordList = [];
        for(var item of this.deviceReplace){
          if(!!name && item.name.indexOf(name) < 0){
            continue;
          }
          if(!!code && item.code.indexOf(code) < 0){
            continue;
          }
          this.replaceRecordList.push(item)
        }
        this.number = this.replaceRecordList.length;
        this.showMore = false;
      },

      // 重置
      reset: function(){
        this.selectCode = '';
        this.selectName = '';
      },

      showVuePopup3(flag) {
        if (flag === false){
          this.showMore = false;
          this.activestyle = ''
        }
        this.show3 = flag;
      },

      // 排序
      sort(type, sorted) {
        if (sorted === false) {
          this.sort2 = true;
          this.deviceReplace.sort(this.compare(type));
        }else{
          this.sort2 = false;
          this.deviceReplace.sort(this.compare2(type));
        }
      },
      compare(attr) {
        return function(a,b){
           var x = a[attr];
           var y = b[attr];
           return ((x>y)?-1:(x<y)?1:0)
        }
      },
      compare2(attr) {
        return function(a,b){
           var x = a[attr];
           var y = b[attr];
           return ((x<y)?-1:(x>y)?1:0)
        }
      },
    },
    mounted(){
      this.$nextTick(() => {
            this.Scroll = new BScroll(this.$refs.replaceRecord,{click: true, tap: true});
        })
    },
  }
</script>
