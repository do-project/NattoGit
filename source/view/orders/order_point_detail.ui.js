var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var Euc = encodeURIComponent;
var loadbg = ui(rootview.add("loadings","source://view/cells/loadingbg.ui",0,148));

var token=page.getData();

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.token($U.url.appGoodOrderInfo,"user")+"&token="+Euc(token); // 请求的 URL
	request_http.request();
});

var shipPanel=ui("do_ALayout_9");  //收货地址面板 120
var logisticsPanel=ui("do_ALayout_11");     //物流信息面板 100
var accountPanel=ui("do_ALayout_12");   //充值账号面板 100
var cardPanel=ui("do_ALayout_14");      //卡密信息面板 100
var whyPanel=ui("do_ALayout_15");       //不通过原因面板 100
var genTime = ui("do_Label_39");   //兑换时间

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible = false;
	var stateStr=ui("do_Label_3");  //状态
	stateStr.text="状态:"+databus.stateStr;
	var integral=ui("do_Label_18");  //积分
	integral.text=databus.integral+"积分";
	var title=ui("do_Label_5");  //名称
	title.text="商品名称:"+databus.title;
	var notice=ui("do_Label_19");
	notice.text="备注:"+(databus.notice==null? "":databus.notice);
	genTime.text = "兑换时间:"+databus.genTime;
	switch(databus.type){
		case 0:  //实物
			shipPanel.height=120;
			shipPanel.redraw();
			var _ship=ui("do_Label_21");
			_ship.text=databus.address;
			if(databus.state==9){
				logisticsPanel.height=100;
				logisticsPanel.redraw();
				var _name=ui("do_Label_25");
				_name.text=databus.courierName;
				var _no=ui("do_Label_26");
				_no.text=databus.courierNo;
			}
			break;
		case 1:  //卡号密码
			if(databus.state==9){
				cardPanel.height=100;
				cardPanel.redraw();
				var _cardNo=ui("do_Label_33");
				_cardNo.text="卡号 "+databus.cardNo;
				var _cardPass=ui("do_Label_34");
				_cardPass.text="密码 "+databus.cardPass;
			}
			break;
		case 2:   //需要账号
			accountPanel.height=100;
			accountPanel.redraw();
			var _account=ui("do_Label_28");
			_account.text=databus.account;
			break;
	};
	if(databus.state==-1){
		whyPanel.height=100;
		whyPanel.redraw();
		var _why=ui("do_Label_36");
		_why.text=databus.why
	}
});