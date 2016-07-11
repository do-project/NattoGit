//related to testanim.ui
var page = sm("do_Page");
var app = sm("do_App");
var device = sm("do_Device");
page.on("back", function(){
	app.closePage();
});

//闪光灯
var flshLight = ui("do_ALayout_flash");
flshLight.on("touch",function(){
	if(flshLight.text == "打开"){
		device.flash("on"); 
		flshLight.text = "关闭";
	}else{
		device.flash("off"); 
		flshLight.text = "打开";
	}
});