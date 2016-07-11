var page = sm("do_Page");
var app = sm("do_App");
var open = require("open");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var global = sm("do_Global");

var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var rootview = ui("$");
var $U = require("url");
var city_node = global.getMemory("city");
var Euc = encodeURIComponent;

//选择图片. 别和评论的给搞混了!!可以选择6张照片!!!!!
deviceone.param={oImg:[],img:[]};
//选择的图片不需要裁切.直接选择进去上传
var selhdpic = ui(rootview.add("headpic", "source://view/cells/selectPic2.ui", 0, 0));
selhdpic.visible = false;

var loadbg = rootview.add("loadingbg", "source://view/cells/loadingyes.ui", 0, 0);
var loadbg_ui=ui(loadbg);
loadbg_ui.visible=false;
var loadbg_label=ui(loadbg + ".do_Label_1");

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back","",300, function(){
	app.closePage();
}).on("loaded",function(){
	beanImg();  //显示图片
}).on("imageModel",function(){
	page.hideKeyboard();
	page.fire("animShows",6-deviceone.param.oImg.length);  //可上传的图片数量
}).on("UploadPicture",function(data){
	if(typeof data=="string"){
		deviceone.param.oImg[deviceone.param.oImg.length] = {index:deviceone.param.oImg.length,path:data};
	}else if(typeof data=="object"){
		data.forEach(function(d,i){
			deviceone.param.oImg[deviceone.param.oImg.length] = {index:deviceone.param.oImg.length,path:d};
		});
	}
	beanImg();  //显示图片
}).on("deleteImage",function(data){
	page.hideKeyboard();
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
			beanImg();  //显示图片
		}
	});
});


var supportData = mm("do_ListData");
var supportgrid = ui("do_GridView_1");
supportgrid.bindItems(supportData);

function beanImg(){
	supportData.removeAll();
	supportData.addData(deviceone.param.oImg);
	for(var i=0;i<deviceone.param.oImg.length;i++){
		var _data=deviceone.param.oImg[i];
		supportData.updateOne(i,{
			"index":_data.index,
			"path":_data.path,
			"enabled":false,
			"show":true
		});
	}
	if(deviceone.param.oImg.length<6){
		supportData.addOne({path:"source://image/addimgs.png",enabled:true,"show":false}, deviceone.param.oImg.length);
	}
	supportgrid.refreshItems();
}


//添加豆圈图片
supportgrid.on("touch",function(index){
	page.fire("animShows",true);
});


var scrollv = ui("do_ScrollView_1");
scrollv.on("scroll",function(){
	page.hideKeyboard();
});
var linerabg = ui("do_LinearLayout_1");
linerabg.on("touch",function(){
	page.hideKeyboard();
});

var msg = ui("do_TextBox_1");
var btn = ui("do_Button_1");
btn.on("touch","",300,function(){
	if(msg.text.trim()==""){
		msg.setFocus(true);
		nf.alert("请输入内容","提示");
	}else{
		nf.confirm({text:"确认发表豆圈?", title:"操作提示", button1text:"确定", button2text:"取消"}, function(data, e) {
			if(data == 1){
				loadbg_ui.visible=true;
				page.fire("LoadingProgress");
				if(deviceone.param.oImg.length>0){
					loadbg_label.text="正在上传图片";
					deviceone.param.index=0;
					imgUpoad(deviceone.param.index);
				}else{
					loadbg_label.text="正在提交";
					BeanContent();
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
		BeanContent();
	}
}

var http_upload;
http_upload = mm("do_Http");
http_upload.timeout = 30000;
http_upload.contentType = "audio/wav";
http_upload.url = $U.token($U.url.appUploadBeanImages,"user");
 
http_upload.on("success", function(data) {
	if(parseInt(data.error_code)==0){
		loadbg_label.text = "上传中:("+deviceone.param.oImg.length+"/"+deviceone.param.index+")";
		deviceone.param.index++;
		deviceone.param.img[deviceone.param.img.length]={token:data.token,path:deviceone.param.defaultImg};
		
		
		imgUpoad(deviceone.param.index);
	}else{
		deviceone.param.img = [];
		nf.alert(data.reason,"第"+(deviceone.param.index+1)+"张图片");
		loadbg_ui.visible = false;
	}
});

function BeanContent(){
	var _imgStr="";
	for(var i=0;i<deviceone.param.img.length;i++){
		var _data=deviceone.param.img[i]; 
		_imgStr+=_data.token+",";
	}
	_imgStr=_imgStr==""? "":_imgStr.substring(0,_imgStr.length-1);
	
	request_http.url = $U.token($U.url.appPublishBean,"user")+"&city="+city_node+"&imgList="+Euc(_imgStr)+"&msg="+Euc(msg.text); // 请求的 URL
	request_http.request();
}

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.error_code==0){
		page.fire("LoadingComplete");
		loadbg_label.text = "发表成功";
		app.closePage("success");
	}else{
		loadbg_ui.visible = false;
		nf.toast("服务器无响应");
	}
});