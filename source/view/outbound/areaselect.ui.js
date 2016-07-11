var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var peopleNumber=1,_index=0;
var arealist=[];

//遮罩显示
var animMaskShow = mm("do_Animator");
var propsMS = {bgColor:"00000077"};
animMaskShow.append(300,propsMS,"EaseOut");
//面板显示
var animPanelShow = mm("do_Animator");
var propsPS = {y:634};
animPanelShow.append(300,propsPS,"Linear");
//遮罩隐藏
var animMaskHide = mm("do_Animator");
var propsMH = {bgColor:"00000000"};
animMaskHide.append(300,propsMH,"EaseIn");
//面板隐藏
var animPanelHide = mm("do_Animator");
var propsPH = {y:1334};
animPanelHide.append(300,propsPH,"EaseIn");

//遮罩事件
var maskbg = ui("bgmask");
maskbg.on("touch","",300,function(){
	maskbg.animate(animMaskHide,function(){
		maskbg.visible = false;
	});
	bodyp.animate(animPanelHide);
});
//防止穿透
var bodyp = ui("pbody");
bodyp.on("touch","",300,function(){
	
});

//确定按钮
var btnyes = ui("yesbtn");
btnyes.on("touch","",300,function(){
	page.fire("refreshArea",[arealist[_index].token,arealist[_index].title]);
	maskbg.animate(animMaskHide,function(){
		maskbg.visible = false;
	});
	bodyp.animate(animPanelHide);
});
//zdy
page.on("panelshows",function(data){
	maskbg.visible = data;
	maskbg.animate(animMaskShow);
	bodyp.animate(animPanelShow);
});
//日期选择
var areapick = ui("do_Picker_area");
var dataarea = mm("do_ListData");

page.on("areaList",function(databus){
	arealist=databus;
	dataarea.removeAll();
	var peoJson = [];
	var _index=0;
	for(var i=0;i<databus.length;i++){
		peoJson[peoJson.length]=databus[i].title;
		if(deviceone.area!="" && deviceone.area==databus[i].token){
			_index = i;
		}
	}
	dataarea.addData(peoJson);
	areapick.bindItems(dataarea);
	areapick.refreshItems();
	
	if(deviceone.area!=""){
		areapick.index=_index;
		page.fire("defaultArea",dataarea.getOne(_index));
	}
});


areapick.on("selectChanged",function(index){
	_index=index;
});