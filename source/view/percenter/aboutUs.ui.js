//related to aboutUs.ui
var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");
var nf = sm("do_Notification");
var external = sm("do_External");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var $U = require("url");
page.supportPanClosePage();
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.url.nattoInfo;
	request_http.request();
});


//加载区域
var request_http = mm("do_Http");
var _mobile = ui("do_Label_8");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	_mobile.text = databus.customer_mobile;
});


//用户协议
var useragreement = ui("do_ALayout_8");
useragreement.on("touch","",300,function(){
	useragreement.animate(buttonA,function(){
		open.start("source://view/percenter/useragree.ui");
	});
});

var phonetal = ui("do_ALayout_10");
phonetal.on("touch","",300,function(){
	phonetal.animate(buttonA,function(){
		nf.confirm({text:_mobile.text,title:"联系客服",button1text:"拨打",button2text:"取消"},function(datacall,e){
			if(datacall == 1){
				external.openDial(_mobile.text);
			}
		});
	});
});