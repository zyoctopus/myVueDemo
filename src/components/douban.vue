<template>
	<div class="douban">
		<div class="optionSelect" @click="showList">
			<i class="iconfont icon-xuanxiang"></i>
			<div class="list-wrapper">
				<transition name="list">
					<ul class="itemList" v-show="listShow">
						<li class="item" @click="inTheaters">正在热映</li>
						<li class="item" @click="comingSoon">即将上映</li>
						<li class="item" @click="top250">top250</li>
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
						<form @submit.prevent="searchSubmit(searchKey)">
							<input type="text" class="input" v-model="searchKey">
						</form>
					</div>
				</transition>
			</div>
			<div ref="movie" class="movie-wrapper">
				<ul>
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
				movieData: '',
				searchKey: '',
				typeTitle: '',
				maskShow: false,
				searchShow: false
			}
		},
		created() {
			this.maskShow = true
			this.$http.jsonp('https://api.douban.com/v2/movie/in_theaters')
			.then((data) => {
				if (data.ok) {
					this.movieData = data.body.subjects
					this.typeTitle = '正在热映'
					this.$nextTick(() => {
						this.movieScroll = new BScroll(this.$refs.movie, {
							click: true
						})
					})
					this.maskShow = false
				}
			})
		},
		methods: {
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
			comingSoon() {
				this.maskShow = true
				this.$http.jsonp('https://api.douban.com/v2/movie/coming_soon')
				.then((data) => {
					// console.log(data.body.subjects)
					this.movieData = data.body.subjects
					this.typeTitle = '即将上映'
					this.movieScroll.refresh()
					this.maskShow = false
				})
			},
			inTheaters() {
				this.maskShow = true
				this.$http.jsonp('https://api.douban.com/v2/movie/in_theaters')
				.then((data) => {
					// console.log(data.body.subjects)
					this.movieData = data.body.subjects
					this.typeTitle = '正在热映'
					this.movieScroll.refresh()
					this.maskShow = false
				})
			},
			searchSubmit(key) {
				this.maskShow = true
				this.searchShow = false
				this.$http.jsonp(`https://api.douban.com/v2/movie/search?q=${key}`)
				.then((data) => {
					// console.log(data.body.subjects)
					this.movieData = data.body.subjects
					this.typeTitle = '搜索'
					this.movieScroll.refresh()
					this.maskShow = false
					this.searchKey = ''
				})
			},
			top250() {
				this.maskShow = true
				this.$http.jsonp('https://api.douban.com/v2/movie/top250')
				.then((data) => {
					// console.log(data.body.subjects)
					this.movieData = data.body.subjects
					this.typeTitle = 'top250'
					this.movieScroll.refresh()
					this.maskShow = false
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
				// width: 80px;
				// height: 140px;
				// overflow: hidden;
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
