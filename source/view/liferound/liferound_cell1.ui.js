var root = ui("$");
var page = sm("do_Page");

root.setMapping({
	"userheadimg.tag":"index",
	"userheadimg.source":"head",
	"username.text":"name",
	"userfxtime.text":"genTime",
	"userfxtext.text":"msg",
	"do_Label_13.text":"praise",
	"do_ImageView_1.source":"img1",
	"do_ImageView_1.visible":"vimg1",
	"do_ImageView_1.tag":"timg1",
	"do_ImageView_2.source":"img2",
	"do_ImageView_2.visible":"vimg2",
	"do_ImageView_2.tag":"timg2",
	"do_ImageView_3.source":"img3",
	"do_ImageView_3.visible":"vimg3",
	"do_ImageView_3.tag":"timg3",
	"do_ImageView_7.source":"praisea"
});

var head = ui("userheadimg");

var img1 = ui("do_ImageView_1");
var img2 = ui("do_ImageView_2");
var img3 = ui("do_ImageView_3");

var imgList = [img1,img2,img3];

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
			_imgArray[_imgArray.length] = {source:img.tag};
		}
	});
	return _imgArray;
};

var praisea = ui("do_ALayout_9");
praisea.on("touch","",300,function(){
	page.fire("Praisea",head.tag);
});
