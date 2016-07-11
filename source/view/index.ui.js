/**********************************************
 * Author : @Author
 * Timestamp : @Timestamp
 **********************************************/
var nf = sm("do_Notification");
var app = sm("do_App");
var open = require("open");
var page = sm("do_Page");
var global = sm("do_Global");
var storage = sm("do_Storage");
var external = sm("do_External");
var $U = require("url");

var $V = require("version");

var device = sm("do_Device");
var info = device.getInfo();

var version_file = "data://version";


var push=sm("do_BaiduPush");

//安卓返回键主页退出
var canBack = false;
var delay3 = mm("do_Timer");
delay3.delay = 3000;
delay3.interval = 1000;
delay3.on("tick", function(){
    this.stop();
    canBack = false;
});

page.on("back", function(){
    if (canBack) {
        global.exit();
    } else {
        nf.toast("再按一次退出");
        canBack = true;
        delay3.start();
    }
}).on("loaded",function(){
	//设备信息
	if(info.OS=="android"){
		global.setMemory("equipment", 0);
	}else{
		global.setMemory("equipment", 1);
	}
	page.fire("page4");
	startimg.animate(animimg,function(){
		startimg.visible = false;
		//对比
		$V.compare(false);
		request_http.url = $U.token($U.url.appInTheOrder,"user");
	    request_http.request();
	});
	
	
}).on("result",function(data){
	if(data.url!=undefined && data.url!=""){
		if(data.param!=undefined && data.param!=""){
			open.start(data.url,data.param);
		}else{
			open.start(data.url);
		}
	}
	
	if(data.msgNum!=undefined && data.msgNum>0){
		page.fire("MessageNumber",data.msgNum);
	}
	orderNum(data);
}).on("OrderNumber",function(data){
	orderNum(data);
});
function orderNum(data){
	if(data.orderNum!=undefined){
		var orderNum = ui("do_Label_5");
		if(data.orderNum>0){
			orderNum.visible=true;
		}else{
			orderNum.visible=false;
		}
	}
}


var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	orderNum(databus);
});

//安卓返回键主页退出END

//global.on("foreground", function(data, e) {
//	$V.compare();
//});

//切换tab
var main_shower = ui("main_shower");
var imgv0,imgv1,imgv2,imgv3,lb0,lb1,lb2,lb3;
imgv0 = ui("img_0");imgv1 = ui("img_1");imgv2 = ui("img_2");imgv3 = ui("img_3");
lb0 = ui("lb_0");lb1 = ui("lb_1");lb2 = ui("lb_2");lb3 = ui("lb_3");
//dl0 = ui("dal0");dl1 = ui("dal1");dl2 = ui("dal2");dl3 = ui("dal3");

var ivs = [ imgv0, imgv1, imgv2, imgv3 ];
var labels = [ lb0, lb1, lb2, lb3 ];

//为viewshower增加3个页面，这3个页面和index.ui都属于上面的page对象的子控件
main_shower.addViews([ {
	id : "page1",// 页面的标示
	path : "source://view/homeViewShowers/page1.ui"//页面的路径1
}, {
	id : "page2",
	path : "source://view/homeViewShowers/page2.ui"
}, {
	id : "page3",
	path : "source://view/homeViewShowers/page3.ui"
}, {
	id : "page4",
	path : "source://view/homeViewShowers/page4.ui"
} ]);
// 初始化先显示第一个页面
main_shower.showView("page1");

var page1 = ui("page1");
var page2 = ui("page2");
var page3 = ui("page3");
var page4 = ui("page4");
page1.on("touch", function() {
	show("page1",300);// 3000毫秒的动画效果
});
page2.on("touch", function() {
	show("page2",300);// 3000毫秒的动画效果
});
page3.on("touch", function() {
	show("page3",300);// 3000毫秒的动画效果
});
page4.on("touch", function() {
	show("page4",300);// 3000毫秒的动画效果
});

var pagess = [page1, page2 ,page3 ,page4];

var checkFun = function(index) {
	for (var i = 0; i < pagess.length; i++) {
		if (index == i) { // 表示选中了第几个
			ivs[i].source = "source://image/tab-" + i + "-d" + ".png";
			labels[i].fontColor = "0793dbFF";
		} else {
			ivs[i].source = "source://image/tab-" + i + ".png";
			labels[i].fontColor = "666666FF";
		}
	}
}
pagess.forEach(function(dl,i){
	dl.on("touch", function(data, e) {
		checkFun(i);
		//page.fire(data);
	})
});

function show(pageid) {
	main_shower.showView(pageid);
	page.fire(pageid);
}

var startimg = ui("do_ALayout_3");
startimg.on("touch",function(){
	//防穿透事件
});
var animimg = mm("do_Animation");
animimg.fillAfter = true;
animimg.scale({
	delay:2500,
    duration : 600,
    scaleFromX : 1,
    scaleFromY : 1,
    scaleToX : 1.5,
    scaleToY : 1.5,
    pivotX : 0.5,
    pivotY : 0.5
}, "id1");
animimg.alpha({
	delay:2500,
    duration : 600,
    alphaFrom : 1,
    alphaTo : 0
}, "id2");



