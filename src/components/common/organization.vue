<template>
    <div class="organization">
        <div class="header" @click="openPopup">
            <div class="header-content">
                <div>{{curDepartment? curDepartment : '未选择'}}</div>
                <img src="../../assets/icon/toRight.png">
            </div>
        </div>
        <div class="main_wrapper">
            <ul id="demo">
                <tree-item
                class="item"
                :item="treeData"
                ></tree-item>
            </ul>
        </div>
        <div class="footer">
            <div class="btn" @click="confirm()">完成</div>
        </div>
    </div>
</template>
<script>
    import TreeItem from "../../components/common/tree-item.vue"; 
    let _this = null;
    export default {
        name:'organization',
        components:{
            TreeItem
        },
        props: {
            selectDepartment:Object
        },
        data: function () {
            return {
            isOpen: false,
            show:false,
            curDepartment:'',
            depart:1,
            department:{},
            treeData:{}
            }
        },
        computed: {
            isFolder: function () {
                return this.item.children && this.item.children.length
            }
        },
        watch: {
            selectDepartment: function(){
                _this.curDepartment = this.selectDepartment.name
            }
        },
        methods: {
            getOrganization: function(){
                this.$http(this.$API.getMyOrganization,{},true).then((data)=>{
                    let a = data[0]
                    this.treeData = a
                })
            },
            toggle: function () {
                if (this.isFolder) {
                    this.isOpen = !this.isOpen;
                }
            },
            selectD: function(data){
                this.depart = '';
                _this.department = data;
                this.depart = data.id
            },
            //打开选择器
            openPopup: function () {
                this.show = true;
            },
            confirm: function () {
                _this.curDepartment = _this.department.name
                console.log('aaaaaaaa',_this.curDepartment)
                this.show = false;
            },
        },
        created: function(){
            _this = this
            this.getOrganization();
        }
    }
</script>
<style lang="less" scoped>
    @import '../../styles/iconfont.css';
    body {
        font-family: Menlo, Consolas, monospace;
        color: #fff;
        font-size: 16px;
    }
    .main_wrapper{
        // position:absolute;
        // top: 48px;
        color: #fff;
        width: 100%;
        background-color: #456de6;
        z-index: 999;
        font-size: 16px;
    }
    .item {
        cursor: pointer;
    }
    .bold {
        line-height: 3em;   
    }
    ul {
        padding-left: 1em;
        line-height: 3em;
        list-style-type: dot;
    }
    .selecet_depart{
        line-height: 40px;
        position: absolute;
        right:20px;
        margin-top: 1.5em;
    }
    .iconfont{
        margin-right: 0.5em;
        margin-left: 0.3em;
        font-size: 14px;
    }
    .header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      padding: 13px 0;
      background: #03061C;
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
        bottom: 0;
        width: 100%;
        padding: 23px 0;
        background: #333651;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .btn {
            padding: 6px 29px;
            background: #3967DC;
            border-radius: 4px;
            margin-right: 16px;
        }
    }
    .main_wrapper{
        position: absolute;
        top: 100px;
        width: 100%;
    }
</style>
