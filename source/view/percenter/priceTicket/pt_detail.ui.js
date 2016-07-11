var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var QRcodea = sm("do_QRCode");
var QRimage = ui("do_ImageView_2");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var param = page.getData();
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	var _price = ui("do_Label_3");
	_price.text = param.price;
	
	var dutTime = ui("do_Label_5");
	dutTime.text = param.dueTime;
	
	var tick = ui("do_Label_6");
	tick.text = tickChange(param.ticket);
	//生成二维码
	QRcodea.create(tick,"500", function(dataQ, e) {
		QRimage.source = dataQ;
		//deviceone.print(QRimage.source + tick.text);
    });
});

function tickChange(tick){
	return tick.substring(0,4)+" "+tick.substring(4,8)+" "+tick.substring(8);
}