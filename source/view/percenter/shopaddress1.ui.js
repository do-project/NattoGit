var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var global = deviceone.sm("do_Global");
var city_node = global.getMemory("city");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var Euc = encodeURIComponent;
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loadingbg.ui", 0, 148));

var param = page.getData();

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	shipLoad();
}).on("result",function(){
	shipLoad();
}).on("deleteShip",function(index){
	shipLoad();
}).on("defaultShip",function(index){
	shipLoad();
});
function shipLoad(){
	request_http.url = $U.token($U.url.appUserShipAddress,"user"); // 请求的 URL
	request_http.request();
}

var addressgird = ui("do_SlideListView_1");
var dataadds = mm("do_ListData");
addressgird.bindItems(dataadds);

addressgird.on("touch",function(index){
	if(param!=""){
		var cell = dataadds.getOne(index);
		app.closePage([4,{name:cell.name,phone:cell.phone,address:cell.address,token:cell.token}]);
	}
});

var addresadd = ui("address_add");
addresadd.on("touch","",300,function(){
	addresadd.animate(buttonA,function(){
		open.start("source://view/percenter/addressEdit1.ui");
	});
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible = false;
	dataadds.removeAll();
	dataadds.addData(databus);
	for(var i=0;i<databus.length;i++){
		var def = databus[i].shipDefault;
		if(param!=""){
			if(param==databus[i].token){
				def=true;
			}else{
				def=false;
			}
		}
		dataadds.updateOne(i,{
			"name":databus[i].name,
			"phone":databus[i].phone,
			"address":databus[i].address,
			"zip":databus[i].zip==null? "":databus[i].zip,
			"token":databus[i].token,
			"imgVisible":databus[i].shipDefault,
			"rightTemplate":1,
			"width":databus[i].shipDefault? 320:480,
			"shipDefault":def,
			"operate":{token:databus[i].token,index:i}
		});
	}
	addressgird.refreshItems();
});