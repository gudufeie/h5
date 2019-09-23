import host from './host'

const hostUrl = host.hostUrl;

const API = {
  //登录（y验证码）
  login: hostUrl + '/user/login',
  // 账户密码登陆
  loginAccountOrPhone: hostUrl + '/user/loginAccountOrPhone',
  //修改密码
  updatePassword: hostUrl + '/user/updatePassword',
  //修改用户信息
  updateUserInfo: hostUrl + '/user/updateUserInfo',
  //获取用户信息
  getUserInfo: hostUrl + '/user/getUserInfo',
  //  扫码获取用户信息
  getUserByOpenId: hostUrl+ '/user/getUserByOpenId',
  //发送短信验证码
  sendLoginSms: hostUrl + '/user/sendLoginSms',
  //发送短信验证码
  sendSmsForOpportunity: hostUrl + '/user/sendSmsForOpportunity',
  //我的设备列表
  listMyDevice: hostUrl + '/listMyDevice',
  //我的组织架构
  listMyOrgStruct: hostUrl + '/listMyOrgStructV02',
  //获取某个部门的设备
  listDevice: hostUrl + '/listDevice',
  //获取某个设备的参数
  getDeviceDetail: hostUrl + '/getDeviceDetail',
    //获取某个设备的参数
  getDeviceDetails: hostUrl + '/getDeviceDetails',
  //获取我的巡检历史
  listMyCheckRecord: hostUrl + '/listMyCheckRecord',
  //获取某天某设备的巡检记录
  listCheckRecordByDate: hostUrl + '/listCheckRecordByDate',
  //获取设备的部件列表
  listDeviceComponent: hostUrl + '/listDeviceComponent',
  //获取设备部件更换记录
  listReplaceRecordByDeviceId: hostUrl + '/listReplaceRecordByDeviceId',
  //获取部件的更换记录
  listReplaceRecordByComponentId: hostUrl + '/listReplaceRecordByComponentId',
  //一键更换
  onekeyReplace: hostUrl + '/onekeyReplace',
  //获取微信配置
  getWxConfig: hostUrl + '/wxAuth/getWxConfig',
  //公众号授权
  getWxCode: hostUrl + '/wxAuth/getWxCode',
  //上传图片
  upload: hostUrl + '/file/upload',
  //添加巡检记录
  addCheckRecord: hostUrl + '/addCheckRecord',
  //添加更换记录
  addReplaceRecord: hostUrl + '/addReplaceRecord',
  //保存商机
  saveOpportunity: hostUrl + '/opportunity/saveOpportunity',
  //入库管理-部件列表-入库
  inventList:hostUrl + '/componentList',
  //入库管理-部件详情
  inventDetail:hostUrl + '/componentDetails',
  //入库管理-部件列表
  inventItem:hostUrl+'/stockComponentList',
  //部件延后更换
  delayedReplace: hostUrl + '/delayedReplace',
  // 设备延后更换
  delayedDeviceReplace: hostUrl + '/delayedDeviceReplace',
  // 获取部件更换截止日期
  delayedReplaceDate : hostUrl + '/delayedReplaceDate',
  // 获取设备延后更换日期
  delayedDeviceReplaceDate : hostUrl + '/delayedDeviceReplaceDate',
  //获取设备组件列表
  checkRecordList: hostUrl + '/checkRecordList',
  //部件巡检
  checkComponent: hostUrl + '/checkComponent',
  //删除图片
  deleteCheckImg: hostUrl + '/delImage',
  //退出登录
  logout: hostUrl + '/user/logout',
  //获取规格
  getCategoryList: hostUrl + '/stockCategoryList',
  //入库
  saveStockOperator: hostUrl + '/stockOperator',
  // 获取设备点巡检
  loadDeviceCheckRecord: hostUrl + '/checkConfig/loadCheckRecords',
  //获取设备点巡检设置列表
  deviceCheckRecordList: hostUrl + '/deviceCheckRecordList',
  // 获取未点巡检数量
  getCheckConfigNum: hostUrl + '/deviceCheckRecordCount',
  // 获取设备下所有部件点巡检记录
  loadComponentCheckRecord: hostUrl + '/checkRecord/loadCheckRecords',
  // 获取部门下所有设备点巡检记录
  loadDeviceCheckRecords: hostUrl + '/checkRecord/loadDeviceCheckRecords',
  // 获取用户部门所有领导(上报人)
  getLeader: hostUrl + '/user/getLeaders',
  // 添加设备点巡检记录
  addDeviceCheckRecord: hostUrl + '/addDeviceCheckRecord',
  // 获取该设备所有的点巡检记录
  loadDeviceCheckRecordByDeviceId: hostUrl + '/checkRecord/loadAllDeviceRecords',
  // 查询点巡检记录详情
  loadCheckDetail: hostUrl + "/checkRecord/loadRecordDetails",
  // 查询部门下所有设备
  loadDeviceList: hostUrl + '/device/getDeviceInfo',
  //获取设备管理首页信息
  getDeviceNum: hostUrl + '/device/getDeviceNum',
  //微信验证信息
  getWxSign: hostUrl + '/wxAuth/getWxSign',
  //获取首页信息
  getAgencyMatters: hostUrl + '/user/getAgencyMatters',
  //获取设备列表信息
  getDeviceList: hostUrl + '/device/getDeviceList',
  //组织架构
  loadOrganStructure: hostUrl + '/user/loadOrganStructure',
  // 获取部门下所有设备的更换设置
  loadDeviceReplaceConfig: hostUrl + '/getDeviceReplaceConfig',
  // 获取设备待更换设备数量
  getReplaceConfigCount: hostUrl + '/loadAllDeviceReplaceCount',
  // 添加设备更换记录
  addDeviceReplace: hostUrl + '/addDeviceReplaceRecord',
  // 设备下所有部件的更换设置
  loadComponentReplaceConfig: hostUrl + '/getComponnentReplaceRecord',
  // 部门下所有设备的更换记录
  loadDeviceReplaceRecord: hostUrl + '/loadAllDeviceReplaceRecord',
  // 设备所有更换记录
  loadDeviceAllReplaceRecord: hostUrl + '/getDeviceReplaceRecordDetails',
// 设备下所有部件的添加更换记录
  loadCompReplaceRecord: hostUrl + '/getCompReplaceRecordDetails',

  // 部门下工单各种类型数量统计
  workSheetInfo: hostUrl + "/workSheet/allManager",
  // 部门下未处理工单
  loadToDealWorkSheet: hostUrl + "/workSheet/unHandleManager",
  // 我提交的工单
  mySubmitWorkSheets: hostUrl + "/workSheet/submitManager",
  // 我完结的工单
  myFinishedWorkSheets: hostUrl + '/workSheet/handleManager',
  // 历史工单
  loadHistoryWorkSheet: hostUrl + '/workSheet/historyWorkSheet',
  // 工单处理过程详情
  getWorkSheetPeocessInfo: hostUrl + '/workSheet/getWorkSheetHandleInfo',
  // 获取工单信息
  getWorkSheetInfo: hostUrl + '/workSheet/getWorkSheetInfo',
  // 获取转办人
  loadTransferees: hostUrl + '/user/loadUserByDepart',
  // 添加工单记录
  addWorkSheetRecord: hostUrl + '/workSheetHandle/save',
  // 我回复的工单
  loadMyWorkSheet: hostUrl + '/workSheet/getMyWorkSheet',
  // //点巡检记录-部件点巡检记录
  // loadComponentCheckRecords: hostUrl + '/checkConfig/loadComponentCheckRecords',
  //运维工单首页信息
  getCheckRecordByMonth: hostUrl + '/getCheckRecordByMonth',
    // 部门下所有异常工单
  loadExceptionWorkSheet: hostUrl + '/workSheet/getExecWorkSheet',
  // 异常工单的处理记录
  loadExceptWorkSheetRecord: hostUrl + '/workSheetHandle/getExecWorkSheetHandle',
  // 提交异常工单提醒记录
  addExceptWorkSheetRecord: hostUrl + '/workSheet/saveLeapfrogRemind',
  //扫码之后获取的设备信息
  loadDeviceInfo: hostUrl + '/loadDeviceInfo',
  //扫码之后获取的设备更换信息
  getDeviceReplaceConfigByDeviceId: hostUrl + '/getDeviceReplaceConfigByDeviceId',
  // 获取部门下所有异常工单
  loadExecWorkSheet: hostUrl + '/workSheet/getExecWorkSheet',
  // 查询部门所有人员信息
  searchPerson: hostUrl + '/user/loadByNameOrDepart' ,
  // 获取统计点巡检数据
  getCheckMatters: hostUrl + '/user/getCheckMatters',
  // 获取统计更换数据
  getReplaceMatters: hostUrl + '/user/getReplaceMatters',
  // 获取工单统计数据
  getWorkSheetMatters: hostUrl + '/user/getWorkSheetMatters',
  // 获取设备详细信息
  getDeviceDetail: hostUrl + '/device/getDeviceInfo',
  // 获取点巡检工单详情
  getCheckWorkSheet: hostUrl + '/workSheetHandle/loadWorkSheetHandleByCheckId',
  // 获取更换记录近七天的数量统计
  getReplaceRecordByMonth: hostUrl + '/getReplaceRecordByMonth',
  // 设备点巡检记录统计数量
  getDeviceCheckRecordNum: hostUrl + '/checkRecord/loadDeviceCheckRecordCount',
  // 设备更换记录数量统计
  getDeviceReplaceRecordNum: hostUrl + '/loadDeviceReplaceRecordCount'
}

export default API;
