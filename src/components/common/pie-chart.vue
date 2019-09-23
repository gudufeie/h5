<template>
  <div class="chart_block">

  </div>
</template>

<script>

  var _this = null;


  let echarts = require('echarts/lib/echarts');
  require("echarts/lib/chart/pie");
  require("echarts/lib/component/tooltip");

  export default {
    name: "pie-chart",
    props: {
      options: {}
    },
    data(){
      return {
        chartOptions: null,
        formatter: null
      }
    },
    watch: {
      options: function () {
        this.buildChart(this.options, this.$el);
      }
    },
    created: function () {
      _this = this;
    },
    mounted: function () {
      this.buildChart(this.options, this.$el);
    },
    methods: {
      init: function (callback) {
        if (!this.chartObj) {
          this.chartObj = echarts.init(this.$el);
        }
        if (callback && typeof callback === 'function') callback();
      },
      buildChart: function () {
        if (!this.options) {
          return;
        }
        if (this.options.tooltip && this.options.tooltip.formatter) {
          this.formatter = this.options.tooltip.formatter;
          this.options.tooltip.formatter = this.tooltipFormatter;
        }
        let _this = this;
        this.$nextTick(() => {
          _this.init(function () {
            _this.chartObj.setOption(_this.options);
          });
        });
      },
      tooltipFormatter: function (params) {
          let self = this;
        var interval = this.chartObj._dom.getAttribute('hide_interval');
        if (interval) clearTimeout(interval);
        interval = setTimeout(function () {try {self.chartObj.dispatchAction({type: 'hideTip'});} catch (e) {}}, 3000);
        self.chartObj._dom.setAttribute('hide_interval', interval);
        return this.formatter(params);
      }
    }
  }
</script>

<style>
  .chart_block {
    height: 100%;
    width: 100%;
  }
</style>
