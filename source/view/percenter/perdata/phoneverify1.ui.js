var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var global = deviceone.sm("do_Global");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var mTimer = mm("do_Timer");
mTimer.interval = 1000;

var _mobileSelect="";

var _index=page.getData();  //获取手机号码
var time=60;
var timing=60;

var _phone=ui("do_TextField_1");
var _send=ui("do_Button_4");    //发送验证码
var _verify=ui("do_Button_3");  //验证
var _code=ui("do_TextField_2"); //验证码
var _mobile=ui("do_Label_1");
var leftclose = ui("do_ALayout_close");
page.supportPanClosePage();
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
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

rootview.on("touch",function(){
	page.hideKeyboard();
});

mTimer.on("tick", function(data, e) {
	if(timing>0){
		timing--;
		_send.text=timing+"秒后重新发送";
	}else{
		_send.text="发送验证码";
		global.setMemory("bindNewTime", "");
		mTimer.stop();
	}
});

_verify.on("touch","",300,function(){
	if(_mobileSelect!=_phone.text){
		nf.toast("请先获取手机验证码");
	}else if(_code.text.trim()==""){
		nf.toast("请输入验证码");
		_code.setFocus(true);
	}else{
		request_http.url = $U.token($U.url.appVerifyPhone,"user")+"&authCode="+_code.text.trim()+"&type=3&mobile="+_phone.text;
		request_http.request();
	}
});


_send.on("touch",function(){  //发送验证码
	if($U.regular.phone.test(_phone.text)){
		_mobileSelect=_phone.text;
		send_http.url = $U.token($U.url.appBindingPhone,"user")+"&type=3&Template=1541&mobile="+_phone.text;
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

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.error_code==0){
		nf.toast("绑定手机号码成功");
		app.closePage("","",_index);
	}else{
		nf.toast("验证码输入有误");
		_code.setFocus(true);
	}
});