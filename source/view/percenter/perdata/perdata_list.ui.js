var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var $U = require("url");
var nf = sm("do_Notification");
var imageBrowser = sm("do_ImageBrowser");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var data_cache = sm("do_DataCache");
var loadbg = rootview.add("loadingbg", "source://view/cells/loadingyes.ui", 0, 148);
var loadbg_ui=ui(loadbg);
loadbg_ui.visible=false;
var loadbg_label=ui(loadbg + ".do_Label_1");
var login_file = "data://security/login";
var _headImg="";
var imgList=[];
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

var param={nickName:"",sex:"null",phone:"",paypass:false}

page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	infoLoad();
}).on("result",function(data){
	infoLoad();
	if(data!="" && data.type==1){
		loadbg_ui.visible=true;
		page.fire("LoadingProgress");
		loadbg_label.text="上传中";
		_headImg=data.path;
		http_upload.upload(data.path, "file");
	}
});
//选取头像
var selhead = ui("do_ALayout_selhead");
var selhdpic = ui(rootview.add("headpic", "source://view/cells/selectPic.ui", 0, 0));
selhdpic.visible = false;

selhead.on("touch","",300,function(){
	selhead.animate(buttonA,function(){
		selhdpic.visible = true;
		page.fire("animShows","true");
	});
});
//头像
var headimg = ui("do_Imagehead");
//读取默认图片
var _img=data_cache.loadData({key:"HeadImg"});
if(_img!=""){
	headimg.defaultImage=_img;  //更改默认图片
}
headimg.on("touch","",300,function(){
	headimg.animate(buttonAS,function(){
		imageBrowser.show(imgList, 0);
	});
});

//昵称
var namenick = ui("nickname");
namenick.on("touch","",300,function(){
	namenick.animate(buttonA,function(){
		open.start("source://view/percenter/perdata/nickname.ui",param.nickName);
	});
});
//性别
var selsexy = ui("sexysel");
selsexy.on("touch","",300,function(){
	selsexy.animate(buttonA,function(){
		open.start("source://view/percenter/perdata/sexy.ui",param.sex);
	});
});

//手机验证
var verifyphone = ui("phoneverify");
verifyphone.on("touch","",300,function(){
	verifyphone.animate(buttonA,function(){
		if(param.phone!=null && param.phone!=""){
			open.start("source://view/percenter/perdata/phoneverify.ui",param.phone);
		}else{
			open.start("source://view/percenter/perdata/phoneverify1.ui",1);
		}
	});
});
//账号安全
var safeaccount = ui("accountsafe");
safeaccount.on("touch","",300,function(){
	safeaccount.animate(buttonA,function(){
		open.start("source://view/percenter/perdata/accountSafe.ui",param.paypass);
	});
});

function infoLoad(){
	request_http.url = $U.token($U.url.appPersonalData,"user");
    request_http.request();
}

var nickname=ui("do_Label_5");  //昵称
var sex=ui("do_Label_7");       //性别
var phone=ui("do_Label_9");     //手机

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.path!=null && databus.path!=""){
		headimg.source=databus.path;
		imgList[0]={source : databus.maxPath, init : databus.path};
	}
	if(databus.nickname!=null && databus.nickname!=""){
		nickname.text=databus.nickname;
	}
	if(databus.sex!=null){
		sex.text=databus.sex==0? "男":"女";
		param.sex=databus.sex.toString();
	}else{
		sex.text="保密";
		param.sex="null";
	}
	if(databus.bindPhone!=null && databus.bindPhone!=""){
		param.phone=databus.bindPhone;
		phone.text=databus.bindPhone;
	}
	param.nickName=databus.nickname;
	param.paypass=databus.setPayPass;
	
	namenick.enabled=true;
	selsexy.enabled=true;
	verifyphone.enabled=true;
	safeaccount.enabled=true;
	selhead.enabled=true;
	
	//头像原图   databus.maxPath
});


var http_upload;
http_upload = mm("do_Http");
http_upload.timeout = 30000;
http_upload.contentType = "audio/wav";
http_upload.url = $U.token($U.url.appUploadHeadPortrait,"user");
 
http_upload.on("success", function(data) {
	if(data.error_code==0){
		page.fire("LoadingComplete");
		loadbg_label.text="上传完成";
		headimg.defaultImage=_headImg;  //更改默认图片
		headimg.source=data.reason;
		data_cache.saveData({key:"HeadImg", value:_headImg});
		
		imgList[0]={source : data.reason, init : _headImg};
	}else{
		nf.toast(data.reason);
	}
	page.fire("LoadingHide");
});
http_upload.on("fail", function(data) {
    nf.toast("上传失败");
});
http_upload.on("progress", function(data) {
	loadbg_label.text="正在上传";
});