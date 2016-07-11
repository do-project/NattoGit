//related to loading_roundtxt.ui
var page = sm("do_Page");
var nf = sm("do_Notification");
var root = ui("$");
var animloadingshow = mm("do_Animation");
animloadingshow.fillAfter = true;
animloadingshow.scale({
	duration : 200,
	scaleFromX : 0,
    scaleFromY : 0,
    curve : "EaseInOut",
    scaleToX : 1,
    scaleToY : 1,
    pivotX : 0.5,
    pivotY : 0.5
},"idsca");
animloadingshow.alpha({
    duration : 200,
    curve : "EaseInOut",
    alphaFrom : 0,
    alphaTo : 1
}, "idala");
//
var animloadinghide = mm("do_Animation");
animloadinghide.fillAfter = true;
animloadinghide.scale({
	duration : 200,
	scaleFromX : 1,
    scaleFromY : 1,
    curve : "EaseInOut",
    scaleToX : 0,
    scaleToY : 0,
    pivotX : 0.5,
    pivotY : 0.5
},"idsc");
animloadinghide.alpha({
    duration : 200,
    curve : "EaseInOut",
    alphaFrom : 1,
    alphaTo : 0
}, "idal");
//滚动条
var animloadingleft = mm("do_Animation");
animloadingleft.fillAfter = false;
animloadingleft.transfer({
	duration : 1600,
	fromX : -120,
	fromY : 0,
	repeatCount:-1,
    toX : 580,
    toY : 0
},"lleft");
var loadingLimg = ui("do_ImageView_1");
loadingLimg.animate(animloadingleft);

var loadingbox = ui("do_ALayout_2");
var loadingback = ui("laodingrxback");
var loadingtxt = ui("do_Label_2");

root.on("loadingrect",function(data){
	loadingback.tag = data[0];
	loadingtxt.text = data[1];
	if(loadingback.tag == 1){
		loadingback.visible = true;
		loadingbox.animate(animloadingshow);
	}else{
		loadingbox.animate(animloadinghide,function(){
			loadingback.visible = false;
		});
	}
});
loadingback.on("touch",function(){
	//
});