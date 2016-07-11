var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var data=page.getData();

var leftclose = ui("do_ALayout_close");

leftclose.on("touch",function(){
	app.closePage();
});
var txt=ui("do_Label_9");
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	if(data){
		txt.text="修改";
	}
}).on("result",function(data){
	if(data==0){
		txt.text = "修改";
	}
});

var pswlogin = ui("loginpassword");
pswlogin.on("touch","",300,function(){
	pswlogin.animate(buttonA,function(){
		open.start("source://view/percenter/perdata/safePassword.ui");
	});
});

var pswpay = ui("paypassword");
pswpay.on("touch","",300,function(){
	pswpay.animate(buttonA,function(){
		open.start("source://view/percenter/perdata/payPassword.ui");
	});
});