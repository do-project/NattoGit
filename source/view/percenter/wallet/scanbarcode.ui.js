var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");
//var device = sm("do_Device");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
});


var nf = sm("do_Notification");

//根据ID获取BarcodeView实例对象；
var barcode = ui("do_BarcodeView_1");

page.on("loaded",function(){
	//start();
	//function start(){
		//开始启动扫描
		barcode.start(function(data) {
			//扫描成功，执行回调函数
			var result = JSON.stringify(data);  
			//nf.alert("result:" + result, "BarcodeView")
			open.start("source://view/other/search.ui");
		});
	//}
});

//闪光灯
var flshLight = ui("do_ALayout_flash");
var flshTxt = ui("do_Label_flshtxt");
var flshimg = ui("do_ImageView_5");
flshLight.on("touch",function(){
	flshLight.animate(buttonA);
	if(flshTxt.text == "打开"){
		//device.flash("on"); 
		barcode.flash("on");
		flshTxt.text = "关闭";
		flshimg.source = "source://image/shanguangdengoff.png";
	}else{
		//device.flash("off"); 
		barcode.flash("off");
		flshTxt.text = "打开";
		flshimg.source = "source://image/shanguangdeng.png";
	}
});