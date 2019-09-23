<template>
  <div class="produce_line_chart">
    <div class="legend_block text-left" v-show="!!chartOptions">
      <div class="legend text-center" v-for="(legend,index) in legendList" :key="index" @click="toggleLegend(legend)">
        <div>
          <span v-bind:style="{'backgroundColor':!legend.active?'#CCC':legend.color}" class="icon"></span>{{legend.name}}
        </div>
        <div><span v-bind:style="{'color':legend.color}">{{legend.value | number(1)}}</span>{{legend.unit}}</div>
        <div></div>
      </div>
    </div>
    <div v-show="!!chartOptions" class="chart_canvas" ref="chart_canvas"></div>
    <div style="margin-top:150px;" v-show="!chartOptions&&!loading">暂无数据</div>
    <div style="margin-top:150px;" v-show="!chartOptions&&loading">loading...</div>
  </div>
</template>
<script>
  let echarts = require('echarts/lib/echarts');
  require("echarts/lib/chart/line");
  require("echarts/lib/component/dataZoom");
  require("echarts/lib/component/tooltip");
  require("echarts/lib/component/legendScroll");

  let defaultMinSpan = 60;

  const colorList = ['#A67327', '#1EB9B3', '#8C900D', '#1A6FCB'];
  const dataZoom = [
    {
      show: true,
      type: 'slider',
      xAxisIndex: [0],
      realtime: true,
      startValue: 0,
      endValue: defaultMinSpan,
      backgroundColor: 'rgba(255,255,255,1)',
      top: '87%',
      bottom: 10,
      handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '70%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    },
    {
      xAxisIndex: [0],
      type: 'inside',
      realtime: true,
      startValue: 0,
      endValue: defaultMinSpan,
    }
  ];

  let chartOptions = {
    backgroundColor: 'rgba(255,255,255,0)',
    color: colorList,
    animationDurationUpdate:200,
    grid: {
      bottom: 80,
      left: 50,
      top: 10
    },
    legend: {
      show: false,
      type: 'scroll',
      textStyle: {
        color: '#FFF'
      },
      data: []
    },
    tooltip: {
      trigger: 'axis',
      triggerOn: 'click',
      position: ['40%', '50%'],
      axisPointer: {
        axis: 'x',
        lineStyle:{
          color:'rgba(0, 0, 0, 0)'
        }
      },
      textStyle:{
          align:'left'
      }
    },
    dataZoom: dataZoom,
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: {
        color: '#FFFFFF'
      },
      axisLine: {
        lineStyle: {
          color: '#474959'
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#FFFFFF'
      },
      axisLine: {
        lineStyle: {
          color: '#474959'
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        showSymbol:false,
        hoverAnimation:false
      }
    ]
  };

  const getSeries = function () {
    return {
      name: '',
      data: [],
      type: 'line',
      showSymbol:false,
      hoverAnimation:false,
      lineStyle: {
//          color:'#000'
      }
    }
  };

  const getLegendItem = function () {
    return {name: '', icon: 'circle'}
  };

  export default {
    props: {
      options: {},
      hasZoom: {
        type: Boolean,
        default: false
      },
      chartType: {
        type: Number,
        default: 1
      },
      needClearChart: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    filters: {
      number: function (value, num) {
        if (isNaN(value)) {
          return value;
        } else {
          return value.toFixed(num);
        }
      }
    },
    data: function () {
      return {
        chartOptions: null,
        chartObj: null,
        legendList: null,
        dataZoomRange: null
      }
    },
    created: function () {
      this.buildOptions(this.options);
    },
    watch: {
      'options.times': function () {
        this.buildOptions(this.options);
      }
    },
    methods: {
      toggleLegend: function (legend) {
        legend.active = !legend.active;
        if (this.chartObj) {
          this.chartObj.dispatchAction({
            type: 'legendToggleSelect',
            name: legend.name,
          });
        }
      },
      dataZoomHandler: function (event) {
        if (!this.dataZoomRange) return;
        var zoom = null;
        if (event.batch && event.batch.length > 0) {
          zoom = event.batch[0];
        } else {
          zoom = event;
        }
        if (null != zoom.start) {
          this.dataZoomRange.startValue = Math.round(this.dataZoomRange.times.length * zoom.start / 100);
          if (this.dataZoomRange.startValue >= this.dataZoomRange.times.length) {
            this.dataZoomRange.startValue = this.dataZoomRange.times.length - 1;
          }
        }
        if (null != zoom.end) {
          this.dataZoomRange.endValue = Math.round(this.dataZoomRange.times.length * zoom.end / 100);
        }
        this.dataZoomRange.visibleTimeLength = this.dataZoomRange.endValue - this.dataZoomRange.startValue + 1;
        if (this.dataZoomRange.visibleTimeLength <= 0) {
          this.dataZoomRange.visibleTimeLength = defaultMinSpan;
        }
      },
      initChartObj: function (callback) {
        if (!this.chartObj) {
          if (!this.$refs['chart_canvas']) {
            return;
          }
          this.chartObj = echarts.init(this.$refs['chart_canvas']);
          this.chartObj.on('dataZoom', this.dataZoomHandler);
          if (callback && typeof callback === 'function') callback();
        } else {
          if (callback && typeof callback === 'function') callback();
        }
      },
      calZoomRange: function (times) {
        let startValue = null;
        let endValue = null;
        if (this.dataZoomRange) {
          let endTime = this.dataZoomRange.times[this.dataZoomRange.endValue];
          if (endTime) {
            for (let i in times) {
              if (endTime == times[i]) {
                endValue = i;
                break
              }
            }
          }

          if (null != endValue) {
            //和最新的time差多少格
            var diff = times.length - endValue - 1;
            if (diff <= 2) {
              endValue = times.length - 1;
            } else {
              endValue = ++endValue;
            }
          }
        } else {
          this.dataZoomRange = {};
          this.dataZoomRange.visibleTimeLength = defaultMinSpan;
        }
        if (null == endValue) {
          endValue = times.length - 1;
        }
        startValue = endValue - this.dataZoomRange.visibleTimeLength + 1;
        startValue = startValue >= 0 ? startValue : 0;
        this.dataZoomRange.times = times;
        this.dataZoomRange.startValue = startValue;
        this.dataZoomRange.endValue = endValue;
      },
      buildOptions: function (options) {
        //数据为空
        if (!options
          || !options.serials || options.serials.length <= 0
          || !options.times || options.times.length <= 0) {
          this.chartOptions = null;
          return;
        }
        let _this = this;
        var legendMap = {};
        if (this.legendList) {
          for (let item of this.legendList) {
            legendMap[item.name] = item;
          }
        }
        this.legendList = [];
        chartOptions.series = [];
        chartOptions.legend.data = [];
        chartOptions.xAxis.data = options.times;
        for (let index in options.serials) {
          let serial = options.serials[index];
          let series = getSeries();
          series.name = serial.name;
          let n = 0;

          for (let i in serial.data) {
            if (serial.data[i] != null) {
              //判断演示环境的账号，演示假实时数据
              const userData = JSON.parse(localStorage.getItem('user'))
              if(userData.orgId == 4) {
                serial.data[i] = Math.round(serial.data[i] * 10) / 10;
              } else {
                serial.data[i] = Math.round(serial.data[i] * 10) / 10;
              }
            }
            /**
             * 出来连续5个为0的情况则显示，其余不显示
             */
            if(serial.data[i] === 0 && i !==0) {
              n = n + 1;
              serial.data[i] = serial.data[i-1]
            } else {
              n = 0;
            }

            if(n >= 5) {
              serial.data[i] = 0;
            }
          }

          series.data = serial.data;
          chartOptions.series.push(series);

          let legend = getLegendItem();
          legend.name = serial.name;
          chartOptions.legend.data.push(legend);

          if (this.chartType === 1) {
            this.legendList.push({
              name: serial.name, unit: serial.unit,
              value: serial.data[serial.data.length - 1],
              color: colorList[index % colorList.length],
              active: legendMap[serial.name] ? legendMap[serial.name].active : true
            })
          } else {
            let sum = 0;
            for (let value of serial.data) {
              if(!value) {
                value = 0;
              }
              sum += value;
            }
            this.legendList.push({
              name: serial.name, unit: serial.unit,
              value: sum,
              color: colorList[index % colorList.length],
              active: true
            })
          }
        }
        if (this.hasZoom) {
          this.calZoomRange(options.times);
          dataZoom[0].endValue = this.dataZoomRange.endValue;
          dataZoom[0].startValue = this.dataZoomRange.startValue;
          dataZoom[1].endValue = this.dataZoomRange.endValue;
          dataZoom[1].startValue = this.dataZoomRange.startValue;
          dataZoom[0].show = true;
          dataZoom[1].show = true;
          chartOptions.dataZoom = dataZoom;
          chartOptions.grid.bottom = 60;
        } else {
          dataZoom[0].show = false;
          dataZoom[1].show = false;
          delete chartOptions.dataZoom;
          chartOptions.grid.bottom = 30;
        }
        this.chartOptions = chartOptions;
        this.$nextTick(() => {
          _this.initChartObj(function () {
            if (_this.needClearChart) {
              _this.chartObj.clear();
              _this.$emit('consumeClearChart', {});
            }
            _this.chartObj.setOption(_this.chartOptions);
          })
        });
      }
    }
  }
</script>

<style>
  .produce_line_chart {
    height: 300px;
  }

  .produce_line_chart .chart_canvas {
    height: 260px;
  }

  .produce_line_chart .legend_block {
    height: 40px;
    overflow-x: auto;
    padding: 0 20px;
    white-space: nowrap;
  }

  .produce_line_chart .legend_block .legend {
    display: inline-block;
    padding: 0 10px;
  }

  .produce_line_chart .legend_block .legend .icon {
    width: 10px;
    height: 10px;
    display: inline-block;
    border-radius: 50px;
    background-color: white;
    margin-right: 5px;
  }
</style>
