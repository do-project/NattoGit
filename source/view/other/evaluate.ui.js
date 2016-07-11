var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var open = require("open");
var data = page.getData();
var $U = require("url");
var rootview = ui("$");
var number = ui("do_Label_8");
var score = ui("do_Label_3");
var title = ui("do_Label_5");
var listbg = ui("listviewbody");
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,300);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;

var isMore = false;

var imageBrowser = sm("do_ImageBrowser");
var imgToken = [];


var pbar = ui(rootview.add("loadings","source://view/cells/loading2.ui",0,567));

var param = {size:10,index:1};
page.supportPanClosePage();
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
})

page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	number.text = data[3];
	score.text = data[2];
	title.text = data[1];
	
	evaluateLoad();
});

function evaluateLoad(){
	if(isMore) param.index++;
	eval_http.url = $U.url.gainEval+"?size="+param.size+"&index="+param.index+"&ser_id=1&token="+data[0]; // 请求的 URL
	eval_http.request();
}

var evalData = mm("do_ListData");
var evalgridview = ui("do_ListView_2");
evalgridview.bindItems(evalData);

var eval_http = mm("do_Http");
eval_http.method = "POST";// GET | POST
eval_http.timeout = 60000; // 超时时间 : 单位 毫秒
eval_http.contentType = "application/json"; // Content-Type
eval_http.on("success", function(databus) {
	if(param.index==1){
		evalData.removeAll();
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "该店铺还没有评价哦!";
		if(databus.rows.length==0){
			tipFace_ui.visible = true;
		}else{
			tipFace_ui.visible = false;
		}
		imgToken=[];
	}else if(databus.rows.length==0){
		nf.toast("没有更多评价了");
		param.index--;
	}
	pbar.visible = false;
	evalData.addData(databus.rows);
	for(var i=0;i<databus.rows.length;i++){
		var img = databus.rows[i].eivm;
		if(img.length>0){
			imgToken[imgToken.length] = {token:databus.rows[i].token,imgList:[]};
			for(var j=0;j<img.length && j<4;j++){
				var imgList = {source:img[j].originalImage};
				var m = imgToken[imgToken.length-1].imgList.length;
				imgToken[imgToken.length-1].imgList[m] = imgList;
			}
		}
		evalData.updateOne(i+(param.size*(param.index-1)), {
			"template": img.length>0? 1:0,
			"token": databus.rows[i].token,
			"userpath":databus.rows[i].userpath,
			"username":databus.rows[i].username,
			"evaluateTime":databus.rows[i].evaluateTime,
			"reply":"商家回复:"+databus.rows[i].reply,
			"replyVisible":databus.rows[i].reply==null? false:true,
			"otherScore":databus.rows[i].otherScore,
			"content":databus.rows[i].content,
			"img1":img.length>0? img[0].thumbnail:"",
			"oimg1":img.length>0? img[0].originalImage:"",
			"img2":img.length>1?img[1].thumbnail:"",
			"oimg2":img.length>1?img[1].originalImage:"",
			"img3":img.length>2?img[2].thumbnail:"",
			"oimg3":img.length>2?img[2].originalImage:"",
			"img4":img.length>3?img[3].thumbnail:"",
			"oimg4":img.length>3?img[3].originalImage:""
		});
	}
	evalgridview.refreshItems();
	evalgridview.rebound();
}).on("fail", function(data) {
	rootview.add("loadings","source://view/other/tipInterface/tipFace.ui",0,300)
});

evalgridview.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	isMore = true;
	evaluateLoad();
});

page.on("ImgShow",function(data){
	for(var i=0;i<imgToken.length;i++){
		if(imgToken[i].token==data[1]){
			imageBrowser.show(imgToken[i].imgList, data[0]);
		}
	}
});