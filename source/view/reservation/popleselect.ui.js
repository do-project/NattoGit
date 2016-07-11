var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var peopleNumber="1";

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

page.on("peples",function(data){
	maskbg.visible = data;
	bodyp.animate(animPanelShow);
	maskbg.animate(animMaskShow);
});

//遮罩事件
var maskbg = ui("bgmask");
maskbg.on("touch","",300,function(){
	bodyp.animate(animPanelHide);
	maskbg.animate(animMaskHide,function(){
		maskbg.visible = false;
	});
});
//防止穿透
var bodyp = ui("pbody");
bodyp.on("touch","",300,function(){
	
});

//确定按钮
var btnyes = ui("yesbtn");
btnyes.on("touch","",300,function(){
	this.animate(buttonA,function(){
		page.fire("refreshPeople",peopleNumber);
		bodyp.animate(animPanelHide);
		maskbg.animate(animMaskHide,function(){
			maskbg.visible = false;
		});
	});
});
//日期选择
var peoplepick = ui("do_Picker_people");
var datapoep = mm("do_ListData");

page.on("presetPeo",function(num){
	var peoJson = [];
	datapoep.removeAll();
	for(var i=0;i<50;i++){
		peoJson[peoJson.length] = (i+1).toString();
	}
	datapoep.addData(peoJson);
	peoplepick.bindItems(datapoep);
	peoplepick.refreshItems();
	
	var cell = datapoep.getOne(peoplepick.index);
	peopleNumber=cell;
	
	//peoplepick.index = parseInt(num-1);
});



peoplepick.on("selectChanged",function(index){
	var cell = datapoep.getOne(index);
	peopleNumber=cell;
	//page.fire("refreshPeople",peopleNumber);
});