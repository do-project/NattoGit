var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var str = page.getData();

var leftclose = ui("do_ALayout_close");

leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
});



var okbtn = ui("do_Button_1");
var bztextbox = ui("do_TextBox_2");

bztextbox.text = str==""? "":str;
okbtn.on("touch",function(){
	okbtn.animate(buttonA,function(){
		var text = bztextbox.text;
		app.closePage([2,text]);
	});
});
