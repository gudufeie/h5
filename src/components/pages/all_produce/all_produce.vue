<template>
  <div class="all_produce">
    <datetime title="" v-model="curDate" format="YYYY-MM-DD" @on-change="dateChange"></datetime>
    <div class="page_content">
      <div class="data_type">
        <flexbox class="text-center data_type_tab" :gutter="0">
          <flexbox-item :class="{'active':curDataType.value==item.value}" v-for="(item, index) in dataTypeList"
                        :key="index">
            <div @click="dataTypeChange(item)">
              {{item.label}}
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <flexbox class="product_title">
        <flexbox-item class="text-left">生产类型</flexbox-item>
        <flexbox-item class="text-center">数据类型</flexbox-item>
        <flexbox-item class="text-right">产量数据</flexbox-item>
      </flexbox>
      <flexbox class="product_item" v-for="(product, index) in productList" :key="index">
        <flexbox-item class="text-left">{{product.category}}</flexbox-item>
        <flexbox-item class="text-center">{{product.data_type}}</flexbox-item>
        <flexbox-item class="text-right">{{product.data!=null&&!isNaN(product.data)?product.data.toFixed(1):0 + product.unit}}</flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
  import {Datetime, dateFormat, Flexbox, FlexboxItem} from 'vux'
  import dataReportDao from "@/daos/data_report_dao.js";

  export default {
    components: {
      Datetime,
      Flexbox,
      FlexboxItem
    },
    data() {
      return {
//        curDate: '2018-04-16',
        curDate: dateFormat(new Date(), 'YYYY-MM-DD'),
        productDataCache: null,
        productList: null,

        dataTypeMap: {},
        dataTypeList: [],
        curDataType: null
      }
    },
    methods: {
      dateChange: function () {
        this.loadData();
      },
      dataTypeChange: function (dataType) {
        this.curDataType = dataType;
        this.buildData();
      },
      buildParams: function () {
        let params = {};
        if (this.curDate) {
          let from = new Date(this.curDate);
          from.setHours(0);
          from.setMinutes(0);
          from.setSeconds(0);

          let to = new Date(this.curDate);
          to.setHours(23);
          to.setMinutes(59);
          to.setSeconds(60);

          params.create_time_from = from.getTime();
          params.create_time_to = to.getTime();
        }
        return params;
      },
      buildData: function () {
        this.productList = [];
        var productMap = {};
        if (!this.productDataCache) {
          return;
        }

        for (let item of this.productDataCache) {
          if (!item.shift || item.shift.length <= 0) {
            continue;
          }
          if ((!this.curDataType || this.curDataType.value === 'all') || this.curDataType.value === item.shift) {
            if (!productMap[item.category]) {
              productMap[item.category] = {};
            }
            if(!productMap[item.category][item.data_type]){
              productMap[item.category][item.data_type]={};
            }
            var productItem = productMap[item.category][item.data_type][item.unit];
            if (!productItem) {
              productItem = {category: item.category, data_type: item.data_type, data: item.data?item.data:0,unit:item.unit};
              this.productList.push(productItem);
              productMap[item.category][item.data_type][item.unit] = productItem;
            } else {
              productItem.data += (item.data?item.data:0);
            }

          }
        }
        this.productList.sort(function (a,b) {
            let result = b.category.localeCompare(a.category);
            if(result!==0){
                return result;
            }
            return b.data_type.localeCompare(a.data_type);
        })
      },
      loadData: function () {
        let _this = this;
        let params = this.buildParams();
        dataReportDao.loadProductData(params, function (data) {
          if (data && data.list) {
            _this.productDataCache = data.list;
          } else {
            _this.productDataCache = [];
          }
          _this.dataTypeMap = {};
          _this.dataTypeList = [];
          for (let item of _this.productDataCache) {
            if (!item.shift || item.shift.length <= 0) {
              continue;
            }
            if (!_this.dataTypeMap[item.shift]) {
              let dataTypeItem = {value: item.shift, label: item.shift, createTime:item.create_time};
              _this.dataTypeList.push(dataTypeItem);
              _this.dataTypeMap[dataTypeItem.value] = dataTypeItem;
            }
          }
          _this.dataTypeList.sort(function (a,b) {
            return a.createTime-b.createTime;
          });
          _this.dataTypeList.unshift({value: 'all', label: '总产量'});
          _this.curDataType = _this.dataTypeList[0];
          _this.productDataCache.sort(function (a, b) {
            return a.category.localeCompare(b.category);
          });
          _this.buildData();
        })
      }
    },
    created: function () {
      this.loadData();
    }
  }
</script>

<style>
  .all_produce {
    color: #ffffff;
    background: #1C1F37;
    height: 100vh;
  }

  .all_produce .vux-datetime {
    color: white;
    position: fixed;
    left: 0;
    right: 0;
    height: 42px;
    line-height: 42px;
    background-color: #03061C !important;
    text-align: center;
    width: 100%;
    padding: 0;
    margin: 0;
    z-index: 1000;
  }

  .all_produce .vux-datetime .vux-datetime-value {
    text-align: center;
    font-size: 16px;
  }

  .all_produce .vux-datetime .vux-input-icon {
    display: none;
    opacity: 0;
  }

  .all_produce .page_content {
    height: 100%;
    overflow-y: auto;
    text-align: center;
    box-sizing: border-box;
    padding: 42px 24px 60px 24px;
  }

  .all_produce .data_type .data_type_tab {
    margin: 0 auto;
    font-size: 14px;
  }

  .all_produce .data_type .data_type_tab > div {
    display: inline-block;
    border-bottom: 3px solid #495889;
    width: 20%;
  }

  .all_produce .data_type .data_type_tab > div.active {
    border-color: #177FFF;
  }

  .all_produce .data_type .data_type_tab .vux-flexbox-item > div {
    padding: 8px 0;
  }

  .all_produce .product_title {
    padding: 8px 0;
    border-bottom: 1px solid #55616161;
    font-weight: 600;
    color:#6B6F8E;
  }

  .all_produce .product_item {
    padding: 8px 0;
    border-bottom: 1px solid #55616161;
  }

</style>
