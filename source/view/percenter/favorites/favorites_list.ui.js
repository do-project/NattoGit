var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var open = require("open");
var $U = require("url");
var rootview = ui("$");
var global = sm("do_Global");
var city_node = global.getMemory("city");
var pbar = ui(rootview.add("loadings","source://view/cells/loading2.ui",0,567));
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
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
	collLoad();
}).on("cancelRefresh",function(){
	param.isMore = false;
	param.isLoading = true;
	collLoad();
});
var param={size:15,index:1,isMore:false,isLoading:true};

var favlist = ui("do_SlideListView_1");
var datafav = mm("do_ListData");
favlist.bindItems(datafav);
//加载收藏
function collLoad(){
	//发送http(外卖列表)
	if(param.isMore) param.index++;
	else param.index=1;
	if(param.isLoading) {
		pbar.visible = true;
		datafav.removeAll();
		favlist.refreshItems();
	}
	collect_http.url = $U.token($U.url.collectStore,"user")+"&city="+city_node+"&size="+param.size+"&index="+param.index;
	collect_http.request();
}
var tipLabel = ui(tipFace + ".do_Label_1");
var collect_http = mm("do_Http");
collect_http.method = "POST";// GET | POST
collect_http.timeout = 60000; // 超时时间 : 单位 毫秒
collect_http.contentType = "application/json"; // Content-Type
collect_http.on("success", function(databus) {
	if(param.index==1){
		datafav.removeAll();
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
	datafav.addData(databus);
	for(var i=0;i<databus.length;i++){
		datafav.updateOne(i+(param.size*(param.index-1)),{
			"template":0,
			"path":databus[i].path,
			"title":databus[i].title,
			"token":databus[i].token,
			"zhichi":databus[i].cvm_str,
			"score":"source://image/star"+parseInt(databus[i].score)+".png",
			"rightTemplate":1
		});
	}
	favlist.refreshItems();
	favlist.rebound();
}).on("fail", function(data) {
	pbar.visible = false;
	tipLabel.text = "获取列表失败，请从新刷新试试!";
	tipFace_ui.visible = true;
});

favlist.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	param.isMore = true;
	param.isLoading = false;
	collLoad();
}).on("pull",function(data){
	page.fire("pullevent", data);
	if (data.state != 2) return;
	param.isMore = false;
	param.isLoading = false;
	collLoad();
});

favlist.on("touch",function(index){
	var token = datafav.getOne(index);
	open.start("source://view/menuorder/menuorder_detail.ui",token.token);
});