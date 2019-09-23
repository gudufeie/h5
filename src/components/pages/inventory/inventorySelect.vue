<template>
  <div class="invent-select">
    <ul>
      <li @click="next(x)" v-for="(x,index) in list" :key="index"><span>{{x.catName}}</span><span v-if="x.children.length>0" class="ico"></span></li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'select-info',
    data() {
      return {
        childList: false,
        radioShow: true,	
        list: [],
        textList: [],
      }
    },
    methods: {
    	//下一级
      next(val) {
        this.textList.push(val)
        this.$emit('typeText', this.textList)
        this.list = val.children
        if(val.children.length==0) return this.$emit('exit','')
//		this.$emit('next',val.children)
      }
    },
    watch: {
    	//监听规格按钮
      statu: function(val) {
        this.list = []
        this.textList = []
        this.list = this.data
      },
//    nextText:function(val){
//    	this.list = val
//    }
    },
    props: ['data', 'statu','nextText'],
    
  }
</script>

<style scoped lang="less">
  .invent-select {
    ul {
      margin-top: 5px;
      li {
        padding: 5px 0 5px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          color: black;
          margin: 0 7px 0 7px;
        }
        .ico {
          width: 10px;
          height: 10px;
          background: url(../../../assets/icon/right-1.svg);
          background-size: contain;
        }
      }
    }
  }
</style>