var root = ui("$");
var page = sm("do_Page");

root.setMapping({
	"do_Label_19.text" : "genTime",
	"do_Label_19.tag" : "index",
	"userfxtext.text" : "msg",
	"do_Label_18.text":"praise",
	"do_ImageView_8.source":"praisea"
});
var data = ui("do_Label_19");
var praisea = ui("do_ALayout_13");
praisea.on("touch","",300,function(){
	page.fire("Praisea",data.tag);
});

var del = ui("do_ALayout_14");
del.on("touch","",300,function(){
	page.fire("DeleteBean",data.tag);
});