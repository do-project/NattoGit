var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var global = sm("do_Global");
var user = global.getMemory("access_token");
var Euc = encodeURIComponent;
var cellIndex = 0;



var txtbg = ui("do_ALayout_25");
txtbg.on("touch",function(){
	
});

var bgmask = ui("maskbg");
bgmask.on("touch","",300,function(){
	this.visible = false;
	page.hideKeyboard();
	txtPay.text = "";
});
var txtPay = ui("do_TextField_1");
//ok
var btnok= ui("do_Button_OK");
btnok.on("touch","",300,function(){
	btnok.animate(buttonA,function(){
		page.hideKeyboard();
		if(txtPay.text.trim()==""){
			nf.toast("请输入支付密码");
		}else{
			pass_http.url = $U.token($U.url.paypass,"user")+"&pass="+Euc(txtPay.text)+"&time="; // 请求的 URL
			pass_http.request();
		}
	});
});
//取消
var btncanel = ui("do_Button_canel");
btncanel.on("touch","",300,function(){
	btncanel.animate(buttonA,function(){
		bgmask.visible = false;
		page.hideKeyboard();
		txtPay.text = "";
		page.fire("canelPayPass");
	});
});

//支付密码
var pass_http = mm("do_Http");
pass_http.method = "POST";// GET | POST
pass_http.timeout = 60000; // 超时时间 : 单位 毫秒
pass_http.contentType = "application/json"; // Content-Type
pass_http.on("success", function(databus) {
	if(databus.error_code==-1){
		bgmask.visible = true;
		txtPay.setFocus(true);
		nf.alert("支付密码输入不正确","提示");
	}else{
		global.setMemory("paypass", [txtPay.text,databus.reason]);
		page.fire("ReturnPayPass",cellIndex);
		bgmask.visible = false;
		page.hideKeyboard();
		//txtPay.text = "";
	}
});

page.on("SendPayPass",function(n){
	cellIndex = n;
	var token = global.getMemory("paypass");
	if(token!=""){
		pass_http.url = $U.token($U.url.paypass,"user")+"&pass="+Euc(token[0])+"&time="+Euc(token[1]); // 请求的 URL
		pass_http.request();
	}else{
		bgmask.visible = true;
		txtPay.setFocus(true);
	}
}).on("loaded",function(){
	query_http.url = $U.token($U.url.appQueryPayPass,"user") // 请求的 URL
	query_http.request();
});

var forget = ui("do_Button_17");
forget.on("touch","",300,function(){
	open.start("source://view/percenter/payback/phoneverify.ui");
});

//查看是否设置支付密码
var query_http = mm("do_Http");
query_http.method = "POST";// GET | POST
query_http.timeout = 60000; // 超时时间 : 单位 毫秒
query_http.contentType = "application/json"; // Content-Type
query_http.on("success", function(databus) {
	if(databus==-1){  //未设置支付密码
		nf.alert("您未设置支付密码,请先设置支付密码","提示",function(){
			open.start("source://view/percenter/perdata/payPassword.ui");
		});
	}
});