var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var Euc = encodeURIComponent;

var loadbg = rootview.add("loadingbg", "source://view/cells/loadingyes.ui", 0, 0);
var loadbg_ui=ui(loadbg);
loadbg_ui.visible=false;
var loadbg_label=ui(loadbg + ".do_Label_1");

var selhdpic = ui(rootview.add("headpic", "source://view/cells/selectPic1.ui", 0, 0));
selhdpic.visible = false;

var orderno = page.getData();

deviceone.param={score:[],img:[],anonymity:false,oImg:[]};

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	class_http.url = $U.token($U.url.appEvaluateClass,"user")+"&no="+orderno; // 请求的 URL
	class_http.request();
	
	evaluateImg();
}).on("scoreRefresh",function(d){
	var _token=d.token;
	var _score=d.score;
	for(var i=0;i<deviceone.param.score.length;i++){
		var _data=deviceone.param.score[i];
		if(_data.token==_token){
			_data.score=_score;
		}
	}
}).on("UploadPicture",function(data){   //上传图片
	if(typeof data=="string"){
		deviceone.param.oImg[deviceone.param.oImg.length] = {index:deviceone.param.oImg.length,path:data};
	}else if(typeof data=="object"){
		data.forEach(function(d,i){
			deviceone.param.oImg[deviceone.param.oImg.length] = {index:deviceone.param.oImg.length,path:d};
		});
	}
	evaluateImg();  //显示图片
}).on("imageModel",function(){
	page.fire("animShows",4-deviceone.param.oImg.length);  //可上传的图片数量
}).on("deleteImage",function(data){
	nf.confirm("确认删除图片？", "评价图片", "确认", "取消", function(num, e) {
		if(num==1){
			var json = [];
			for(var i=0;i<deviceone.param.oImg.length;i++){
				var _data=deviceone.param.oImg[i];
				if(_data.index!=data){
					json[json.length] = _data;
				}
			}
			deviceone.param.oImg = json;
			
			evaluateImg();  //显示图片
		}
	});
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
		deviceone.param.anonymity=true;
	}else{
		swbtn.x = 5;
		swbtn.redraw();
		swbg.bgColor = "AFAFAFFF";
		deviceone.param.anonymity=false;
	}
});

var tcbody = ui("do_LinearLayout_1");
tcbody.on("touch",function(){
	page.hideKeyboard();
});

//评星列表
var datapx = mm("do_ListData");
var girdpx = ui("do_GridView_1");
girdpx.bindItems(datapx);

var class_http = mm("do_Http");
class_http.method = "POST";// GET | POST
class_http.timeout = 60000; // 超时时间 : 单位 毫秒
class_http.contentType = "application/json"; // Content-Type
class_http.on("success", function(databus) {
	datapx.addData(databus);
	for(var i=0;i<databus.length;i++){
		datapx.updateOne(i, {
			"token":databus[i].token,
			"title":databus[i].title
		});
		deviceone.param.score[deviceone.param.score.length]={token:databus[i].token,score:0};
	}
	girdpx.refreshItems();
});


var datafk = mm("do_ListData");
var listyjfk = ui("do_GridView_yjfk");
listyjfk.bindItems(datafk);
//加载图片
function evaluateImg(){
	datafk.removeAll();
	datafk.addData(deviceone.param.oImg);
	for(var i=0;i<deviceone.param.oImg.length;i++){
		var _data=deviceone.param.oImg[i];
		datafk.updateOne(i,{
			"index":_data.index,
			"path":_data.path,
			"enabled":false,
			"show":true
		});
	}
	if(deviceone.param.oImg.length<4){
		datafk.addOne({path:"source://image/addimgs.png",enabled:true,"show":false}, deviceone.param.oImg.length);
	}
	listyjfk.refreshItems();
}

var txtContent=ui("do_TextBox_2");
//提交评价
var btnSubmit=ui("do_Button_1");
btnSubmit.on("touch","",300,function(){
	if(txtContent.text.trim()==""){
		nf.toast("请输入评价内容");
		txtContent.setFocus(true);
	}else{
		nf.confirm({text:"确认提交评价信息?", title:"操作提示", button1text:"确定", button2text:"取消"}, function(data, e) {
			if(data == 1){
				loadbg_ui.visible=true;
				page.fire("LoadingProgress");
				if(deviceone.param.oImg.length>0){
					loadbg_label.text="正在上传图片";
					deviceone.param.index=0;
					imgUpoad(deviceone.param.index);
				}else{
					loadbg_label.text="正在提交";
					EvaluationContent();
				}
			}
		});
	}
});

//多张图片上传
function imgUpoad(index){
	if(index<deviceone.param.oImg.length){
		var _data=deviceone.param.oImg[index];
		http_upload.upload(_data.path, "file");
	}else{
		EvaluationContent();
	}
}

function EvaluationContent(){
	var _score=""; //评价分数
	for(var i=0;i<deviceone.param.score.length;i++){
		var _data=deviceone.param.score[i];
		_score+=_data.token+":"+_data.score+",";
	}
	_score=_score==""? "":_score.substring(0,_score.length-1);
	//图片
	var _imgStr="";
	for(var i=0;i<deviceone.param.img.length;i++){
		var _data=deviceone.param.img[i]; 
		_imgStr+=_data.token+",";
	}
	_imgStr=_imgStr==""? "":_imgStr.substring(0,_imgStr.length-1);
	request_http.url = $U.token($U.url.appEvaluate,"user")+"&no="+orderno+"&score="+Euc(_score)+"&img="+Euc(_imgStr)+"&msg="+Euc(txtContent.text)+"&anonymity="+deviceone.param.anonymity; // 请求的 URL
	request_http.request();
}

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.error_code==0){
		page.fire("LoadingComplete");
		loadbg_label.text = "评价完成";
		app.closePage(-1);
	}else{
		nf.toast("评价提交失败");
	}
});

var http_upload;
http_upload = mm("do_Http");
http_upload.timeout = 30000;
http_upload.contentType = "audio/wav";
http_upload.url = $U.token($U.url.appUploadEvaluate,"user");
 
http_upload.on("success", function(data) {
	if(parseInt(data.error_code)==0){
		loadbg_label.text = "上传中:("+deviceone.param.oImg.length+"/"+deviceone.param.index+")";
		deviceone.param.index++;
		deviceone.param.img[deviceone.param.img.length]={token:data.token};
		
		imgUpoad(deviceone.param.index);
	}else{
		deviceone.param.img = [];
		nf.alert(data.reason,"第"+(deviceone.param.index+1)+"张图片");
		loadbg_ui.visible = false;
	}
});