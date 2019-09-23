<template>
  <div class="produce">
    <department-selected
      :selectedDepartment="curDepartment"
      @department_selected="departmentSelected"
    ></department-selected>
    <div class="page_content">
      <div class="chart_type">
        <flexbox class="text-center chart_type_tab" :gutter="0">
          <flexbox-item :class="{'active':chartType==1}">
            <div @click="chartTypeChange(1)">实时</div>
          </flexbox-item>
          <flexbox-item :class="{'active':chartType==2}">
            <div @click="chartTypeChange(2)">1天</div>
          </flexbox-item>
          <flexbox-item :class="{'active':chartType==3}">
            <div @click="chartTypeChange(3)">1个月</div>
          </flexbox-item>
          <flexbox-item :class="{'active':chartType==4}">
            <div @click="chartTypeChange(4)">1年</div>
          </flexbox-item>
        </flexbox>
      </div>
      <produce-line-chart
        :options="lineChartOptions"
        :hasZoom="hasZoom"
        :chartType="chartType"
        :needClearChart="needClearChart"
        @consumeClearChart="consumeClearChart"
        :loading="loading"
      ></produce-line-chart>

      <flexbox class="pie_chart_block" v-for="(pieRow,index) in pieList" :key="index">
        <flexbox-item>
          <div>
            <div class="chart_title text-center">{{pieRow[0].pieData.name}}</div>
            <flexbox justify="center" wrap class="legend_block">
              <flexbox-item
                class="text-center"
                v-for="(item,index) in pieRow[0].pieData.items"
                :key="index"
              >
                <span v-if="!pieRow[0].pieData.sum" :style="{'color':item.color}">0%</span>
                <span
                  v-else
                  :style="{'color':item.color}"
                >{{(item.data / pieRow[0].pieData.sum * 100).toFixed(1)}}%</span>
                <br>
                {{item.name}}
              </flexbox-item>
            </flexbox>
            <div class="chart_container text-center">
              <pie-chart
                v-if="!!pieRow[0].pieOptions"
                :options="pieRow[0].pieOptions"
                refId="chart1"
              ></pie-chart>
              <div v-else class="no_data">暂无数据</div>
            </div>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div v-if="pieRow.length>=2">
            <div class="chart_title text-center">{{pieRow[1].pieData.name}}</div>
            <flexbox justify="center" wrap class="legend_block">
              <flexbox-item
                class="text-center"
                v-for="(item,index) in pieRow[1].pieData.items"
                :key="index"
              >
                <span v-if="!pieRow[1].pieData.sum" :style="{'color':item.color}">0%</span>
                <span
                  v-else
                  :style="{'color':item.color}"
                >{{(item.data / pieRow[1].pieData.sum * 100).toFixed(1)}}%</span>
                <br>
                {{item.name}}
              </flexbox-item>
            </flexbox>
            <div class="chart_container text-center">
              <pie-chart
                v-if="!!pieRow[1].pieOptions"
                :options="pieRow[1].pieOptions"
                refId="chart1"
              ></pie-chart>
              <div v-else class="no_data">暂无数据</div>
            </div>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
    <div class="footer">
      <div class="view_all_btn" @click="openAllProduce()">查看全部产量数据</div>
    </div>
  </div>
</template>

<script>
// import IcFooter from "../../common/ic-footer";
import ProduceLineChart from "./produce-line-chart.vue";
import PieChart from "../../common/pie-chart.vue";
import Flexbox from "vux/src/components/flexbox/flexbox";
import FlexboxItem from "vux/src/components/flexbox/flexbox-item";
import XButton from "vux/src/components/x-button/index";
import dataReportDao from "@/daos/data_report_dao.js";
import DepartmentSelected from "../../common/department-selected";
import virtualData from './data.json'
import virtualDataDay from './dataDay.json'
import virtualDataMonth from './dataMonth.json'
import virtualDataYear from './dataYear.json'

//实时数据5秒刷新
const real_time_interval = 5;
let _this = null;

let colorList = ["#1EB9B3", "#3C77C1", "#A67327", "#8C900D"];

const getBasePieOptions = function() {
  return {
    tooltip: {
      trigger: "item",
      formatter: function(params) {
        return (
          params.data.name +
          ":" +
          params.data.value.toFixed(2) +
          params.data.unit +
          "<br/>" +
          "(" +
          params.percent.toFixed(1) +
          "%)"
        );
      },
      position: ["10%", "20%"]
    },
    color: colorList,
    legend: {
      show: false,
      orient: "vertical",
      x: "left",
      data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
    },
    series: [
      {
        label: {
          normal: {
            //              show: false
            fontSize: 10
          }
        },
        labelLine: {
          normal: {
            //              show: false,
            length2: 5,
            length: 15
          }
        },
        name: "访问来源",
        type: "pie",
        avoidLabelOverlap: true,
        radius: ["20%", "35%"],
        data: [
          { value: 335, name: "直接访问" },
          { value: 310, name: "邮件营销" },
          { value: 234, name: "联盟广告" },
          { value: 135, name: "视频广告" },
          { value: 1548, name: "搜索引擎" }
        ]
      }
    ]
  };
};

export default {
  components: {
    DepartmentSelected,
    XButton,
    FlexboxItem,
    Flexbox,
    ProduceLineChart,
    PieChart
  },
  data() {
    return {
      chartType: 0,
      hasZoom: true,
      lineChartOptions: {},
      value: "19%",
      chartDataMap: {},
      pieList: [],
      curDepartment: null,
      realTimer: null,
      needClearChart: false,
      loading: false
    };
  },
  methods: {
    chartTypeChange: function(chartType) {
      let _this = this;
      if (_this.chartType === chartType) {
        return;
      }
      this.needClearChart = true;
      _this.chartType = chartType;
      _this.lineChartOptions = {};
      if (
        !this.loading &&
        (!this.lineChartOptions ||
          !this.lineChartOptions.times ||
          this.lineChartOptions.times.length <= 0)
      ) {
        this.loading = true;
      }
      if (chartType === 1) {
        this.loadData();
        this.realTimer = setInterval(function() {
          _this.loadData();
        }, real_time_interval * 1000);
      } else {
        if (this.realTimer) {
          clearInterval(this.realTimer);
          this.realTimer = null;
        }
        this.loadData();
      }
    },
    departmentSelected: function(params) {
      this.needClearChart = true;
      this.curDepartment = params.department;
      this.lineChartOptions = {};
      if (
        !this.loading &&
        (!this.lineChartOptions ||
          !this.lineChartOptions.times ||
          this.lineChartOptions.times.length <= 0)
      ) {
        this.loading = true;
      }
      if (this.chartType !== 1) {
        this.loadData();
      }
    },
    buildParams: function() {
      let params = {};
      if (this.curDepartment) {
        params.departmentId = this.curDepartment.id;
      }
      return params;
    },
    getOnePieOptions: function(pieData) {
      if (!pieData || !pieData.items || pieData.items.length <= 0) {
        return null;
      }
      let pieOptions = getBasePieOptions();
      pieOptions.series[0].data = [];
      pieOptions.legend.data = [];
      pieOptions.series[0].name = pieData.name;
      let sum = 0;
      for (let index in pieData.items) {
        let item = pieData.items[index];
        item.color = colorList[index % colorList.length];
        pieOptions.legend.data.push(item.name);
        pieOptions.series[0].data.push({
          value: item.data,
          name: item.name,
          unit: item.unit
        });
        sum += item.data;
      }
      pieData.sum = sum;
      return { pieData: pieData, pieOptions: pieOptions };
    },
    buildPieOptions: function(chartData) {
      if (!chartData || !chartData.pies || chartData.pies.length <= 0) {
        this.pieList = [];
        return;
      }
      for (let i = 0, index = 0; i < chartData.pies.length; i++) {
        let row = Math.floor(index / 2);
        let col = index % 2;
        let options = this.getOnePieOptions(chartData.pies[i]);
        if (!options) {
          continue;
        }
        if (!this.pieList[row]) {
          this.pieList[row] = [];
        }
        this.pieList[row][col] = options;
        index++;
      }
    },
    sortChartData: function(chartData) {
      if (!chartData) {
        return;
      }
      if (chartData.pies) {
        chartData.pies.sort(function(a, b) {
          return b.name.localeCompare(a.name);
        });
        for (let pie of chartData.pies) {
          if (pie.items) {
            pie.items.sort(function(a, b) {
              return b.name.localeCompare(a.name);
            });
          }
        }
      }
      if (chartData.serials) {
        chartData.serials.sort(function(a, b) {
          return b.name.localeCompare(a.name);
        });
      }
    },
    //演示环境函数
    virtualDataShow(type) {
      //判断演示环境的账号，演示假实时数据
        const userData = JSON.parse(localStorage.getItem('user'))

        if(userData.orgId == 4) {
          let now = new Date()
          let year = now.getFullYear()
          let month = now.getMonth() + 1
          let day = now.getDate()
          let hour = now.getHours()
          let minute = now.getMinutes()

          //data用来存放相关的数据项
          let data = []

          //1:实时 2:一天 3:一月 4:一年
          if(type === 1) {
            let second = now.getSeconds()
            let previousHour = hour - 1
            let times = []

            //解决当前秒数不是5的倍数的情况
            if(second%5 !== 0) {
              second = second - second%5
            }

            //获取一个小时内的每隔5秒的时间段
            for(let i = 0; i< 720; i++) {
              times.push(`${previousHour}:${minute}:${second}`)
              second = second + 5;
              if(second == 60) {
                second = 0
                minute = minute + 1
              }
              if(minute == 60) {
                previousHour = previousHour + 1
                minute = 0
              }
            }
            virtualData.chartData.times = times

            //实时切换数据，把第一个数据放到尾部
            const serials = virtualData.chartData.serials
            serials[0].data[serials[0].data.length] = serials[0].data.shift()
            serials[1].data[serials[1].data.length] = serials[1].data.shift()
            serials[2].data[serials[2].data.length] = serials[2].data.shift()
            serials[3].data[serials[3].data.length] = serials[3].data.shift()

            data = virtualData.chartData
          } else if(type === 2) {
            let times = []
            for(let i = 0;i <= hour; i ++) {
              times.push(`${i === 0?'00':i}:00`)
            }
            virtualDataDay.chartData.times = times

            const serials = virtualDataDay.chartData.serials
            virtualDataDay.chartData.serials = virtualDataDay.chartData.days

            data = virtualDataDay.chartData
          } else if(type === 3) {
            let times = []
            for(let i = 1;i <= day; i ++) {
              times.push(`${month}-${i}`)
            }
            virtualDataMonth.chartData.times = times

            data = virtualDataMonth.chartData
          } else if(type === 4) {
            let times = []
            for(let i = 1;i <= month; i ++) {
              times.push(`${year}-${i}`)
            }
            virtualDataYear.chartData.times = times

            data = virtualDataYear.chartData
          }

          this.chartDataMap[type] = data

          if (this.chartType === type) {
            this.lineChartOptions = data
            this.buildPieOptions(data)
          }
        }
    },
    loadRealTimeChart: function() {
      let _this = this;
      var params = this.buildParams();
      dataReportDao.loadRealTimeChart(params, function(data) {
        if (_this.loading) {
          _this.loading = false;
        }
        // if (params.departmentId !== _this.curDepartment.id) {
        //   return;
        // }
        if (data && data.chartData) {
          //这函数在华为荣耀上面存在兼容问题
          // _this.sortChartData(data.chartData);
          _this.chartDataMap[1] = data.chartData;
          if (_this.chartType === 1) {
            _this.lineChartOptions = data.chartData;
            _this.buildPieOptions(data.chartData);
          }
        } else {
          _this.lineChartOptions = {};
        }

        _this.virtualDataShow(1)
      });
    },
    loadProductChartByDay: function() {
      let _this = this;
      var params = this.buildParams();
      dataReportDao.loadProductChartByDay(params, function(data) {
        if (_this.loading) {
          _this.loading = false;
        }
        if (data && data.chartData) {
          // _this.sortChartData(data.chartData);
          _this.chartDataMap[2] = data.chartData;
          if (_this.chartType === 2) {
            _this.lineChartOptions = data.chartData;
            _this.buildPieOptions(data.chartData);
          }
        } else {
          _this.lineChartOptions = {};
        }

        _this.virtualDataShow(2)
      });
    },
    loadProductChartByMonth: function() {
      let _this = this;
      var params = this.buildParams();
      dataReportDao.loadProductChartByMonth(params, function(data) {
        if (_this.loading) {
          _this.loading = false;
        }
        if (data && data.chartData) {
          // _this.sortChartData(data.chartData);
          _this.chartDataMap[3] = data.chartData;
          if (_this.chartType === 3) {
            _this.lineChartOptions = data.chartData;
            _this.buildPieOptions(data.chartData);
          }
        } else {
          _this.lineChartOptions = {};
        }

        _this.virtualDataShow(3)
      });
    },
    loadProductChartByYear: function() {
      let _this = this;
      var params = this.buildParams();
      dataReportDao.loadProductChartByYear(params, function(data) {
        if (_this.loading) {
          _this.loading = false;
        }
        if (data && data.chartData) {
          // _this.sortChartData(data.chartData);
          _this.chartDataMap[4] = data.chartData;
          if (_this.chartType === 4) {
            _this.lineChartOptions = data.chartData;
            _this.buildPieOptions(data.chartData);
          }
        } else {
          _this.lineChartOptions = {};
        }

        _this.virtualDataShow(4)
      });
    },
    loadData: function() {
      // if (!this.curDepartment) {
      //   return;
      // }
      switch (this.chartType) {
        case 1:
          this.hasZoom = true;
          this.loadRealTimeChart();
          break;
        case 2:
          this.hasZoom = true;
          this.loadProductChartByDay();
          break;
        case 3:
          this.hasZoom = true;
          this.loadProductChartByMonth();
          break;
        case 4:
          this.hasZoom = false;
          this.loadProductChartByYear();
          break;
      }
    },
    openAllProduce: function() {
      this.$router.push({ name: "allProduce" });
    },
    consumeClearChart: function() {
      //子控件消费回调通知已经清空echarts对象
      this.needClearChart = false;
    }
  },
  created: function() {
    _this = this;
    let strCurrentDepartment = localStorage.getItem("produce_department");
    if (strCurrentDepartment) {
      this.curDepartment = JSON.parse(strCurrentDepartment);
    }
    this.loadData()
    this.chartTypeChange(1);
  },
  destroyed: function() {
    if (this.curDepartment) {
      localStorage.setItem(
        "produce_department",
        JSON.stringify(this.curDepartment)
      );
    }
    if (this.realTimer) {
      clearInterval(this.realTimer);
      _this.realTimer = null;
    }
  },
  deactivated: function() {
    if (this.realTimer) {
      clearInterval(this.realTimer);
      _this.realTimer = null;
    }
  }
};
</script>

<style>
.produce {
  color: #ffffff;
  background: #1c1f37;
  height: 100vh;
}

.produce .selected {
  width: 100%;
  padding: 11px 0;
  background: #03061c;
  text-align: center;
  position: absolute;
  z-index: 99;
  top: 0;
}

.produce .page_content {
  height: 100%;
  padding-top: 42px;
  padding-bottom: 130px;
  overflow-y: auto;
  text-align: center;
  box-sizing: border-box;
}

.produce .page_content .vux-tab {
  width: 80%;
  margin: 0 auto;
  background-color: transparent;
}

.produce .page_content .vux-tab .vux-tab-item {
  color: white;
}

.produce .page_content .vux-tab .vux-tab-ink-bar {
  background-color: #177fff;
}

.produce .chart_type .chart_type_tab {
  width: 80%;
  margin: 0 auto;
}

.produce .chart_type .chart_type_tab > div {
  display: inline-block;
  border-bottom: 3px solid #495889;
  width: 20%;
}

.produce .chart_type .chart_type_tab > div.active {
  border-color: #177fff;
}

.produce .chart_type .chart_type_tab .vux-flexbox-item > div {
  padding: 8px 0;
}

.produce .page_content .produce_line_chart {
  padding: 10px 0;
  border-bottom: 1px solid #616161;
}

.produce .pie_chart_block .chart_title {
  padding: 10px 0;
}

.produce .pie_chart_block .chart_container {
  width: 100%;
  height: 180px;
}

.produce .pie_chart_block .chart_container .no_data {
  padding-top: 40%;
}

.produce .pie_chart_block .legend_block .vux-flexbox-item {
  max-width: 80px;
}

.produce .h_split {
  width: 80%;
  margin: 0 auto;
  height: 1px;
  background-color: #616161;
}

.produce .footer {
  width: 100%;
  padding: 16px 0;
  position: fixed;
  bottom: 51px;
  background: #1c1f37;
}

.produce .view_all_btn {
  margin: 0 40px;
  padding: 12px 0;
  font-size: 16px;
  color: #ffffff;
  text-align: center;
  background: #3967dc;
  border-radius: 4px;
}
</style>
