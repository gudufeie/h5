<template>
  <div class="invent-treeManage">
    <div class="componentTopInv">
      <div style="padding-left: 15px" class="changeMore" @click="changeMore">筛选 <span class="iconfont icon-shaixuan"></span></div>
      <div @click="backToHomepage"><img src="../../../assets/icon/backHome.png" alt=""></div>
    </div>
    <div class="MoreData" v-if="showMore">
      <div class="deviceName">部件名称 <input type="text" placeholder="请输入部件名称" v-model="componentName"></div>
      <div class="deviceCode">部件编号 <input type="text" placeholder="请输入部件编号" v-model="componentCode"></div>
      <div class="btnGroup">
        <button class="reserBtn" @click="reset">重置</button>
        <button class="overBtn" @click="overBtn">完成</button>
      </div>
      <!-- <div @click="slideClassify">部件分类 <span>{{componentCls}} <font-awesome-icon :icon="['fa','chevron-down']" size="lg" /></span></div> -->
    </div>
    <!-- <div :class="styles" ref="category" style="width: 100%;height: 103px;padding: 10px 0;overflow: hidden;position: absolute">
      <div>
        <group>
          <radio :options="classify" v-model="radioValue" @on-change="change"></radio>
        </group>
      </div>
    </div> -->
    <div v-if="showMore" :class="maskStyle" v-show="show" @click="showVuePopup(false)"></div>

    <div class="invent-box">
      <div class="number">共{{componentNum}}条记录</div>
      <div class="thead">
        <div class="name">部件名称</div>
        <div class="code">部件编号</div>
        <div class="item"  @click="leapfrogSort('stockNum', sort1, 1)">库存数量 <font-awesome-icon :icon="['fa','sort']" size="lg" /></div>
        <div class="item"  @click="leapfrogSort('safeNum', sort2, 2)">安全库存 <font-awesome-icon :icon="['fa','sort']" size="lg" /></div>
      </div>
      <div class="bscroll" ref="bscroll">
         <div class="bscroll-container">
            <mescroll-vue class="me_scroll" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
              <div v-for="(item, index) in data" :key="index" class="invent-item" @click="invenInfo(item)">
                <span class="name">{{item.name}}</span>
                <span class="code">{{item.code}}</span>
                <span class="value">{{item.stockNum || item.stockNum == 0?item.stockNum:'-'}}</span>
                <span class="value">{{item.safeNum || item.safeNum == 0?item.safeNum:'-'}}</span>
              </div>
            </mescroll-vue>
        </div>
      </div>
    </div>
    <ic-footer></ic-footer>
  </div>
</template>

<style scoped lang="less">
  @import '../../../styles/iconfont.css';
  * { touch-action: none; }
  #app, .content{
    width: 100%!important;
    height: 100%!important;
  }
  .invent-treeManage{
    position: fixed; 
    top:0px;
    width: 100%;
    height: 100%;
    background-color: #22233f;
    color: #fff;

  }
  .componentTopInv{
    height: 8%;
    display: flex;
    line-height: 50px;
    font-size: 16px;
  }
  .componentTopInv div{flex: 1}
  .componentTopInv div:last-child{text-align: right;padding-right: 15px}
  .componentTopInv img{
    width: 18px;
    height: 18px;
  }

  .invent-box{
    width:100%;
    height: 85%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .thead, .invent-item{
    height: 40px;
    line-height: 40px;
    display: flex;
  }
  .thead div, .invent-item span{flex: 1;text-align: center}
  .invent-item span:nth-child(1){
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    word-break:keep-all;
  }
  .invent-item span:nth-child(1){
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    word-break:keep-all;
  }
  .bscroll{
    width: 100%;
    height: 78%;
    overflow: hidden;
    position: fixed;
  }

  .category{
     width: 100%;
    height: 103px;
    padding: 10px 0;
    overflow: hidden;
    position: fixed;
    visibility: hidden; 
    z-index: -10;
  }
  .category2{
     width: 100%;
    height: 103px;
    padding: 10px 0;
    overflow: hidden;
    position: fixed; 
    top: 5.8rem;
    z-index: 999;
  }

  .setBtn{
    z-index: 999;
    background: #22233f;
    width: 100%;
    height: 50px;
    text-align: -webkit-right;
    padding: 20px 0 15px;
  }
  .setBtn2{
    z-index: 999;
    position: absolute;
    top: 9rem;
    background: #22233f;
    width: 100%;
    height: 50px;
    text-align: -webkit-right;
    padding: 20px 0 15px;
  }

  .btnGroup{
    display: flex;
    height: 30px;
    line-height: 30px;
    width: fit-content;
    padding:20px !important;
    float: right;
  }
  .reserBtn{
    background: #3967DC;
    padding: 0 15px;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
    border-right: 1px #22233f solid;
    border:none;
    color:#fff;
    font-size: 16px;
  }
  .overBtn{
    background: #3967DC;
    padding: 0 15px;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
    border:none;
    color:#fff;
    font-size: 16px;
  }

  .weui-cells{
    background-color: #1e1f3c !important;
  }
  .mask {
      position: fixed;
      top:39%;
      width: 100%;
      height: -webkit-fill-available;
      background-color: rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease-in;
      z-index: 999;
      left:0px;
      right:0px;
  }
  .mask2 {
      position: absolute;
      top: 64%;
      width: 100%;
      height: -webkit-fill-available;
      background-color: rgba(0, 0, 0, 0.3);
      transition: all 0.2s ease-in;
      z-index: 999;
  }
  .weui-cells:before, .weui-cells:after{border: none!important;}
</style>
<style scoped lang="less">
  body{
    overflow: hidden;
  }
  .me_scroll {
    top: 120px;
  }
  .mescroll {
    position: fixed;
    bottom: 130px;
    height: 75%;
  }
  .bscroll-container{
    transform:unset ! important;
  }
  .MoreData{
      background: #22233f;
      position:fixed;
      width: 100%;
      height: auto;
      top: 45px;
      z-index: 999;
      .showClassifyInfo{
        margin: 0;
        height: 120px;
        overflow: auto;
      }
      div{
        font-size: 16px;
        line-height: 40px;
        color: #ffffff;
        margin: 10px;
        input{
          border-bottom: 1px solid rgba(0, 0, 0, 0.3);
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
      span{
        float: right;
        height: 40px;
        line-height: 40px;
        /*width: 50%;*/
        color: rgba(255,255,255,0.5);
        img{
          width: 20px;
          height: 20px;
          margin: 15px 0;
          float: right;
        }
      }
    }
    .number{
      line-height: 30px;
      padding-left: 15px;
      width: 100%;
      background-color: #22233f;
      color:#fff;
    }
</style>

<script>
  import { XTable,ButtonTab, ButtonTabItem,Checklist, Radio, Group} from "vux";
  import IcFooter from "../../common/ic-footer";
  import BScroll from "better-scroll";
  import MescrollVue from "mescroll.js/mescroll.vue"
  export default {
    components: {
      XTable,
      IcFooter,
      ButtonTab,
      ButtonTabItem,
      Checklist,
      BScroll,
      Radio,
      Group,
      MescrollVue
    },
    data () {
      return {
        radioShow: [],
        data: [],
        dataInfo:[],
        id: null,
        showMore: false,
        //部件分类
        componentCls: '请选择部件分类',
        //部件名称
        componentName: '',
        //部件编号
        componentCode: '',
        componentNum:'0',
        //部件分类信息展示 默认不展示
        showClassifyInfo: false,
        //分类信息
        classify: [],
        classifyInfo: [],
        radioValue: '',
        imgStyle: {
          display: 'block',
        },
        sort1: false,
        sort2: false,
        sortType: 'stockNum',
        show: false,
        styles: 'category',
        btnStyle: 'setBtn',
        maskStyle: 'mask',
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
      }
    },
    methods: {
      getComponentNum: function(){
        let param = {
          departmentId: 0,
          componentName:this.componentName,
          componentCode:this.componentCode,
        }
        this.$http(this.$API.getDeviceNum, param,true).then((res) => {
        if (res) {
          this.componentNum = res.componentNum;
          }
        });
      },
      //入库  (暂时注释)
      invenInfo(data) {
        this.$store.commit("setRadio", data);
        this.$router.push({
          name: "inventoryManage",
          query: { id: data.id, name: "listInfo" }
        });
      },
      //获取列表
      getList() {
        var url = this.$API.inventList;
        this.$http(url, {}, true).then(res => {
          for (var i = 0; i < res.length; i++) {
            this.radioShow.push(true);
            if(this.classify.indexOf(res[i].catName) == -1){
                this.classify.push(res[i].catName);
                this.classifyInfo.push({catId:res[i].catId, catName:res[i].catName});
            }
          }
          this.data = res;
          this.data = this.data.concat(res);
          this.data = this.data.concat(res);
          this.data = this.data.concat(res);
          this.data = this.data.concat(res);
          this.dataInfo = this.data
        });
      },
      //展开更多
      changeMore: function () {
        this.showMore = true;
        this.show = true;
      },
      reset: function(){
        this.componentName = '';
        this.componentCode = '';
        this.componentCls = '请选择部件分类';
      },

      // 筛选
      overBtn: function () {
        this.showMore = false;
        this.mescroll.resetUpScroll(true);
        this.getComponentNum();
      },
      slideClassify: function () {
        this.show = true;
        this.showClassifyInfo = true;
        this.styles = 'category2';
        this.btnStyle = 'setBtn2';
        this.maskStyle = 'mask2';
        this.Scroll = new BScroll(this.$refs.category,{click: true, tap: true});
      },
      //返回首页
      backToHomepage: function () {
        this.$router.push({name:'homepage'});
      },
      change(val, label) {
          this.componentCls = val;
          this.styles = 'category';
          this.btnStyle = 'setBtn';
          this.maskStyle = 'mask';
          // this.imgStyle.display = "none";
          // this.showClassifyInfo = false;
      },
      leapfrogSort(type, sorted, sortnumber) {
          if (sortnumber === 1){
            if (sorted === false) {
              this.sort1 = true;
              this.sortType = type;
              this.data.sort(this.compare(type));
            }else{
              this.sort1 = false;
              this.sortType = type;
              this.data.sort(this.compare2(type));
            }
          }else {
            if (sorted === false) {
              this.sort2 = true;
              this.sortType = type;
              this.data.sort(this.compare(type));
            }else{
              this.sort2 = false;
              this.sortType = type;
              this.data.sort(this.compare2(type));
            }
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
      showVuePopup(flag) {
        if (flag === false){
          this.change();
          this.showMore = false;
        }
        this.show = flag;
      },
      mescrollInit(mescroll) {
        this.mescroll = mescroll;
      },

      upCallback(page, mescroll) {
        let params = {
          componentName: this.componentName,
          componentCode: this.componentCode,
          pageNum: page.num,
          pageSize: page.size,
        };
        this.$http(this.$API.inventList, params, true).then(res => {
          if (res) {
            let data = res;
            if (page.num === 1) {
              this.data = [];
            }
            this.data = this.data.concat(data);
            this.dataInfo = this.data;
            this.$nextTick(() => {
              mescroll.endSuccess(data.length);
            });
          } else {
            this.mescroll.endErr();
          }
        });
      },
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
    created() {
      this.$store.commit("setRadio", null);
      this.getComponentNum();
    },
    mounted(){
      this.$nextTick(() => {
        this.Scroll = new BScroll(this.$refs.mescroll,{click: true, tap: true});
        })
      },

    }

</script>
