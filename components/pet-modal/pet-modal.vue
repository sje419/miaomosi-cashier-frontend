<template>
	<view v-if="visible" class="pet-modal-overlay" @click="handleOverlayClick">
		<view class="pet-modal-container" @click.stop>
			<!-- 装饰元素 -->
			<view class="modal-decoration">
				<text class="decoration-paw">🐾</text>
				<text class="decoration-heart">💕</text>
			</view>
			
			<!-- 模态框主体 -->
			<view class="pet-modal-main">
				<!-- 头部图标 -->
				<view class="modal-header">
					<view class="header-icon">{{ iconText }}</view>
					<text class="modal-title">{{ title }}</text>
				</view>
				
				<!-- 内容区域 -->
				<view class="modal-content">
					<text class="content-text">{{ content }}</text>
				</view>
				
				<!-- 按钮区域 -->
				<view class="modal-actions">
					<button 
						class="action-btn cancel-btn" 
						@click="handleCancel"
						v-if="showCancel"
					>
						<text class="btn-icon">❌</text>
						<text class="btn-text">{{ cancelText }}</text>
					</button>
					<button 
						class="action-btn confirm-btn" 
						@click="handleConfirm"
					>
						<text class="btn-icon">✨</text>
						<text class="btn-text">{{ confirmText }}</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'PetModal',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: '提示'
		},
		content: {
			type: String,
			default: ''
		},
		iconText: {
			type: String,
			default: '🐱'
		},
		showCancel: {
			type: Boolean,
			default: true
		},
		cancelText: {
			type: String,
			default: '取消'
		},
		confirmText: {
			type: String,
			default: '确定'
		}
	},
	methods: {
		handleOverlayClick() {
			this.handleCancel();
		},
		handleCancel() {
			this.$emit('cancel');
			this.$emit('update:visible', false);
		},
		handleConfirm() {
			this.$emit('confirm');
			this.$emit('update:visible', false);
		}
	}
}
</script>

<style lang="scss" scoped>
.pet-modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
	backdrop-filter: blur(5px);
	animation: fadeIn 0.3s ease;
}

.pet-modal-container {
	position: relative;
	margin: 40rpx;
	max-width: 600rpx;
	width: 90%;
}

.modal-decoration {
	position: absolute;
	top: -20rpx;
	left: -20rpx;
	right: -20rpx;
	bottom: -20rpx;
	pointer-events: none;
	z-index: 1;
}

.decoration-paw {
	position: absolute;
	top: 10rpx;
	right: 15rpx;
	font-size: 20rpx;
	opacity: 0.6;
	animation: float 3s ease-in-out infinite;
}

.decoration-heart {
	position: absolute;
	bottom: 15rpx;
	left: 10rpx;
	font-size: 18rpx;
	opacity: 0.7;
	animation: heartbeat 2s ease-in-out infinite;
}

.pet-modal-main {
	position: relative;
	z-index: 10;
	background: linear-gradient(135deg, #fff 0%, #fef7f7 100%);
	border-radius: 25rpx;
	box-shadow: 0 20rpx 60rpx rgba(255, 107, 107, 0.15);
	overflow: hidden;
	animation: slideIn 0.3s ease;
}

.modal-header {
	text-align: center;
	padding: 40rpx 30rpx 20rpx;
	background: linear-gradient(45deg, #ff9a9e, #fecfef);
	color: white;
}

.header-icon {
	font-size: 50rpx;
	margin-bottom: 15rpx;
	animation: bounce 2s ease-in-out infinite;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.modal-content {
	padding: 35rpx 30rpx;
	text-align: center;
}

.content-text {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
}

.modal-actions {
	display: flex;
	padding: 0 30rpx 30rpx;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	height: 70rpx;
	border-radius: 15rpx;
	border: none;
	font-size: 26rpx;
	font-weight: 500;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.cancel-btn {
	background: linear-gradient(45deg, #f5f5f5, #e0e0e0);
	color: #666;
}

.cancel-btn:hover {
	background: linear-gradient(45deg, #e0e0e0, #d0d0d0);
	transform: translateY(-2rpx);
}

.confirm-btn {
	background: linear-gradient(45deg, #ff6b6b, #ffa500);
	color: white;
	box-shadow: 0 8rpx 20rpx rgba(255, 107, 107, 0.3);
}

.confirm-btn:hover {
	background: linear-gradient(45deg, #ff5252, #ff9500);
	transform: translateY(-2rpx);
	box-shadow: 0 12rpx 25rpx rgba(255, 107, 107, 0.4);
}

.btn-icon {
	font-size: 20rpx;
}

.btn-text {
	font-size: 26rpx;
}

/* 动画效果 */
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes slideIn {
	from { 
		opacity: 0;
		transform: translateY(-50rpx) scale(0.9);
	}
	to { 
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

@keyframes float {
	0%, 100% { transform: translateY(0px) rotate(0deg); }
	50% { transform: translateY(-10px) rotate(5deg); }
}

@keyframes heartbeat {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.1); }
}

@keyframes bounce {
	0%, 100% { transform: translateY(0px); }
	50% { transform: translateY(-5px); }
}

/* 响应式设计 */
@media screen and (max-width: 600rpx) {
	.pet-modal-main {
		margin: 20rpx;
	}
	
	.modal-header {
		padding: 30rpx 20rpx 15rpx;
	}
	
	.header-icon {
		font-size: 40rpx;
	}
	
	.modal-title {
		font-size: 28rpx;
	}
	
	.modal-content {
		padding: 25rpx 20rpx;
	}
	
	.content-text {
		font-size: 24rpx;
	}
	
	.modal-actions {
		padding: 0 20rpx 25rpx;
		gap: 15rpx;
	}
	
	.action-btn {
		height: 60rpx;
		font-size: 24rpx;
	}
}
</style>