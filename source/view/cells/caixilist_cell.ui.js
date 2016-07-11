var root = ui("caixilist");
var page = sm("do_Page");
root.setMapping({
	"caixititle.text":"title",
	"caixititle.tag":"index",
	"caixititle.fontColor" : "fontColor",
	"caixilist.bgColor" : "bgColor",
	"caixititle.fontStyle" : "fontStyle"
});

var _title=ui("caixititle");
var caixititle=ui("caixititle");
var caixilist=ui("caixilist");
page.on("caixiColor",function(index){
	if(_title.tag==index){
		caixititle.fontColor="E6852DFF";
		caixititle.fontStyle="bold";
		caixilist.bgColor="F6F6F6FF";
	}else{
		caixititle.fontColor="555555FF";
		caixititle.fontStyle="normal";
		caixilist.bgColor="F6F6F600";
	}
});