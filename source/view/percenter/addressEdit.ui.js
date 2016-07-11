var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var $U = require("url");
var nf = sm("do_Notification");
var rootview = ui("$");
var global = deviceone.sm("do_Global");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var city_node = global.getMemory("city");
var Euc = encodeURIComponent;
var areaList = ui(rootview.add("areaList","source://view/outbound/areaselect.ui",0,0));
areaList.visible = false;

var _areaId = "";

var token = page.getData();
var btnSubmit = ui("do_Button_3");


var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	var url = "";
	if(token!=""){
		url = $U.url.appStoreArea+"?store="+Euc(token);
	}
	area_http.url = url;
	area_http.request();
}).on("refreshArea",function(data){
	_area.text = data[1];
	_areaId = data[0];
	_area.fontColor="000000FF";
});
rootview.on("touch",function(){
	page.hideKeyboard();
});

//switch切换开关
var swbox = ui("switch_box");
var swbg = ui("switch_bg");
var swbtn = ui("switch_btn");
swbox.on("touch",function(){
	swbtn.animate(buttonAS);
	if(swbg.bgColor == "AFAFAFFF"){
		_default = true;
		swbtn.x = 65;
		swbtn.redraw();
		swbg.bgColor = "4DD965FF";
	}else{
		_default = false;
		swbtn.x = 5;
		swbtn.redraw();
		swbg.bgColor = "AFAFAFFF";
	}
});
var _name = ui("do_TextField_1");      //姓名
var _mobile = ui("do_TextField_2");    //手机号码
var _area = ui("do_Label_14");         //区域
var _address = ui("do_TextField_4");   //地址
var _zip = ui("do_TextField_5");       //邮编
var _default = false;
var btnArea = ui("do_ALayout_6");
btnArea.on("touch",function(){
	page.hideKeyboard();
	//areaList.visible = true;
	page.fire("panelshows","true");
});
//添加按钮事件
btnSubmit.on("touch",function(){
	var _reg = /^1[3|4|5|8][0-9]\d{8}$/;
	if(_name.text.trim()==""){
		nf.toast("请输入收货人姓名");
		_name.setFocus(true);
	}else if(!_reg.test(_mobile.text)){
		nf.toast("请输入正确的手机号码");
		_mobile.setFocus(true);
	}else if(_areaId==""){
		nf.toast("请选择区域");
	}else if(_address.text.trim()==""){
		nf.toast("请输入地址");
		_address.setFocus(true);
	}else if(_zip.text!="" && !/\d{6}/.test(_zip.text)){
		nf.toast("邮编输入不正确");
		_zip.setFocus(true);
	}else{
		request_http.url = $U.token($U.url.appUpdateShipAddress,"user")+"&city="+city_node+"&area="+Euc(_areaId)+"&name="+Euc(_name.text.trim())+"&mobile="+Euc(_mobile.text)+"&address="+Euc(_address.text.trim())+"&zip="+Euc(_zip.text.trim())+"&defaule="+_default+"&id=";
		request_http.request();
	}
});
//加载区域
var area_http = mm("do_Http");
area_http.method = "POST";// GET | POST
area_http.timeout = 60000; // 超时时间 : 单位 毫秒
area_http.contentType = "application/json"; // Content-Type
area_http.on("success", function(databus) {
	page.fire("areaList",databus);
});
//添加收货地址
var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus.error_code==0){
		app.closePage(1);
	}else{
		nf.toast("网络连接异常");
	}
});

//scroll
var scrollbg = ui("do_ScrollView_1");
scrollbg.on("scroll",function(){
	page.hideKeyboard();
});