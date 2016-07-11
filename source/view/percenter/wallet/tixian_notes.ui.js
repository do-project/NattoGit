var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var $U = require("url");
var nf = sm("do_Notification");
var rootview = ui("$");
var pbar = ui(rootview.add("loadings","source://view/cells/loading2.ui",0,567));
var listbg = ui("listviewbody");
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,300);
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
	withdrawalLoad();
});

function withdrawalLoad(){
	request_http.url = $U.token($U.url.appUserWithdrawalList,"user");
    request_http.request();
}

var listdata1 = mm("do_ListData");
var girdviewHomebar= ui("do_ListView_1");
girdviewHomebar.bindItems(listdata1);


var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type

request_http.on("success", function(databus) {
	pbar.visible = false;
	listdata1.removeAll();
	listdata1.addData(databus);
	var tipLabel = ui(tipFace + ".do_Label_1");
	if(databus.length==0){
		tipFace_ui.visible = true;
		tipLabel.text = "没有找到相关信息!";
	}
	for(var i=0;i<databus.length;i++){
		listdata1.updateOne(i, {
			"genTime":"提交时间: "+databus[i].gen_time,
			"account":"提现账户: "+databus[i].account,
			"price":databus[i].amount,
			"state":databus[i].state
		})
	}
	girdviewHomebar.refreshItems();
	girdviewHomebar.rebound();
}).on("fail", function(data) {
	pbar.visible = false;
	var tipLabel = ui(tipFace + ".do_Label_1");
	tipLabel.text = "服务器超时!";
	tipFace_ui.visible = true;
});;

girdviewHomebar.on("pull",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	withdrawalLoad();
})