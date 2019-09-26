<template>
    <div class="main_wrapper">
        <li>
            <div
                :class="{bold: isFolder}"
                @click="toggle(item)">
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
        },
        data: function () {
            return {
            isOpen: false,
            show:false,
            curDepartment:'',
            depart:1,
            department:{}
            }
        },
        computed: {
            isFolder: function () {
                return this.item.children && this.item.children.length
            }
        },
        methods: {
            toggle: function (data) {
                if (this.isFolder) {
                    this.isOpen = !this.isOpen;
                }
                this.depart = '';
                _this.department = data;
                this.depart = data.id
            },
            //打开选择器
            openPopup: function () {
                this.show = true;
            },
        },
        created: function(){
            _this = this
            // this.getOrganization();
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
</style>
