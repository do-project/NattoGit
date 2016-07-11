var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var $U = require("url");
var updateSex=page.getData();
var leftclose = ui("do_ALayout_close");

var sexys = [ui("do_ALayout_sexy1"),ui("do_ALayout_sexy2"),ui("do_ALayout_sexy3")];
var sexyimgs = [ui("do_ImageView_sexy1"),ui("do_ImageView_sexy2"),ui("do_ImageView_sexy3")];

leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(data){
	for(i = 0 ;i<sexys.length;i++){
		sexyimgs[i].visible = sexys[i].tag==updateSex;
	}
});

//性别选择

var sexytouch = function(index){
	for(i = 0 ;i<sexys.length;i++){
		sexyimgs[i].visible = i==index;
		if(i==index){
			updateSex = sexys[i].tag;
		}
	}
};
sexys.forEach(function(dc,i){
	dc.on("touch", function(datac, e) {
		sexytouch(i);
	});
});

var save=ui("do_Button_1");
save.on("touch","",300,function(){
	save.animate(buttonA,function(){
		var sex = updateSex=="null"? null:updateSex;
		request_http.url = $U.token($U.url.appUpdateSex,"user")+"&sex="+sex;
		request_http.request();
	});
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.error_code==0){
		app.closePage();
	}else{
		nf.toast("更新失败");
	}
});

