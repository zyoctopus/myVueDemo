<template>
	<div class="douban">
		<div class="optionSelect" @click="showList">
			<i class="iconfont icon-xuanxiang"></i>
			<div class="list-wrapper">
				<transition name="list">
					<ul class="itemList" v-show="listShow">
						<li class="item" @click="requestDouban('inTheaters')">正在热映</li>
						<li class="item" @click="requestDouban('comingSoon')">即将上映</li>
						<li class="item" @click="requestDouban('top250')">top250</li>
					</ul>
				</transition>
			</div>
		</div>
		<div class="content">
			<div class="mask" v-show="maskShow">
				<mt-spinner type="fading-circle" color="rgb(224, 128, 49)" class="spinner" :size="48"></mt-spinner>
			</div>
			<div class="title-wrapper">
				<span class="title">{{typeTitle}}</span>
				<i class="searchIcon iconfont icon-sousuo-sousuo" @click="searchIsShow"></i>
				<transition name="search">
					<div class="search" v-show="searchShow">
						<form @submit.prevent="requestDouban('search',null,submitCallback)">
							<input type="text" class="input" v-model="searchKey">
						</form>
					</div>
				</transition>
			</div>
			<div ref="movie" class="movie-wrapper">
				<ul ref="scrollTarget">
					<li class="movie-item" v-for="item in movieData" v-if="movieData">
						<div class="movie-image">
							<img :src="item.images.large" width="80" height="110">
						</div>
						<div class="description">
							<div class="movie-name common">片名：{{item.title}}</div>
							<div class="genres common">
								类型：<span v-for="(type, index) in item.genres">{{type}}<span v-if="!(index===item.genres.length-1)">.</span></span>
							</div>
							<div class="casts common">
								演员：<span v-for="(cast, index) in item.casts">{{cast.name}}<span v-if="!(index===item.casts.length-1)">、</span></span>
							</div>
							<div class="directors common">
								导演：<span v-for="(director, index) in item.directors">{{director.name}}<span v-if="!(index===item.directors.length-1)">、</span></span>
							</div>
							<div class="year common">
								<span>年份：{{item.year}}</span>
							</div>
							<span class="rating">{{item.rating.average}}</span>
						</div>
					</li>
					<li class="noMore" v-show="noMoreIsShow">没有更多数据了</li>
				</ul>
				<div class="searchMask" v-show="searchShow" @click="searchIsHide"></div>
				
			</div>	
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	export default {
		data() {
			return {
				listShow: false,
				movieData: [],
				searchKey: '',
				typeTitle: '',
				maskShow: false,
				searchShow: false,
				requestData: {
					inTheaters: {
						url: 'https://api.douban.com/v2/movie/in_theaters',
						title: '正在热映'
					},
					comingSoon: {
						url: 'https://api.douban.com/v2/movie/coming_soon',
						title: '即将上映'
					},
					top250: {
						url: 'https://api.douban.com/v2/movie/top250',
						title: 'top250'
					},
					search: {
						url: 'https://api.douban.com/v2/movie/search',
						title: '搜索结果'
					}
				},
				// 用于下拉加载更多
				start: 0,
				currentType: '',
				flag: true,
				noMoreIsShow: false,
				cacheKey: ''
			}
		},
		created() {
			this.requestDouban('inTheaters',
				{
					'start': 0,
					'count': 20
				},
				this.createScroll)
		},
		methods: {
			createScroll() {
				this.$nextTick(() => {
					this.movieScroll = new BScroll(this.$refs.movie, {
						click: true,
						probeType: 3
					})
					this.movieScroll.on('scroll', (pos) => {
						let target = this.$refs.scrollTarget
						let isBottom = target.scrollHeight - target.parentNode.clientHeight
						if (Math.abs(pos.y) >= isBottom && this.flag) {
							this.flag = false
							this.requestDouban(this.currentType, {
								start: (++this.start) * 20,
								count: 20
							})
						}
					})
				})
			},
			showList() {
				this.listShow = !this.listShow
				this.searchShow = false
			},
			mySplice(arr) {
				let str = ''
				for (let i = 0; i < arr.length; i++) {
					str += arr[i] + '、'
				}
				return str.slice(0, -1)
			},
			submitCallback() {
				this.movieData = []
				this.start = 0
			},
			requestDouban(type, params, callback) {
				if (this.currentType !== type) {
					this.movieData = []
					this.start = 0
				}
				type = type || 'inTheaters'
				this.currentType = type
				this.maskShow = true
				this.noMoreIsShow = false
				params = params || {start: 0, count: 20}
				if (type === 'search') {
					params.q = this.searchKey ? this.searchKey : this.cacheKey
					this.searchKey && (this.cacheKey = this.searchKey)
					this.searchKey = ''
					this.searchShow = false
					if (callback) {
						callback()
						callback = null
					}
				}
				// console.log(params)

				this.$http.jsonp(this.requestData[type].url, {
					params: params
				})
				.then((data) => {
					if (data.ok) {
						this.movieData = this.movieData.concat(data.body.subjects)
						this.typeTitle = this.requestData[type].title
						this.maskShow = false
						callback && callback()
						this.$nextTick(() => {
							this.movieScroll && this.movieScroll.refresh()
						})
						// console.log(this.movieData)
						if ((params.start + params.count) <= data.body.total) {
							this.flag = true
						} else {
							this.noMoreIsShow = true
						}
					}
				})
			},
			searchIsShow() {
				this.searchShow = true
			},
			searchIsHide() {
				this.searchShow = false
			}
		}
	}
</script>

<style lang="less" rel="stylesheet/less">
	.douban{
		position: relative;
		height: 100%;
		.optionSelect{
			position: absolute;
			top: 0;
			left: 0;
			width: 48px;
			height: 48px;
			line-height: 48px;
			border-radius: 0 0 48px 0;
			background-color: rgb(224, 128, 49);
			text-align: center;
			z-index: 50;
			.list-wrapper{
				.itemList{
					position: absolute;
					right: -70px;
					top: 30px;
					transition: all 0.2s;
					&.list-enter,&.list-leave-active{
						opacity: 0;
					}
					.item{
						width: 80px;
						height: 40px;
						line-height: 40px;
						margin-bottom: 10px;
						color: #fff;
						background-color: rgb(224, 128, 49);
					}
				}
			}
			i{
				display: inline-block;
				padding-right: 12px;
				padding-bottom: 10px;
				color: #fff;
			}
		}
		.content{
			position: relative;
			height: 100%;
			.title-wrapper{
				height: 40px;
				position: relative;
				text-align: center;
				border-bottom: 1px solid rgb(224, 128, 49);
				box-sizing: border-box;
				.title{
					line-height: 40px;
					font-size: 18px;
				}
				.searchIcon{
					display: inline-block;
					position: absolute;
					right: 0;
					font-size: 20px;
					line-height: 20px;
					padding: 10px;
				}
				.search{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					padding-top: 10px;
					transition: all 0.3s;
					&.search-enter,&.search-leave-active{
						transform: translate3d(0, -100%, 0);
					}
					.input{
						border: 1px solid rgb(224, 128, 49);
						width: 50%;
					}
				}
			}
			.movie-wrapper{
				position: absolute;
				top: 40px;
				bottom: 0;
				width: 100%;
				overflow: hidden;
				.movie-item{
					padding: 10px;
					border-bottom: 1px solid rgba(0, 0, 0, .2);
					display: flex;
					overflow: hidden;
					&:last-child{
						border: none;
					}
					.movie-image{
						flex: 0 0 80px;
						margin-right: 12px;
					}
					.description{
						position: relative;
						width: 0;
						flex: 1;
						font-size: 14px;
						line-height: 22px;
						.common{
							overflow: hidden;
      						white-space: nowrap;
      						word-break:keep-all;
							text-overflow: ellipsis;
						}
						.rating{
							position: absolute;
							right: 0;
							bottom: 0;
						}
					}
				}
				.noMore{
					width: 100%;
					line-height: 40px;
					text-align: center;
				}
				.searchMask{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					z-index: 20;
					background-color: rgba(0, 0, 0, .5);
				}
					
			}
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
		}
	}
</style>
