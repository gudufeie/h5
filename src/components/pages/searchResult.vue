<template>
  <div class="searchResult">
    <div>
      <x-header :left-options="{backText: ''}" style="color:#000!important;">
        <div></div>
        <div class="header-title">搜索</div>
      </x-header>
    </div>

    <div class="search_input">
      <x-icon type="ios-search" size="25"></x-icon>
      <input type="text" id="i-advanced-search" v-model="keywords">
      <button type="button" class="searchBtn" @click="resetSearch">取消</button>
    </div>
    <div>
      <div class="title">
        <span>搜索结果</span>
      </div>
      <div class="sreachContent">
        <x-table :cell-bordered="false" style="background-color:#fff;">
          <thead>
            <tr>
              <th>设备/部件</th>
              <th @click="sort('type', sort1, 1)">工单类型&ensp;<font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
              <th @click="sort('date', sort2, 2)">上报时间&ensp;<font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
              <th @click="sort('status', sort3, 3)">处理状态&ensp;<font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, key) in list2" :key="key">
              <td>{{item.name}}</td>
              <td>{{item.type}}</td>
              <td>{{item.date}}</td>
              <td>{{item.status}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
    </div>
    <div class="vue-popup">
        <div class="mask" v-show="show2" @click="showVuePopup(false)"></div>
        <transition name="slide">
            <div class="popup-content" v-show="show2">
                <div class="popup-title"><span>快捷菜单</span></div>
                <div class="popup-body">
                  <flexbox :gutter="0">
                    <flexbox-item>
                      <div class="flex-demo">
                        <img class="lineImg1" src="../../assets/icon/devicemanage.png" alt="">
                        <p>设备管理</p>
                      </div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="flex-demo">
                        <img class="lineImg1" src="../../assets/icon/mochaITOM.png" alt="">
                        <p>运维管理</p>
                      </div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="flex-demo">
                        <img class="lineImg1" src="../../assets/icon/workOrderManage.png" alt="">
                        <p>工单管理</p>
                      </div>
                    </flexbox-item>
                  </flexbox>
                  <flexbox :gutter="0">
                    <flexbox-item>
                      <div class="flex-demo">
                        <img class="lineImg2" src="../../assets/icon/organization.png" alt="">
                        <p>组织架构管理</p>
                      </div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="flex-demo">
                        <img class="lineImg2" src="../../assets/icon/production.png" alt="">
                        <p>生产管理</p>
                      </div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="flex-demo">
                        <img class="lineImg2" src="../../assets/icon/personalCenter.png" alt="">
                        <p>个人中心</p>
                      </div>
                    </flexbox-item>
                  </flexbox>
                </div>
              <div class="popup-bottom"><span>取消</span></div>
            </div>
        </transition>
    </div>

    <div class="bottomBtn">
      <button type="button" @click="$router.back(-1)"><font-awesome-icon :icon="['fa','chevron-left']" size="lg" /></button>
      <span> | </span>
      <button type="button" class="type1" @click="showVuePopup(true)"><font-awesome-icon :icon="['fa','bars']" size="lg" /></button>
    </div>
  </div>
</template>

<script>
  import {XHeader, XTable, Flexbox, FlexboxItem} from 'vux'
  export default {
    components: {
      XHeader,
      XTable,
      Flexbox,
      FlexboxItem
    },
    data() {
      return{
        keywords: '',
        list2: [{'name':'2#回水泵', 'type':'更换','date': '2019-01-01 09:39:57', 'status': '已处理'},{'name':'阿尔勒牌染布机', 'type':'点巡检','date': '2019-01-23 18:58:19', 'status': '未处理'},{'name':'29-1#皮带', 'type':'更换','date': '2019-07-17 09:36:30', 'status': '已处理'}, {'name':'重型给料皮带', 'type':'点巡检','date': '2019-01-05 12:30:53', 'status': '未处理'}],
        sortType: 'status',
        sort1: false,
        sort2: false,
        sort3: false,
        show2: false
      }
    },
    methods: {
      resetSearch() {
        this.keywords = '';
      },
      sort(type, sorted, sortnumber) {
        if (sortnumber === 1) {
          if (sorted === false) {
            this.sort1 = true;
            this.sortType = type;
            this.list2.sort(this.compare(type));
          } else {
            this.sort1 = false;
            this.sortType = type;
            this.list2.sort(this.compare2(type));
          }
        } else if (sortnumber === 2) {
          if (sorted === false) {
            this.sort2 = true;
            this.sortType = type;
            this.list2.sort(this.compare(type));
          } else {
            this.sort2 = false;
            this.sortType = type;
            this.list2.sort(this.compare2(type));
          }
        } else {
          if (sorted === false) {
            this.sort3 = true;
            this.sortType = type;
            this.list2.sort(this.compare(type));
          } else {
            this.sort3 = false;
            this.sortType = type;
            this.list2.sort(this.compare2(type));
          }
        }

      },
      compare(attr) {
        return function (a, b) {
          var x = a[attr];
          var y = b[attr];
          return ((x > y) ? -1 : (x < y) ? 1 : 0)
        }
      },
      compare2(attr) {
        return function (a, b) {
          var x = a[attr];
          var y = b[attr];
          return ((x < y) ? -1 : (x > y) ? 1 : 0)
        }
      },
      showVuePopup(flag) {
        this.show2 = flag
      }
    }
  }
</script>

<style lang="less" scoped>
  * { touch-action: none; }
  #app, .content{
    height: 100%;
  }
  .searchResult{
    background: #22233f;
    /*height: auto;*/
    position: absolute;
    height: 100%;
    width: 100%;
  }
  .vux-header{
    background-color: white;
  }
  .header-title{
    font-weight: 600;
    color:#000;
  }

  .vux-x-icon {
    fill: #fff;
    position: absolute;
    width: 26px;
    height: 26px;
    left: 35px;
    top: 7px;
  }

  .search_input{
    width: 100%;
    height: 40px;
    margin: 10px 0;
    position: relative;
  }
  .search_input input[type='text']{
    width: 72%;
    margin-left: 20px;
    height: 40px;
    border-radius: 20px;
    background: #000;
    color: #fff;
    border: none;
    text-indent: 1.2rem;
  }

  .searchBtn{
    border: none;
    /*width: 30%;*/
    float: right;
    margin-right: 20px;
    font-size: 18px;
    line-height: 40px;
    background: #22233f;
    color: #456de6;
  }
  .title{
    height: 40px;
    margin: 0.5rem 0;
    line-height: 40px;
    padding: 0 0.5rem;
    font-size: 18px;
    background-color: #000;
    color: #fff;
  }
  .vux-table:after{
    border: none;
  }
  .vux-table.vux-table-no-cell-bordered{
    background-color: #22233f!important;
    color: #fff;
  }

  .bottomBtn{
    width: fit-content;
    border: 1px solid #ddd;
    padding: 6px 15px;
    position: fixed;
    bottom: 10px;
    left: 10px;
    border-radius: 15px;
    background: #22233f;
  }
  .bottomBtn button{
    border: none;
    background: #22233f;
    color: #fff;
  }
  .bottomBtn span{
    color: #fff;
    margin: 0 8px;
  }



  .vue-popup {
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
      .popup-title{
        text-align: center;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        color: #fff;
        border-bottom: 1px solid #737373;
      }
      .popup-body{
        height: 250px;
      }
      .popup-bottom{
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
  .mask {
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

  .flex-demo {
    text-align: center;
    color: #fff;
    background-color: #323465;
    border-radius: 4px;
    background-clip: padding-box;
    height: 125px;
    /*line-height: 125px;*/
    img{
      width: 40px;
      height: 40px;
      margin-bottom: 5px;
    }
    .lineImg1{
      margin-top: 35px;
    }
    .lineImg2{
      margin-top: 20px;
    }
  }
</style>
