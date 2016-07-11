//related to pointfinish.ui
var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.on("back", function(){
	app.closePage();
})

var btn1=ui("do_Button_2");
btn1.on("touch",function(){
	app.closePage("","",3);
});

var btn2=ui("do_Button_1");
btn2.on("touch",function(){
	open.start("source://view/orders/order_point_list.ui");
});