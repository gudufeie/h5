<template>
    <div class="main_wrap">
        <div class="content_wrap">
            <div>
                <tab :line-width=3 line-color="#456de6" active-color='#fff' v-model="index" default-color="#fff">
                    <tab-item class="vux-center" :selected="demo2 === item" v-for="(item, index) in tltles" @on-item-click="tabSelect(index)" :key="index">{{item}}</tab-item>
                </tab>
                <swiper v-model="index" height="500px" :show-dots="false">
                    <swiper-item>
                        <x-table :cell-bordered="false">
                            <thead>
                            <tr>
                                <td v-for="(item, index) in headNames" :key="index">{{item}}</td>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in showCheckDatas" :key="index">
                                    <td>{{item.name}}</td>
                                    <td>{{item.type}}</td>
                                    <td>{{item.time}}</td>
                                    <td v-if="item.operation == 1" @click="shitoryWorkOrderDetail">已处理</td>
                                    <td v-if="item.operation == 2" @click="shitoryWorkOrderDetail" style="color:red">未处理</td>
                                    <td v-else><button class="operation_btn" @click="processWorkSheet(item.name)">处理</button></td>
                                </tr>
                            </tbody>
                        </x-table>
                    </swiper-item>
                </swiper>
            </div>
        </div>
        <div class="footer">
            <div class="add_wrap">
                <button>扫码添加</button>
            </div>
            <grid :show-lr-borders="false" :show-vertical-dividers="false">
                <grid-item label='运维工单'>
                    <img slot="icon" src="../../assets/icon/workSheet.png">
                </grid-item>
                <grid-item label='设备报警'>
                    <img slot="icon" src="../../assets/icon/deviceAlarm4.png">
                </grid-item>
                <grid-item  label='生产预警'>
                    <img slot="icon" src="../../assets/icon/produceAlarm1.png">
                </grid-item>
            </grid>
        </div>
    </div>
</template>
<script>
import { Icon, Grid, GridItem ,Tab, TabItem ,Swiper,SwiperItem,XTable} from 'vux'
const list = () => ['处理工单','历史工单记录']
export default {
    components: {
        Icon,
        Grid,
        GridItem,
        Tab,
        TabItem,
        Swiper,
        SwiperItem,
        XTable
    },
    data(){
        return {
            index: 0,
            tltles: list(),
            demo2: '添加点巡检',
            addCheckDatas:[
                {
                    name:'车胎1',
                    type:'点巡检',
                    time:'2-19-19-',
                },
                {
                    name:'车胎2',
                    type:'点巡检',
                    time:'2-19-19-',
                }
            ],
            CheckDatas:[
                {
                    name:'水管',
                    type:'生产报警',
                    time:'111',
                    operation:'2'
                },
                {
                    name:'水管',
                    type:'生产报警',
                    time:'1111',
                    operation:'2'
                }
            ],
            showCheckDatas:[],
            headNames:[],
            addCheckTitles:['设备/部件','工单类型','上报时间','操作'],
            CheckRecordTitles:['设备/部件','工单类型','上报时间','处理状态'],
        }
    },
    created:function(){
        this.loadData()
    },
    methods:{
        tabSelect:function(index){
            if(this.index == 0){
                this.showCheckDatas =this.addCheckDatas;
                this.headNames = this.addCheckTitles;
            }else{
                this.showCheckDatas =this.CheckDatas;
                this.headNames = this.CheckRecordTitles;
            }
        },
        loadData:function(){
            this.showCheckDatas = this.addCheckDatas;
            this.headNames = this.addCheckTitles;
        },
        view:function(config){
            this.$router.push({
            name: `deviceCheckRecord`,
            params: {
                deviceId:config
                }
            })
        },
        componentWorkInfo:function(config){
            this.$router.push({
            name: `componentCheckRecord`,
            params: {
                deviceId:config
            }
        })
        },
        processWorkSheet:function(config){
            this.$router.push({
            name: `workSheetInfo`,
            params: { deviceId:config }
            })
        },
        shitoryWorkOrderDetail: function(){
            this.$router.push({name: 'workOrderDetails'});
        }
    },
    watch:{

    }
}
</script>
<style>
    body{
        background-color: #22233f;
        height: 100%;
        width: 100%;
    }
    .main_wrap{
        margin: 0 auto;
        height: 100%;
        width: 100%;
    }
    .footer{
        position: absolute;
        bottom: 0px;
        width: 100%;
    }
    .footer .weui-grid:after{
        border-bottom: none;
    }
    .footer .add_wrap{
        margin-bottom: 10px;
        text-align: center;
    }
    .footer .add_wrap button{
        border-radius: 20px;
        font-size: 16px;
        height: 45px;
        width: 70%;
        border: none;
        background-color: #456de6;
        color:#fff;

    }
    .footer .weui-grid__label{
        color: #fff;
    }
    .vux-tab{
        background-color: #22233f !important;
    }
    .vux-swiper{
        color: #fff;
    }
    .vux-tab-ink-bar{
        background: #456de6 !important;
    }

    .operation_btn{
        background-color: #22233f;
        color:#456de6;
        border: 1px solid #456de6;
        padding:5px 10px;
    }
</style>


