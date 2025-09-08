<template>
	<page-meta :root-font-size="rootSize"></page-meta>
	<view class="classic-login-container">
		<!-- 背景装饰 -->
		<view class="bg-decoration">
			<view class="bg-circle circle-1"></view>
			<view class="bg-circle circle-2"></view>
			<view class="bg-circle circle-3"></view>
			<view class="floating-elements">
				<view class="element element-1"></view>
				<view class="element element-2"></view>
				<view class="element element-3"></view>
			</view>
		</view>

		<!-- 主要登录区域 -->
		<view class="login-main">
			<!-- 左侧装饰区域 -->
			<view class="left-decoration">
				<view class="brand-showcase">
					<view class="logo-display">
						<image src="/static/mlogo.jpg" class="main-logo" mode="aspectFit"></image>
						<view class="logo-shine"></view>
					</view>
					<view class="welcome-content">
						<text class="welcome-title">欢迎使用</text>
						<text class="brand-name">喵莫思收银台</text>
						<text class="welcome-subtitle">宠友云门店管理系统</text>
						<view class="feature-list">
							<view class="feature-item">
								<text class="feature-icon">💼</text>
								<text class="feature-text">专业管理</text>
							</view>
							<view class="feature-item">
								<text class="feature-icon">🔒</text>
								<text class="feature-text">安全可靠</text>
							</view>
							<view class="feature-item">
								<text class="feature-icon">⚡</text>
								<text class="feature-text">高效便捷</text>
							</view>
						</view>
					</view>
				</view>
				<view class="decoration-elements">
					<view class="deco-line line-1"></view>
					<view class="deco-line line-2"></view>
					<view class="deco-circle circle-small"></view>
					<view class="deco-circle circle-medium"></view>
				</view>
			</view>

			<!-- 右侧登录表单 -->
			<view class="login-form-wrapper">
				<view class="form-header">
					<text class="form-title">账户登录</text>
					<text class="form-subtitle">请输入您的登录凭据</text>
					<view class="header-divider"></view>
				</view>

				<view class="form-container">
				<!-- 用户名输入 -->
				<view class="input-wrapper">
					<view class="input-group">
						<view class="input-icon">
							<text class="icon-user">👤</text>
						</view>
						<input 
							type="text" 
							@confirm="loginFn" 
							v-model="formData.username" 
							placeholder="请输入用户名" 
							placeholder-class="input-placeholder"
							class="form-input"
						/>
						<view class="input-border"></view>
					</view>
				</view>

				<!-- 密码输入 -->
				<view class="input-wrapper">
					<view class="input-group">
						<view class="input-icon">
							<text class="icon-lock">🔒</text>
						</view>
						<input 
							:type="passShow ? 'text' : 'password'"
							@confirm="loginFn" 
							v-model="formData.password" 
							placeholder="请输入密码" 
							placeholder-class="input-placeholder"
							class="form-input"
						/>
						<view class="password-toggle" @click="passShow = !passShow">
							<text class="toggle-icon">{{ passShow ? '👁️' : '🙈' }}</text>
						</view>
						<view class="input-border"></view>
					</view>
				</view>

				<!-- 验证码输入 -->
				<view class="input-wrapper">
					<view class="input-group captcha-group">
						<view class="input-icon">
							<text class="icon-code">🔢</text>
						</view>
						<input 
							type="number" 
							@confirm="loginFn" 
							v-model="formData.vercode" 
							placeholder="验证码" 
							placeholder-class="input-placeholder"
							class="form-input captcha-input"
							maxlength="4"
						/>
						<view class="captcha-wrapper" @click="getCaptchaFn">
							<image :src="captcha.img" class="captcha-image" />
						</view>
						<view class="input-border"></view>
					</view>
				</view>

				<!-- 登录按钮 -->
				<view class="button-wrapper">
					<button type="default" class="login-button" @click="loginFn" :disabled="isSub">
						<view class="button-content">
							<text v-if="!isSub" class="button-text">立即登录</text>
							<text v-else class="button-text loading">登录中...</text>
							<view v-if="isSub" class="loading-spinner"></view>
						</view>
						<view class="button-ripple"></view>
					</button>
				</view>

				<!-- 底部信息 -->
				<view class="form-footer">
					<text class="footer-text">安全可靠的门店管理解决方案</text>
				</view>
			</view>
		</view>
	</view>

		<!-- 版本切换 -->
		<view class="version-switch" @click="switchToPetLogin">
			<view class="switch-content">
				<text class="switch-icon">🎨</text>
				<text class="switch-text">体验宠物版</text>
			</view>
		</view>
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
			 * 切换到宠物版登录页
			 */
			switchToPetLogin() {
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
		background: linear-gradient(135deg, #2050B3 0%, #4A90E2 50%, #EACF4F 100%);
	}

	.classic-login-container {
		position: relative;
		width: 100vw;
		height: 100vh;
		background: linear-gradient(135deg, #2050B3 0%, #4A90E2 50%, #EACF4F 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	/* 背景装饰元素 */
	.bg-decoration {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.bg-circle {
		position: absolute;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		animation: floatCircle 8s ease-in-out infinite;
	}

	.circle-1 {
		width: 200rpx;
		height: 200rpx;
		top: 10%;
		left: 10%;
		animation-delay: 0s;
	}

	.circle-2 {
		width: 150rpx;
		height: 150rpx;
		bottom: 20%;
		right: 15%;
		animation-delay: 2s;
	}

	.circle-3 {
		width: 100rpx;
		height: 100rpx;
		top: 60%;
		left: 5%;
		animation-delay: 4s;
	}

	.floating-elements {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.element {
		position: absolute;
		width: 6rpx;
		height: 6rpx;
		background: rgba(234, 207, 79, 0.8);
		border-radius: 50%;
		animation: sparkle 4s ease-in-out infinite;
	}

	.element-1 {
		top: 25%;
		right: 20%;
		animation-delay: 1s;
	}

	.element-2 {
		bottom: 30%;
		left: 25%;
		animation-delay: 2.5s;
	}

	.element-3 {
		top: 45%;
		right: 10%;
		animation-delay: 3.5s;
	}

	@keyframes floatCircle {
		0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
		50% { transform: translateY(-30px) rotate(180deg); opacity: 0.2; }
	}

	@keyframes sparkle {
		0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
		50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
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
		box-shadow: 0 30rpx 80rpx rgba(0, 0, 0, 0.15);
		backdrop-filter: blur(20px);
		overflow: hidden;
		animation: cardEntrance 0.8s ease-out;
	}

	@keyframes cardEntrance {
		0% {
			transform: translateY(50px) scale(0.9);
			opacity: 0;
		}
		100% {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
	}

	/* 左侧装饰区域 */
	.left-decoration {
		flex: 1;
		background: linear-gradient(135deg, #2050B3 0%, #4A90E2 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60rpx 50rpx;
		position: relative;
		overflow: hidden;
	}

	.brand-showcase {
		text-align: center;
		z-index: 2;
		position: relative;
	}

	.logo-display {
		position: relative;
		margin-bottom: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.main-logo {
		width: 150rpx;
		height: 150rpx;
		border-radius: 25rpx;
		box-shadow: 0 15rpx 35rpx rgba(0, 0, 0, 0.2);
		border: 4rpx solid rgba(255, 255, 255, 0.9);
		animation: logoFloat 4s ease-in-out infinite;
	}

	.logo-shine {
		position: absolute;
		top: -8rpx;
		left: -8rpx;
		right: -8rpx;
		bottom: -8rpx;
		background: linear-gradient(45deg, #EACF4F, rgba(255, 255, 255, 0.8), #EACF4F);
		border-radius: 35rpx;
		z-index: -1;
		opacity: 0;
		animation: logoShine 6s ease-in-out infinite;
	}

	@keyframes logoFloat {
		0%, 100% { transform: translateY(0px) scale(1); }
		50% { transform: translateY(-8px) scale(1.02); }
	}

	@keyframes logoShine {
		0%, 100% { opacity: 0; transform: scale(1); }
		50% { opacity: 0.4; transform: scale(1.05); }
	}

	.welcome-content {
		color: white;
		text-align: center;
	}

	.welcome-title {
		display: block;
		font-size: 32rpx;
		font-weight: 300;
		margin-bottom: 15rpx;
		opacity: 0.9;
	}

	.brand-name {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
		letter-spacing: 2rpx;
	}

	.welcome-subtitle {
		display: block;
		font-size: 28rpx;
		margin-bottom: 40rpx;
		opacity: 0.85;
	}

	.feature-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		align-items: center;
	}

	.feature-item {
		display: flex;
		align-items: center;
		gap: 15rpx;
		padding: 12rpx 25rpx;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 25rpx;
		backdrop-filter: blur(10px);
		animation: featureSlide 0.6s ease-out;
	}

	.feature-item:nth-child(1) { animation-delay: 0.2s; }
	.feature-item:nth-child(2) { animation-delay: 0.4s; }
	.feature-item:nth-child(3) { animation-delay: 0.6s; }

	@keyframes featureSlide {
		0% {
			transform: translateX(-30px);
			opacity: 0;
		}
		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}

	.feature-icon {
		font-size: 24rpx;
	}

	.feature-text {
		font-size: 24rpx;
		color: white;
		font-weight: 500;
	}

	.decoration-elements {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.deco-line {
		position: absolute;
		background: rgba(234, 207, 79, 0.3);
		border-radius: 2rpx;
	}

	.line-1 {
		width: 80rpx;
		height: 4rpx;
		top: 15%;
		right: 10%;
		animation: lineFloat 4s ease-in-out infinite;
		animation-delay: 1s;
	}

	.line-2 {
		width: 60rpx;
		height: 4rpx;
		bottom: 20%;
		left: 15%;
		animation: lineFloat 4s ease-in-out infinite;
		animation-delay: 2s;
	}

	.deco-circle {
		position: absolute;
		border-radius: 50%;
		background: rgba(234, 207, 79, 0.2);
		animation: circleFloat 6s ease-in-out infinite;
	}

	.circle-small {
		width: 20rpx;
		height: 20rpx;
		top: 25%;
		left: 8%;
		animation-delay: 0.5s;
	}

	.circle-medium {
		width: 30rpx;
		height: 30rpx;
		bottom: 30%;
		right: 12%;
		animation-delay: 1.5s;
	}

	@keyframes lineFloat {
		0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
		50% { transform: translateY(-10px) rotate(5deg); opacity: 0.6; }
	}

	@keyframes circleFloat {
		0%, 100% { transform: scale(1) translateY(0px); opacity: 0.2; }
		50% { transform: scale(1.2) translateY(-15px); opacity: 0.5; }
	}

	/* 右侧登录表单 */
	.login-form-wrapper {
		flex: 1;
		padding: 80rpx 60rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: #fff;
	}

	.form-header {
		text-align: center;
		margin-bottom: 50rpx;
	}

	.form-title {
		display: block;
		font-size: 36rpx;
		font-weight: bold;
		color: #2050B3;
		margin-bottom: 12rpx;
		letter-spacing: 1rpx;
	}

	.form-subtitle {
		display: block;
		font-size: 26rpx;
		color: #666;
		margin-bottom: 25rpx;
	}

	/* 表单容器 */
	.form-container {
		width: 100%;
	}

	.input-wrapper {
		margin-bottom: 30rpx;
	}

	.input-group {
		position: relative;
		display: flex;
		align-items: center;
		background: #f8f9fa;
		border-radius: 16rpx;
		padding: 0 20rpx;
		border: 2rpx solid transparent;
		transition: all 0.3s ease;
		overflow: hidden;
	}

	.input-group:focus-within {
		border-color: #2050B3;
		background: #fff;
		box-shadow: 0 0 0 4rpx rgba(32, 80, 179, 0.1);
	}

	.input-icon {
		margin-right: 15rpx;
		color: #2050B3;
		font-size: 24rpx;
		transition: transform 0.3s ease;
	}

	.input-group:focus-within .input-icon {
		transform: scale(1.1);
	}

	.form-input {
		flex: 1;
		height: 80rpx;
		font-size: 28rpx;
		color: #333;
		border: none;
		background: transparent;
	}

	.input-placeholder {
		color: #999;
		font-size: 26rpx;
	}

	.captcha-group {
		padding-right: 0;
	}

	.captcha-input {
		padding-right: 15rpx;
	}

	.captcha-wrapper {
		display: flex;
		align-items: center;
		padding: 10rpx 15rpx;
		cursor: pointer;
	}

	.captcha-image {
		width: 120rpx;
		height: 60rpx;
		border-radius: 8rpx;
		border: 1rpx solid #e0e0e0;
		transition: transform 0.2s ease;
	}

	.captcha-wrapper:active .captcha-image {
		transform: scale(0.95);
	}

	.password-toggle {
		padding: 15rpx;
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.password-toggle:active {
		transform: scale(0.9);
	}

	.toggle-icon {
		font-size: 24rpx;
	}

	.input-border {
		position: absolute;
		bottom: 0;
		left: 50%;
		width: 0;
		height: 2rpx;
		background: linear-gradient(45deg, #2050B3, #EACF4F);
		transition: all 0.3s ease;
		transform: translateX(-50%);
	}

	.input-group:focus-within .input-border {
		width: 100%;
	}

	/* 登录按钮 */
	.button-wrapper {
		margin: 40rpx 0 30rpx;
	}

	.login-button {
		position: relative;
		width: 100%;
		height: 80rpx;
		background: linear-gradient(45deg, #2050B3, #4A90E2, #EACF4F);
		color: white;
		border: none;
		border-radius: 16rpx;
		font-size: 30rpx;
		font-weight: bold;
		transition: all 0.3s ease;
		box-shadow: 0 8rpx 20rpx rgba(32, 80, 179, 0.3);
		overflow: hidden;
	}

	.login-button:not(:disabled):active {
		transform: translateY(2rpx);
		box-shadow: 0 4rpx 12rpx rgba(32, 80, 179, 0.4);
	}

	.login-button:disabled {
		opacity: 0.7;
		transform: none;
	}

	.button-content {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
	}

	.button-text {
		letter-spacing: 1rpx;
	}

	.loading-spinner {
		width: 24rpx;
		height: 24rpx;
		border: 2rpx solid rgba(255, 255, 255, 0.3);
		border-top: 2rpx solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.button-ripple {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.1);
		transform: translateX(-100%);
		transition: transform 0.6s ease;
	}

	.login-button:active .button-ripple {
		transform: translateX(100%);
	}

	/* 底部信息 */
	.form-footer {
		text-align: center;
		margin-top: 20rpx;
	}

	.footer-text {
		font-size: 22rpx;
		color: #999;
		line-height: 1.4;
	}

	/* 版本切换按钮 */
	.version-switch {
		position: absolute;
		top: 40rpx;
		right: 40rpx;
		z-index: 20;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 25rpx;
		padding: 15rpx 25rpx;
		backdrop-filter: blur(10px);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.1);
	}

	.version-switch:active {
		transform: scale(0.95);
		background: rgba(255, 255, 255, 1);
	}

	.switch-content {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.switch-icon {
		font-size: 20rpx;
	}

	.switch-text {
		font-size: 24rpx;
		color: #666;
		font-weight: 500;
	}

	.header-divider {
		width: 60rpx;
		height: 4rpx;
		background: linear-gradient(45deg, #2050B3, #EACF4F);
		border-radius: 2rpx;
		margin: 0 auto;
	}

	/* 响应式设计 */
	@media screen and (max-width: 900rpx) {
		.login-main {
			flex-direction: column;
			width: 90vw;
			max-width: 650rpx;
		}

		.left-decoration {
			padding: 40rpx 35rpx;
			min-height: 250rpx;
		}

		.main-logo {
			width: 100rpx;
			height: 100rpx;
		}

		.brand-name {
			font-size: 38rpx;
		}

		.feature-list {
			flex-direction: row;
			justify-content: center;
			gap: 15rpx;
		}

		.feature-item {
			padding: 8rpx 15rpx;
		}

		.feature-text {
			font-size: 20rpx;
		}

		.login-form-wrapper {
			padding: 50rpx 40rpx;
		}

		.form-title {
			font-size: 32rpx;
		}

		.form-input {
			height: 70rpx;
			font-size: 26rpx;
		}

		.login-button {
			height: 70rpx;
			font-size: 28rpx;
		}

		.version-switch {
			top: 30rpx;
			right: 30rpx;
			padding: 12rpx 20rpx;
		}
	}
</style>