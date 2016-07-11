var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");
var storage = sm("do_Storage");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var omdbtn = ui("do_ALayout_omd");  //点单列表
omdbtn.on("touch","",300,function(){
	omdbtn.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "white",
		    	data:{url:"source://view/orders/order_menu_list.ui"}
		    });
		}else{
			open.start("source://view/orders/order_menu_list.ui");
		}
	});
});

var reservation = ui("do_ALayout_reservation");
reservation.on("touch","",300,function(){
	reservation.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "white",
		    	data:{url:"source://view/orders/order_reserv_list.ui"}
		    });
		}else{
				open.start("source://view/orders/order_reserv_list.ui");
		}
	});
});

var takeway = ui("do_ALayout_takeway");
takeway.on("touch","",300,function(){
	takeway.animate(buttonA,function(){
	if(!$U.tokenExist()){
		app.openPage({
	    	source : "source://view/loginreg/login.ui",
	    	animationType: "slide_b2t",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "white",
	    	data:{url:"source://view/orders/order_takeway_list.ui"}
	    });
	}else{
		open.start("source://view/orders/order_takeway_list.ui");
	}
	});
});
//积分兑换
var pointmall = ui("do_ALayout_pointmall");
pointmall.on("touch","",300,function(){
	pointmall.animate(buttonA,function(){
	if(!$U.tokenExist()){
		app.openPage({
	    	source : "source://view/loginreg/login.ui",
	    	animationType: "slide_b2t",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "white",
	    	data:{url:"source://view/orders/order_point_list.ui"}
	    });
	}else{
		open.start("source://view/orders/order_point_list.ui");
	}
	});
});
//退款订单
var drawback = ui("do_ALayout_drawback");
drawback.on("touch","",300,function(){
	drawback.animate(buttonA,function(){
	if(!$U.tokenExist()){
		app.openPage({
	    	source : "source://view/loginreg/login.ui",
	    	animationType: "slide_b2t",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "white",
	    	data:{url:"source://view/orders/order_drawback_list.ui"}
	    });
	}else{
		open.start("source://view/orders/order_drawback_list.ui");
	}
	});
});
var flag = false;
page.on("page3",function(){
	page3Load();
}).on("result",function(data){
	page3Load();
});

function page3Load(){
	if($U.tokenExist()){
		request_http.url = $U.token($U.url.appOrderMsg,"user");
	    request_http.request();
	}
}

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus!=-1){
		var flag = true;
		var takeMsg = ui("do_Label_10");
		if(databus.takeMessage!=null){
			takeMsg.text = databus.takeMessage;
			flag=false;
		}else{
			takeMsg.text="";
		}
		var resMsg=ui("do_Label_7");
		if(databus.reserveMessage!=null){
			resMsg.text = databus.reserveMessage;
			flag=false;
		}else{
			resMsg.text="";
		}
		var refMsg=ui("do_Label_17");
		if(databus.refundMessage!=null){
			refMsg.text=databus.refundMessage;
			flag=false;
		}else{
			refMsg.text="";
		}
		
		page.fire("OrderNumber",flag? 0:1);
	}
});