var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
});

var nf = sm("do_Notification");

var barcode = ui("do_BarcodeView_1");

page.on("loaded",function(){
	StartSweep();
}).on("result",function(){
	StartSweep();
});
//启动扫描
function StartSweep(){
	//开始启动扫描
	barcode.start(function(data) {
		//扫描成功，执行回调函数
		var result = data.value;
		var flag = true;
		if(result.indexOf(':')!=-1){
			var tag = result.split(':')[0];
			var token = result.split(':')[1];
			switch(tag){
				case "merchant":
					open.start("source://view/menuorder/menuorder_detail.ui",token,"menuorderstart");
					break;
				default:
					flag=false;
					break;
			};
		}else{
			flag=false;
		}
		if(!flag){
			nf.alert("必须是商家二维码",function(){
				StartSweep();
			});
		}
	});
}

//闪光灯
var flshLight = ui("do_ALayout_flash");
var flshTxt = ui("do_Label_flshtxt");
var flshimg = ui("do_ImageView_5");
flshLight.on("touch",function(){
	flshLight.animate(buttonA);
	if(flshTxt.text == "打开"){
		barcode.flash("on");
		flshTxt.text = "关闭";
		flshimg.source = "source://image/shanguangdengoff.png";
	}else{
		barcode.flash("off");
		flshTxt.text = "打开";
		flshimg.source = "source://image/shanguangdeng.png";
	}
});