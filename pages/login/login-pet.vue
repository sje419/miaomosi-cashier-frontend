<template>
	<page-meta :root-font-size="rootSize"></page-meta>
	<view class="container" :style="themeColor">
		<view class="login-wrap">
			<view class="header">
				<view class="title">收银台</view>
			</view>
			<view class="form-wrap">
				<view class="input-wrap">
					<text class="iconfont icona-xingzhuang2"></text>
					<input type="text" @confirm="loginFn" v-model="formData.username" placeholder="请输入用户名" placeholder-class="placeholder" />
				</view>
				<view class="input-wrap">
					<text class="iconfont iconmima"></text>
					<input type="text" @confirm="loginFn" v-model="formData.password" placeholder="请输入密码" placeholder-class="placeholder" v-show="passShow" />
					<input type="password" @confirm="loginFn" v-model="formData.password" placeholder="请输入密码" placeholder-class="placeholder" v-show="!passShow" />
					<view class="iconfont pass-show" :class="{ iconyanjing5: passShow, iconinvisible: !passShow }" @click="passShow = !passShow"></view>
				</view>
				<view class="input-wrap">
					<text class="iconfont iconyanzhengma"></text>
					<input type="number" @confirm="loginFn" v-model="formData.vercode" placeholder="请输入验证码" placeholder-class="placeholder" maxlength="4" />
					<image :src="captcha.img" class="captcha" @click="getCaptchaFn" />
				</view>
				<button type="default" class="login-btn primary-btn" @click="loginFn">登录</button>
			</view>
			<!-- 版本切换按钮 -->
			<view class="version-switch-classic" @click="switchToPetLogin">
				<text class="switch-text-classic">🐾 体验宠物版登录</text>
			</view>
		</view>
		
		<!-- 自定义宠物主题弹窗 -->
		<pet-modal 
			:visible="showPetModal"
			title="切换登录主题"
			content="想要体验专为宠物行业设计的温馨登录页面吗？"
			iconText="🐾"
			cancelText="保持经典"
			confirmText="体验宠物版"
			@cancel="showPetModal = false"
			@confirm="confirmSwitchToPet"
		></pet-modal>
	</view>
</template>

<script>
	import validate from 'common/js/validate.js';
	import { getCaptcha, login } from '@/api/login.js'

	export default {
		data() {
			return {
				passShow: false,
				formData: {
					username: '',
					password: '',
					vercode: '',
					dynacode: '',
					key: ''
				},
				captcha: {
					id: '',
					img: ''
				},
				isSub: false,
				showPetModal: false // 控制宠物主题弹窗显示
			};
		},
		onLoad() {
			this.loadThemeColor();
			this.getCaptchaFn();
		},
		methods: {
			/**
			 * 获取验证码
			 */
			getCaptchaFn() {
				getCaptcha(this.captcha.id).then(res => {
					if (res.code >= 0) {
						this.captcha = res.data;
						this.captcha.img = this.captcha.img.replace(/\r\n/g, '');
					}
				})
			},
			loginFn() {
				var data = {
					username: this.formData.username,
					password: this.formData.password
				};

				if (this.captcha.id != '') {
					data.captcha_id = this.captcha.id;
					data.captcha_code = this.formData.vercode;
				}

				if (this.verify(data)) {
					if (this.isSub) return;
					this.isSub = true;

					uni.showLoading({});

					login(data).then(res => {
						uni.hideLoading();
						if (res.code >= 0) {
							uni.setStorageSync('siteId', res.data.site_id);
							this.$store.commit('app/setGlobalStoreId', res.data.store_id);
							uni.setStorage({
								key: 'cashierToken',
								data: res.data.token,
								success: () => {
									this.$store.dispatch('app/getStoreInfoFn');
									this.$store.dispatch('app/getUserInfoFn');
									this.$store.dispatch('app/getUserGroupFn');
								}
							});
						} else {
							this.isSub = false;
							this.getCaptchaFn();
							this.$util.showToast({
								title: res.message
							});
						}
					})
				}
			},
			verify(data) {
				var rule = [{
					name: 'username',
					checkType: 'required',
					errorMsg: '请输入用户名'
				}, {
					name: 'password',
					checkType: 'required',
					errorMsg: '请输入密码'
				}, {
					name: 'captcha_code',
					checkType: 'required',
					errorMsg: '请输入验证码'
				}];

				var checkRes = validate.check(data, rule);
				if (checkRes) {
					return true;
				} else {
					this.$util.showToast({
						title: validate.error
					});
						return false;
					}
				},
				/**
				 * 切换到宠物版登录页
				 */
				switchToPetLogin() {
					this.showPetModal = true;
				},
				/**
				 * 确认切换到宠物版
				 */
				confirmSwitchToPet() {
					uni.redirectTo({
						url: '/pages/login/login-pet'
					});
				}
		},
		watch: {
			menu: function(menu) {
				if (menu && menu.length) {
					if (menu[0].path) this.$util.redirectTo(menu[0].path, {}, 'redirectTo');
					else this.$util.redirectTo('/pages/stat/index', {}, 'redirectTo');
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	page {
		width: 100vw;
		height: 100vh;
		background: #f7f8fa;
	}

	.container {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		background-size: cover;
		background-repeat: no-repeat;
		background-position: center;
		display: flex;
		align-items: center;
		justify-content: center;
		background-image:url(@/static/login_bg.png);

		.login-bg {
			margin-right: 1.5rem;
			width: 5.9rem;
			height: 4.3rem;

			image {
				width: 5.9rem;
				height: 4.3rem;
			}
		}
	}

	.login-wrap {
		padding: 0.3rem 0;
		width: 3.48rem;
		background-color: #fff;
		box-shadow: 0 0.01rem 0.09rem 0 rgba(15, 92, 251, 0.12);
		border-radius: 0.05rem;

		.header {
			text-align: center;

			image {
				width: 2.13rem;
				height: 0.78rem;
			}

			.title {
				font-weight: bold;
				font-size: 0.25rem;
				margin-top: 0.1rem;
				color: #222222;
			}

			.desc {
				font-size: 0.16rem;
				color: #969799;
				margin-top: 0.1rem;
			}
		}
	}

	.form-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0.2rem 0;

		.input-wrap {
			width: 2.85rem;
			padding: 0 0.1rem;
			border-bottom: 0.01rem solid #e6e6e6;
			margin-top: 0.25rem;
			display: flex;
			align-items: center;
			box-sizing: border-box;
			border-radius: 0.05rem;

			.iconfont {
				margin-right: .1rem;
				font-size: .2rem;
				color: #46586E;
			}

			input {
				flex: 1;
				height: 0.4rem;
				line-height: 0.4rem;
				font-size: $uni-font-size-base;
			}

			.placeholder {
				font-size: $uni-font-size-base;
				color: #999999;
				font-weight: 500;
			}

			.send-code {
				color: $primary-color;
				cursor: pointer;

				&.disabled {
					cursor: not-allowed;
					color: #999;
				}
			}

			.captcha {
				width: 0.8rem;
				height: 0.3rem;
				cursor: pointer;
			}

			.pass-show {
				font-size: 0.14rem;
				cursor: pointer;
				color: #333;
			}
		}

		.login-btn {
			width: 2.85rem;
			margin-top: 0.3rem;
			height: 0.4rem;
			line-height: 0.4rem;
			border-radius: 0.05rem;
		}
	}
			
	/* 版本切换按钮样式 */
	.version-switch-classic {
		position: absolute;
		top: 0.2rem;
		right: 0.2rem;
		z-index: 100;
		background: rgba(255, 255, 255, 0.9);
		padding: 0.1rem 0.15rem;
		border-radius: 0.15rem;
		backdrop-filter: blur(10px);
		cursor: pointer;
		transition: all 0.3s ease;
		border: 1px solid rgba(32, 80, 179, 0.3);
	}
			
	.version-switch-classic:hover {
		background: rgba(255, 255, 255, 1);
		transform: scale(1.05);
		box-shadow: 0 0.02rem 0.1rem rgba(32, 80, 179, 0.3);
	}
			
	.switch-text-classic {
		font-size: 0.12rem;
		color: #2050B3;
		font-weight: 500;
	}
</style>