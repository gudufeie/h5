import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/pages/login"
import Promotion from "../components/pages/promotion"
import Produce from "../components/pages/produce/produce.vue"
import AllProduce from "../components/pages/all_produce/all_produce.vue"
import Run from "../components/pages/run"
import Manage from "../components/pages/manage"
import MyDevice from "../components/pages/myDevice"
import DeviceDetailRun from "../components/pages/deviceDetailRun"
import CheckHistory from "../components/pages/checkHistory"
import CheckHistoryDetail from "../components/pages/checkHistoryDetail"
import AddCheckHistory from "../components/pages/addCheckHistory"
import DeviceDetailManage from "../components/pages/deviceDetailManage"
import DeviceReplaceList from "../components/pages/deviceReplaceList"
// import DeviceSeeRecordComponent from "../components/pages/deviceSeeRecordComponent"
import ReplaceDetail from "../components/pages/replaceDetail"
import AddReplace from "../components/pages/addReplace"
import Opportunity from "../components/pages/opportunity/opportunity.vue"
import InventoryManage from "../components/pages/inventory/inventoryManage"
import InventoryTree from "../components/pages/inventory/inventoryTree"
import Homepage from "../components/pages/homepage"
import OperaionManage from "../components/pages/operaionManage"
import SpotCheck from "../components/pages/spotCheck"
import AddDeviceCheck from "../components/pages/addDeviceCheck"
import AddComponentCheck from "../components/pages/addComponentCheck"
import DeviceCheckRecord from "../components/pages/deviceCheckRecord"
import ComponentCheckRecord from "../components/pages/componentCheckRecord"
import WorkSheetDetail from "../components/pages/workSheetDetail"
import WorkSheetHomePage from "../components/pages/workSheetHomePage"
import WorkSheetManage from "../components/pages/workSheetManage"
import WorkSheetInfo from "../components/pages/workSheetInfo"
import DeviceInfo from "../components/pages/deviceInfomation"
import Personality from "../components/pages/personality"
import PersonalityInformation from "../components/pages/personalityInformation"
import ChangePassword from "../components/pages/changePassword"
import EnterpriseSwitch from "../components/pages/enterpriseSwitch"
import Structure from "../components/pages/structure"
import StructureSecond from "../components/pages/structureSecond"
import StructureThird from "../components/pages/structureThird"
import StructureFourth from "../components/pages/structureFourth"
import StructureFifth from "../components/pages/structureFifth"
import ChooseChecker from "../components/pages/chooseChecker"
import AddDeviceReplace from "../components/pages/addDeviceReplace"
import AddComponentReplace from "../components/pages/addComponentReplace"
import HistoryWorkOrder from "../components/pages/historyWorkOrder"
import WorkOrderDetails from "../components/pages/workOrderDetails"
import SearchResult from "../components/pages/searchResult"
import SubmitWorkOrder from "../components/pages/submitWorkOrder"
import ComponentCheck from "../components/pages/componentCheck"
import RemindManage from "../components/pages/remindManage"
import RemindManageDetail from "../components/pages/remindManageDetail"
import SubmitRemindRecord from "../components/pages/submitRemindRecord"
import RemindHomePage from "../components/pages/remindHomePage"
import ComponentReplace from "../components/pages/componentReplace"
import ComponentReplaceList from "../components/pages/componentReplaceList"
Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    // {
    //   path: '/',
    //   name: 'Promotion',
    //   component: Promotion,
    //   meta: {
    //     title: 'IU工业云平台'
    //   }
    // },
    {
      path: '/opportunity',
      name: 'opportunity',
      component: Opportunity,
      meta: {
        title: '发布需求'
      }
    },
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/produce',
      name: 'produce',
      component: Produce,
      meta: {
        title: '生产数据'
      }
    },
    {
      path: '/produce/allProduce',
      name: 'allProduce',
      component: AllProduce,
      meta: {
        title: '全部生产数据'
      }
    },
    {
      path: '/run',
      name: 'run',
      component: Run,
      meta: {
        title: '设备运行'
      },
    },
    {
      path: '/run/myDevice',
      name: 'myDevice',
      component: MyDevice,
      meta: {
        title: '巡检历史'
      }
    },
    {
      path: '/run/deviceDetailRun',
      name: 'deviceDetailRun',
      component: DeviceDetailRun,
      meta: {
        title: '设备信息'
      }
    },
    {
      path: '/run/deviceDetailRun/checkHistory',
      name: 'checkHistory',
      component: CheckHistory,
      meta: {
        title: '巡检记录'
      }
    },
    {
      path: '/run/deviceDetailRun/checkHistory/checkHistoryDetail',
      name: 'checkHistoryDetail',
      component: CheckHistoryDetail,
      meta: {
        title: '添加巡检记录'
      }
    },
    {
      path: '/run/deviceDetailRun/addCheckHistory',
      name: 'addCheckHistory',
      component: AddCheckHistory,
      meta: {
        title: '添加巡检记录'
      }
    },
    {
      path: '/manage',
      name: 'manage',
      component: Manage,
      meta: {
        title: '设备管理'
      }
    },
    {
      path: '/manage/deviceDetailManage',
      name: 'deviceDetailManage',
      component: DeviceDetailManage,
      meta: {
        title: '设备管理'
      }
    },
    {
      path: '/manage/deviceDetailManage/deviceInfo',
      name: 'deviceInfo',
      component: DeviceInfo,
      meta: {
        title: '设备信息'
      }
    },
    {
      path: '/manage/deviceDetailManage/addReplace',
      name: 'addReplace',
      component: AddReplace,
      meta: {
        title: '更换管理'
      }
    },
    {
      path: '/manage/deviceDetailManage/deviceReplaceList',
      name: 'deviceReplaceList',
      component: DeviceReplaceList,
      meta: {
        title: '更换记录'
      }
    },
    {
      path: '/manage/deviceDetailManage/componentReplace',
      name: 'componentReplace',
      component: ComponentReplace,
      meta: {
        title: '更换记录'
      }
    },

    {
      path: '/manage/deviceDetailManage/componentReplaceList',
      name: 'componentReplaceList',
      component: ComponentReplaceList,
      meta: {
        title: '设备更换记录'
      }
    },
    {
      path: '/manage/deviceDetailManage/deviceReplaceList/replaceDetail',
      name: 'replaceDetail',
      component: ReplaceDetail,
      meta: {
        title: '更换记录详情'
      }
    },
    {
      path: '/manage/deviceDetailManage/inventoryTree',
      name: 'inventoryTree',
      component: InventoryTree,
      meta: {
        title: '部件管理'
      }
    },
    {
      path: '/manage/deviceDetailManage/inventoryManage',
      name: 'inventoryManage',
      component: InventoryManage,
      meta: {
        title: '入库管理'
      }
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: Homepage,
      meta: {
        title: '首页'
      }
    },
    {
      path:'/operaionManage',
      name:'operaionManage',
      component:OperaionManage,
      meta:{
        title:'运维管理'
      }
    },
    {
      path:'/operaionManage/spotCheck',
      name:'spotCheck',
      component:SpotCheck,
      meta:{
        title:'点巡检'
      }
    },
    {
      path:'/operaionManage/addDeviceCheck',
      name:'addDeviceCheck',
      component:AddDeviceCheck,
      meta:{
        title:'添加设备点巡检'
      }
    },
    {
      path:'/operaionManage/addComponentCheck',
      name:'addComponentCheck',
      component:AddComponentCheck,
      meta:{
        title:'添加部件点巡检'
      }
    },
    {
      path:'/operaionManage/spotCheck/deviceCheckRecord',
      name:'deviceCheckRecord',
      component:DeviceCheckRecord,
      meta:{
        title:'设备点巡检记录'
      }
    },
    {
      path:'/operaionManage/spotCheck/componentCheckRecord',
      name:'componentCheckRecord',
      component:ComponentCheckRecord,
      meta:{
        title:'部件点巡检记录'
      }
    },
    {
      path:'/operaionManage/spotCheck/workSheetDetail',
      name:'workSheetDetail',
      component:WorkSheetDetail,
      meta:{
        title:'点巡检详情'
      }
    },
    {
      path:'/workSheetHomePage',
      name:'workSheetHomePage',
      component:WorkSheetHomePage,
      meta:{
        title:'工单管理'
      }
    },
    {
      path:'/workSheetHomePage/workSheetManage',
      name:'workSheetManage',
      component:WorkSheetManage,
      meta:{
        title:'工单管理'
      }
    },
    {
      path:'/workSheetManage/workSheetInfo',
      name:'workSheetInfo',
      component:WorkSheetInfo,
      meta:{
        title:'工单信息'
      }
    },
  {
    path: '/personality',
    name: 'personality',
    component: Personality,
    meta: {
      title: '个人中心'
    }
  },
  {
    path: '/personalityInformation',
    name: 'personalityInformation',
    component: PersonalityInformation,
    meta: {
      title: '个人信息'
    }
  },
  {
    path: '/changePassword',
    name: 'changePassword',
    component: ChangePassword,
    meta: {
      title: '密码修改'
    }
  },
  {
    path: '/enterpriseSwitch',
    name: 'enterpriseSwitch',
    component: EnterpriseSwitch,
    meta: {
      title: '企业切换'
    }
  },
  {
    path: '/structure',
    name: 'structure',
    component: Structure,
    meta: {
      title: '组织架构'
    }
  },
  {
    path: '/structureSecond',
    name: 'structureSecond',
    component: StructureSecond,
    meta: {
      title: '二级组织架构'
    }
  },
  {
    path: '/structureThird',
    name: 'structureThird',
    component: StructureThird,
    meta: {
      title: '三级组织架构'
    }
  },
  {
    path: '/structureFourth',
    name: 'structureFourth',
    component: StructureFourth,
    meta: {
      title: '四级组织架构'
    }
  },
  {
    path: '/structureFifth',
    name: 'structureFifth',
    component: StructureFifth,
    meta: {
      title: '五级组织架构'
    }
  },
  {
    path: '/manage/deviceDetailManage/chooseChecker',
    name: 'chooseChecker',
    component: ChooseChecker,
    meta: {
      title: '选择点巡检审核人'
    }
  },
  {
    path: '/manage/deviceDetailManage/addDeviceReplace',
    name: 'addDeviceReplace',
    component: AddDeviceReplace,
    meta: {
      title: '添加设备更换记录'
    }
  },
  {
    path: '/manage/deviceDetailManage/addComponentReplace',
    name: 'addComponentReplace',
    component: AddComponentReplace,
    meta: {
      title: '添加部件更换记录'
    }
  },
  {
    path: '/workSheetHomePage/historyWorkOrder/',
    name: 'historyWorkOrder',
    component: HistoryWorkOrder,
    meta: {
      title: '历史工单记录'
    }
  },
  {
    path: '/workSheetHomePage/searchResult/',
    name: 'searchResult',
    component: SearchResult,
    meta: {
      title: '搜索结果'
    }
  },
  {
    path: '/workSheetHomePage/workOrderDetails/',
    name: 'workOrderDetails',
    component: WorkOrderDetails,
    meta: {
      title: '工单详情'
    }
  },
  {
    path: '/workSheetManage/workSheetInfo/submitWorkOrder/',
    name: 'submitWorkOrder',
    component: SubmitWorkOrder,
    meta: {
      title: '提交工单处理'
    }
  },
  {
    path:'/operaionManage/spotCheck/componentCheck',
    name:'componentCheck',
    component:ComponentCheck,
    meta:{
      title:'部件点巡检'
    }
  },
  {
    path: '/manage/remindHomePage',
    name: 'remindHomePage',
    component: RemindHomePage,
    meta: {
      title: '提醒管理首页'
    }
  },
  {
    path: '/manage/remindHomePage/remindManage',
    name: 'remindManage',
    component: RemindManage,
    meta: {
      title: '提醒管理'
    }
  },
  {
    path: '/manage/remindHomePage/remindManageDetail',
    name: 'remindManageDetail',
    component: RemindManageDetail,
    meta: {
      title: '提醒管理详情'
    }
  },
  {
    path: '/manage/remindHomePage/submitRemindRecord',
    name: 'submitRemindRecord',
    component: SubmitRemindRecord,
    meta: {
      title: '提交提醒记录'
    }
  },
],
})

