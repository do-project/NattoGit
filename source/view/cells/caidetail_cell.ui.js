var nf = sm("do_Notification");
var page = sm("do_Page");
var numminus = ui("num_minus");
var numplus = ui("num_plus");
var numtxt = ui("num_txt");

numminus.on("touch",function(){   //加
	numtxt.text = numtxt.text*1+1;
	var d = {};
	d.index=this.tag;
	d.count=numtxt.text;
	numsHide(numtxt.text);
	page.fire("countupdate",d);
});
numplus.on("touch",function(){   //减
	numtxt.text = numtxt.text*1-1;
	var d = {};
	d.index=this.tag;
	d.count=numtxt.text;
	numsHide(numtxt.text);
	page.fire("countupdate",d);
});

function numsHide(n){
	if(n>0){
		numplus.visible = true;
		numtxt.visible = true;
	}else{
		numplus.visible = false;
		numtxt.visible = false;
	}
}
page.on("menuInfo",function(data){
	var img = ui("do_ImageView_1");
	img.source = data.path;
	var title = ui("do_Label_1");
	title.text = data.title;
	var price = ui("do_Label_2");
	price.text = data.price;
	var sales = ui("do_Label_3");
	sales.text = data.sales;
	numtxt.text = data.num;
	var note = ui("do_Label_7");
	note.text = data.note==null? "暂无":data.note;
	numsHide(data.num);
	numminus.tag=numplus.tag=data.index;
});
