var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var $U = require("url");
var nf = sm("do_Notification");
var rootview = ui("$");
var global = sm("do_Global");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var Euc = encodeURIComponent;
var id = page.getData();
var provinceList = ui(rootview.add("provinceList","source://view/percenter/province.ui",0,0));
provinceList.visible = false;
var areaList = ui(rootview.add("areaList","source://view/outbound/areaselect.ui",0,0));
areaList.visible = false;

var param = {areaError:true,def:false};
deviceone.city="";  //已选择的城市
deviceone.area="";  //已选择区域

var btnSubmit = ui("do_Button_3");

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
var _city = ui("do_Label_20");   //省市

page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	if(id!=""){
		gain_http.url = $U.token($U.url.appShipSingle,"user")+"&token="+Euc(id);
		gain_http.request();
	}else{
		cityLoad();
	}
}).on("refreshArea",function(data){
	_area.text = data[1];
	deviceone.area = data[0];
	_area.fontColor="000000FF";
}).on("refreshCity",function(data){
	_city.text=data.title;
	deviceone.city=data.node;
	_city.fontColor="000000FF";
	deviceone.area="";
	areaLoad();
}).on("defaultCity",function(data){
	_city.text = data;
	_city.fontColor="000000FF";
	areaLoad();
}).on("defaultArea",function(data){
	_area.text = data;
	_area.fontColor="000000FF";
});
rootview.on("touch",function(){
	page.hideKeyboard();
});

//城市加载
function cityLoad(){
	city_http.url = $U.url.appProvinceList;
	city_http.request();
}
//区域加载
function areaLoad(){
	area_http.url = $U.url.areaList+"?city="+deviceone.city;
	area_http.request();
}

//switch切换开关
var swbox = ui("switch_box");
var swbg = ui("switch_bg");
var swbtn = ui("switch_btn");
swbox.on("touch",function(){
	swbtn.animate(buttonAS);
	if(swbg.bgColor == "AFAFAFFF"){
		param.def = true;
		swbtn.x = 65;
		swbtn.redraw();
		swbg.bgColor = "4DD965FF";
	}else{
		param.def = false;
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
var btnArea = ui("do_ALayout_6");
btnArea.on("touch",function(){
	page.hideKeyboard();
	if(deviceone.city!=""){
		if(param.areaError){
			//areaList.visible = true;
			page.fire("panelshows","true");
		}else{
			nf.toast("没有获取到区域信息");
		}
	}else{
		nf.toast("请先选择所在地");
	}
});
var btnCity = ui("do_ALayout_13");
btnCity.on("touch",function(){
	page.hideKeyboard();
	provinceList.visible = true;
	page.fire("citysels","true");
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
	}else if(deviceone.city==""){
		nf.toast("请选择所在地");
	}else if(_address.text.trim()==""){
		nf.toast("请输入地址");
		_address.setFocus(true);
	}else if(_zip.text!="" && !/\d{6}/.test(_zip.text)){
		nf.toast("邮编输入不正确");
		_zip.setFocus(true);
	}else{
		request_http.url = $U.token($U.url.appUpdateShipAddress,"user")+"&city="+deviceone.city+"&area="+Euc(deviceone.area)+"&name="+Euc(_name.text.trim())+"&mobile="+Euc(_mobile.text)+"&address="+Euc(_address.text.trim())+"&zip="+Euc(_zip.text.trim())+"&defaule="+param.def+"&id="+Euc(id);
		request_http.request();
	}
});
//加载区域
var area_http = mm("do_Http");
area_http.method = "POST";// GET | POST
area_http.timeout = 60000; // 超时时间 : 单位 毫秒
area_http.contentType = "application/json"; // Content-Type
area_http.on("success", function(databus) {
	_area.text = "选择地区";
	_area.fontColor="999999FF";
	if(databus.length>0){
		param.areaError=true;
		page.fire("areaList",databus);
	}else{
		param.areaError=false;
	}
	
});
//省市加载
var city_http = mm("do_Http");
city_http.method = "POST";// GET | POST
city_http.timeout = 60000; // 超时时间 : 单位 毫秒
city_http.contentType = "application/json"; // Content-Type
city_http.on("success", function(databus) {
	page.fire("cityList",databus);
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
//获取收货地址
var gain_http = mm("do_Http");
gain_http.method = "POST";// GET | POST
gain_http.timeout = 60000; // 超时时间 : 单位 毫秒
gain_http.contentType = "application/json"; // Content-Type
gain_http.on("success", function(databus) {
	if(databus!=-1){
		_name.text = databus.name;
		_mobile.text=databus.phone;
		_address.text=databus.address;
		_zip.text=databus.zip;
		if(databus.shipDefault){
			param.def = true;
			swbtn.x = 65;
			swbtn.redraw();
			swbg.bgColor = "4DD965FF";
		}
		if(databus.district!=""){
			deviceone.city=databus.district;
		}else if(databus.city!=""){
			deviceone.city=databus.city;
		}else{
			deviceone.city=databus.province;
		}
		
		deviceone.area=databus.area;
		
		cityLoad();//加载城市
	}else{
		nf.toast("网络连接异常")
	}
});

//scroll
var scrollbg = ui("do_ScrollView_1");
scrollbg.on("scroll",function(){
	page.hideKeyboard();
});