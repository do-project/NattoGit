var root = ui("$");
var page = sm("do_Page");
root.setMapping({
	"do_ImageView_head.source":"userpath",
	"do_ImageView_head.tag":"token",
	"do_Label_username.text":"username",
	"do_Label_sendtime.text":"evaluateTime",
	"do_Label_sendtextcon.text":"content",
	"do_Label_busniesstext.text" :"reply",
	"do_Label_busniesstext.visible" :"replyVisible",
	"do_Label_aboutpoint.text" :"otherScore",
	"do_ImageView_2.source":"img1",
	"do_ImageView_2.tag":"oimg1",
	"do_ImageView_3.source":"img2",
	"do_ImageView_3.tag":"oimg2",
	"do_ImageView_4.source":"img3",
	"do_ImageView_4.tag":"oimg3",
	"do_ImageView_5.source":"img4",
	"do_ImageView_5.tag":"oimg4"
});
var head = ui("do_ImageView_head");
var imgBtn = [ui("do_ImageView_2"),ui("do_ImageView_3"),ui("do_ImageView_4"),ui("do_ImageView_5")]
imgBtn.forEach(function(dc,i){
	dc.on("touch", function(datac, e) {
		if(dc.source!=""){
			page.fire("ImgShow",[i,head.tag]);
		}
	});
});