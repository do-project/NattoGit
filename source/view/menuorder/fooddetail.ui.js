var page = sm("do_Page");
var app = sm("do_App");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var param = page.getData();
var leftclose = ui("do_ALayout_close");
var d={};
leftclose.on("touch",function(){
	app.closePage(d);
});
var anline = ui("do_ImageView_aimline");
//line动画
var animatorline = mm("do_Animator");
var props = {width : 375};
animatorline.append(1300, props, "EaseOut");

var btnAdd = ui("do_Button_3");
if(param.type==0){
	btnAdd.visible=false;
}
page.on("back", function(){
	app.closePage(d);
}).on("loaded",function(){
	//line动画
	anline.animate(animatorline);
});
var img = ui("do_ImageView_4");
img.source = param.path;
var title = ui("do_Label_2");
title.text = param.title;
var sales = ui("do_Label_3");
sales.text = param.sales;
var price = ui("do_Label_4");
price.text = param.price;
var note = ui("do_Label_7");
note.text = param.note=="null"? "暂无描述":param.note;
btnChange(param.selected);

btnAdd.on("touch","",300,function(){
	btnAdd.animate(buttonAS);
	d.index=param.index;
	param.selected = param.selected? false:true;
	d.count=param.selected? 1:0;
	btnChange(param.selected);
});

function btnChange(flag){
	if(flag){
		btnAdd.bgColor="804040FF";
		btnAdd.text = "不要了";
	}else{
		btnAdd.bgColor="1C8DFFFF";
		btnAdd.text = "加入菜单";
	}
	btnAdd.redraw();
}

var hdimg = ui("do_ImageView_4");
var scrollview = ui("do_ScrollView_1");
scrollview.on("scroll",function(data){
	hdimg.height = 800 -+ data;
	if(hdimg.height <= 0){
		hdimg.height = 0;
	}
	hdimg.redraw();
});