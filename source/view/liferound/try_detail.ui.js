var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var external = sm("do_External");
var open = require("open");
var $U = require("url");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var pbar = ui(rootview.add("loadings","source://view/cells/loadingbg.ui",0,148));
var Euc = encodeURIComponent;
var token = page.getData();

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.url.appPlateDetail+"?token="+Euc(token);
	request_http.request();
});


var supportData = mm("do_ListData");
var supportgrid = ui("do_GridView_1");
supportgrid.bindItems(supportData);

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	pbar.visible = false;
	if(databus!=-1){
		var title = ui("do_Label_1");
		title.text = databus.title;
		var img = ui("do_ImageView_4");
		img.source = databus.path;
		var headline = ui("do_Label_3");
		headline.text = databus.headline;
		var msg = ui("do_Label_4");
		msg.text = databus.msg;
		
		if(databus.psvm!=undefined && databus.psvm.length>0){
			supportData.addData(databus.psvm);
			for(var i=0;i<databus.psvm.length;i++){
				var data = databus.psvm[i];
				supportData.updateOne(i, {
					"path":data.path,
					"storetitle":data.storeTitle,
					"title":data.title,
					"price":parseFloat(data.price),
					"detail":data.detail,
					"token":data.storeToken
				});
			}
			supportgrid.refreshItems();
		}
	}else{
		nf.toast("服务器超时");
		app.closePage();
	}
});