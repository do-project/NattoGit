var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var global = sm("do_Global");
var open = require("open");
var nf = sm("do_Notification");
var cache = sm("do_CacheManager");
var device = sm("do_Device");
var rootview = ui("$");
var $U = require("url");
var $V = require("version");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var version_file = "data://version";

var login_file = "data://security/login";
var exitbtn = ui("do_Button_exit");
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
var version = ui("do_Label_7");   //版本号
var btnver = ui("do_ALayout_12");  //点击版本号
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	if($U.tokenExist()){
		exitbtn.visible=true;
	}
	var info = device.getInfo();
	var system = "";
	if(info.OS=="android")
		system = "android";
	else if(info.OS=="iPhone OS"){
		system = "ios";
	}
	storage.readFile(version_file, function(data, e) {
		version.text = "v"+data;
	});
	if(system!="ios"){
		btnver.enabled=true;
	}
});

//对比版本号
btnver.on("touch","",300,function(){
	$V.compare(true);
});

//switch切换开关
var swbox = ui("switch_box");
var swbg = ui("switch_bg");
var swbtn = ui("switch_btn");
swbox.on("touch",function(){
	swbtn.animate(buttonAS);
	if(swbg.bgColor == "AFAFAFFF"){
		swbtn.x = 65;
		swbtn.redraw();
		swbg.bgColor = "4DD965FF";
	}else{
		swbtn.x = 5;
		swbtn.redraw();
		swbg.bgColor = "AFAFAFFF";
	}
});


exitbtn.on("touch","",300,function(){
	exitbtn.animate(buttonA,function(){
		nf.confirm("退出登录？", "登出", "确定", "取消", function(data, e) {
			if(data==1){
				storage.deleteFile(login_file, function(data, e) {
					global.setMemory("access_token", "");
					app.closePage("close");
				});
			}
		});
	});
});
//获取图片缓存
var cachelabel = ui("do_Label_5");
cache.getImageCacheSize(function(data) {
	cachelabel.text = parseInt(data)+"KB";
	if(data==0){
		clearCache.enabled = false;
	}else {
		clearCache.enabled = true;
		if(data>=1024){
			cachelabel.text = (data/1024).toFixed(2)+"MB";
		}
	}
});
//清空缓存
var clearCache = ui("do_ALayout_8");
clearCache.on("touch","",300,function(){
	clearCache.animate(buttonA,function(){
		nf.confirm({text:"是否清空缓存",title:"缓存",button1text:"确定",button2text:"取消"},function(datacall,e){
			if(datacall == 1){
				cache.clearImageCache(function(data) {
					if(data=="true"||data=="1"){
						cachelabel.text = "0KB";
						clearCache.enabled = false;
					}
				});
			}
		});
		
	});
});

var abtus = ui("do_ALayout_15");
abtus.on("touch","",300,function(){
	abtus.animate(buttonA,function(){
		open.start("source://view/percenter/aboutUs.ui");
	});
});