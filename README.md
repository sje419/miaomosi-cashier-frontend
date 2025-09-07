# 喵墨思收银台前端

一个基于 uni-app 开发的跨平台收银台应用，支持多种支付方式、会员管理、商品管理、库存管理等完整的收银功能。

## 📱 项目简介

**喵墨思收银台**是一款功能完善的商业收银系统前端应用，采用 uni-app 框架开发，支持多平台部署。系统涵盖了现代零售业务的核心功能，包括商品销售、会员管理、库存控制、数据统计等模块。

### ✨ 主要特性

- 🛒 **完整收银流程** - 商品扫码、价格计算、多种支付方式
- 👥 **会员管理系统** - 会员注册、积分管理、等级体系
- 📦 **库存管理** - 入库出库、库存盘点、调拨管理
- 🎫 **储值卡管理** - 卡片发行、充值、消费记录
- 📊 **数据统计** - 销售报表、经营分析、图表展示
- 🖨️ **打印功能** - 小票打印、标签打印
- ⚖️ **电子秤集成** - 称重商品管理
- 🔄 **预约服务** - 预约管理、配置设置

## 🛠️ 技术栈

- **框架**: uni-app (支持 Vue 2/3)
- **UI库**: uni-ui 组件库
- **状态管理**: Vuex
- **网络请求**: 自定义 HTTP 模块
- **图表**: qiun-data-charts
- **样式**: SCSS
- **构建工具**: HBuilderX / Vite

## 📁 项目结构

```
miaomosi-cashier-frontend/
├── api/                    # API 接口模块
│   ├── address.js         # 地址相关
│   ├── card.js           # 储值卡
│   ├── goods.js          # 商品管理
│   ├── member.js         # 会员管理
│   ├── order.js          # 订单处理
│   └── ...
├── common/                # 公共资源
│   ├── css/              # 全局样式
│   ├── js/               # 工具函数
│   └── menu/             # 菜单配置
├── components/            # 自定义组件
│   ├── ns-goods/         # 商品组件
│   ├── ns-payment/       # 支付组件
│   ├── uni-*/            # uni-ui 组件
│   └── ...
├── pages/                 # 页面文件
│   ├── billing/          # 收银台
│   ├── member/           # 会员管理
│   ├── goods/            # 商品管理
│   ├── stock/            # 库存管理
│   ├── order/            # 订单管理
│   └── ...
├── store/                 # Vuex 状态管理
├── static/                # 静态资源
├── layout/                # 布局组件
├── electron/              # Electron 配置
├── manifest.json          # 应用配置
├── pages.json            # 页面路由配置
└── main.js               # 应用入口
```

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- HBuilderX (推荐) 或 VS Code
- uni-app CLI (可选)

### 安装依赖

```bash
# 克隆项目
git clone [项目地址]
cd miaomosi-cashier-frontend

# 安装依赖
npm install
```

### 开发调试

#### 使用 HBuilderX
1. 用 HBuilderX 打开项目根目录
2. 点击工具栏的"运行" -> 选择运行到对应平台
3. 选择设备或浏览器进行调试

#### 使用 CLI
```bash
# H5 开发
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# App 开发
npm run dev:app-plus
```

### 生产构建

```bash
# H5 构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin

# App 构建
npm run build:app-plus
```

## ⚙️ 配置说明

### 应用配置

在 `common/js/config.js` 中配置应用基本信息：

```javascript
export default {
  appkey: 'cashier',
  version: '5.4.3',
  siteId: '', // 站点ID
  baseUrl: '', // API 基础地址
  imgDomain: '', // 图片域名
  webSocket: '' // WebSocket 地址
}
```

### 权限配置

在 `manifest.json` 中配置应用权限和平台特性：

- Android 权限：网络访问、存储、相机、电话状态等
- 应用图标、启动页面
- 平台特定配置

## 📖 开发指南

### 页面开发

1. **页面结构**：所有页面继承 `base-page` 布局组件
2. **路由配置**：在 `pages.json` 中配置页面路径和导航
3. **状态管理**：使用 Vuex 管理全局状态
4. **API 调用**：使用统一的 HTTP 模块进行接口请求

### 组件开发

```vue
<template>
  <view class="custom-component">
    <!-- 组件内容 -->
  </view>
</template>

<script>
export default {
  name: 'CustomComponent',
  props: {
    // 组件属性
  },
  data() {
    return {
      // 组件数据
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-component {
  // 组件样式
}
</style>
```

### API 接口

```javascript
import http from '@/common/js/http.js'

// GET 请求
const getData = (params) => {
  return http.sendRequest({
    url: '/api/data',
    method: 'GET',
    data: params
  })
}

// POST 请求
const postData = (data) => {
  return http.sendRequest({
    url: '/api/data',
    method: 'POST',
    data: data
  })
}
```

## 🔧 核心功能模块

### 收银台 (Billing)
- 商品扫码添加
- 价格计算和优惠
- 多种支付方式
- 小票打印

### 会员管理 (Member)
- 会员注册和信息管理
- 积分和等级系统
- 消费记录查询

### 商品管理 (Goods)
- 商品信息维护
- 分类管理
- 价格管理

### 库存管理 (Stock)
- 入库出库操作
- 库存盘点
- 调拨管理
- 报损处理

### 订单管理 (Order)
- 订单查询和处理
- 退款管理
- 订单统计

## 📱 平台支持

- ✅ H5 (浏览器)
- ✅ 微信小程序
- ✅ 支付宝小程序
- ✅ Android App
- ✅ iOS App
- ✅ Electron (桌面应用)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系我们

- 项目维护者：[维护者姓名]
- 邮箱：[联系邮箱]
- 项目地址：[项目仓库地址]

## 🙏 致谢

感谢以下开源项目的支持：

- [uni-app](https://uniapp.dcloud.io/) - 跨平台应用开发框架
- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [uni-ui](https://hellouniapp.dcloud.net.cn/pages/extUI/badge/badge) - uni-app UI 组件库

---

**注意**: 请在使用前仔细阅读配置说明，确保正确配置 API 地址和相关参数。