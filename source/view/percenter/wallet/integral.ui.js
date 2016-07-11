var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");

var pbar = ui(rootview.add("loadings","source://view/cells/loading2.ui",0,567));
var listbg = ui("listviewbody");
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,300);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;

var param={size:20,index:1};

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.token($U.url.appIntegralRecord,"user")+"&size="+param.size+"&index="+param.index;
    request_http.request();
});

//余额记录
var listdatab = mm("do_ListData");
var listviewb = ui("do_ListView_jl");
listviewb.bindItems(listdatab);

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type

request_http.on("success", function(databus) {
	if(param.index==1){
		listdatab.removeAll();
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "没有找到相关信息!";
		if(databus.length==0){
			tipFace_ui.visible = true;
		}else{
			tipFace_ui.visible = false;
		}
	} else if(databus.length==0){
		nf.toast("没有更多信息了");
		param.index--;
	}
	pbar.visible = false;
	listdatab.addData(databus);
	for(var i=0;i<databus.length;i++){
		listdatab.updateOne(i+(param.size*(param.index-1)), {
			"type":databus[i].typeStr,
			"time":databus[i].genTime,
			"price":databus[i].integral,
			"priceColor":databus[i].integral>0? "00FF00FF":"FF3900FF"
		});
	}
	listviewb.refreshItems();
	listviewb.rebound();
}).on("fail", function(data) {
	pbar.visible = false;
	var tipLabel = ui(tipFace + ".do_Label_1");
	tipLabel.text = "服务器超时!";
	tipFace_ui.visible = true;
});

listviewb.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	param.index++;
	request_http.url = $U.token($U.url.appBalanceRecord,"user")+"&size="+param.size+"&index="+param.index;
    request_http.request();
});