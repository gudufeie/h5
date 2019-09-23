<template>
	<div class="componentReplace">
		<div class="container">
			<checklist label-position="left" :max="1" :options="commonList" @on-change="checkComponent"></checklist>
		</div>
		<div class="footer">
			<div class="btn" type="warn" @click.stop="toDeviceReplaceList">确定</div>
		</div>
	</div>
</template>
<script>
import { Checklist,XButton} from 'vux'
export default {
	components: {
		Checklist,
		XButton
	},
	data() {
		return {
			commonList: [],
			componentList: [],
			curComponentId: null
		}
	},
	methods: {
		getComponent() {
			let url = this.$API.inventList
			this.commonList = []

			this.$http(url,{},true).then(res=>{
				this.componentList = res

				let len = this.componentList.length
				for(let i = 0;i< len; i++) {
					this.commonList.push({
						key: this.componentList[i].catId.toString(),
						value: this.componentList[i].name
					})
				}
    		})
		},
		checkComponent(value,label) {
			this.curComponentId = value[0]
		},
		//确定
		toDeviceReplaceList(){
			if(!this.curComponentId) {
				this.$commom.alert('请选择要查看的部件')
				return
			}
			this.$router.push({name: 'deviceReplaceList',query: {id: 128,type: true}})
		},
	},
	created() {
		this.getComponent()
	}
}
</script>

<style lang="less" scoped>
	.componentReplace {
		position: relative;
		background: #1c1f37;
		color: #ffffff;
		height: 100vh;
		overflow: auto;
		// margin-bottom: 70px;
		.container {
			margin: 20px 8px 70px;
			overflow: auto;
			/deep/ .weui-cells {
				background-color: #1c1f37;
				font-size: 13px;
			}

		}
		.footer {
			position: fixed;
			bottom: 0;
			width: 100%;
			height: 70px;
			background-color: #1c1f37;
			.btn {
				width: 90%;
				margin: 14px auto;
				padding: 12px 0;
				background: #3967DC;
				border-radius: 4px;
				text-align: center;
			}
		}
	}
</style>

