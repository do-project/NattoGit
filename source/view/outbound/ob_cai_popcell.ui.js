var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

//遮罩显示
var animMaskShow = mm("do_Animator");
var propsMS = {bgColor:"000000AA"};
animMaskShow.append(400,propsMS,"EaseOut");
//遮罩隐藏
var animMaskHide = mm("do_Animator");
var propsMH = {bgColor:"00000000"};
animMaskHide.append(300,propsMH,"EaseIn");

//面板显示
var animPanelShow = mm("do_Animator");
var propsPS = {y:260};
animPanelShow.append(400,propsPS,"EaseOut");
//面板隐藏
var animPanelHide = mm("do_Animator");
var propsPH = {y:1334};
animPanelHide.append(300,propsPH,"EaseIn");

var imgs = ui("do_ImageView_1");
//遮罩事件--
var bgmask = ui("bugmask");
bgmask.on("touch","",300,function(){
	bgmask.animate(animMaskHide);
	bgs.animate(animPanelHide,function(){
		bgmask.visible = false;
		imgs.source = "source://image/defult_food.png";
	});
});

page.on("caipops",function(data){
	bgmask.visible = data;
	bgmask.animate(animMaskShow);
	bgs.animate(animPanelShow);
});

var bgs = ui("do_ALayout_bk");
bgs.on("touch","",300,function(){
	//防止穿透底层事件
});
