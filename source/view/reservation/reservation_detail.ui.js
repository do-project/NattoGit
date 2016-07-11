var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var external = sm("do_External");
var open = require("open");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var $U = require("url");
var global = deviceone.sm("do_Global");
var user = global.getMemory("access_token");
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
	addition_http.url = $U.token($U.url.collectExist,"identity")+"&token="+Euc(token); // 请求的 URL
	addition_http.request();
	storeLoad();
}).on("result",function(){
	user = global.getMemory("access_token");
	addition_http.url = $U.token($U.url.collectExist,"identity")+"&token="+Euc(token); // 请求的 URL
	addition_http.request();
});
var collect_ui = ui("do_ALayout_72");  //收藏版面
var collect = ui("do_ImageView_64");
//是否收藏
var addition_http = mm("do_Http");
addition_http.method = "POST";// GET | POST
addition_http.timeout = 60000; // 超时时间 : 单位 毫秒
addition_http.contentType = "application/json"; // Content-Type
addition_http.on("success", function(databus) {
	if(databus.collect){
		collect.source = "source://image/fav_yes.png";
	}else{
		collect.source = "source://image/fav_no.png";
	}
	
}).on("fail", function(data) {
    nf.toast("网络异常");
});

var bsnametitle = ui("do_Label_busname"); //店铺名称标题
//标题动画
var animScrollBT = mm("do_Animation");
animScrollBT.fillAfter = true;
animScrollBT.transfer({
	delay : 100,
	duration : 600,
	curve : "EaseInOut",
	fromX : 0,
	toX : 400
});



collect_ui.on("touch","",300,function(){
	collect_ui.animate(buttonAS,function(){
		if(!$U.tokenExist()){
			nf.toast("请先登录");
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "white"
		    });
		}else{
		    collect_http.url = $U.token($U.url.collection,"userid")+"&_store="+Euc(token); // 请求的 URL
			collect_http.request();
		}
	});
});

//接收
var collect_http = mm("do_Http");
collect_http.method = "POST";// GET | POST
collect_http.timeout = 60000; // 超时时间 : 单位 毫秒
collect_http.contentType = "application/json"; // Content-Type
collect_http.on("success", function(databus) {
	if(databus.error_code!=-1){
		if(databus.token==1){
			collect.source = "source://image/fav_yes.png";
			nf.toast("收藏成功");
		}else{
			collect.source = "source://image/fav_no.png";
			nf.toast("取消收藏");
		}
	}else{
		nf.toast("网络异常");
	}
}).on("fail", function(data) {
    nf.toast("网络异常");
});

//评价
var evals = ui("do_ALayout_eval");

//地图
var busmap = ui("do_ALayout_map");

var imgviewbg = ui("do_ImageView_4");
var scrollbody = ui("do_ScrollView_busdetail");
scrollbody.on("scroll",function(datas){
		imgviewbg.height = 500 -+ datas;
		if(imgviewbg.height <= 0){
			imgviewbg.height = 0;
		}
		imgviewbg.redraw();
		
});

function storeLoad(){
	request_http.url = $U.url.ReservationInfo+"?token="+Euc(token);
    request_http.request();
}

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	var img = ui("do_ImageView_4");
	img.source = databus.path;
	//接收预定时间
	var _time = ui("do_Label_70");
	_time.text = "预订时间: "+databus.businessHours;
	//人均
	var renjun = ui("do_Label_71");
	renjun.text = "人均: "+databus.per_capita;
	//名称
	bsnametitle.text = databus.title;
	//分值
	var _scoreimg = ui("do_ImageView_52");
	_scoreimg.source = "source://image/star"+parseInt(databus.score)+".png";
	var _score = ui("do_Label_82");
	_score.text = parseFloat(databus.score).toFixed(1);
	//评论人数
	var renshu = ui("do_Label_83");
	renshu.text = databus.number+"条评论";
	//折扣
	var zkts = ui("do_Label_94");
	var zk = ui("do_Label_95");
	if(databus.showDiscount){
		zkts.text = databus.discountPrompt==null? "暂无":databus.discountPrompt;
		zk.text = databus.discount+"折";
	}else{
		zkts.text = "暂无";
		zk.text = "";
	}
	//地址
	var _address = ui("do_Label_84");
	_address.text = databus.address;
	//电话
	var _phone = ui("do_Label_86");
	_phone.text = "商家客服:"+databus.phone;
	//简介
	var jianjie = ui("do_Label_88");
	if(databus.introduce==null || databus.introduce==""){
		jianjie.text = "暂无";
	}else{
		jianjie.text = databus.introduce;
	}
	
	
	//支持图标列表
	var supportData = mm("do_ListData");
	var supportgrid = ui("do_GridView_support");
	supportgrid.bindItems(supportData);
	supportData.addData(databus.lvm);
	supportgrid.refreshItems();
	if(databus.lvm==""){
		var lvmPanel = ui("do_ALayout_67");
		lvmPanel.height=0;
		lvmPanel.redraw();
	}
	
	//动画
	bsnametitle.animate(animScrollBT);
	
	var phonecall=ui("do_ALayout_phonecall");
	phonecall.on("touch","",300,function(datacall,e){
		phonecall.animate(buttonA,function(){
			nf.confirm({text:databus.phone,title:"商家客服",button1text:"拨打",button2text:"取消"},function(datacall,e){
				if(datacall == 1){
					external.openDial(databus.phone);
				}
			});
		});
	});
	
	evals.on("touch","",300,function(){
		evals.animate(buttonA,function(){
			open.start("source://view/other/evaluate.ui",[databus.token,databus.title,parseFloat(databus.score).toFixed(1),databus.number]);
		});
	});
	
	busmap.on("touch","",300,function(){
		busmap.animate(buttonA,function(){
			open.start("source://view/other/maplocation.ui",[databus.lat,databus.lng,databus.title,databus.address]);
		});
	});
});