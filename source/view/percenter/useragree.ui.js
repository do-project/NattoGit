//related to aboutUs.ui
var page = sm("do_Page");
var app = sm("do_App");
page.supportPanClosePage();
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
});
