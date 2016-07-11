var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loading.ui", 0, 580));
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
	goodLoad();
}).on("result",function(data){
	if(data.url!=undefined && data.url!=""){
		if(data.param!=undefined && data.param!=""){
			open.start(data.url,data.param);
		}else{
			open.start(data.url);
		}
	}
});

function goodLoad(){
	request_http.url = $U.url.appGoodInfo+"?token="+Euc(token); // 请求的 URL;
    request_http.request();
}

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible=false;
	var img=ui("do_ImageView_bg");
	img.source=databus.path;
	
	var integral=ui("do_Label_3");
	integral.text=databus.integral+"积分";
	
	var price=ui("do_Label_4");
	price.text="市场价: "+databus.price+"元";
	
	var title=ui("do_Label_5");
	title.text=databus.title;
	
	var notice=ui("do_MarqueeLabel_2");
	notice.text=databus.notice;
});

var imgviewbg = ui("do_ImageView_bg");
var scrollbody = ui("do_ScrollView_body");
scrollbody.on("scroll",function(datas){
		imgviewbg.height = 900 -+ datas;
		imgviewbg.redraw();
});

var subbtn = ui("do_Button_sub");
subbtn.on("touch","",300,function(){
	if(!$U.tokenExist()){
		app.openPage({
	    	source : "source://view/loginreg/login.ui",
	    	animationType: "slide_b2t",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "white",
	    	data:{url:"source://view/pointsMall/pointMall_suborder.ui",param:token}
	    });
	}else{
		subbtn.animate(buttonA,function(){
			open.start("source://view/pointsMall/pointMall_suborder.ui",token);
		});
	}
})