//related to lr_detail_cell.ui
var root = ui("$");
var open = require("open");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
root.setMapping({
	"do_ImageView_2.source":"path",
	"do_Label_1.text":"storetitle",
	"do_Label_2.text":"title",
	"do_Label_3.text":"price",
	"do_Label_4.text":"detail",
	"do_Button_2.tag":"token"
});

var btn = ui("do_Button_2");
btn.on("touch","",300,function(){
	btn.animate(buttonA,function(){
		open.start("source://view/menuorder/menuorder_detail.ui",btn.tag,"menuorderstart");
	});
	
});