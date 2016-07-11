var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.token($U.url.appUserInfo,"user");
    request_http.request();
}).on("result",function(){
	request_http.url = $U.token($U.url.appUserInfo,"user");
    request_http.request();
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	var _price = ui("do_Label_4");
	_price.text = "￥"+databus.balance;
});

//余额记录
var yejilu = ui("do_ALayout_yue");
yejilu.on("touch","",300,function(){
	yejilu.animate(buttonA,function(){
		open.start("source://view/percenter/wallet/balanceRecord.ui");
	});
});
//积分记录
var jifen=ui("do_ALayout_jifen");
jifen.on("touch","",300,function(){
	jifen.animate(buttonA,function(){
		open.start("source://view/percenter/wallet/integral.ui");
	});
});



var tixian = ui("do_Button_tixian");
tixian.on("touch","",300,function(){
	tixian.animate(buttonA,function(){
		open.start("source://view/percenter/wallet/tixian.ui");
	});
});