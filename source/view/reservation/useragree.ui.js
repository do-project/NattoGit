//related to user.ui
var page = sm("do_Page");
var app = sm("do_App");
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.supportPanClosePage();
page.on("back","",300, function(){
	app.closePage();
});