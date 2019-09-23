<template>
  <div id="app">
    <div class="content">
      <navigation>
        <router-view></router-view>
      </navigation>
    </div>
  </div>
</template>
<script>

export default {
  components: { },
  name: 'App',
}
</script>

<style lang="less">
  body{
    padding: 0;
    margin: 0;
  }
  *{
    -webkit-overflow-scrolling: touch;
  }
  p{
    margin: 0;
  }
  input{
    border: none;
    padding: 0;
    background: none;
  }
  textarea{
    resize:none;
  }
  input:focus,textarea:focus{
    outline: none;
  }
  input::-webkit-input-placeholder,textarea::-webkit-input-placeholder{
    color: #495889;
  }    /* 使用webkit内核的浏览器 */
  input:-moz-placeholder,textarea:-moz-placeholder{
    color: #495889;
  }                  /* Firefox版本4-18 */
  input::-moz-placeholder,textarea:-moz-placeholder{
    color: #495889;
  }                  /* Firefox版本19+ */
  input:-ms-input-placeholder,textarea:-moz-placeholder{
    color: #495889;
  }           /* IE浏览器 */
  a{
    text-decoration: none;
  }
  ul{
    padding-left: 0;
    margin: 0;
    list-style:none;
  }
  img{
    width: 100%;
    height: 100%;
  }
  .content .vux-slider > .vux-indicator > a > .vux-icon-dot.active,.content .vux-slider .vux-indicator-right > a > .vux-icon-dot.active{
    background: #ffffff;
  }
</style>
