<template>
	<page-meta :root-font-size="rootSize"></page-meta>
	<view class="pet-login-container" :style="themeColor">
		<!-- 背景装饰元素 -->
		<view class="bg-decoration">
			<view class="paw-print paw-1">🐾</view>
			<view class="paw-print paw-2">🐾</view>
			<view class="paw-print paw-3">🐾</view>
			<view class="paw-print paw-4">🐾</view>
			<view class="paw-print paw-5">🐾</view>
			<view class="floating-heart heart-1">💖</view>
			<view class="floating-heart heart-2">💖</view>
			<view class="floating-heart heart-3">💖</view>
		</view>

		<!-- 主要登录区域 -->
		<view class="login-main">
			<!-- 左侧装饰区域 -->
			<view class="left-decoration">
				<view class="pet-mascot">
					<view class="cat-face">🐱</view>
					<view class="dog-face">🐶</view>
				</view>
				<view class="welcome-text">
					<text class="welcome-title">欢迎来到</text>
					<text class="brand-name">喵莫思宠物收银台</text>
					<text class="welcome-subtitle">宠友云门店管理系统</text>
				</view>
			</view>

			<!-- 右侧登录表单 -->
			<view class="login-form-wrapper">
				<view class="form-header">
					<view class="header-logo">
						<image src="/static/mlogo.jpg" class="logo-image" mode="aspectFit"></image>
					</view>
					<text class="form-title">店铺登录</text>
					<text class="form-subtitle">管理您的宠物店业务</text>
				</view>

				<view class="login-form">
					<!-- 用户名输入 -->
					<view class="input-group">
						<view class="input-icon">👤</view>
						<input 
							type="text" 
							@confirm="loginFn" 
							v-model="formData.username" 
							placeholder="请输入用户名" 
							placeholder-class="input-placeholder"
							class="form-input"
						/>
					</view>

					<!-- 密码输入 -->
					<view class="input-group">
						<view class="input-icon">🔐</view>
						<input 
							:type="passShow ? 'text' : 'password'"
							@confirm="loginFn" 
							v-model="formData.password" 
							placeholder="请输入密码" 
							placeholder-class="input-placeholder"
							class="form-input"
						/>
						<view class="password-toggle" @click="passShow = !passShow">
							<text class="toggle-icon">{{ passShow ? '🔓' : '🔒' }}</text>
						</view>
					</view>

					<!-- 验证码输入 -->
					<view class="input-group">
						<view class="input-icon">🔢</view>
						<input 
							type="number" 
							@confirm="loginFn" 
							v-model="formData.vercode" 
							placeholder="请输入验证码" 
							placeholder-class="input-placeholder"
							class="form-input captcha-input"
							maxlength="4"
						/>
						<image :src="captcha.img" class="captcha-image" @click="getCaptchaFn" />
					</view>

					<!-- 登录按钮 -->
					<button type="default" class="pet-login-btn" @click="loginFn" :disabled="isSub">
						<text v-if="!isSub">🚀 立即登录</text>
						<text v-else>🐾 登录中...</text>
					</button>

					<!-- 底部装饰 -->
					<view class="form-footer">
						<text class="footer-text">为宠物店主提供专业服务 🐕‍🦺</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 版本切换按钮 -->
		<view class="version-switch" @click="switchToOldLogin">
			<text class="switch-text">🔄 切换经典版本</text>
		</view>
		
		<!-- 自定义弹窗 -->
		<pet-modal 
			:visible="showClassicModal"
			title="切换到经典版"
			content="要切换回简洁的传统登录页面吗？"
			iconText="📝"
			cancelText="继续体验"
			confirmText="切换经典"
			@cancel="showClassicModal = false"
			@confirm="confirmSwitchToClassic"
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
				showClassicModal: false // 控制经典版弹窗显示
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
			/**
			 * 登录功能
			 */
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

					uni.showLoading({
						title: '正在登录...'
					});

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
			/**
			 * 表单验证
			 */
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
			 * 切换到旧版登录页
			 */
			switchToOldLogin() {
				this.showClassicModal = true;
			},
			/**
			 * 确认切换到经典版
			 */
			confirmSwitchToClassic() {
				uni.redirectTo({
					url: '/pages/login/login'
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
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.pet-login-container {
		position: relative;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, #2050B3 0%, #4A90E2 50%, #EACF4F 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	/* 背景装饰动画 */
	.bg-decoration {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.paw-print {
		position: absolute;
		font-size: 24rpx;
		opacity: 0.6;
		animation: float 6s ease-in-out infinite;
	}

	.paw-1 { top: 10%; left: 10%; animation-delay: 0s; }
	.paw-2 { top: 20%; right: 15%; animation-delay: 1s; }
	.paw-3 { bottom: 30%; left: 5%; animation-delay: 2s; }
	.paw-4 { bottom: 15%; right: 10%; animation-delay: 3s; }
	.paw-5 { top: 50%; left: 3%; animation-delay: 4s; }

	.floating-heart {
		position: absolute;
		font-size: 20rpx;
		opacity: 0.7;
		animation: heartbeat 4s ease-in-out infinite;
	}

	.heart-1 { top: 15%; right: 5%; animation-delay: 0.5s; }
	.heart-2 { bottom: 20%; left: 15%; animation-delay: 1.5s; }
	.heart-3 { top: 60%; right: 20%; animation-delay: 2.5s; }

	@keyframes float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(-20px) rotate(10deg); }
	}

	@keyframes heartbeat {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.2); }
	}

	/* 主要登录区域 */
	.login-main {
		position: relative;
		z-index: 10;
		display: flex;
		width: 95vw;
		max-width: 1200rpx;
		min-height: 600rpx;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 40rpx;
		box-shadow: 0 25rpx 80rpx rgba(0, 0, 0, 0.2);
		backdrop-filter: blur(15px);
		overflow: hidden;
	}

	/* 左侧装饰区域 */
	.left-decoration {
		flex: 1;
		background: linear-gradient(45deg, #2050B3, #4A90E2);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 50rpx;
		position: relative;
	}

	.pet-mascot {
		display: flex;
		gap: 25rpx;
		margin-bottom: 50rpx;
	}

	.cat-face, .dog-face {
		font-size: 80rpx;
		animation: bounce 3s ease-in-out infinite alternate;
	}

	.dog-face {
		animation-delay: 1.5s;
	}

	@keyframes bounce {
		0% { transform: translateY(0px); }
		100% { transform: translateY(-10px); }
	}

	.welcome-text {
		text-align: center;
		color: white;
	}

	.welcome-title {
		display: block;
		font-size: 32rpx;
		font-weight: 300;
		margin-bottom: 12rpx;
	}

	.brand-name {
		display: block;
		font-size: 42rpx;
		font-weight: bold;
		margin-bottom: 18rpx;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.welcome-subtitle {
		display: block;
		font-size: 28rpx;
		opacity: 0.9;
	}

	/* 右侧登录表单 */
	.login-form-wrapper {
		flex: 1;
		padding: 70rpx 50rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.form-header {
		text-align: center;
		margin-bottom: 60rpx;
	}

	.header-logo {
		margin-bottom: 25rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.logo-image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		box-shadow: 0 8rpx 25rpx rgba(255, 255, 255, 0.3);
		border: 3rpx solid rgba(255, 255, 255, 0.8);
		animation: logoGlow 3s ease-in-out infinite alternate;
	}
	
	@keyframes logoGlow {
		0% { 
			box-shadow: 0 8rpx 25rpx rgba(255, 255, 255, 0.3);
			transform: scale(1);
		}
		100% { 
			box-shadow: 0 12rpx 35rpx rgba(255, 255, 255, 0.5);
			transform: scale(1.02);
		}
	}

	.form-title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 12rpx;
	}

	.form-subtitle {
		display: block;
		font-size: 26rpx;
		color: #666;
	}

	.login-form {
		width: 100%;
	}

	.input-group {
		position: relative;
		display: flex;
		align-items: center;
		margin-bottom: 35rpx;
		background: #f8f9fa;
		border-radius: 18rpx;
		padding: 0 25rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
	}

	.input-group:focus-within {
		border-color: #2050B3;
		background: white;
		box-shadow: 0 0 20rpx rgba(32, 80, 179, 0.2);
	}

	.input-icon {
		margin-right: 18rpx;
		font-size: 28rpx;
		color: #2050B3;
	}

	.form-input {
		flex: 1;
		height: 90rpx;
		font-size: 30rpx;
		color: #333;
		border: none;
		background: transparent;
	}

	.input-placeholder {
		color: #999;
		font-size: 28rpx;
	}

	.captcha-input {
		flex: 1;
		margin-right: 18rpx;
	}

	.password-toggle {
		padding: 12rpx;
		cursor: pointer;
	}

	.toggle-icon {
		font-size: 28rpx;
	}

	.captcha-image {
		width: 140rpx;
		height: 70rpx;
		border-radius: 10rpx;
		cursor: pointer;
		border: 1rpx solid #e0e0e0;
	}

	.pet-login-btn {
		width: 100%;
		height: 90rpx;
		background: linear-gradient(45deg, #2050B3, #EACF4F);
		color: white;
		border: none;
		border-radius: 18rpx;
		font-size: 32rpx;
		font-weight: bold;
		margin-top: 25rpx;
		margin-bottom: 35rpx;
		transition: all 0.3s ease;
		box-shadow: 0 10rpx 25rpx rgba(32, 80, 179, 0.3);
	}

	.pet-login-btn:hover {
		transform: translateY(-2rpx);
		box-shadow: 0 15rpx 30rpx rgba(32, 80, 179, 0.4);
	}

	.pet-login-btn:disabled {
		opacity: 0.7;
		transform: none;
	}

	.form-footer {
		text-align: center;
		margin-top: 25rpx;
	}

	.footer-text {
		font-size: 24rpx;
		color: #999;
	}

	/* 版本切换按钮 */
	.version-switch {
		position: absolute;
		top: 45rpx;
		right: 45rpx;
		z-index: 20;
		background: rgba(255, 255, 255, 0.9);
		padding: 18rpx 30rpx;
		border-radius: 30rpx;
		backdrop-filter: blur(10px);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.version-switch:hover {
		background: rgba(255, 255, 255, 1);
		transform: scale(1.05);
	}

	.switch-text {
		font-size: 26rpx;
		color: #666;
		font-weight: 500;
	}

	/* 响应式设计 */
	@media screen and (max-width: 900rpx) {
		.login-main {
			flex-direction: column;
			width: 90vw;
			max-width: 650rpx;
		}

		.left-decoration {
			padding: 35rpx;
			min-height: 220rpx;
		}

		.pet-mascot {
			margin-bottom: 25rpx;
		}

		.cat-face, .dog-face {
			font-size: 55rpx;
		}

		.brand-name {
			font-size: 34rpx;
		}

		.login-form-wrapper {
			padding: 45rpx 35rpx;
		}
	}
</style>