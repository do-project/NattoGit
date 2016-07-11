var page = sm("do_Page");
ui("$").on("touch", function(){
    return false;
});
//防止穿透
var _lbgs = ui("ladingyesbg");
_lbgs.on("touch",function(){
	
});

var animimg = mm("do_Animation");
animimg.fillAfter = true;
animimg.alpha({
	delay:500,
    duration : 300,
    alphaFrom : 1,
    alphaTo : 0
}, "id2");

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