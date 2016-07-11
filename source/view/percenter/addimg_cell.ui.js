var root = ui("$");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var page = sm("do_Page");
root.setMapping({
	"do_ImageView_yjfk.source":"path",
	"do_ImageView_yjfk.enabled":"enabled",
	"do_ALayout_3.visible":"show",
	"do_ImageView_yjfk.tag":"index"
});

var btnImg=ui("do_ImageView_yjfk");
btnImg.on("touch","",300,function(){
	page.fire("imageModel");
});

var delbtn = ui("do_ALayout_3");
delbtn.on("touch","",300,function(){
	page.fire("deleteImage",btnImg.tag);
});