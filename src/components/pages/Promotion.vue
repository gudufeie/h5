<template>
  <div class="promotion" v-show="status">
    <div class="header">
      <img src="../../assets/icon/header-logo.png">
      <div class="require">
        <div class="btn" @click="openOpportunity()">商务合作</div>
      </div>
      <div class="btn" @click="toLogin" v-show="btnStatus">工业云平台</div>
    </div>
    <img src="../../assets/icon/promontion-1.png" class="img1">
    <div class="main1">
      <div class="item">
        <div class="title">丰富实践</div>
        <div class="value">我们具备从设备到工厂级群级的丰富实践</div>
      </div>
      <div class="item">
        <div class="title">开放平台</div>
        <div class="value">共享工业云平台、祝您飞跃发展</div>
      </div>
      <div class="item">
        <div class="title">数据挖掘</div>
        <div class="value">对数据进行深入挖掘，提供数据咨询服务</div>
      </div>
      <div class="item">
        <div class="title">优化产能</div>
        <div class="value">运用大数据对现有产能进行精细化管理</div>
      </div>
      <img src="../../assets/icon/promontion-2.png">
    </div>
    <div class="main2">
      <div class="title">
        <div class="title1">工业一体化解决方案</div>
        <div class="title2">储存、计算、创新、安全、人工智助您飞跃发展</div>
      </div>
      <div class="box">
        <div class="item">
          <img src="../../assets/icon/main2-1.png">
          <div class="text">云端监控</div>
          <div class="value">存储、整理数据实现工业数据云端监控</div>
        </div>
        <div class="item">
          <img src="../../assets/icon/main2-2.png">
          <div class="text">自动化控制系统</div>
          <div class="value">搭建或者改造适合企业运营模式的自动化控制系统</div>
        </div>
        <div class="item">
          <img src="../../assets/icon/main2-3.png">
          <div class="text">最优控制策略</div>
          <div class="value">数据建模，提供详细的设备保养周期表、适用于当前生产工况的工艺参数</div>
        </div>
        <div class="item">
          <img src="../../assets/icon/main2-4.png">
          <div class="text">无人工厂</div>
          <div class="value">整合ERP系统及自动控制系统，实现智能监控、无人工厂</div>
        </div>
      </div>
    </div>
    <div class="main3">
      <div class="title">
        <div class="title1">提供安全合规的服务内容</div>
        <div class="title2">优化产能、打造智能产能、运营数据挖掘</div>
      </div>
      <div class="main">
        <img src="../../assets/icon/main3-bg.png" class="bg">
        <div class="box1">
          <p>设备级</p>
          <p>子系统级</p>
          <p>生产线级</p>
          <p>工厂级</p>
          <p>工厂级群集</p>
        </div>
        <div class="box2">
          <p>自动化系统</p>
          <p>运维服务</p>
        </div>
        <div class="box3">
          <p>云端监控</p>
          <p>数据挖掘</p>
          <p>智能升级</p>
        </div>
      </div>
    </div>
    <div class="main4">
      <div class="item">
        <div class="title">
          <!-- <img src="../../assets/icon/main4-1.png"> -->
          <span>优化现有产能</span>
        </div>
        <div class="value">运用大数据对现有产能进行精细化管理；加装智能物联网设备，实现数据采集、远程控制等功能</div>
      </div>
      <div class="item">
        <div class="title">
          <!-- <img src="../../assets/icon/main4-1.png"> -->
          <span>打造智能产能</span>
        </div>
        <div class="value">联合客户设计团队共同打造多维度智能节点；一次安装到位，数据采集、远程控制同步就位</div>
      </div>
      <div class="item">
        <div class="title">
          <!-- <img src="../../assets/icon/main4-1.png"> -->
          <span>运营数据挖掘</span>
        </div>
        <div class="value">对采集数据进行深入挖掘建模，结合行业特点、运营规律提供高质量数据咨询服务</div>
      </div>
    </div>
    <div class="main5">
      <div class="title">
        <div class="title1">精选高品质服务方式</div>
        <div class="title2">海纳百川、精选高品质</div>
      </div>
      <div class="main">
        <div class="item">
          <img src="../../assets/icon/main5-1.png">
          <div class="right">
            <div class="text">低成本验证改造效果</div>
            <div class="value">
              <div>产线监控</div>
              <div class="border">运维预警</div>
              <div>人力统筹</div>
            </div>
            <div class="value">
              <div>供应链管理</div>
              <div class="border">精细数据采集</div>
              <div>销量预测</div>
            </div>
          </div>
        </div>
        <div class="item">
          <img src="../../assets/icon/main5-2.png">
          <div class="right">
            <div class="text">零成本接入工业云</div>
            <div class="value">
              <div>参数提取</div>
              <div class="border">数据归集</div>
              <div>建模分析</div>
            </div>
            <div class="value">
              <div>数据可视化</div>
              <div class="border">精细化管理</div>
              <div>产能优化</div>
            </div>
          </div>
        </div>
        <div class="item">
          <img src="../../assets/icon/main5-3.png">
          <div class="right">
            <div class="text">高回报依托智能升级</div>
            <div class="value">
              <div>产线升级</div>
              <div class="border">数据挖掘</div>
              <div>智能管控</div>
            </div>
            <div class="value">
              <div>战略分析</div>
              <div class="border">运营咨询</div>
              <div>知识沉淀</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main6">
      <div class="title">
        <div class="title1">成功案例</div>
        <div class="title2">真正解决客户的问题</div>
      </div>
      <div class="main">
        <div class="item1 bg1">
          <div class="text1">自动化系统 —— 整改 —— 设备升级</div>
          <div class="text2">多品牌中央空调机组节能整改（定频改变频）</div>
          <img src="../../assets/icon/main6-1.png">
        </div>
        <div class="item2 bg2">
          <div class="left">
            <div class="text1">自动化系统 —— 整改—— 子系统升级</div>
            <div class="text2">内蒙古乌海化工单筒烘干窑控制系统整改</div>
          </div>
          <img src="../../assets/icon/main6-2.png">
        </div>
        <div class="item2 bg1">
          <div class="left">
            <div class="text1">工业云平台化监控 —— 自动化实施、</div>
            <div class="text1">智能化分析、预测 —— 工厂集群集中控制</div>
            <div class="text2">承德天宝集团工厂集群互联网化管理</div>
          </div>
          <img src="../../assets/icon/main6-3.png">
        </div>
        <div class="item2 bg2">
          <div class="left">
            <div class="text1">自动化系统 —— 整改—— 子系统升级</div>
            <div class="box">
              <div class="text2">视频监控系统</div>
              <div class="text2">料位检测子系统</div>
              <div class="text2">无人值守称重系统</div>
              <div class="text2">烘干窑控制系统</div>
            </div>
          </div>
          <img src="../../assets/icon/main6-4.png">
        </div>
        <div class="item2 bg1">
          <div class="left">
            <div class="text1">自动化系统 —— 整改—— 子系统升级</div>
            <div class="text2">重庆莱宝高科高压变频中央空调能源管理系统</div>
          </div>
          <img src="../../assets/icon/main6-5.png">
        </div>
        <div class="item2 bg2">
          <div class="left">
            <div class="text1">运营维护 —— 数据平台 —— 工厂级</div>
            <div class="text2">承德天宝铁矿一期选厂人员优化数据</div>
          </div>
          <img src="../../assets/icon/main6-6.png">
        </div>
        <div class="item2 bg1">
          <div class="left">
            <div class="text1">自动化系统 —— 整改—— 子系统升级</div>
            <div class="box">
              <div class="text2">皮带半自动化维护</div>
              <div class="text2">车间广播系统</div>
              <div class="text2">品位检测自动化</div>
              <div class="text2">中央空调机房群控系统</div>
            </div>
          </div>
          <img src="../../assets/icon/main6-7.png">
        </div>
      </div>
    </div>
    <div class="footer">
      <div>Copyright © Innovation & Union Technology Co. Ltd, All Rights Reserved 京ICP备18013191号</div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "promotion",
    data: function () {
      return {
        //是否显示页面状态
        status: false,
        //工业云平台按钮显示状态
        btnStatus: true,
      }
    },
    created: function () {
      var ua = navigator.userAgent.toLowerCase();
      var isWeixin = ua.indexOf('micromessenger') != -1;
      if (!isWeixin) {
        this.status = true;
        // this.btnStatus = false;
        return;
      }
      const that = this;
      if (this.$route.query.openId) {
        if (this.$route.query.status == 'true') {
            this.$http(this.$API.getUserInfo, {}).then((res) => {
              if (res) {
                that.$store.commit('saveUser', res);
                if (this.$route.query.deviceId && this.$route.query.deviceId !== 'null') {
                  this.$router.push({name: 'deviceDetailRun', query: {deviceId: this.$route.query.deviceId}})
                } else {
                  that.showDefaultPage(res);
                }
              }else {
                that.status = true;
              }
          })
        } else {
          this.status = true;
        }
      }else if(this.$route.query.stop=='1'){
          this.status = true;
      } else {
        this.$http(this.$API.getWxCode, {callbackUrl: location.href}, true).then((res) => {
          if (res) {
            location.href = res;
          }
        });
      }
    },
    methods: {
      //去登录
      toLogin: function () {
        localStorage.setItem('openId', JSON.stringify(this.$route.query.openId));
        localStorage.setItem('nickName', JSON.stringify(decodeURI(this.$route.query.nickName)));
        this.$router.replace({name: 'Login', query: {type: true}});
      },
      openOpportunity: function () {
        this.$router.push({name: 'opportunity'});
      },
      showDefaultPage: function (userInfo) {
        if (!userInfo || !userInfo.roleAction || userInfo.roleAction.length <= 0) {
          this.$commom.alert("用户没有微信权限");
          return;
        }
        let userActionMap = {};
        for (let item of userInfo.roleAction) {
          userActionMap[item.pageId] = item;
        }
        if (userActionMap['wechat_data'] != null) {
          this.$router.push({name: 'produce'});
        } else if (userActionMap['wechat_run'] != null) {
          this.$router.push({name: 'run'});
        } else if (userActionMap['wechat_manage'] != null) {
          this.$router.push({name: 'manage'});
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .promotion {
    height: 100vh;
    overflow: auto;
    img {
      vertical-align: middle;
    }
    .header {
      background: #0C1728;
      height: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 4px;
      img {
        width: 94px;
        height: 12px;
      }
      .btn {
        color: #ffffff;
        margin-right: 12px;
        padding: 0 6px;
        border: 1px solid #FFFFFF;
      }
      .require {
        flex-basis: 45%;
        text-align: right;
        .btn {
          display: inline-block;
        }
      }
    }
    .img1 {
      height: 363px;
    }
    .main1 {
      background: #FAFCFC;
      display: flex;
      flex-wrap: wrap;
      position: relative;
      .item {
        width: 50%;
        height: 99px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .title {
          width: 82px;
          margin: 0 64px 0 43px;
          font-size: 15px;
          color: #2E313D;
          border-bottom: 2px solid #0059BF;
        }
        .value {
          font-size: 12px;
          color: #6F7880;
          line-height: 16.5px;
          width: 106px;
          margin-top: 5px;
        }
      }
      img {
        width: 76px;
        height: 76px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .main2 .title, .main3 .title, .main5 .title, .main6 .title {
      padding: 24px 0;
      text-align: center;
      .title1 {
        font-size: 16px;
        color: #004A90;
        letter-spacing: 2.43px;
      }
      .title2 {
        font-size: 12px;
        color: #202330;
        letter-spacing: 1.98px;

      }
    }
    .main2 {
      .box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 0 46px;
        .item {
          border: 1px solid #D3D3D3;
          width: 273px;
          height: 154px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 19px;
          img {
            width: 30px;
            height: 26px;
            padding-top: 12px;
          }
          .text {
            font-size: 11px;
            color: #202330;
            letter-spacing: 1.5px;
            text-align: center;
            padding: 5px 0 23px;
          }
          .value {
            color: #676565;
            width: 230px;
            line-height: 16px;
            text-align: center;
            padding: 0 4px;
          }
        }
      }
    }
    .main3 {
      .main {
        height: 187px;
        position: relative;
        .bg {
          position: absolute;
          top: 0;
          left: 0;
        }
        div {
          width: 69px;
          position: absolute;
          text-align: center;
          color: #4A5258;
        }
        .box1 {
          top: 60px;
          left: 28px;
        }
        .box2 {
          top: 40px;
          left: 154px;
        }
        .box3 {
          top: 76px;
          left: 280px;
        }
      }
    }
    .main4 {
      margin-top: 34px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0 5px;
      .item {
        width: 273px;
        text-align: center;
        color: #4A5258;
        margin-bottom: 25px;
        .title {
          padding-bottom: 7px;
          color: #202330;
          img {
            width: 20px;
            height: 20px;
          }
          span {
            margin-left: 9px;
          }
        }
      }
    }
    .main5 {
      padding-bottom: 62px;
      .main {
        .item {
          margin-top: 21px;
          display: flex;
          justify-content: center;
          align-items: center;
          .right {
            width: 228px;
            margin-left: 25px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .text {
              margin: 9px 0 7px;
            }
            .value {
              display: flex;
              margin-top: 4px;
              div {
                padding: 0 7px;
              }
              .border {
                border-left: 1px solid #A0ADB7;
                border-right: 1px solid #A0ADB7;
              }
            }
          }
          img {
            width: 27px;
            height: 20px;
          }

        }
      }
    }
    .main6 {
      background: #F9F9F9;
      padding-bottom: 62px;
      .main {
        margin: 0 38px;
        .bg1 {
          background: #F7FDFF;
        }
        .bg2 {
          background: #ECFBFE;
        }
        div {
          .text1 {
            font-size: 13px;
            color: #004A90;
          }
          .text2 {
            color: #202330;
          }
        }
        .item1 {
          text-align: center;
          width: 100%;
          .text1 {
            padding: 53px 0 17px;
          }
          .text2 {
            padding-bottom: 63px;
          }
        }
        .item2 {
          display: flex;
          padding: 25px 9px;
          .left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0 4px;
          }
          img {
            width: 100px;
            height: 100px;
          }
        }
      }
    }
    .footer {
      color: #AEB0B8;
      text-align: center;
      padding: 0 45px;
    }
  }
</style>
