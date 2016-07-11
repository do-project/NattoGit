var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var global = sm("do_Global");
var ser_id = page.getData();
var city_node = global.getMemory("city");
var $U = require("url");
var Euc = encodeURIComponent;
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	leftclose.animate(buttonA,function(){
		app.closePage();
	});
});

page.on("back", function(){
	app.closePage();
});

//顶部显示动画
var animHDdown = mm("do_Animator");
var propshd = {y:0};
animHDdown.append(300,propshd,"EaseOut");
var hdbgs = ui("do_ALayout_1");
page.on("loaded",function(){
	hdbgs.animate(animHDdown);
});
var searchText = ui("do_TextField_1");

//搜索的内容
var listdatabus = mm("do_ListData");
var listviewbus = ui("do_ListView_1");

listviewbus.bindItems(listdatabus);

searchText.on("textChanged",function(){
	if(this.text==""){
		listdatabus.removeAll();
		listviewbus.refreshItems();
	}else{
		var url = $U.url.storeList+"?ser_id="+ser_id+"&city="+city_node+"&title="+Euc(this.text); // 请求的 URL
		request_http.url = url;
	    request_http.request();
	}
});


var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type

request_http.on("success", function(databus) {
	listdatabus.removeAll();
	listdatabus.addData(databus);
	for(var i=0;i<databus.length;i++){
		listdatabus.updateOne(i, {
			"title":databus[i].title,
			"token":databus[i].token,
			"show":true
		});
	}
	if(databus.length==0){
		listdatabus.addOne({token:"",title:"没有找到您要搜索的内容",show:false}, 0);
	}
	listviewbus.refreshItems();
});

listviewbus.on("touch",function(index){
	page.hideKeyboard();
	var list = listdatabus.getOne(index);
	if(list.token!=""){
		switch(parseInt(ser_id)){
			case 1:  //预定
				open.start("source://view/reservation/reservation_start.ui",list.token);
				break;
			case 2:  //外卖
				open.start("source://view/outbound/outbound_start.ui",list.token);
				break;
			case 6:  //点单
				open.start("source://view/menuorder/menuorder_detail.ui",list.token);
				break;
		};
	}
});