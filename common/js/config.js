var app = {
	appkey: 'cashier',
	version: '5.4.3',
	version_no: '543240730001',
}

var config = {
	// 站点ID
	siteId: 0,
	// api请求地址 https://abc.com
	baseUrl: '{{$baseUrl}}',
	// 图片域名 https://abc.com
	imgDomain: '{{$imgDomain}}',
	//长链接 wss://abc.com/wss
	webSocket: '{{$webSocket}}',
	// app版本信息
	app: app,
}

export default config;