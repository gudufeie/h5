<template>
    <div class="main_wrap">
        <div class="content_wrap">
            <img src="https://ws1.sinaimg.cn/large/663d3650gy1fq685v5csyj208c06ygm0.jpg" alt="">
            <div class="info_wrap">
                <table>
                    <tr>
                        <td class="name">设备名称</td>
                        <td>c车轱辘</td>
                    </tr>
                    <tr>
                        <td class="name">设备编号</td>
                        <td>c车轱辘</td>
                    </tr>
                    <tr>
                        <td class="name">所在部门</td>
                        <td>c车轱辘</td>
                    </tr>
                    <tr>
                        <td class="name">运行状态</td>
                        <td>轻微故障</td>
                    </tr>
                    <tr>
                        <td class="name">工单类型</td>
                        <td>点巡检</td>
                    </tr>
                </table>
            </div>
            <div class="workSheetNote">
                <p><span><img src="../../assets/icon/notProcess.png" class="notProcess"></span><span>黄海辉</span>待处理</p>
                <div class="workSheetFlow">
                    <timeline>
                        <timeline-item>
                            <p class="recent">周媛<span style="float:right">上报</span></p>
                            <p class="recent">2016-04-17 12:00:00</p>
                        </timeline-item>
                        <timeline-item>
                            <p>卢静<span style="float:right">转办</span></p>
                            <p>2016-04-16 10:23:00</p>
                            <p>请假</p>
                        </timeline-item>
                        <timeline-item>
                            <p>刘涛<span style="float:right">转办</span></p>
                            <p>2016-04-16 10:23:00</p>
                            <p>设备钱不替换</p>
                        </timeline-item>
                    </timeline>
                </div>
            </div>
            <div class='operation_wrap'>
                <button class="submit_btn" @click="processWorkSheet">工单处理</button>
            </div>
        </div>
    </div>
</template>
<script>
import { XTable, Timeline,TimelineItem,XButton} from 'vux'

export default {
    components: {
        XTable,
        Timeline,
        TimelineItem,
        XButton
    },
    data(){
        return {
            name:'111',
            deviceId:'',
        }
    },
   created() {
    this.getRouterData()
    },
    methods: {
        getRouterData() {
        this.deviceId = this.$route.params.deviceId
        this.name = this.deviceId
        },
        processWorkSheet: function(){
            this.$router.push({name: 'submitWorkOrder'});
        }
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
        padding-bottom: 20px;
    }
    .content_wrap{
        height: 100%;
    }
    .info_wrap{
        padding:10px;
    }
    table{
        width:100%;
        line-height: 40px;
        font-size: 14px;
        color:#fff;
        border-bottom: 1px solid;
        border-color: rgba(255, 255, 255, 0.5)
    }
    table .name{
        color: rgba(255, 255, 255, 0.5);
        width: 25%;
    }

    .workSheetNote{
        padding:20px 10px;
        color:#fff;
        font-size: 16px;
    }
    .workSheetNote .notProcess{
        width: 5%;
        margin-right: 20px;
    }
    .workSheetFlow{
        color:#fff;
    }
    .operation_wrap{
        text-align: center;
        margin-bottom: 20px;
    }
    .submit_btn{
        height: 50px;
        width: 80%;
        background-color: #456de6;
        color:#fff;
        font-size: 20px;
        border-radius: 20px;
        border: none;
    }
    .vux-timeline-item-color{
        color:#456de6 !important;
    }
</style>


