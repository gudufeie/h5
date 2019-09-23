<template>
  <div class="opportunity">
    <div class="desc_block">
      <div>需求描述</div>
      <div>
      <textarea placeholder="请描述您的需求（1000字以内）" maxlength="1000" v-model="formData.requirement">

      </textarea>
      </div>
    </div>
    <div class="cooperation_type input_row" @click="cooperationTypeShow=true">
      <span class="title">合作类型</span>
      <span class="value text-right"
            v-if="cooperationTypeMap[cooperationTypeIndex]">{{cooperationTypeMap[cooperationTypeIndex]}}</span>
      <span class="value text-right" v-else>(必选)</span>
      <img class="img_right" src="../../../assets/icon/toRight.png">
    </div>
    <div class="input_row">
      <span class="title">您的称呼</span>
      <input class="value text-right" placeholder="请输入您的姓名(选填)" v-model="formData.name">
    </div>
    <div class="input_row">
      <span class="title">公司名称</span>
      <input class="value text-right" placeholder="请输入公司名称(必填)" v-model="formData.orgName">
    </div>
    <div class="input_row">
      <span class="title">手机验证</span>
      <input class="value text-right" placeholder="验证码将发送至此手机" v-model="formData.phone">
    </div>
    <div class="input_row">
      <span class="title">短信验证</span>
      <input class="value text-left" placeholder="请输入验证码" v-model="formData.verifyCode">
      <span class="sendVerifyBtn" v-if="retryTimeLeft<0" @click="getVerifyCode()">发送验证码</span>
      <span v-else>已发送({{retryTimeLeft}}s)</span>
    </div>

    <div>
      <x-button class="submit_btn" @click.native="submit()">提交</x-button>
    </div>
    <div class="text-center">
      请您填写以上表单或发邮件给<br/>linweiqin.cu@gmail.com、tianhao.cu@gmail.com，<br/>我们将第一时间和您取得联系
    </div>
    <actionsheet v-model="cooperationTypeShow" :menus="cooperationTypeMap"
                 @on-click-menu="cooperationTypeClick"></actionsheet>
  </div>
</template>

<script>
  import Selector from "vux/src/components/selector";
  import Actionsheet from "vux/src/components/actionsheet";
  import Flexbox from "vux/src/components/flexbox/flexbox";
  import FlexboxItem from "vux/src/components/flexbox/flexbox-item";
  import XButton from "vux/src/components/x-button";

  export default {
    components: {
      XButton,
      FlexboxItem,
      Flexbox,
      Actionsheet,
      Selector
    },
    data() {
      return {
        cooperationTypeIndex: 0,
        cooperationTypeShow: false,
        cooperationTypeMap: {
          1: '云端设备管理（设备上云免费试用）',
          2: '自动化（DCS）控制系统',
          3: '工厂自动化运维',
          4: '工业互联网解决方案',
          5: '其他'
        },
        formData: {
          name: null,
          phone: null,
          requirement: null,
          verifyCode: null,
          orgName: null,
        },
        retryTimeLeft: -1
      }
    },
    methods: {
      cooperationTypeClick: function (index) {
        this.cooperationTypeIndex = index;
      },
      getVerifyCode: function () {
        let that = this;
        if (!this.formData.phone || !/^1[0-9]{10}$/.test(this.formData.phone)) {
          this.$commom.alert('请输入正确的手机号码');
          return;
        }
        let params = {
          phone: this.formData.phone,
          userName:this.formData.name
        };
        this.$http(this.$API.sendSmsForOpportunity, params, true).then((res) => {
          if (res) {
            that.retryTimeLeft = 60;
            const timer = setInterval(function () {
              if (that.retryTimeLeft < 0) {
                clearInterval(timer);
              } else {
                that.retryTimeLeft--;
              }
            }, 1000)
          }
        });
      },
      checkOpportunity: function () {
        if (this.cooperationTypeIndex == 0) {
          this.$commom.alert('请选择合作类型');
          return;
        }
         if (!this.formData.orgName || this.formData.orgName.length <= 0) {
          this.$commom.alert('请输入您的公司名称');
          return;
        }
        if (!this.formData.phone || !/^1[0-9]{10}$/.test(this.formData.phone)) {
          this.$commom.alert('请输入正确的手机号码');
          return;
        }
        if (!this.formData.verifyCode || this.formData.verifyCode.length <= 0) {
          this.$commom.alert('请输入验证码');
          return;
        }
        let params = {};
        params.verifyCode = this.formData.verifyCode;
        params.phone = this.formData.phone;
        params.name = this.formData.name;
        params.requirement = this.formData.requirement;
        params.requireType = this.cooperationTypeIndex;
        params.orgName = this.formData.orgName;
        params.source = 2;
        return params
      },
      submit: function () {
        let params = this.checkOpportunity();
        if (!params) {
          return;
        }
        let that = this;
        this.$http(this.$API.saveOpportunity, params, true).then((res) => {
          if (res) {
            this.$commom.alert('添加成功');
            let userAgent = navigator.userAgent.toLowerCase();
            if(userAgent.indexOf('micromessenger')>=0){
              wx.closeWindow();
            }else{
              that.$router.replace({name:'Promotion'});
            }
          }
        })
      }
    },
    created: function () {

    }
  }
</script>

<style>
  .opportunity {
    color: #ffffff;
    background: #1C1F37;
    height: 100vh;
    overflow: auto;
    padding-top: 16px;
  }

  .opportunity .desc_block {
    background-color: #03061C;
    padding: 10px 16px;
  }

  .opportunity .desc_block textarea {
    width: 100%;
    height: 100px;
    border-radius: 4px;
    margin-top: 10px;
  }

  .opportunity .cooperation_type {
    margin-top: 16px !important;
  }

  .opportunity .input_row {
    background-color: #03061C;
    margin-top: 2px;
    padding: 10px;
    color: white;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .opportunity .input_row .title {
    flex-basis: 60px;
  }

  .opportunity .input_row .value {
    padding: 0 10px;
    flex-grow: 2;
    color: white !important;
  }

  .opportunity .input_row .img_right {
    width: 8px;
    flex-basis: 8px;
  }

  .opportunity .input_row .sendVerifyBtn {
    text-decoration: underline;
  }

  .opportunity .submit_btn {
    width: 80%;
    margin: 20px auto;
    background-color: #3967DC;
    color: white;
  }

  .opportunity input::-webkit-input-placeholder {
    color: #DADADA;
  }

  .opportunity input:-moz-placeholder {
    color: #DADADA;
  }

  .opportunity input::-moz-placeholder {
    color: #DADADA;
  }

  .opportunity input:-ms-input-placeholder {
    color: #DADADA;
  }

  .opportunity textarea::-webkit-input-placeholder {
    color: #BABABA;
  }

  .opportunity textarea:-moz-placeholder {
    color: #BABABA;
  }

  .opportunity textarea::-moz-placeholder {
    color: #BABABA;
  }

  .opportunity textarea:-ms-input-placeholder {
    color: #BABABA;
  }
</style>
