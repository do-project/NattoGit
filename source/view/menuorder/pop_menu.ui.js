var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var open = require("open");
var page = sm("do_Page");
var popbg = ui("popmenybg");
var btnfuwut = ui("do_Button_1");
var btnpayorder = ui("do_Button_2");
popbg.on("touch","",300,function(){
	page.fire("popmenu","false");
});

btnfuwut.on("touch","",300,function(){
	btnfuwut.animate(buttonAS,function(){
		page.fire("popmenu","false");
		open.start("source://view/menuorder/fuwutai.ui",{sameId:deviceone.param.sameId,ip:deviceone.param.ip,port:deviceone.param.port});
	});
});
btnpayorder.on("touch","",300,function(){
	btnpayorder.animate(buttonAS,function(){
		page.fire("popmenu","false");
		open.start("source://view/menuorder/menuorder_reckon.ui",{sameId:deviceone.param.sameId,ip:deviceone.param.ip,port:deviceone.param.port});
	});
});