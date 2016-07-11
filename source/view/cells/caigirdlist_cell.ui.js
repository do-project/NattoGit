var root = ui("$");
var page = sm("do_Page");
var open = require("open");
var nf = sm("do_Notification");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
root.setMapping({
	"do_ImageView_img.source":"path",
	"do_Label_title.text":"title",
	"do_Label_title.tag":"note",
	"do_Label_price.text":"price",
	"do_Label_xl.text":"sales",
	"do_ImageView_1.source":"selected",
	"do_ALayout_1.tag":"index"
});

var _sales = ui("do_Label_xl");
var _title = ui("do_Label_title");
var _price = ui("do_Label_price");
var btnCon = ui("do_ALayout_1");
var img = ui("do_ImageView_1");
var btnImg = ui("do_ImageView_img");

page.on("result",function(data){
	if(data.index==btnCon.tag){
		if(data.count>0){
			img.source=deviceone.checked;
		}else{
			img.source=deviceone.unchecked;
		}
		page.fire("countupdate",data);
	}
}).on("removeMenu",function(index){
	if(index==btnCon.tag){
		img.source=deviceone.unchecked;
	}
}).on("removeAll",function(){
	if(img.source==deviceone.checked){
		img.source=deviceone.unchecked;
	}
});

btnImg.on("touch","",300,function(){
	var flag = img.source==deviceone.checked;
	var json = {path:this.source,title:_title.text,sales:_sales.text,price:_price.text,note:_title.tag,selected:flag,index:btnCon.tag};
	open.start("source://view/other/fooddetail.ui",json);
});

btnCon.on("touch",function(){
	img.animate(buttonAS);
	var d = {};
	d.index=this.tag;
	if(img.source==deviceone.unchecked || img.source==0){
		d.count=1;
		img.source=deviceone.checked;
	}else{
		img.source=deviceone.unchecked;
		d.count=0;
	}
	page.fire("countupdate",d);
});