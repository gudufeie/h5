<template>
    <div class="main_wrapper">
        <li>
            <div :class="{bold: isFolder}" @click="toggle(item)">
                <span v-if="isFolder&&isOpen" class="iconfont">&#xe603;</span>
                <span v-if="isFolder&&!isOpen" class="iconfont">&#xe601;</span>
                {{ item.name }}
                <input class="selecet_depart" name='department' type="radio" v-model="depart" :value='item.id' />
            </div>
            <ul v-show="isOpen" v-if="isFolder">
                <tree-item
                    class="item"
                    v-for="(child, index) in item.children"
                    :key="index"
                    :item="child"
                    @get_department="getDepartment"
                ></tree-item>
            </ul>
        </li>
    </div>
</template>
<script>
    let _this = null;
    export default {
        name:'tree-item',
        props: {
            item: Object,
            selectDepartments:Object
        },
        data: function () {
            return {
            isOpen: false,
            show:false,
            curDepartment:'',
            depart:'1',
            department:{}
            }
        },
        computed: {
            isFolder: function () {
                return this.item.children && this.item.children.length
            }
        },
        watch:{
            selectDepartments: function(){
                console.log('kkkkkkkkkkkkk',this.selectDepartments)
            }
        },
        methods: {
            toggle: function (data) {
                if (this.isFolder) {
                    this.isOpen = !this.isOpen;
                }
                this.depart = '';
                this.department = data;
                this.depart = data.id
                this.$emit('get_department',this.department)
            },
            getDepartment: function(data){
                this.$emit('get_department',data)
            },
        },
        created: function(){
            let departmentLevel = []
            if(this.selectDepartments != undefined){
                departmentLevel = this.selectDepartments.departmentLevel
                this.depart = this.selectDepartments.id
                localStorage.setItem('departmentLevel',JSON.stringify(this.selectDepartments))
            }else{
                let selectDepart = JSON.parse(localStorage.getItem('departmentLevel'))
                departmentLevel = selectDepart.departmentLevel
                this.depart = selectDepart.id
            }
            if(departmentLevel.indexOf(this.item.id) != -1 || this.item.id == undefined){
                this.isOpen = true;
            }
            _this = this
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
        color: #fff;
        width: 100%;
        background-color:#03061C;
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
        padding-left: 15px;
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
</style>
