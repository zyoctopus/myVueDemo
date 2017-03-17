<template>
  <div id="app">
	<div class="header">
		<img src="./common/img/train.jpg" width="100%">
		<div class="title">Vue.js</div>
		<div class="toResume" @click="showResume">个人简历<i class="iconfont icon-chevron-right"></i></div>
		<transition name="resume">
			<div class="my-resume" v-show="isShowResume">
				<div class="title">
					<i class="icon iconfont icon-chevron-left" @click="hideResume"></i>
					<span>我的简历</span>
				</div>
				<div class="resumeList" ref="resume">
					<div class="resume-wrapper">
						<resume-item v-for="item in resumeContent" :key="item.id" :item="item" ref="resumeItem" @refreshScroll="refreshScroll"></resume-item>
					</div>
				</div>
			</div>
		</transition>
	</div>
	<div class="display">
		<router-view></router-view>
	</div>
    <div class="menu">
    	<div class="option"><router-link to="/douban">豆瓣</router-link></div>
    	<div class="option"><router-link to="/relax">前端干货</router-link></div>
    </div>
  </div>
</template>

<script>
import resumeItem from './components/resumeItem.vue'
import resumeInfo from './common/json/resume.json'
import BScroll from 'better-scroll'

export default {
	data() {
		return {
			isShowResume: false,
			resumeContent: ''
		}
	},
	created() {
		this.resumeContent = resumeInfo
	},
	methods: {
		showResume() {
			this.isShowResume = true
			this.$nextTick(() => {
				if (!this.resumeScroll) {
					this.resumeScroll = new BScroll(this.$refs.resume, {
					click: true
					})
				} else {
					this.resumeScroll.refresh()
				}
			})
		},
		hideResume() {
			this.isShowResume = false
		},
		refreshScroll() {
			this.resumeScroll.refresh()
		}
	},
	components: {
		resumeItem
	}
}
</script>

<style lang="less" rel="stylesheet/less">
// @yellow :rgb(224, 128, 49)
// @green: rgb(25, 147, 117)
#app {
  // max-width: 700px;
  margin: 0 auto;
  .header{
  	position: relative;
  	height: 150px;
  	overflow: hidden;
  	>.title{
  		position: absolute;
  		top: 30px;
  		left: 30px;
  		font-size: 30px;
  		color: #efefef;
  		text-shadow: 0px -5px 8px #000;
  	}
  	.toResume{
  		position: absolute;
  		width: 90px;
  		height: 28px;
  		font-size: 16px;
  		line-height: 28px;
  		color: #c3c3c3;
  		right: 0;
  		top: 100px;
  		background-color: rgba(0,0,0,.5);
  		text-align: center;
  		border-radius: 12px 0 0 12px;
  		padding: 0 5px;
  		.iconfont{
  			font-size: 14px;
  			margin-left: 5px;
  		}
  	}
  	.my-resume{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		z-index: 100;
		transition: all 0.2s;
		&.resume-enter,&.resume-leave-active{
			transform: translate3d(100%,0,0);
		}
		.title{
			position: relative;
			height: 40px;
			line-height: 40px;
			width: 100%;
			font-size: 20px;
			font-weight: 700;
			text-align: center;
			background-color: rgb(25, 147, 117);
			color: #fff;
			box-shadow: 0 4px 5px rgba(25, 147, 117, .6);
			.icon{
				position: absolute;
				padding: 10px;
				font-size: 20px;
				line-height: 20px;
				left: 0;
				top: 0;
			}
		}
		.resumeList{
			position: absolute;
			z-index: -1;
			width: 100%;
			top: 40px;
			bottom: 0;
		}
	}
  }
  .display{
	position: absolute;
	top: 150px;
  	bottom: 40px;
  	width: 100%;
  	overflow: hidden;
  }
  .menu{
  	position: fixed;
  	display: flex;
  	width: 100%;
  	bottom: 0;
  	left: 0;
  	border-top: 1px solid rgba(0, 0, 0, .2);
  	background-color: #fff;
  	.option{
		flex: 1;
		text-align: center;
		font-size: 18px;
		line-height: 40px;
		border-right: 1px solid rgba(0, 0, 0, .2);
		&:last-child{
			border-right: none;
		}
		.active{
			background-color: rgba(224, 128, 49, .5);
		}
		a{
			color: rgb(25, 147, 117);
			display: inline-block;
			width: 100%;
			height: 100%;
		}
  	}
  }
}
</style>
