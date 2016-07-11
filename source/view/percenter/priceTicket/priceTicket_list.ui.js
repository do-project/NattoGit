var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");

var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loadingbg.ui", 0, 148));
var listbg = ui("listviewbody");
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,350);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	tickedLoad();
});

//纳豆券列表
var listdatab = mm("do_ListData");
var listviewb = ui("do_ListView_ndq");

listviewb.bindItems(listdatab);

listviewb.on("touch",function(index){
	var cell = listdatab.getOne(index);
	open.start("source://view/percenter/priceTicket/pt_detail.ui",{dueTime:cell.dueTime,price:cell.price,ticket:cell.ticket});
})
function tickedLoad(){
	request_http.url = $U.token($U.url.appUserTick,"user");
    request_http.request();
}

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.length>0){
		listdatab.addData(databus);
		for(var i=0;i<databus.length;i++){
			listdatab.updateOne(i,{
				"title":databus[i].title,
				"dueTime":"有效期："+(databus[i].dueTime==""? "长期有效":databus[i].dueTime),
				"price":"￥"+databus[i].amount,
				"path":databus[i].path,
				"ticket":databus[i].ticket
			});
		}
		listviewb.refreshItems();
	}else{
		tipFace_ui.visible = true;
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "还没有抵价券";
	}
	loadbg.visible=false;
});