var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");
var rootview = ui("$");
var nf = sm("do_Notification");
var storage = sm("do_Storage");
var global = sm("do_Global");
var $U = require("url");
var mTimer = mm("do_Timer");
mTimer.interval = 1000;
var login_file = "data://security/login";
var Euc = encodeURIComponent;

var _send = ui("do_Button_3");   //点击验证码
var _phone=ui("do_TextField_5");  //手机号码
var _code=ui("do_TextField_6");   //验证码
var _password=ui("do_TextField_7");  //密码
var _qpassword=ui("do_TextField_8"); //确认密码

var register=ui("do_Button_2");  //注册按钮

var _mobileSelect="";
var time=60;
var timing=60;

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
	page.hideKeyboard();
});

page.on("back", function(){
	app.closePage();
	page.hideKeyboard();
}).on("loaded",function(){
	var _time=global.getMemory("bindNewTime");
	if(_time!=""){
		var time1 = new Date(_time);
		var time2 = new Date();
		var ms=time2.getTime()-time1.getTime();
		var second=parseInt(ms/1000);
		if(second<60){
			_send.enabled=false;
			timing=time-second;
			_send.text=timing+"秒后重新发送";
			mTimer.start();  //开始倒计时
		}
	}
});
//隐藏键盘--
rootview.on("touch",function(){
	page.hideKeyboard();
});
//验证码
_send.on("touch","",300,function(){
	if($U.regular.phone.test(_phone.text)){
		_mobileSelect=_phone.text;
		send_http.url = $U.url.appRegisterPhone+"?type=1&Template=1541&mobile="+_phone.text;
		send_http.request();
	}else{
		nf.toast("请输入正确的手机号码");
		_phone.setFocus(true);
	}
});

var send_http = mm("do_Http");
send_http.method = "POST";// GET | POST
send_http.timeout = 60000; // 超时时间 : 单位 毫秒
send_http.contentType = "application/json"; // Content-Type
send_http.on("success", function(databus) {
	if(databus.error_code==0){
		nf.toast("发送成功");
		global.setMemory("bindNewTime", new Date());  //记录当前时间
		_send.enabled=false;
		timing=time;
		_send.text=timing+"秒后重新发送";
		mTimer.start();  //开始倒计时
	}else{
		nf.toast(databus.reason);
	}
});

mTimer.on("tick", function(data, e) {
	if(timing>0){
		timing--;
		_send.text=timing+"秒后重新发送";
	}else{
		_send.text="获取验证码";
		global.setMemory("bindNewTime", "");
		mTimer.stop();
	}
});

register.on("touch","",300,function(){
	if(!$U.regular.phone.test(_phone.text)){
		nf.toast("手机号码输入不正确");
		_phone.setFocus(true);
	}else if(_code.text.trim()==""){
		nf.toast("请输入验证码");
		_code.setFocus(true);
	}else if(_password.text.length<8){
		nf.toast("密码必须大于等于8位字符");
		_password.setFocus(true);
	}else if(_qpassword.text.trim()==""){
		nf.toast("请输入确认密码");
		_qpassword.setFocus(true);
	}else if(_password.text!=_qpassword.text){
		nf.toast("两次密码输入不一致");
		_qpassword.setFocus(true);
	}else{
		request_http.url = $U.url.appRegister+"?phone="+Euc(_phone.text)+"&code="+Euc(_code.text)+"&password="+Euc(_password.text);
		request_http.request();
	}
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.error_code==0){
		nf.toast("注册成功");
		var login_body = {
				access_login:_phone.text,
		        access_token : databus.token,
		        access_img:databus.path
		    };
		storage.writeFile(login_file, login_body);
		global.setMemory("access_token", databus.token);
		app.closePageToID("","","pageIndex");
	}else{
		nf.toast(databus.reason);
	}
});