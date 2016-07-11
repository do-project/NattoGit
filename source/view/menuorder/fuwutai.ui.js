var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var global = sm("do_Global");
var algorithm = sm("do_Algorithm");
var mTimer = mm("do_Timer");
var socket = mm("do_Socket");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var $U = require("url");

var param = page.getData();
var time=10;
var timing=time;

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	timing = getTimer();
	if(timing>0){
		mTimer.start();  //开始倒计时
	}
});

function getTimer(){
	var _time = 0;
	var _time=global.getMemory("bindNoticeTime");
	if(_time!=""){
		var time1 = new Date(_time);
		var time2 = new Date();
		var ms=time2.getTime()-time1.getTime();
		var second=parseInt(ms/1000);
		if(second<60){
			_time=time-second;
		}
	}
	return _time;
}

var PushFood = ui("do_Button_3");      //催菜
var Waiter = ui("do_Button_2");        //服务员
var Chair = ui("do_Button_4");         //加椅子
var Water = ui("do_Button_5");         //加水
var Napkin = ui("do_Button_6");        //加餐巾纸
var Tableware = ui("do_Button_7");     //加餐具
var BottleOpener = ui("do_Button_8");  //需要开瓶器

PushFood.on("touch","",300,function(){
	this.animate(buttonAS);
	SendSocket(1);   //催菜
});
Waiter.on("touch","",300,function(){
	this.animate(buttonAS);
	SendSocket(2);   //呼叫服务员
});
Chair.on("touch","",300,function(){
	this.animate(buttonAS);
	SendSocket(3);   //加椅子
});
Water.on("touch","",300,function(){
	this.animate(buttonAS);
	SendSocket(4);   //加水
});
Napkin.on("touch","",300,function(){
	this.animate(buttonAS);
	SendSocket(5);   //加餐巾纸
});
Tableware.on("touch","",300,function(){
	this.animate(buttonAS);
	SendSocket(6);   //加餐具
});
BottleOpener.on("touch","",300,function(){
	this.animate(buttonAS);
	SendSocket(7);   //需要开瓶器
});

function SendSocket(index){
	var _timer = getTimer();
	if(_timer>0){
		nf.toast("请不要频繁呼叫服务台，"+_timer+"秒后再试");
	}else{
		var sameStr = {type:9,sameId:param.sameId,user:$U.userToken(),species:index};
		socket.connect(param.ip,param.port.toString(), function(data, e) {
			if(data){
				socket.send("UTF-8",JSON.stringify(sameStr) , function(data1, e) {
					if(data1){
						nf.toast("已通知吧台");
						global.setMemory("bindNoticeTime", new Date());  //记录当前时间
						timing=time;
						mTimer.start();  //开始倒计时
					}else{
						nf.toast("通知吧台失败");
					}
				});
			}else{
				nf.toast("发送失败，请重新点击发送");
			}
		});
	}
	
}

mTimer.on("tick", function(data, e) {
	if(timing>0){
		timing--;
	}else{
		global.setMemory("bindNewTime", "");
		mTimer.stop();
	}
});