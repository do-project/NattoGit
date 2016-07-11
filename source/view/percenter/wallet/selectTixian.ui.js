var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var page = sm("do_Page");
//遮罩显示
var animMaskShow = mm("do_Animator");
var propsMS = {bgColor:"000000AA"};
animMaskShow.append(300,propsMS,"EaseOut");
//面板显示
var animPanelShow = mm("do_Animator");
var propsPS = {y:1013};
animPanelShow.append(300,propsPS,"EaseOut");
//遮罩隐藏
var animMaskHide = mm("do_Animator");
var propsMH = {bgColor:"00000000"};
animMaskHide.append(300,propsMH,"EaseIn");
//面板隐藏
var animPanelHide = mm("do_Animator");
var propsPH = {y:1334};
animPanelHide.append(300,propsPH,"EaseIn");

var page = sm("do_Page");
var paneler = ui("do_ALayout_1");
//自定义事件---打开
page.on("animShows",function(data){
	bgmask.visible = data;
	bgmask.animate(animMaskShow);
	paneler.animate(animPanelShow);
});
//遮罩事件
var bgmask = ui("maskbg");
bgmask.on("touch","",300,function(){
	bgmask.animate(animMaskHide,function(){
		bgmask.visible = false;
	});
	paneler.animate(animPanelHide);
});
//取消事件
var canel = ui("do_Button_canel");
canel.on("touch","",300,function(){
	bgmask.animate(animMaskHide,function(){
		bgmask.visible = false;
	});
	paneler.animate(animPanelHide);
});

//支付宝
var camerabtn = ui("do_Button_1");
camerabtn.on("touch","",300,function(){
	this.animate(buttonA,function(){
		//动画结束后执行
		bgmask.animate(animMaskHide,function(){
			bgmask.visible = false;
		});
		paneler.animate(animPanelHide);
		page.fire("reselutSel",this.text);
		
	});
});
//银行卡
var photobtn = ui("do_Button_2");
photobtn.on("touch","",300,function(){
	this.animate(buttonA,function(){
		//动画结束后执行
		bgmask.animate(animMaskHide,function(){
			bgmask.visible = false;
		});
		paneler.animate(animPanelHide);
		page.fire("reselutSel",this.text);
	});
});
