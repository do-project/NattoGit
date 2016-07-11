var page = sm("do_Page");
var nf = sm("do_Notification");
ui("$").on("touch", function(){
    return false;
});
var maskbg = ui("ladingyesbg");
maskbg.on("touch",function(){
	page.hideKeyboard();
});
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var animimg = mm("do_Animation");
animimg.fillAfter = true;
animimg.alpha({
	delay:500,
    duration : 300,
    alphaFrom : 1,
    alphaTo : 0
}, "id2");

page.on("disableButton",function(){
	btnConfirm.enabled=false;
});
//var _pro=ui("do_ProgressBar_1");
//var _img=ui("do_ImageView_1");
//page.on("LoadingHide",function(){
//	_lbgs.animate(animimg, function(data, e) {
//		_lbgs.visible=false;
//	});
//}).on("LoadingProgress",function(){
//	_pro.visible=true;
//	_img.visible=false;
//}).on("LoadingComplete",function(){
//	_pro.visible=false;
//	_img.visible=true;
//});

var btnConfirm = ui("do_Button_2");
var btnCancel = ui("do_Button_1");
var people = ui("do_TextField_1");
var sameName = ui("do_TextField_2");


btnCancel.on("touch","",300,function(){
	btnCancel.animate(buttonA,function(){
		page.hideKeyboard();
		maskbg.visible=false;
		page.fire("LoginVisible",false);
	});
});
//确定按钮
btnConfirm.on("touch","",300,function(){
	btnConfirm.animate(buttonA,function(){
		if(people.text.trim()=="" || parseInt(people.text)<=0){
			people.setFocus(true);
			nf.toast("请输入就餐人数");
		}else if(sameName.text.trim()==""){
			sameName.setFocus(true);
			nf.toast("请输入台位号");
		}else{
			page.hideKeyboard();
			page.fire("OpenSame",{sameName:sameName.text,People:parseInt(people.text)});
		}
	});
});