var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loading.ui", 0, 580));
var listbg = ui("listviewbody");
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,350);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;
var $U = require("url");

var param = {size:0,index:1,isMore:false,isLoading:true};

var mallScroll = ui("do_ScrollView_1");
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	mallLoad();
});

var dataomd = mm("do_ListData");
var listomd = ui("do_GridView_spmall");

listomd.bindItems(dataomd);

listomd.on("touch",function(index){
	var cell = dataomd.getOne(index);
	open.start("source://view/pointsMall/pointMall_detail.ui",cell.token);
});

function mallLoad(){
	if(param.isMore) param.index++;
	else param.index=1;
	if(param.isLoading) {
		loadbg.visible = true;
		dataomd.removeAll();
		listomd.refreshItems();
	}
	else loadbg.visible = false;
	request_http.url = $U.url.appGoodList+"?size="+param.size+"&index="+param.index; // 请求的 URL;
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
	dataomd.addData(databus);
	for(var i=0;i<databus.length;i++){
		dataomd.updateOne(i+(param.size*(param.index-1)),{
			"path":databus[i].path,
			"title":databus[i].title,
			"integral":databus[i].integral+"积分",
			"token":databus[i].token
		});
	}
	listomd.refreshItems();
	mallScroll.rebound();
}).on("fail", function(data) {
	loadbg.visible = false;
	tipLabel.text = "获取列表失败，请从新刷新试试!";
	tipFace_ui.visible = true;
});

mallScroll.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	param.isMore = true;
	param.isLoading = false;
	mallLoad();
}).on("pull",function(data){
	page.fire("pullevent", data);
	if (data.state != 2) return;
	param.isMore = false;
	param.isLoading = false;
	mallLoad();
});