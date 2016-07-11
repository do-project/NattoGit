var root = ui("$");
var page = sm("do_Page");

root.setMapping({
	"userheadimg.tag":"index",
	"userheadimg.source":"head",
	"username.text":"name",
	"userfxtime.text":"genTime",
	"userfxtext.text":"msg",
	"do_Label_18.text":"praise",
	"do_ImageView_8.source":"praisea"
	
});

var head = ui("userheadimg");

var praisea = ui("do_ALayout_13");
praisea.on("touch","",300,function(){
	page.fire("Praisea",head.tag);
});
