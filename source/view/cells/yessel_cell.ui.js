var root = ui("$");
root.setMapping({
	"caititle.text":"title",
	"caiprice.text":"price",
	"snum_plus.tag":"index",
	"snum_minus.tag":"index",
	"snum_txt.text":"count"
});
var page = sm("do_Page");
var numminus = ui("snum_minus");  //+
var numplus = ui("snum_plus");    //-
var count = ui("snum_txt");
numminus.on("touch",function(){
	var _count = count.text*1+1;
	var d = {};
	d.index = this.tag;
	d.count = _count;
	page.fire("shopupdate",d)
});
numplus.on("touch",function(){
	var _count = count.text*1-1>0? count.text*1-1:0;
	var d = {};
	d.index = this.tag;
	d.count = _count;
	page.fire("shopupdate",d)
});
