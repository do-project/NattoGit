var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var rootview = ui("$");
var external = sm("do_External");
var open = require("open");
var network = sm("do_Network");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var loadingyes2 = ui(rootview.add("yesloading2","source://view/cells/loadingyes2.ui",0,0));
loadingyes2.visible = false;
var inputpople = ui(rootview.add("popleinput","source://view/menuorder/inputPople.ui",0,0));
inputpople.visible = false;
var token = page.getData();
var leftclose = ui("do_ALayout_close");
var $U = require("url");
var global = deviceone.sm("do_Global");
var user = global.getMemory("access_token");
page.supportPanClosePage();

leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
}).on("result",function(data){
	addition_http.url = $U.token($U.url.collectExist,"identity")+"&token="+Euc(token); // 请求的 URL
	addition_http.request();
	
	if(data.url!=undefined && data.url!=""){
		if(data.param!=undefined && data.param!=""){
			open.start(data.url,data.param);
		}else{
			open.start(data.url);
		}
	}
});
var collect_ui = ui("do_ALayout_72");  //收藏版面
var collect = ui("do_ImageView_64");
var menustarbtn = ui("menuorderstart");
var reservebtn = ui("do_ALayout_65");
var takeoutbtn = ui("do_ALayout_66");
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
//开始点单按钮
menustarbtn.on("touch","",300,function(){
	menustarbtn.animate(buttonA,function(){
		selpointmask.visible = true;
		selpointbg.animate(animYes);
		//open.start("source://view/menuorder/menuorder_start.ui");
	});
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
		    collect_http.url = $U.url.collection+"?userid="+Euc(user)+"&_store="+Euc(token); // 请求的 URL
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

//var scrollNr = ui("do_LinearLayout_bus"); //内容视图
var bsnametitle = ui("do_Label_busname"); //店铺名称标题
//UI打开时触发
var Euc = encodeURIComponent;
page.on("loaded",function(data){
	addition_http.url = $U.token($U.url.collectExist,"identity")+"&token="+Euc(token); // 请求的 URL
	addition_http.request();
	reserveLoad();
});
//加载信息
function reserveLoad(){
	var url = $U.url.SinglePointInfo+"?token="+Euc(token); // 请求的 URL
	request_http.url = url;
    request_http.request();
}
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


var imgviewbg = ui("do_ImageView_4");
var scrollbody = ui("do_ScrollView_busdetail");
scrollbody.on("scroll",function(datas){
		imgviewbg.height = 500 -+ datas; //imgview不要放到scrollview里面放到外面 (图片高度 -+ data<--滚动)
		if(imgviewbg.height <= 0){       //判断如果imgview高度 <=0  只等于0
			imgviewbg.height = 0;
		}
		imgviewbg.redraw();
});

reservebtn.on("touch","",300,function(){
	reservebtn.animate(buttonA,function(){
		open.start("source://view/reservation/reservation_start.ui",token);
	});
});

takeoutbtn.on("touch","",300,function(){
	takeoutbtn.animate(buttonA,function(){
		open.start("source://view/outbound/outbound_start.ui",token);
	});
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus!=-1){
		//加载动画的地方
		bsnametitle.text = databus.title;
		imgviewbg.source = databus.path;
		var businessHours = ui("do_Label_70");
		businessHours.text = "营业时间:"+databus.businessHours;
		var perCapita = ui("do_Label_71");
		perCapita.text = "人均:"+databus.per_capita;
		var notice = ui("do_MarqueeLabel_1");
		if(databus.notice!=null){
			notice.text = databus.notice;
		}
		var menustar = ui("do_Label_75");
		if(databus.supportOrder){
			menustarbtn.bgColor = "EEB934FF";
			menustar.text = "快捷点餐";
			menustarbtn.enabled = true;
		}
		
		var reserve = ui("do_Label_77");
		if(databus.supportReserve){
			reservebtn.bgColor = "DD7632FF";
			reserve.text = "便捷";
			reservebtn.enabled = true;
		}
		
		var takeout = ui("do_Label_79");
		if(databus.supportTakeOut){
			takeoutbtn.bgColor = "5B52AAFF";
			takeout.text = "全城美食";
			takeoutbtn.enabled = true;
		}
		
		//评分
		var scoreImg = ui("do_ImageView_52");
		scoreImg.source = "source://image/star"+parseInt(databus.score)+".png";
		var scoreTxt = ui("do_Label_82");
		scoreTxt.text = parseFloat(databus.score).toFixed(1);
		var number = ui("do_Label_83");
		number.text = databus.number+"条评论";
		
		//折扣
		var prompt = ui("do_Label_94");
		var discount = ui("do_Label_95");
		if(databus.discountPrompt!=null){
			prompt.text = databus.discountPrompt;
			discount.text = parseFloat(databus.discount)+"折";
		}
		
		var address = ui("do_Label_84");
		address.text = databus.address;
		
		var phone = ui("do_Label_86");
		phone.text = databus.phone;
		
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
		
		var synopsis = ui("do_Label_88");
		synopsis.text = databus.introduce;
		
		//支持图标列表
		var supportData = mm("do_ListData");
		var supportgrid = ui("do_GridView_support");
		supportgrid.bindItems(supportData);
		if(databus.lvm.length!=undefined && databus.lvm.length>0){
			supportData.addData(databus.lvm);
			supportgrid.refreshItems();
		}else{
			var _panel = ui("do_ALayout_67");
			_panel.height = 0;
			_panel.redraw();
		}
		
		var busmap = ui("do_ALayout_map");
		busmap.on("touch","",300,function(){
			busmap.animate(buttonA,function(){
				open.start("source://view/other/maplocation.ui",[databus.lat,databus.lng,databus.title,databus.address]);
			});
		});
		
		
		
		//评价
		var evals = ui("do_ALayout_eval");
		evals.on("touch","",300,function(){
			evals.animate(buttonA,function(){
				open.start("source://view/other/evaluate.ui",[databus.token,databus.title,parseFloat(databus.score).toFixed(1),databus.number]);
			});
		});
		bsnametitle.animate(animScrollBT);
	}else{
		nf.toast("未获取到店铺信息");
		app.closePage();
	}
});


//open
var animYes = mm("do_Animation");
animYes.fillAfter = true;
animYes.alpha({
    duration : 150,
    alphaFrom : 0.5,
    alphaTo : 1
}, "id2a");
//close
var animBk = mm("do_Animation");
animBk.fillAfter = true;
animBk.alpha({
    duration : 150,
    alphaFrom : 1,
    alphaTo : 0
}, "id2b");

var closepint = ui("do_ALayout_90");
var selpointmask = ui("do_ALayout_selpoint");
var selpointbg = ui("do_ALayout_selpointbg");
selpointbg.on("touch","",300,function(){
	//防止点击穿透
});
selpointmask.on("touch","",300,function(){
	selpointbg.animate(animBk,function(){
		selpointmask.visible = false;
	});
});
closepint.on("touch","",300,function(){
	closepint.animate(buttonAS);
	selpointbg.animate(animBk,function(){
		selpointmask.visible = false;
	});
});


//点单预览
var btnView = ui("do_Button_1");
btnView.on("touch","",300,function(){
	btnView.animate(buttonA, function(data, e) {
		selpointmask.visible = false;
		selpointbg.animate(animYes);
		open.start("source://view/menuorder/menuorder_start.ui",{type:0,token:token,title:bsnametitle.text});
	});
});
var btnSinglePoint=ui("do_Button_2");
btnSinglePoint.on("touch","",300,function(){
	btnSinglePoint.animate(buttonA, function(data, e) {
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/menuorder/menuorder_start.ui",param:{type:1,token:token,title:bsnametitle.text}}
		    });
		}else{
			var networkStatus = network.getStatus();
			if($U.networkWIFI(networkStatus)){
				selpointmask.visible = false;
				selpointbg.animate(animYes);
				open.start("source://view/menuorder/menuorder_start.ui",{type:1,token:token,title:bsnametitle.text});
			}else{
				nf.toast("请连接WIFI后点单");
				network.openWifiSetting();
			}
		}
	});
});
