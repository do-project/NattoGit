var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");
var global = sm("do_Global");
var nf = sm("do_Notification");
var data_cache = sm("do_DataCache");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var login_file = "data://security/login";

var btn_portrait = ui("btn_portrait");
btn_portrait.on("touch",function(){
	app.openPage({
    	source : "source://view/loginreg/login.ui",
    	animationType: "slide_b2t",
    	statusBarState : "transparent",
    	statusBarFgColor : "white",
    	data:{}
    });
});

var scrollview = ui("do_ScrollView_2");
var imgbg = ui("do_ImageView_3");
scrollview.on("scroll",function(datas){
	imgbg.height = 450 - datas;
	imgbg.redraw();
});
var username = ui("login_name");
var portrait = ui("portrait");
var _message=ui("do_Label_18");
var _price = ui("do_Label_35");
var _integral = ui("do_Label_36");
var _tickNum = ui("do_Label_40");

page.on("result",function(data){
	if($U.tokenExist()){
		userLoad();
	}
	if(data=="close"){   //已经退出
		portrait.defaultImage="source://image/defult_head.jpg";  //更改默认图片
		portrait.source="source://image/defult_head.jpg";  //更改默认图片
		_price.text = "￥0";
		_integral.text = "0";
		_tickNum.text = "0张";
		_message.text = "";
		username.text = "";
		data_cache.removeData("HeadImg");
		btn_portrait.visible = true;
	}
}).on("page4",function(){
	if($U.tokenExist()){
		userLoad();
	}
}).on("MessageNumber",function(data){
	if(data>0){
		_message.text=data+"条新消息";
	}else{
		_message.text = "";
	}
});

//加载用户信息
function userLoad(){
	//读取默认图片
	var _img=data_cache.loadData({key:"HeadImg"});
	if(_img!=""){
		portrait.defaultImage=_img;  //更改默认图片
	}
	request_http.url = $U.token($U.url.appUserInfo,"user");
    request_http.request();
}


var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	btn_portrait.visible = false;
	username.text = databus.userName;
	portrait.source = databus.path;
	
	global.setMemory("access_token", databus.token);
	
	
	_price.text = "￥"+databus.balance;
	
	_integral.text = databus.integral;
	_tickNum.text = databus.tickNum+"张";
	
	if(databus.message>0){
		_message.text=databus.message+"条新消息";
	}else{
		_message.text="";
	}
});

//收货地址
var address = ui("do_ALayout_address");
address.on("touch","",300,function(){
	address.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/percenter/shopaddress1.ui"}
		    });
		}else{
			open.start("source://view/percenter/shopaddress1.ui","");
		}
	});
	
});
//消息
var message = ui("do_ALayout_message");
message.on("touch","",300,function(){
	message.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/percenter/messages.ui"}
		    });
		}else{
			open.start("source://view/percenter/messages.ui");
		}
	});
});

var backfeed = ui("do_ALayout_backfeed");
backfeed.on("touch","",300,function(){
	backfeed.animate(buttonA,function(){
		open.start("source://view/percenter/feedback.ui");
	});
});

var setting = ui("do_ALayout_setting");
setting.on("touch","",300,function(){
	setting.animate(buttonA,function(){
		open.start("source://view/percenter/setting.ui");
	});
});
//个人资料
var perdata = ui("do_ALayout_perdata");
perdata.on("touch","",300,function(){
	perdata.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/percenter/perdata/perdata_list.ui"}
		    });
		}else{
			open.start("source://view/percenter/perdata/perdata_list.ui");
		}
	});
});
//收藏
var perfav = ui("do_ALayout_facorites");
perfav.on("touch","",300,function(){
	perfav.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/percenter/favorites/favorites_list.ui"}
		    });
		}else{
			open.start("source://view/percenter/favorites/favorites_list.ui");
		}
	});
});

//我的分享
var myshare = ui("do_ALayout_share");
myshare.on("touch","",300,function(){
	myshare.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/percenter/myshare/myshare.ui"}
		    });
		}else{
			open.start("source://view/percenter/myshare/myshare.ui");
		}
	});
});

//钱包
var cwallet = ui("walletcon");
cwallet.on("touch","",300,function(){
	cwallet.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/percenter/wallet/walletHome.ui"}
		    });
		}else{
			open.start("source://view/percenter/wallet/walletHome.ui");
		}
	});
});
//抵价券
var ticketprice = ui("priceticket");
ticketprice.on("touch","",300,function(){
	ticketprice.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/percenter/priceTicket/priceTicket_list.ui"}
		    });
		}else{
			open.start("source://view/percenter/priceTicket/priceTicket_list.ui");
		}
	});
});
//积分商城
var spmall = ui("do_ALayout_shopmall");
spmall.on("touch","",300,function(){
	spmall.animate(buttonA,function(){
		open.start("source://view/pointsMall/pointMall_list.ui");
	});
});