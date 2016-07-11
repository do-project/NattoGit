//related to pointfinish.ui
var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage("","",2);
});
page.on("back", function(){
	app.closePage("","",2);
})

var btn1=ui("do_Button_2");
btn1.on("touch",function(){
	app.closePage("","",2);
});