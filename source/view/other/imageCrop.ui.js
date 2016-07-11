var page = sm("do_Page");
var app = sm("do_App");
var nf = sm("do_Notification");
var open = require("open");
var path = page.getData();
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var cropview = ui("do_ImageCropView_1");

var caiclose = ui("do_Button_1");
caiclose.on("touch","",500,function(){
	caiclose.animate(buttonA,function(){
		app.closePage();
	});
});

page.on("back", function(){
	app.closePage();
});

var imgcrop = ui("do_ImageCropView_1");
imgcrop.source = path;   //图片地址

var btn = ui("do_Button_2");

btn.on("touch","",300,function(){
	cropview.crop(function(data, e) {
		app.closePage({type:1,path:data});
	});
});
