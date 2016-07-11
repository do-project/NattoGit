var root = ui("$");
var page = sm("do_Page");
var open = require("open");
var nf = sm("do_Notification");
root.setMapping({
	"do_ImageView_img.source":"path",
	"do_Label_title.text":"title",
	"do_Label_title.tag":"note",
	"do_Label_price.text":"price",
	"do_Label_xl.text":"sales",
	"do_Label_xl.tag":"type",
	"do_ALayout_1.tag":"index",
	"do_ImageView_img.tag":"BigPath",
	
});

var _sales = ui("do_Label_xl");
var _title = ui("do_Label_title");
var _price = ui("do_Label_price");
var btnCon = ui("do_ALayout_1");
var btnImg = ui("do_ImageView_img");


btnImg.on("touch","",300,function(){
	if(_sales.tag=="1"){
		var json = {path:this.tag,title:_title.text,sales:_sales.text,price:_price.text,note:_title.tag,index:btnCon.tag};
		open.start("source://view/other/fooddetail.ui",json);
	}else if(_sales.tag=="6"){
		var json = {path:this.tag,title:_title.text,sales:_sales.text,price:_price.text,note:_title.tag,index:btnCon.tag,type:deviceone.param.type};
		open.start("source://view/menuorder/fooddetail.ui",json);
	}
});
