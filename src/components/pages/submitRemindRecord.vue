<template>
  <div class="submitRemindRecord">
     <div class="introduce">
       <span style="color:red;margin-right:10px;">*</span>提醒记录
     </div>
     <textarea class="introduceTextArea " v-model="remindText" id="" cols="30" rows="15" placeholder="请输入记录"></textarea>
    <div class="remindRecord" @click="submitRecord">保存</div>
    <shortcut-menu></shortcut-menu>
  </div>
</template>

<script>
  import {XHeader, Flexbox, FlexboxItem} from 'vux';
  import ShortcutMenu from "../../components/common/shortcut_menu.vue"

  export default {
    components: {
      XHeader,
      Flexbox,
      FlexboxItem,
      ShortcutMenu
    },
     data () {
      return {
        remindText:'',
        workSheetInfo:{}
      }
    },
    created: function(){
      this.getRouteInfo();
    },
    methods: {
      getRouteInfo: function(){
        this.workSheetInfo = this.$route.query.workSheet
        console.log('rrrrrr',this.workSheetInfo)
      },
      //提交提醒记录
      submitRecord: function () {
        var params={
          workSheetId: this.workSheetInfo.id,
          description: this.remindText
        }

        this.$http(this.$API.addExceptWorkSheetRecord, params, true).then((data)=>{
          if(data){
            this.$commom.alert('提交成功');
            this.$router.push({
              name:'remindManageDetail',
              query:{
                workSheetInfo: this.workSheetInfo
              }
            })
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .submitRemindRecord{
    min-height: 100vh;
    background: #22233f;
    color: #FFFFFF;
    overflow: hidden;
    .vux-header{
      background: #ffffff;
    }
    .remindRecordText{
      color: #000;
    }
    .introduce{
      border-bottom: none;
      margin: 20px 0 20px 20px;
      color: #ffffff;
      font-size: 18px;
    }
    .introduceTextArea{
      width: calc(~"100% - 60px");
      margin: 0 20px 20px;
      background: transparent;
      border: 1px rgba(255,255,255,0.6) solid;
      border-radius: 5px;
      padding: 20px 0 0 20px;
      color: #ffffff;
    }
    .introduceTextArea textarea::placeholder{
      color: #fff;
      font-size: 16px;
    }
    .remindRecord {
        height: 50px;
        margin: 50px 20px 0px 20px;
        line-height: 50px;
        text-align: center;
        border:1px solid #3967DC;
        border-radius: 20px;
        color:  #3967DC;
        font-size: 18px;
    }
  }
</style>
