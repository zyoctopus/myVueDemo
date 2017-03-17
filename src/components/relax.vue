<template>
	<div class="relax" ref="gank">
		<ul v-if="gankData" class="gank-list">
			<li v-for="item in gankData" class="gank-wrapper">
				<a :href="item.url" target="_blank">
					<div class="desc">{{item.desc}}</div>
					作者：<span>{{item.who}}</span>
				</a>
			</li>
		</ul>
		<div class="mask" v-show="maskShow">
			<mt-spinner type="fading-circle" color="rgb(224, 128, 49)" class="spinner" :size="48"></mt-spinner>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	export default {
		data() {
			return {
				gankData: '',
				maskShow: false
			}
		},
		created() {
			this.maskShow = true
			this.$http.get('http://gank.io/api/data/前端/10/1').then((data) => {
				this.gankData = data.body.results
				// console.log(data.body.results)
				this.maskShow = false
				this.$nextTick(() => {
					this.gankScroll = new BScroll(this.$refs.gank, {
						click: true
					})
				})
			})
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	.relax{
		height: 100%;
		overflow: hidden;
		.mask{
			position: absolute;
			top: 0;
			left: 0;
			background-color: rgba(0, 0, 0, .5);
			width: 100%;
			height: 100%;
			z-index: 60;
			.spinner{
				position: absolute;
				margin-right: -24px;
				margin-top: -24px;
				right: 50%;
				top: 50%;
			}
		}
		.gank-list{
			.gank-wrapper{
				padding: 12px;
				border-bottom: 1px solid rgba(0, 0, 0, .2);
				font-size: 14px;
				.desc{
					font-size: 16px;
					line-height: 20px;
					margin-bottom: 10px;
					color: rgb(25, 147, 117);
				}
			}
		}
			
	}
</style>
