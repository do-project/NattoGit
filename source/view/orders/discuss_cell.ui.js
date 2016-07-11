var page = sm("do_Page");
var root = ui("$");
root.setMapping({
	"do_Label_1.tag":"token",
	"do_Label_1.text":"title"
});

var btnList=[ui("do_ImageView_1"),ui("do_ImageView_2"),ui("do_ImageView_3"),ui("do_ImageView_4"),ui("do_ImageView_5")];

btnList.forEach(function(dc,i){
	dc.on("touch", function(datac, e) {
		paytouch(i);
	});
});
var txtTitle=ui("do_Label_1");
var paytouch = function(index){
	for(var i=index;i>=0;i--){
		btnList[i].source="source://image/star-full.png";
	}
	for(var i=index+1;i<btnList.length;i++){
		btnList[i].source="source://image/star-empty.png";
	}
	
	var d={};
	d.token=txtTitle.tag;
	d.score=index+1;
	page.fire("scoreRefresh",d);
};