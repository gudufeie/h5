<template>
  <div class="deviceDetailManage">
    <div class="mainBox" ref="mainBox">
      <div>
        <div class="detail">
          <div class="baseInfo" style="color: #fff">基本信息</div>
          <div class="deviceName">设备名称 <span>{{deviceInfo.name}}</span></div>
          <div class="deviceCode">设备编号 <span>{{deviceInfo.code}}</span></div>
          <div class="departmentName">所在部门 <span>{{departmentName}}</span></div>
          <div class="runOrNot">是否运行 
            <span v-if="deviceInfo.runStatus == 0">停止</span>
            <span v-else-if="deviceInfo.runStatus == 1">运行</span>
            <span v-else>-</span>
          </div>
          <div class="deviceState">设备状态 
            <span v-if="deviceInfo.status == 1">无</span>
            <span v-else-if="deviceInfo.status == 2">运转</span>
            <span v-else-if="deviceInfo.status == 3">停止</span>
            <span v-else-if="deviceInfo.status == 4">异常</span>
            <span v-else-if="deviceInfo.status == 5">模块异常</span>
            <span v-else>-</span>
          </div>
        </div>
        <div class="docCheckRecord">
          <div class="baseInfo">点巡检记录</div>
          <button-tab>
            <button-tab-item selected  @on-item-click="changeTab('设备点巡检')">设备点巡检</button-tab-item>
            <button-tab-item  @on-item-click="changeTab('部件点巡检')">部件点巡检</button-tab-item>
          </button-tab>
          <x-table 
            v-if="dotCheckDeviceComponent" 
            class="tab-swiper vux-center" 
            :cell-bordered="false" 
            :full-bordered="false" 
            :content-bordered="true" 
            style="background-color:#22233f;">
            <thead>
              <tr>
                <th>设备名称</th>
                <th style="width:130px;" @click="leapfrogSort('update_time', sort1)">最后点巡检时间 <font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
                <th>负责人</th>
                <th>结果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record,index) in deviceDotCheck" :key="index">
                <td>{{record.name}}</td>
                <td>{{record.update_time | formatDate}}</td>
                <td>{{record.operatorName}}</td>
                <td>{{record.check_result}}</td>
              </tr>
            <tr class="openmore">
              <td></td>
              <td></td>
              <td></td>
              <td @click="toDeviceDotCheck()" class="slideMore"><span style="color: #3967DC">展开</span> >></td>
            </tr>
            </tbody>
          </x-table>
          <x-table v-if="dotCheckDeviceComponent == false" class="tab-swiper vux-center" :cell-bordered="false" :full-bordered="false" :content-bordered="true" style="background-color:#22233f;">
            <thead>
              <tr>
                <th>部件名称</th>
                <th style="width:130px;" @click="leapfrogSort('update_time', sort1)">最后点巡检时间 <font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
                <th>负责人</th>
                <th>结果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record,index) in componentDotCheck" :key="index">
                <td>{{record.name}}</td>
                <td>{{record.update_time | formatDate}}</td>
                <td>{{record.operatorName}}</td>
                <td>{{record.check_result}}</td>
              </tr>
              <tr class="openmore">
              <td></td>
              <td></td>
              <td></td>
              <td @click="toComponentDotCheck()"  class="slideMore"><span style="color: #3967DC">展开</span> >></td>
            </tr>
            </tbody>
          </x-table>

        </div>
        <div class="replaceRecord">
          <div class="baseInfo">更换记录</div>
          <button-tab>
            <button-tab-item selected  @on-item-click="changeTab('设备更换记录')">设备更换记录</button-tab-item>
            <button-tab-item  @on-item-click="changeTab('部件更换记录')">部件更换记录</button-tab-item>
          </button-tab>
          <x-table v-if="replaceDeviceComponent" class="tab-swiper vux-center" :cell-bordered="false" :full-bordered="false" :content-bordered="true" style="background-color:#22233f;">
            <thead>
              <tr>
                <th>设备名称</th>
                <th>设备编号</th>
                <th @click="leapfrogSort2('update_time', sort2, 2)">更换时间 <font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
                <th>操作人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record,index) in deviceReplace" :key="index">
                <td>{{record.name}}</td>
                <td>{{record.code}}</td>
                <td style="width:150px;">{{record.update_time | formatDate}}</td>
                <td>{{record.operatorName}}</td>
              </tr>
              <tr class="openmore">
              <td></td>
              <td></td>
              <td></td>
              <td @click="toDeviceReplaceList" class="slideMore"><span style="color: #3967DC">展开</span> >></td>
              </tr>
            </tbody>
          </x-table>
          <x-table v-if="replaceDeviceComponent == false" class="tab-swiper vux-center" :cell-bordered="false" :full-bordered="false" :content-bordered="true" style="background-color:#22233f;">
            <thead>
              <tr>
                <th>部件名称</th>
                <th>部件编号</th>
                <th @click="leapfrogSort2('update_time', sort2, 2)">更换时间 <font-awesome-icon :icon="['fa','sort']" size="lg" /></th>
                <th>操作人</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record,index) in componentReplace" :key="index">
                <td>{{record.name}}</td>
                <td>{{record.code}}</td>
                <td style="width:150px;">{{record.update_time | formatDate}}</td>
                <td>{{record.operator}}</td>
              </tr>
              <tr class="openmore">
              <td></td>
              <td></td>
              <td></td>
              <td @click="toComponentReplaceList" class="slideMore"><span style="color: #3967DC">展开</span> >></td>
            </tr>
            </tbody>
          </x-table>
        </div>
      </div>
    </div>
    <shortcut-menu></shortcut-menu>
  </div>
</template>

<style scoped>
  #app, .content{
    width: 100% !important;
    height: 100% !important;
  }
  .deviceDetailManage{
    position: fixed;
    height: 100%;
    width: 94%;
    background: #22233f;
    padding: 0 3%;
    padding-bottom: 20px;
    color: #fff
  }
  .device-selected{height: 50px}

  .mainBox{
    height: 90%;
    margin-top: 10px;
    overflow: hidden;
    width: 100%;
    color: #fff;
  }
  .detail{
    border-bottom: 1px rgba(255,255,255,0.5) solid;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }
  .detail div{
    color: rgba(255,255,255,0.5);
    font-size: 14px;
    padding: 10px 0;
    margin: 0 10px;
  }
  .detail div span{
    margin-left: 30px;
    color: #ffffff;
  }

  .baseInfo{
    padding-left: 10px;
    margin-top: 20px;
    margin-bottom: 15px;
  }

  .vux-button-group{
    margin-bottom: 15px;
  }
  .vux-button-group > a.vux-button-group-current{
    background: #3967DC!important;
  }
  .vux-button-group > a.vux-button-tab-item-first:after, .vux-button-group > a.vux-button-tab-item-last:after{border: none!important;}

  .vux-table{
    width:100%;
  }
  .vux-table:after{border: none!important;}
  /* .vux-table thead tr{width: 100%} */
  .openmore td:before{border: none!important;}


  .flex-demo {
    text-align: center;
    color: #fff;
    background-color: #323465;
    border-radius: 4px;
    background-clip: padding-box;
    height: 125px;
  }
  .flex-demo img{
      width: 40px;
      height: 40px;
      margin-bottom: 5px;
    }
  .flex-demo .lineImg1{
      margin-top: 35px;
    }
  .flex-demo .lineImg2{
      margin-top: 20px;
    }

  table{
    width: 100%;
    table-layout:fixed;
  }

  table td{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>

<script>
  import BScroll from "better-scroll";
  import { XDialog, TransferDomDirective as TransferDom, XTable, LoadMore,XButton,Toast,ButtonTab, ButtonTabItem,Flexbox, FlexboxItem } from 'vux';
  import ShortcutMenu from "../../components/common/shortcut_menu.vue";

  export default {
    components: {
      XDialog,
      XTable,
      LoadMore,
      XButton,
      Toast,
      ButtonTab,
      ButtonTabItem,
      Flexbox,
      FlexboxItem,
      BScroll,
      ShortcutMenu
    },
    name: "deviceDetailManage",
    directives: {
      TransferDom
    },
    data (){
      return {
        //多选状态
        status: false,
        deviceId: '',
        deviceDetail: {},
        show: false,
        checkList: [],
        toastShow: false,
        toastText: null,
        //edit by xu
        deviceMessage: {},
        deviceComponent: [],
        deviceDotCheck:[],
        componentDotCheck: [],
        //点巡检 默认为展示设备
        dotCheckDeviceComponent: true,
        //更换 默认为展示设备
        replaceDeviceComponent: true,
        show4: false,
        deviceReplace:[],
        componentReplace: [],
        sort1: false,
        sort2: false,
        sort3: false,
        sortType: 'changeTime',
        nowselect1: 'left',
        nowselect2: 'left',
        deviceInfo:{},
        departmentName:''
      }
    },
    created() {
        this.deviceDetail = this.$route.query.deviceInfo;
        if(this.deviceDetail.deviceId){
          this.deviceId = this.deviceDetail.deviceId;
        }else if(this.deviceDetail.device_id){
          this.deviceId = this.deviceDetail.device_id;
        }
        if(this.deviceDetail.departmentName){
          this.departmentName = this.deviceDetail.departmentName;
        }else if(this.deviceDetail.department_name){
          this.departmentName = this.deviceDetail.department_name;
        }
        this.getDeviceInfo();
        this.getDeviceComponentDetail();

    },
    methods: {
      //获取设备部件
      getDeviceComponentDetail: function(){
        let that = this;
        this.$http(this.$API.listDeviceComponent + '/' + this.deviceId,{},true).then( (res) => {
          if(res){
            that.deviceComponent = res;
          }
        });
        //当前设备的点巡检记录
        this.$http(this.$API.loadDeviceCheckRecordByDeviceId,{deviceId:this.deviceId},true).then( (res) => {
          if(res){
            if(res.length >10){
              res=res.slice(0,10)
            }
            for(let i in res){
              let dic ={}
              dic.name = res[i].name;
              dic.update_time = res[i].update_time;
              dic.operatorName = res[i].operatorName;
              if(res[i].check_result == 1){
                dic.check_result = '正常';
              }else if(res[i].check_result == 2){
                dic.check_result = '轻微故障';
              }else if(res[i].check_result == 3){
                dic.check_result = '中度故障';
              }else{
                dic.check_result = '重故障';
              }
              that.deviceDotCheck.push(dic)
            }
          }
        });
        //当前设备的更换记录
        this.$http(this.$API.loadDeviceAllReplaceRecord,{deviceId:this.deviceId},true).then( (res) => {
          if(res){
            if(res.length >10){
              res=res.slice(0,10)
            }
            for(let i in res){
              let dic ={}
              dic.name = res[i].name;
              dic.code = res[i].code;
              dic.update_time = res[i].update_time;
              dic.operatorName = res[i].operatorName;
              that.deviceReplace.push(dic)
            }
          }
        });
        //当前设备下所有部件的点巡检记录
        this.$http(this.$API.loadComponentCheckRecord,{deviceId:this.deviceId},true).then( (res) => {
          if(res){
            if(res.length >10){
              res=res.slice(0,10)
            }
            for(let i in res){
              let dic ={}
              dic.name = res[i].componentName;
              dic.update_time = res[i].update_time;
              dic.operatorName = res[i].operatorName;
              if(res[i].check_result == 1){
                dic.check_result = '正常';
              }else if(res[i].check_result == 2){
                dic.check_result = '轻微故障';
              }else if(res[i].check_result == 3){
                dic.check_result = '中度故障';
              }else{
                 dic.check_result = '重度故障';
              }
              that.componentDotCheck.push(dic)
            }
          }
        });
        //当前设备下所有部件的更换记录
        this.$http(this.$API.loadCompReplaceRecord,{deviceId:this.deviceId},true).then( (res) => {
          if(res){
            if(res.length >10){
              res=res.slice(0,10)
            }
            for(let i in res){
              let dic ={}
              dic.name = res[i].name;
              dic.code = res[i].code;
              dic.update_time = res[i].update_time;
              dic.operator = res[i].operator;
              that.componentReplace.push(dic)
            }
          }
        });
      },
      //设备更换记录
      toDeviceReplaceList: function(){
        this.$router.push({name: 'deviceReplaceList',query: {deviceId: this.deviceId}});
      },
      //部件更换记录
      toComponentReplaceList: function(){
        this.$router.push({name: 'componentReplaceList',query: {deviceId: this.deviceId}});
      },

      // 获取设备信息
      getDeviceInfo: function(){
        this.$http(this.$API.getDeviceDetail,{deviceId:this.deviceId},true).then((data)=>{
          this.deviceInfo = data;
        })
      },

      //显示
      replaceShow() {
        this.show = true
        this.preventBodyScroll(true)
      },
      //关闭
      replaceHide() {
        this.show = false
        this.preventBodyScroll(false)
      },
      //阻止底部滚动
      preventBodyScroll(type) {
        let deviceDetailManage = document.querySelector('.deviceDetailManage')
        if(type) {
          deviceDetailManage.style.height = '100vh'
          deviceDetailManage.style['overflow-y'] = 'hidden'
        } else {
          deviceDetailManage.style['min-height'] = '100vh'
          deviceDetailManage.style['overflow-y'] = 'auto'
        }
      },
      //一键更换
      replace: function(){
        const list = this.user.roleAction;
        let manageStatus = false;
        for(var i=0; i<list.length; i++){
          if(list[i].pageId == 'wechat_manage'){
            if(list[i].actions.indexOf('一键更换') != -1){
              manageStatus = true;
              break;
            }
          }
        }
        if(!manageStatus){
          this.$commom.alert('您没有权限一键更换');
          return;
        }

        let array = [];
        for(let i=0; i<this.deviceComponent.length; i++){
          if(this.deviceComponent[i].status){
            array.push(this.deviceComponent[i].configId);
          }
        }
        if(array.length <= 0){
          this.toastShow = true
          this.toastText = '请选择部件'
          return;
        }
        let str = array.join(',');
        let that = this;
        this.$http(this.$API.onekeyReplace,{configIds: str},true,that.resetStatus).then( (res) => {
          if(res){
            this.show = false
            this.preventBodyScroll(false)
            that.$commom.alert(res,true);
            that.resetStatus();
          }
        });
      },
      //选择部件
      select: function(index){
        if(this.deviceComponent[index].status){
          this.$set(this.deviceComponent[index],'status',false);
        }else{
          this.$set(this.deviceComponent[index],'status',true);
        }
      },
      //添加更换记录
      toAddReplace: function(data){
        const list = this.user.roleAction;
        let status = false;
        for(var i=0; i<list.length; i++){
          if(list[i].pageId == 'wechat_manage'){
            if(list[i].actions.indexOf('添加更换记录') != -1){
              status = true;
              break;
            }
          }
        }
        if(status){
          this.$store.commit('saveComponentData',data)
          this.$store.commit('saveDeviceComponent',this.deviceComponent);
          this.$router.push({name: 'addReplace'});
        }else{
          this.$commom.alert('您没有权限添加更换记录');
        }
      },
      //重置部件选中状态
      resetStatus: function(){
        const list = this.deviceComponent;
        for(var i=0; i<list.length; i++){
          list[i].status = false;
        }
        this.deviceComponent = list;
      },
       //入库管理
      inventJump:function(){

    		this.$router.push({name:'inventoryManage',query:{id:this.deviceId}})
      },
      //切换点巡检信息和更换记录信息
      changeTab: function(index){
        if (index == '设备点巡检'){
          this.dotCheckDeviceComponent = true;
          this.nowselect1 = 'left';
        }else if (index == '部件点巡检'){
          this.dotCheckDeviceComponent = false;
          this.nowselect1 = 'right';
        }else if(index == '设备更换记录'){
          this.replaceDeviceComponent = true;
          this.nowselect2 = 'left';
        }else if(index == '部件更换记录'){
          this.replaceDeviceComponent = false;
          this.nowselect2 = 'right';
        }
      },
      showVuePopup4(flag) {
        this.show4 = flag;
      },
      //点击跳转到设备点巡检页面
      toDeviceDotCheck: function () {
        this.$router.push({name: 'deviceCheckRecord',query: {deviceId: this.deviceId}});
      },
      //点击跳转到部件点巡检页面
      toComponentDotCheck: function () {
        this.$router.push({name: 'componentCheckRecord',query: {deviceId: this.deviceId}});
      },
      leapfrogSort(type, sorted) {
        if (sorted === false) {
          this.sort1 = true;
          this.sortType = type;
          if (this.nowselect1 === 'left'){
            this.deviceDotCheck.sort(this.compare(type));
          }else{
            this.componentDotCheck.sort(this.compare(type));
          }

        }else{
          this.sort1 = false;
          this.sortType = type;
          if (this.nowselect1 === 'left'){
            this.deviceDotCheck.sort(this.compare2(type));
          }else{
            this.componentDotCheck.sort(this.compare2(type));
          }
        }

      },
      leapfrogSort2(type, sorted, sortnumber) {
        if (sortnumber === 2){
          if (sorted === false) {
            this.sort2 = true;
            this.sortType = type;
            if(this.nowselect2 === 'left'){
              this.deviceReplace.sort(this.compare(type));
            }else{
              this.componentReplace.sort(this.compare(type));
            }
          }else{
            this.sort2 = false;
            this.sortType = type;
            if(this.nowselect2 === 'left'){
              this.deviceReplace.sort(this.compare2(type));
            }else{
              this.componentReplace.sort(this.compare2(type));
            }
          }
        }else {
          if (sorted === false) {
            this.sort3 = true;
            this.sortType = type;
            if(this.nowselect2 === 'left'){
              this.deviceReplace.sort(this.compare(type));
            }else{
              this.componentReplace.sort(this.compare(type));
            }
          }else{
            this.sort3 = false;
            this.sortType = type;
            if(this.nowselect2 === 'left'){
              this.deviceReplace.sort(this.compare2(type));
            }else{
              this.componentReplace.sort(this.compare2(type));
            }
          }
        }
      },
      compare(attr) {
        return function(a,b){
           var x = a[attr];
           var y = b[attr];
           return ((x>y)?-1:(x<y)?1:0)
        }
      },
      compare2(attr) {
        return function(a,b){
           var x = a[attr];
           var y = b[attr];
           return ((x<y)?-1:(x>y)?1:0)
        }
      },
    },
    mounted(){
      this.$nextTick(() => {
            this.Scroll = new BScroll(this.$refs.mainBox,{click: true, tap: true});
        })
    },
  }
</script>
