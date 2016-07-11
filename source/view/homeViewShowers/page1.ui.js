var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var global = sm("do_Global");
var nf = sm("do_Notification");
var open = require("open");
var $U = require("url");
var city_node = global.getMemory("city");

var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var hdlayout = ui("do_ALayout_1");
hdlayout.on("touch",function(){
	//防止穿透
});
//scroll
var scrollhome = ui("do_ScrollView_home");
var navbt = ui("do_ALayout_24");
scrollhome.on("scroll",function(data){
	navbt.y = 148 -+ (data/2);
	if(data<=0){
		navbt.y = 148;
	}
	if(navbt.y <= -52){
		navbt.y = -52;
	}
	navbt.redraw();
});

//最新商家
var listdata2 = mm("do_ListData");
var girdviewHomenav = ui("do_GridView_2");
girdviewHomenav.bindItems(listdata2);


page.on("loaded",function(){
	//最新商家
	latest_http.url = $U.url.LatestStore+"?size=8&city="+city_node;
	latest_http.request();
	//美食推荐
	plate_http.url = $U.url.appPlateList+"?size=4";
	plate_http.request();
});

var reloadbtn = ui("do_Button_1");
reloadbtn.on("touch", function(data) {
	//最新商家
	listdata2.removeAll();
	latest_http.url = $U.url.LatestStore+"?size=8&city="+city_node;
	latest_http.request();
	//美食推荐
	listdata3.removeAll();
	plate_http.url = $U.url.appPlateList+"?size=4";
	plate_http.request();
})

//点单界面
var pageMenuOrder = ui("menuorder_list");
pageMenuOrder.on("touch","",200,function(){
	pageMenuOrder.animate(buttonAS,function(){
		open.start("source://view/menuorder/menuorder_list.ui");
	});
});
//外卖界面
var pageoutbound = ui("outboundit");
pageoutbound.on("touch","",300,function(){
	pageoutbound.animate(buttonAS,function(){
		open.start("source://view/outbound/outbound_list.ui");
	});
});
//预订界面
var pagereservation = ui("reservation_list");
pagereservation.on("touch","",300,function(){
	pagereservation.animate(buttonAS,function(){
		open.start("source://view/reservation/reservation_list.ui");
	});
});
//支付码
var payment = ui("do_ALayout_payment");
payment.on("touch","",300,function(){
	payment.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/other/payment.ui"}
		    });
		}else{
			open.start("source://view/other/payment.ui");
		}
	});
});
//扫码
var scanBarcod = ui("do_ALayout_branceScan");
scanBarcod.on("touch","",300,function(){
	scanBarcod.animate(buttonA,function(){
		app.openPage({
	    	source : "source://view/other/scanbarcode.ui",
	    	animationType: "slide_b2t",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "white"
	    });
	});
});

var latest_http = mm("do_Http");
latest_http.method = "POST";// GET | POST
latest_http.timeout = 60000; // 超时时间 : 单位 毫秒
latest_http.contentType = "application/json"; // Content-Type
latest_http.on("success", function(databus) {
	listdata2.addData(databus);
	for(var i=0;i<databus.length;i++){
		var data = databus[i];
		listdata2.updateOne(i, {
			"token":data.token,
			"path":data.path,
			"title":data.title,
			"discount":data.discount==""? "":data.discount+"折",
			"cvm_str":data.cvm_str,
			"per_capita":"人均:"+data.per_capita
		});
	}
	var empt = listdata2.getCount();
	if(empt > 0){
		reloadbtn.visible = false;
	}else{
		reloadbtn.visible = true;
	}
	
	girdviewHomenav.refreshItems();
}).on("fail",function(){
	reloadbtn.visible = true;
});
girdviewHomenav.on("touch","",300,function(index){
	var cell = listdata2.getOne(index);
	open.start("source://view/menuorder/menuorder_detail.ui",cell.token,"menuorderstart");
});

//美食推荐
var gridviewHomegg = ui("do_GridView_3");
var listdata3 = mm("do_ListData");
gridviewHomegg.bindItems(listdata3);

var plate_http = mm("do_Http");
plate_http.method = "POST";// GET | POST
plate_http.timeout = 60000; // 超时时间 : 单位 毫秒
plate_http.contentType = "application/json"; // Content-Type
plate_http.on("success", function(databus) {
	listdata3.addData(databus);
	for(var i=0;i<databus.length;i++){
		var data = databus[i];
		listdata3.updateOne(i, {
			"token":data.token,
			"path":data.path,
			"title":data.title
		});
	}
	gridviewHomegg.refreshItems();
});
gridviewHomegg.on("touch",function(index){
	var cell = listdata3.getOne(index);
	open.start("source://view/liferound/try_detail.ui",cell.token);
});