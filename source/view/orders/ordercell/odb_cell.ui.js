var root = ui("$");
root.setMapping({
	"busniess_name.text":"title",
	"ordernum.text":"orderno",
	"backprice.text":"price",
	"imgposi.x":"left",
	"jindubl.width":"width"
});

root.on("dataRefreshed",function(){
	root.redraw();
});