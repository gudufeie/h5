<template>
    <div class="organization">
        <div class="header" @click="openPopup">
            <div class="header-content">
                <div class="name">{{curDepartment? curDepartment.name : '未选择'}}</div>
                <span class="iconfont" v-if="!show">&#xe601;</span>
                <span class="iconfont" v-if="show">&#xe603;</span>
            </div>
        </div>
        <popup v-model="show" :show-mask="false">
            <div class="main_wrapper" v-if="show">
                <ul id="demo">
                    <tree-item
                        class="item"
                        :item="treeData"
                        @get_department="getDepartment"
                        :selectDepartments="departmentSelect"
                    ></tree-item>
                </ul>
            </div>
        </popup>
        <div class="footer" v-if="show">
            <div class="btn" @click="confirm()">完成</div>
        </div>
    </div>
</template>
<script>
    import { Popup } from "vux";
    import TreeItem from "../../components/common/tree-item.vue"; 
    let _this = null;
    export default {
        name:'organization',
        components:{
            TreeItem,
            Popup
        },
        props: {
            selectDepartment:Object
        },
        data: function () {
            return {
            isOpen: false,
            show:false,
            curDepartment:{},
            department:{},
            treeData:{},
            departmentLevel:['1']
            }
        },
        computed: {
            isFolder: function () {
                return this.item.children && this.item.children.length
            }
        },
        mounted(){
            this.departmentSelect ={
                name:'444',
                id:'1'
            }
        },
        watch: {
            selectDepartment: function(){
                this.curDepartment = this.selectDepartment;
                this.department = this.curDepartment;
                this.getDepartLevel();
            }
        },
        methods: {
            getOrganization: function(){
                this.$http(this.$API.getMyOrganization,{},true).then((data)=>{
                    let a = data[0]
                    this.treeData = a
                })
            },
            //打开选择器
            openPopup: function () {
                this.show = true;
                this.departmentSelect ={
                    departmentLevel:this.departmentLevel,
                    id:this.curDepartment.id
                }
            },
            getDepartment: function(data){
                this.department = data;
                this.curDepartment = data;
            },
            getDepartLevel: function(){
                this.$http(this.$API.getDepartmentStruct,{departmentId:this.curDepartment.id},true).then((data)=>{
                    this.departmentLevel = data;
                })
            },
            confirm: function () {
                this.curDepartment = this.department
                this.$emit('department_select',this.curDepartment)
                this.show = false;
            },
        },
        created: function(){
            this.getOrganization();
            _this = this
        }
    }
</script>
<style lang="less" scoped>
    @import '../../styles/iconfont.css';
    .organization .vux-popup-mask{
        display: none !important;
    }
    .organization{
        // position: absolute;
        // top: 45px;
        width: 100%;
    }
    .main_wrapper{
        color: #fff;
        width: 100%;
        z-index: 999;
        font-size: 16px;
    }
    .header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      padding: 13px 0;
      font-size: 16px;
      line-height: 16px;
      color:#fff;
      .header-content {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 5px;
          height: 11px;
          margin-left: 15px;
        }
      }
    }
    .footer {
        position: fixed;
        bottom: 0px;
        width: 100%;
        padding: 20px 0;
        background: #03061C;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        z-index:999;
        .btn {
            padding: 10px 35px;
            background: #3967DC;
            border-radius: 4px;
            margin-right: 16px;
            color:#fff;
            font-size: 16px;
        }
    }
    .iconfont{
        margin-right: 10px;
        font-size: 14px;
    }
    .vux-popup-dialog{
        height: 78% !important;
        top: 50px;
        bottom: unset!important;
        background: #22233f!important;
        font-size: 14px;
    }
    .name{
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        word-break: keep-all !important;
    }
</style>
