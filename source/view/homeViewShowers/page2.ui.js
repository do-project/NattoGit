var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var global = sm("do_Global");
var imageBrowser = sm("do_ImageBrowser");
var city_node = global.getMemory("city");
var rootview = ui("$");
var $U = require("url");
var open = require("open");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var Euc = encodeURIComponent;

var pbar = ui(rootview.add("loadings","source://view/cells/loading2.ui",0,567));
var listbg = ui("listviewbody");
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,350);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;


var param = {isMore:false,isLoading:true,size:15,index:1,praise:-1};
var unpraisea = "source://image/fav_no.png";
var praisea = "source://image/fav_yes.png";


var flag = true;
page.on("page2",function(){
	if(flag){
		beanLoad();
	}
}).on("result",function(data){
	if(data=="success"){
		param.isMore = false;
		param.isLoading = true;
		beanLoad();
	}
	if(data.PraiseIndex!=undefined){
		param.isMore = false;
		param.isLoading = true;
		beanLoad();  //从新加载兜圈
	}
}).on("ImageBrowser",function(data){
	imageBrowser.show(data.array, data.index);
}).on("Praisea",function(data){
	if(!$U.tokenExist()){
		app.openPage({
	    	source : "source://view/loginreg/login.ui",
	    	animationType: "slide_b2t",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "black",
	    	data:{PraiseIndex:data}
	    });
	}else{
		param.praise = data;
		PraiseaSubmit(data);
	}
});

//赞一下
function PraiseaSubmit(index){
	var cell = supportData.getOne(index);
	praise_http.url = $U.token($U.url.appBeanPraise,"user")+"&token="+Euc(cell.token);
	praise_http.request();
}

//加载豆圈
function beanLoad(){
	flag = false;
	if(param.isMore) param.index++;
	else param.index=1;
	if(param.isLoading) {
		tipFace_ui.visible = false;
		pbar.visible = true;
		supportData.removeAll();
		supportgrid.refreshItems();
	}
	else pbar.visible = false;
	request_http.url = $U.token($U.url.appBeanList,"user")+"&size="+param.size+"&index="+param.index+"&city="+Euc(city_node);
    request_http.request();
}

var supportData = mm("do_ListData");
var supportgrid = ui("do_ListView_1");
supportgrid.bindItems(supportData);

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(param.index==1){
		supportData.removeAll();
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "还没有豆圈分享哦!";
		if(databus.length==0){
			tipFace_ui.visible = true;
		}else{
			tipFace_ui.visible = false;
		}
	}else if(databus.length==0){
		nf.toast("没有更多分享了");
		param.index--;
	}
	pbar.visible = false;
	supportData.addData(databus);
	for(var i=0;i<databus.length;i++){
		var data = databus[i];
		var template = 0;
		if(data.bivm!=undefined && data.bivm.length>3){
			template = 2;
		}else if(data.bivm!=undefined && data.bivm.length>0){
			template = 1;
		}
		supportData.updateOne(i+(param.size*(param.index-1)), {
			"template":template,
			"token":data.token,
			"index":i+(param.size*(param.index-1)),
			"head":data.head,
			"name":data.name,
			"genTime":data.genTime,
			"msg":data.msg,
			"praise":data.praise,
			"praisea":data.praisea==true? praisea:unpraisea,
			"img1":data.bivm.length>0? data.bivm[0].thumbnail:"",
			"vimg1":data.bivm.length>0,
			"timg1":data.bivm.length>0? data.bivm[0].originalImage:"",
			"img2":data.bivm.length>1? data.bivm[1].thumbnail:"",
			"vimg2":data.bivm.length>1,
			"timg2":data.bivm.length>1? data.bivm[1].originalImage:"",
			"img3":data.bivm.length>2? data.bivm[2].thumbnail:"",
			"vimg3":data.bivm.length>2,
			"timg3":data.bivm.length>2? data.bivm[2].originalImage:"",
			"img4":data.bivm.length>3? data.bivm[3].thumbnail:"",
			"vimg4":data.bivm.length>3,
			"timg4":data.bivm.length>3? data.bivm[3].originalImage:"",
			"img5":data.bivm.length>4? data.bivm[4].thumbnail:"",
			"vimg5":data.bivm.length>4,
			"timg5":data.bivm.length>4? data.bivm[4].originalImage:"",
			"img6":data.bivm.length>5? data.bivm[5].thumbnail:"",
			"vimg6":data.bivm.length>5,
			"timg6":data.bivm.length>5? data.bivm[5].originalImage:""
		});
	}
	supportgrid.refreshItems();
	supportgrid.rebound();
}).on("fail", function(data) {
	pbar.visible = false;
	var tipLabel = ui(tipFace + ".do_Label_1");
	tipLabel.text = "服务器超时!";
	tipFace_ui.visible = true;
});

supportgrid.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	param.isMore = true;
	param.isLoading = false;
	beanLoad();
}).on("pull",function(data){
	page.fire("pullevent", data);
	if (data.state != 2) return;
	param.isMore = false;
	param.isLoading = false;
	beanLoad();
});
//发表豆圈
var rightbtn = ui("do_ALayout_5");
rightbtn.on("touch","",300,function(){
	rightbtn.animate(buttonA,function(){
		if(!$U.tokenExist()){
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black",
		    	data:{url:"source://view/liferound/writeshare.ui"}
		    });
		}else{
			app.openPage({
		    	source : "source://view/liferound/writeshare.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "black"
		    });
		}
	});
});

var praise_http = mm("do_Http");
praise_http.method = "POST";// GET | POST
praise_http.timeout = 60000; // 超时时间 : 单位 毫秒
praise_http.contentType = "application/json"; // Content-Type
praise_http.on("success", function(databus) {
	if(databus.error_code==0){
		if(param.praise!=-1){
			var cell = supportData.getOne(param.praise);
			cell.praise = cell.praise+1;
			cell.praisea = praisea;
			supportData.updateOne(param.praise, cell);
			supportgrid.refreshItems();
			param.praise = -1;
		}
	}else{
		nf.alert(databus.reason,"赞一下");
	}
});