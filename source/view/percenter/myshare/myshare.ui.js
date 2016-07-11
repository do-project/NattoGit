var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var $U = require("url");
var imageBrowser = sm("do_ImageBrowser");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var Euc = encodeURIComponent;

var pbar = ui(rootview.add("loadings","source://view/cells/loading2.ui",0,567));
var listbg = ui("listviewbody");
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,350);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;


var param = {isMore:false,isLoading:true,size:15,index:1,praise:-1};
var unpraisea = "source://image/fav_no.png";
var praisea = "source://image/fav_yes.png";

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	beanLoad();
}).on("Praisea",function(data){
	param.praise = data;
	PraiseaSubmit(data);
}).on("ImageBrowser",function(data){
	imageBrowser.show(data.array, data.index);
}).on("DeleteBean",function(data){
	nf.confirm("确定要删除此条豆圈？", "删除豆圈", "确认", "取消", function(num, e) {
		deviceone.print(num);
		if(num==1){
			var cell = datamess.getOne(data);
			delete_http.url = $U.token($U.url.appDeleteBean,"user")+"&token="+Euc(cell.token);
			delete_http.request();
		}
	});
});


//赞一下
function PraiseaSubmit(index){
	var cell = datamess.getOne(index);
	praise_http.url = $U.token($U.url.appBeanPraise,"user")+"&token="+Euc(cell.token);
	praise_http.request();
}

//加载豆圈
function beanLoad(){
	if(param.isMore) param.index++;
	else param.index=1;
	if(param.isLoading) {
		tipFace_ui.visible = false;
		pbar.visible = true;
		datamess.removeAll();
		messgird.refreshItems();
	}
	else pbar.visible = false;
	request_http.url = $U.token($U.url.appMyBeanList,"user")+"&size="+param.size+"&index="+param.index;
    request_http.request();
}


var messgird = ui("do_ListView_message");
var datamess = mm("do_ListData");
messgird.bindItems(datamess);


var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(param.index==1){
		datamess.removeAll();
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "还没有豆圈分享哦!";
		if(databus.length==0){
			tipFace_ui.visible = true;
		}else{
			tipFace_ui.visible = false;
		}
	}else if(databus.length==0){
		nf.toast("没有更多分享了");
		param.index--;
	}
	pbar.visible = false;
	datamess.addData(databus);
	for(var i=0;i<databus.length;i++){
		var data = databus[i];
		var template = 0;
		if(data.bivm!=undefined && data.bivm.length>3){
			template = 2;
		}else if(data.bivm!=undefined && data.bivm.length>0){
			template = 1;
		}
		datamess.updateOne(i+(param.size*(param.index-1)), {
			"template":template,
			"token":data.token,
			"index":i+(param.size*(param.index-1)),
			"genTime":data.genTime,
			"msg":data.msg,
			"praise":data.praise,
			"praisea":data.praisea==true? praisea:unpraisea,
			"img1":data.bivm.length>0? data.bivm[0].thumbnail:"",
			"vimg1":data.bivm.length>0,
			"timg1":data.bivm.length>0? data.bivm[0].originalImage:"",
			"img2":data.bivm.length>1? data.bivm[1].thumbnail:"",
			"vimg2":data.bivm.length>1,
			"timg2":data.bivm.length>1? data.bivm[1].originalImage:"",
			"img3":data.bivm.length>2? data.bivm[2].thumbnail:"",
			"vimg3":data.bivm.length>2,
			"timg3":data.bivm.length>2? data.bivm[2].originalImage:"",
			"img4":data.bivm.length>3? data.bivm[3].thumbnail:"",
			"vimg4":data.bivm.length>3,
			"timg4":data.bivm.length>3? data.bivm[3].originalImage:"",
			"img5":data.bivm.length>4? data.bivm[4].thumbnail:"",
			"vimg5":data.bivm.length>4,
			"timg5":data.bivm.length>4? data.bivm[4].originalImage:"",
			"img6":data.bivm.length>5? data.bivm[5].thumbnail:"",
			"vimg6":data.bivm.length>5,
			"timg6":data.bivm.length>5? data.bivm[5].originalImage:""
		});
	}
	messgird.refreshItems();
	messgird.rebound();
}).on("fail", function(data) {
	pbar.visible = false;
	var tipLabel = ui(tipFace + ".do_Label_1");
	tipLabel.text = "服务器超时!";
	tipFace_ui.visible = true;
});

messgird.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	param.isMore = true;
	param.isLoading = false;
	beanLoad();
});

var praise_http = mm("do_Http");
praise_http.method = "POST";// GET | POST
praise_http.timeout = 60000; // 超时时间 : 单位 毫秒
praise_http.contentType = "application/json"; // Content-Type
praise_http.on("success", function(databus) {
	if(databus.error_code==0){
		if(param.praise!=-1){
			var cell = datamess.getOne(param.praise);
			cell.praise = cell.praise+1;
			cell.praisea = praisea;
			datamess.updateOne(param.praise, cell);
			messgird.refreshItems();
			param.praise = -1;
		}
	}else{
		nf.alert(databus.reason,"赞一下");
	}
});

var delete_http = mm("do_Http");
delete_http.method = "POST";// GET | POST
delete_http.timeout = 60000; // 超时时间 : 单位 毫秒
delete_http.contentType = "application/json"; // Content-Type
delete_http.on("success", function(databus) {
	if(databus.error_code==0){
		param.isMore = false;
		param.isLoading = true;
		beanLoad();
	}else{
		nf.alert("操作失败","豆圈");
	}
});