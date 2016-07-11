var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var nickname=page.getData();
var leftclose = ui("do_ALayout_close");
var Euc = encodeURIComponent;

var txtNick=ui("do_TextField_1");
var save=ui("do_Button_1");

leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	txtNick.text = nickname==null? "":nickname;
});

rootview.on("touch",function(){
	page.hideKeyboard();
});


save.on("touch","",300,function(){
	save.animate(buttonA,function(){
		page.hideKeyboard();
		if(txtNick.text.trim()!=""){
			request_http.url = $U.token($U.url.appUpdateNickName,"user")+"&nickname="+Euc(txtNick.text);
		    request_http.request();
		}else{
			nf.toast("请输入昵称");
			txtNick.setFocus(true);
		}
	});
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.error_code==0){
		app.closePage();
	}else{
		nf.toast(databus.reason);
	}
});