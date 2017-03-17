<template>
	<div class="resumeItem">
		<div class="ItemTitle" @click="isShow">
			<span>{{item.title}}</span>
		</div>
		<transition name="content">
			<div class="content" v-show="contentShow" ref="content">
				<ul >
					<li v-for="text in item.list" class="item"><span class="point iconfont icon-point-copy-copy-copy"></span>{{text}}</li>
				</ul>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				contentShow: true
			}
		},
		props: {
			item: {
				type: Object
			}
		},
		methods: {
			isShow(e) {
				if (!e._constructed) {
					return
				}
				this.contentShow = !this.contentShow
				this.$nextTick(() => {
					this.$emit('refreshScroll', '')
				})
			},
			setHeight() {
				// console.log(this.$refs.content.getBoundingClientRect().height)
				// console.log(this.$refs.content.style)
				// this.$refs.content.style.height = this.$refs.content.getBoundingClientRect().height
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	.resumeItem{
		overflow: hidden;
		margin-top: 5px;
		box-shadow: 0 4px 5px rgba(224, 128, 49, .6);
		.ItemTitle{
			position: relative;
			z-index: 50;
			color: #fff;
			height: 40px;
			line-height: 40px;
			background-color: rgb(224, 128, 49);
			padding: 0 20px;
			border-radius: 12px 12px 0 0;
		}
		.content{
			background-color: rgba(224, 128, 49, .3);
			color: #333;
			// transition: all 0.4s;
			// &.content-enter,&.content-leave-active{
			// 	height: 0;
			// }
			.item{
				padding: 4px 10px;
				font-size: 16px;
				line-height: 20px;
				.point{
					vertical-align: middle;
					font-size: 34px;
					line-height: 20px;
				}
			}
		}
	}
</style>
