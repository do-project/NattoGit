/*******************************************************************************
 * Author :
 * 
 * @Author Timestamp :
 * @Timestamp
 ******************************************************************************/
var deviceone = require("deviceone");
var open = require("open");
var $U = require("url");
var app = deviceone.sm("do_App");
var storage = deviceone.sm("do_Storage");
var global = deviceone.sm("do_Global");
var dingwei = deviceone.sm("do_BaiduLocation");
var push = deviceone.sm("do_BaiduPush");// 推送
var login_file = "data://security/login";
var nf = deviceone.sm("do_Notification");

// Alpha效果
var buttonA = deviceone.mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
buttonA.alpha({
	delay : 0,
	duration : 100,
	curve : "Linear",
	repeatCount : "",
	autoReverse : true,
	fillAfter : false,
	alphaFrom : 1,
	alphaTo : .4
});
// Alpha+Scale效果
var buttonAS = deviceone.mm("do_Animation", "BUTTONTOUCHDOWN", "app");
buttonAS.alpha({
	delay : 0,
	duration : 100,
	curve : "Linear",
	repeatCount : "",
	autoReverse : true,
	fillAfter : false,
	alphaFrom : 1,
	alphaTo : .6
});

buttonAS.scale({
	delay : 0,
	duration : 100,
	curve : "Linear",
	repeatCount : "",
	autoReverse : true,
	fillAfter : false,
	scaleFromX : 1,
	scaleFromY : 1,
	scaleToX : 1.1,
	scaleToY : 1.1,
	pivotX : .5,
	pivotY : .5
});
// 开启定位
function position(mdl, loop) {
	dingwei.start({
		model : mdl,
		isLoop : loop
	});
}

var initdata = deviceone.sm("do_InitData");
app.on("loaded", function() {
	initdata.copy([ "initdata://sorting.json", "initdata://sorting1.json",
			"initdata://support.json", "initdata://version" ], "data://",
			function() {
				app.openPage({
					source : "source://view/index.ui",
					// source : "source://view/testanim.ui",
					statusBarState : "transparent",
					statusBarFgColor : "white",
					id : "pageIndex"
				});
				storage.deleteDir("data://temp/do_QRCode"); // 启动时删除二维码图片文件

				storage.readFile(login_file, function(data, e) {
					if (data != undefined && data.access_token != "") {
						global.setMemory("access_token", data.access_token);
					}
				});
				// 城市
				global.setMemory("city", "010101");
				// 定位
				position("high", false);

				push.startWork(); // 开始推送
			})
});

dingwei.on("result", function(data, e) {
	global.setMemory("Location", data);
});
// 推送绑定
push.on("bind", function(data) {
	global.setMemory("channelId", data.channelId);
	push.setIconBadgeNumber(0);
});
push.on("notificationClicked", function(data) { // App未打开IOS android都在这里
	push.setIconBadgeNumber(0);
	nf.alert(data.description);
	// var param = "";
	// if(data.customContent!=undefined){
	// param = JSON.parse(data.customContent);
	// }
	// if(param!="" && param.type==1){ //订单更新
	// var url = "";
	// switch(param.ser_id){
	// case -1:
	// url = "source://view/orders/order_drawback_detail.ui";
	// break;
	// case 1: //预定
	// url = "source://view/orders/order_reserv_detail.ui";
	// break;
	// case 2:
	// url = "source://view/orders/order_takway_detail.ui";
	// break;
	// case 6:
	// url = "source://view/orders/order_menu_detail.ui";
	// break;
	// };
	// if(!$U.tokenExist()){
	// app.openPage({
	// source : "source://view/loginreg/login.ui",
	// animationType: "slide_b2t",
	// statusBarState : "transparent",
	// statusBarFgColor : "white",
	// data:{url:url,param:param.token}
	// });
	// }else{
	// open.start(url,param.token);
	// }
	// }else{
	// deviceone.print(JSON.stringify(data),"notificationClicked event");
	// }
});
// 穿透消息
// push.on("message", function(data, e) {
// deviceone.print(JSON.stringify(data),"message event");
// });
push.on("iOSMessage", function(data, e) { // APP已打开IOS
	push.setIconBadgeNumber(0);
	nf.alert(data.message);
});