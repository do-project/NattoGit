var root = ui("$");
var page = sm("do_Page");
root.setMapping({
	"do_Label_1.text":"title",
	"do_ImageView_1.visible":"imagevisible",
	"do_Label_1.tag":"index"
});

var img = ui("do_ImageView_1");
var title = ui("do_Label_1");

page.on("switch",function(data){
	img.visible = (data==title.tag);
});