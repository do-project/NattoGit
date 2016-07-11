var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var Euc = encodeURIComponent;

var token = page.getData();

var submit=ui("do_Button_1");
var newPass=ui("do_TextField_2");  //新密码
var newQPass=ui("do_TextField_3"); //确认新密码
var leftclose = ui("do_ALayout_close");

leftclose.on("touch",function(){
	app.closePage();
	page.hideKeyboard();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
	page.hideKeyboard();
});


rootview.on("touch",function(){
	page.hideKeyboard();
});

submit.on("touch","",300,function(){
	if(newPass.text.trim()=="" || newPass.text.length<8){
		nf.toast("新密码长度必须大于8位字符");
		newPass.setFocus(true);
	}else if(newQPass.text!=newPass.text){
		nf.toast("两次密码输入不一致");
		newQPass.setFocus(true);
	}else{
		request_http.url = $U.url.appForgetUpdatePass+"?token="+Euc(token)+"&pass="+Euc(newPass.text);
		request_http.request();
	}
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.error_code==0){
		nf.toast("修改密码成功");
		app.closePage("","",2);
	}else{
		nf.toast(databus.reason);
	}
});