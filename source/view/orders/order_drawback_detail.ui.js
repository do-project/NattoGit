var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var Euc = encodeURIComponent;
var token=page.getData();

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.token($U.url.appRefundInfo,"user")+"&token="+Euc(token); // 请求的 URL
	request_http.request();
});
//取消退款
var cancel=ui("do_Button_1");

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus!=-1){
		var state=ui("do_Label_3");
		state.text="状态:"+databus.stateStr;
		
		var price=ui("do_Label_18");
		price.text="金额:￥"+databus.price;
		
		var why=ui("do_Label_5");
		why.text=databus.way;
		
		var genTime=ui("do_Label_19");
		genTime.text="申请时间: "+databus.genTime;
		
		var store=ui("do_Label_7");
		store.text=databus.title;
		
		var address=ui("do_Label_8");
		address.text=databus.address;
		
		var orderno=ui("do_Label_10");
		orderno.text="订单编号："+databus.orderno;
		
		var payTime=ui("do_ALayout_7");
		if(databus.payTime!=null){
			payTime.text="付款时间："+databus.payTime;
		}
		var panel=ui("do_ALayout_7");
		if(databus.state==0 || databus.state==-1){
			panel.visible=true;
		}
		var _panel = ui("do_ALayout_7");
		if(databus.state<=0){
			cancel.visible=true;
			_panel.visible=true;
		}
	}else{
		nf.toast("网络无响应");
	}
});

cancel.on("touch",function(){
	nf.confirm("确定要取消退款？", "取消退款", "确认", "取消", function(data, e) {
		if(data==1){
			cancel_http.url = $U.token($U.url.appCancelRefund,"user")+"&token="+Euc(token); // 请求的 URL
			cancel_http.request();
		}
	});
});

var cancel_http = mm("do_Http");
cancel_http.method = "POST";// GET | POST
cancel_http.timeout = 60000; // 超时时间 : 单位 毫秒
cancel_http.contentType = "application/json"; // Content-Type
cancel_http.on("success", function(databus) {
	if(databus.error_code==0){
		nf.toast("取消退款成功");
		app.closePage(true);
	}else{
		nf.toast("服务器无响应");
	}
});