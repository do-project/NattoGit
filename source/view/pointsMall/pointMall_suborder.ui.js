var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var $U = require("url");
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loading.ui", 0, 580));
var Euc = encodeURIComponent;
var token = page.getData();

var shipPanelY=ui("do_ALayout_14");  //已选收货地址  140
var shipPanelN=ui("do_ALayout_13");  //未选收货地址 100
var accountPanel=ui("do_ALayout_26");  //充值账号 100
var shipName=ui("do_Label_18");  //收货人姓名
var shipMobile=ui("do_Label_19");  //收货人电话
var shipAddress=ui("do_Label_20");  //收货人地址

var param={notice:"",ship:"",uintegral:0,gintegral:0,type:0};

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	shipPanelY.height=0;
	shipPanelY.redraw();
	orderLoad();
}).on("result",function(d){
	if(d!=""){
		switch(parseInt(d[0])){
			case 2:
				bztxt.text = d[1];
				bztxt.fontColor = d[1]==""? "FF3300FF":"888888FF";
				param.notice=d[1];
				break;
			case 4:
				param.ship=d[1].token;
				shipName.text=d[1].name;
				shipMobile.text=d[1].phone;
				shipAddress.text=d[1].address;
				if(shipPanelY.height==0){
					shipPanelY.height=140;
					shipPanelY.redraw();
				}
				break;
		};
	}else{
		orderLoad();
	}
});

shipPanelN.on("touch","",300,function(){
	open.start("source://view/percenter/shopaddress1.ui",param.ship);
});
shipPanelY.on("touch","",300,function(){
	open.start("source://view/percenter/shopaddress1.ui",param.ship);
});

var bztxt= ui("do_Label_beizhu");
var _account=ui("do_TextField_account");

//确认订单
var surebtn = ui("do_Button_dopbtn");
surebtn.on("touch","",300,function(){
	if(param.uintegral<param.gintegral){
		nf.toast("您当前的积分不足兑换此商品");
	}else if(param.type==0 && param.ship==""){
		nf.toast("请选择收货地址");
	}else if(param.type==2 && _account.text.trim()==""){
		nf.toast("请填写充值账号");
		_account.setFocus(true);
	}else{
		nf.confirm({text:"是否确认兑换?",title:"提示",button1text:"确定",button2text:"取消"},function(datacall,e){
			if(datacall == 1){
				loadbg.visible=true;
				submit_http.url = $U.token($U.url.appGoodSubmitOrder,"user")+"&igid="+Euc(token)+"&account="+Euc(_account.text.trim())+"&ship="+Euc(param.ship)+"&notice="+Euc(_account.text); // 请求的 URL;
				submit_http.request();
			}
		});
	}
});
//备注
var beizhu = ui("beizhubox");
beizhu.on("touch","",300,function(){
	beizhu.animate(buttonA,function(){
		open.start("source://view/other/comments.ui");
	});
});


function orderLoad(){
	request_http.url = $U.token($U.url.appGoodOrder,"user")+"&token="+Euc(token); // 请求的 URL;
    request_http.request();
}

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible=false;
	
	var _title=ui("do_Label_56");
	_title.text=databus.title;
	var _uintegral=ui("do_Label_59");
	_uintegral.text=databus.uintegral;
	param.uintegral=databus.uintegral;
	var _gintegral=ui("do_Label_51");
	_gintegral.text=databus.gintegral;
	param.gintegral=databus.gintegral;
	
	param.type=databus.type;
	switch(databus.type){
		case 0:  //实物
			if(databus.shipToken!=null && databus.shipToken!=""){
				param.ship=databus.shipToken;
				shipName.text=databus.name;
				shipMobile.text=databus.phone;
				shipAddress.text=databus.address;
				shipPanelY.height=140;
				shipPanelY.redraw();
			}else{
				shipPanelN.height=100;
				shipPanelN.redraw();
			}
			break;
		case 2:
			accountPanel.height=100;
			accountPanel.redraw();
			break;
	};
});

var submit_http = mm("do_Http");
submit_http.method = "POST";// GET | POST
submit_http.timeout = 60000; // 超时时间 : 单位 毫秒
submit_http.contentType = "application/json"; // Content-Type
submit_http.on("success", function(databus) {
	loadbg.visible=false;
	if(databus.error_code==0){
		surebtn.animate(buttonA,function(){
			open.start("source://view/pointsMall/pointfinish.ui")
		});
	}else{
		nf.toast("订单提交失败");
	}
});

