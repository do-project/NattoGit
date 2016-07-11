var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var param = {size:15,index:1,isMore:false,isLoading:true};
var listbg = ui("listviewbody");
var loadbg = ui(listbg.add("loadings","source://view/cells/loadingbg.ui",0,0));
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
	orderLoad();
	//loadbg.visible = false;
});

var dataomd = mm("do_ListData");
var listomd = ui("do_ListView_1");
listomd.bindItems(dataomd);
listomd.on("touch",function(index){
	var cell=dataomd.getOne(index);
	open.start("source://view/orders/order_point_detail.ui",cell.token);
});

function orderLoad(){
	if(param.isMore) param.index++;
	else param.index=1;
	if(param.isLoading) {
		tipFace_ui.visible = false;
		loadbg.visible = true;
		dataomd.removeAll();
		listomd.refreshItems();
	}
	else {
		loadbg.visible = false;
	}
	request_http.url = $U.token($U.url.appGoodOrderList,"user")+"&size="+param.size+"&index="+param.index; // 请求的 URL
	request_http.request();
}


var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible = false;
	if(param.index==1){
		dataomd.removeAll();
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "没有找到积分兑换记录!";
		if(databus.length==0){
			tipFace_ui.visible = true;
		}else{
			tipFace_ui.visible = false;
		}
	}else if(databus.length==0){
		nf.toast("没有更多信息了");
		param.index--;
	}
	dataomd.addData(databus);
	for(var i=0;i<databus.length;i++){
		dataomd.updateOne(i+(param.size*(param.index-1)), {
			"token":databus[i].token,
			"path":databus[i].path,
			"title":databus[i].title,
			"integral":databus[i].integral
		});
	}
	listomd.refreshItems();
	listomd.rebound();
}).on("fail", function(data) {
	loadbg.visible = false;
	var tipLabel = ui(tipFace + ".do_Label_1");
	tipLabel.text = "服务器超时!";
	tipFace_ui.visible = true;
});

listomd.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	param.isMore = true;
	param.isLoading = false;
	orderLoad();
}).on("pull",function(data){
	page.fire("pullevent", data);
	if (data.state != 2) return;
	param.isMore = false;
	param.isLoading = false;
	orderLoad();
});