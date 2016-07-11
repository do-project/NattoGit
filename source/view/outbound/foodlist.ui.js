var root = ui("$");
var page = sm("do_Page");
var nf = sm("do_Notification");
root.setMapping({
	"caiimg.source":"path",
	"titletext.text":"title",
	"xiaoliangtext.text":"sales",
	"prices.text":"price",
	"num_minus.tag":"index",
	"num_plus.tag":"index",
	"num_txt.visible":"panel",
	"num_plus.visible":"panel",
	"num_txt.text":"count",
	"num_txt.tag":"inventory",
	"do_ALayout_6.visible":"forbid",
	"do_ALayout_7.visible":"inventorypanel",
	"caiimg.tag":"bigPath",
	"do_Label_8.text":"details"
});

var numminus = ui("num_minus");
var numplus = ui("num_plus");
var count = ui("num_txt");
var _imgPan = ui("do_ALayout_4");  //图片外框
var _img = ui("caiimg");  //图片
var _sales1 = ui("xiaoliangtext");  //销量
var _title1 = ui("titletext");  //名称
var _price1 = ui("prices");     //价格

var _panel=ui("do_ALayout_6");
var _details = ui("do_Label_8");
//+
numminus.on("touch",function(){
	if(count.text*1+1>count.tag && count.tag!=-1){
		count.text = count.tag;
		nf.toast(_title1.text+"剩余数量不足");
	}else{
		count.text = count.text*1+1;
	}
	var d = {};
	d.index = this.tag;
	d.count = count.text;
	page.fire("countupdate",d);
});
//-
numplus.on("touch",function(){
	if(count.text*1-1<=0){
		count.visible=false;
		numplus.visible=false;
	}
	count.text = count.text*1-1;
	var d = {};
	d.index = this.tag;
	d.count = count.text;
	page.fire("countupdate",d);
});
//点击图片外框弹出大图
_imgPan.on("touch","",300,function(){
	page.fire("imgShow",{path:_img.tag,title:_title1.text,sales:_sales1.text,price:_price1.text,details:_details.text});
});

page.on("productNumber",function(data){
	if(data.index==numminus.tag){
		if(data.count>0){
			numplus.visible=true;
			count.visible=true;
			count.text=data.count;
		}else{
			numplus.visible=false;
			count.visible=false;
			count.text=0;
		}
	}
});


