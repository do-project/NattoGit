var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var param = {size:15,index:1,isMore:false};

var listbg = ui("listviewbody");
var loadbg = ui(listbg.add("loadings","source://view/cells/loadingbg.ui",0,0));
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,350);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;

var deleteImg=ui("do_ALayout_4");

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage({msgNum:datamess.getCount()});
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage({msgNum:datamess.getCount()});
}).on("loaded",function(){
	messageLoad();
});



var messgird = ui("do_ListView_message");
var datamess = mm("do_ListData");
messgird.bindItems(datamess);

function messageLoad(){
	if(param.isMore) param.index++;
	else param.index=1;
	request_http.url = $U.token($U.url.appMessageList,"user")+"&size="+param.size+"&index="+param.index; // 请求的 URL
	request_http.request();
}

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible = false;
	if(param.index==1){
		datamess.removeAll();
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "没有收到消息哦";
		if(databus.length==0){
			tipFace_ui.visible = true;
			deleteImg.visible = false;
		}else{
			deleteImg.visible=true;
			tipFace_ui.visible = false;
		}
	}else if(databus.length==0){
		nf.toast("没有更多信息了");
		param.index--;
	}
	datamess.addData(databus);
	for(var i=0;i<databus.length;i++){
		datamess.updateOne(i+(param.size*(param.index-1)), {
			"token":databus[i].token,
			"title":databus[i].title,
			"content":databus[i].content,
			"gentime":databus[i].genTime
		});
	}
	messgird.refreshItems();
	messgird.rebound();
}).on("fail", function(data) {
	loadbg.visible = false;
	var tipLabel = ui(tipFace + ".do_Label_1");
	tipLabel.text = "网络连接异常!";
	tipFace_ui.visible = true;
});

messgird.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	param.isMore = true;
	messageLoad();
});


deleteImg.on("touch","",300,function(){
	deleteImg.animate(buttonA,function(){
		nf.confirm("确认删除所有消息？", "删除消息", "确认", "取消", function(data, e) {
			if(data==1){
				delete_http.url = $U.token($U.url.appMessageDelete,"user"); // 请求的 URL
				delete_http.request();
				
			}
		});
	});
});

var delete_http = mm("do_Http");
delete_http.method = "POST";// GET | POST
delete_http.timeout = 60000; // 超时时间 : 单位 毫秒
delete_http.contentType = "application/json"; // Content-Type
delete_http.on("success", function(databus) {
	if(databus.error_code==0){
		datamess.removeAll();
		messgird.refreshItems();
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "没有收到消息哦!";
		tipFace_ui.visible = true;
		deleteImg.visible = false;
	}else{
		nf.toast("清空消息失败，请检查网络是否连接");
	}
});