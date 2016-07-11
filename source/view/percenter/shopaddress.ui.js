var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var global = sm("do_Global");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
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
}).on("result",function(data){
	if(data==1){
		shipLoad();
	}
});
function shipLoad(){
	request_http.url = $U.token($U.url.appShipAddress,"user")+"&city="+Euc(city_node)+"&store="+Euc(param.token); // 请求的 URL
	request_http.request();
}

var addressgird = ui("do_GridView_address");
var dataadds = mm("do_ListData");
addressgird.bindItems(dataadds);


addressgird.on("touch",function(index){
	var cell = dataadds.getOne(index);
	app.closePage([4,{name:cell.name,phone:cell.phone,address:cell.address},cell.token]);
});

var addresadd = ui("address_add");
addresadd.on("touch","",300,function(){
	addresadd.animate(buttonA,function(){
		open.start("source://view/percenter/addressEdit.ui",param.token);
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
		dataadds.updateOne(i,{
			"name":databus[i].name,
			"phone":databus[i].phone,
			"address":databus[i].address,
			"zip":databus[i].zip==null? "":databus[i].zip,
			"token":databus[i].token,
			"imgVisible":param.address==databus[i].token? true:false
		});
	}
	addressgird.refreshItems();
});