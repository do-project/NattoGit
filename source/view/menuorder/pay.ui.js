var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var open = require("open");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
});

var paybtn = ui("do_Button_1");
paybtn.on("touch","",300,function(){
	paybtn.animate(buttonAS);
	page.hideKeyboard();
});

var payalyout = ui("paypage");
payalyout.on("touch",function(){
	page.hideKeyboard();
});