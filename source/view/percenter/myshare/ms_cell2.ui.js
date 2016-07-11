var root = ui("$");
var page = sm("do_Page");

root.setMapping({
	"do_Label_14.text" : "genTime",
	"do_Label_14.tag" : "index",
	"userfxtext.text" : "msg",
	"do_Label_13.text" : "praise",
	"do_ImageView_10.source":"praisea",
	"do_ImageView_1.source":"img1",
	"do_ImageView_1.visible":"vimg1",
	"do_ImageView_1.tag":"timg1",
	"do_ImageView_2.source":"img2",
	"do_ImageView_2.visible":"vimg2",
	"do_ImageView_2.tag":"timg2",
	"do_ImageView_3.source":"img3",
	"do_ImageView_3.visible":"vimg3",
	"do_ImageView_3.tag":"timg3",
	"do_ImageView_4.source":"img4",
	"do_ImageView_4.visible":"vimg4",
	"do_ImageView_4.tag":"timg4",
	"do_ImageView_5.source":"img5",
	"do_ImageView_5.visible":"vimg5",
	"do_ImageView_5.tag":"timg5",
	"do_ImageView_6.source":"img6",
	"do_ImageView_6.visible":"vimg6",
	"do_ImageView_6.tag":"timg6"
});

var data = ui("do_Label_14");
var praisea = ui("do_ALayout_10");
praisea.on("touch","",300,function(){
	page.fire("Praisea",data.tag);
});


var img1 = ui("do_ImageView_1");
var img2 = ui("do_ImageView_2");
var img3 = ui("do_ImageView_3");
var img4 = ui("do_ImageView_4");
var img5 = ui("do_ImageView_5");
var img6 = ui("do_ImageView_6");

var imgList = [img1,img2,img3,img4,img5,img6];

imgList.forEach(function(img, i) {
	img.on("touch", function(datac, e) {
		if(img.source!=""){
			page.fire("ImageBrowser",{index:i,array:imgArray()});
		}
	});
});

var imgArray = function(){
	var _imgArray = [];
	imgList.forEach(function(img, i) {
		if(img.source!=""){
			_imgArray[_imgArray.length] = img.tag;
		}
	});
	return _imgArray;
};

var del = ui("do_ALayout_12");
del.on("touch","",300,function(){
	page.fire("DeleteBean",data.tag);
});