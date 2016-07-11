//related to pointfinish.ui
var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var type = page.getData();


var title = ui("do_Label_8");
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	if(type==1){
		app.closePageToID("","","pageIndex");
	}else if(type==5){   //订单完成
		app.closePageToID("","","page3");
	}else if(type==6){   //订单完成
		app.closePageToID("","","menuorderstart");
	}else if(type==7){
		app.closePage("","",2);
	}
});
page.on("back", function(){
	if(type==1){
		app.closePageToID("","","pageIndex");
	}else if(type==5){   //订单完成
		app.closePageToID("","","page3");
	}else if(type==6){   //订单完成
		app.closePageToID("","","menuorderstart");
	}else if(type==7){
		app.closePage("","",2);
	}
}).on("loaded",function(){
	title.text = "您的订单信息已提交,如商家未收到结账信息，请通知商家进行结账刷新";
});


var btn2=ui("do_Button_1");
btn2.on("touch",function(){
	btn2.animate(buttonA,function(){
		if(type==1){
			app.closePageToID("","","pageIndex");
		}else if(type==5){   //订单完成
			app.closePageToID("","","page3");
		}else if(type==6){   //订单完成
			app.closePageToID("","","menuorderstart");
		}else if(type==7){
			app.closePage("","",2);
		}
	});
});