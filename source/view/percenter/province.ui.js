var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var param = {province:[],city:[],district:[],selected:[]};

//遮罩显示
var animMaskShow = mm("do_Animator");
var propsMS = {bgColor:"00000077"};
animMaskShow.append(300,propsMS,"EaseOut");
//面板显示
var animPanelShow = mm("do_Animator");
var propsPS = {y:634};
animPanelShow.append(300,propsPS,"Linear");
//遮罩隐藏
var animMaskHide = mm("do_Animator");
var propsMH = {bgColor:"00000000"};
animMaskHide.append(300,propsMH,"EaseIn");
//面板隐藏
var animPanelHide = mm("do_Animator");
var propsPH = {y:1334};
animPanelHide.append(300,propsPH,"EaseIn");

//遮罩事件
var maskbg = ui("bgmask");
maskbg.on("touch","",300,function(){
	maskbg.animate(animMaskHide,function(){
		maskbg.visible = false;
	});
	bodyp.animate(animPanelHide);
});
//防止穿透
var bodyp = ui("pbody");
bodyp.on("touch","",300,function(){
	
});
//确定
var surebtn = ui("do_Button_sure");
surebtn.on("touch","",300,function(){
	if(param.selected!="" && param.selected.node!=undefined && param.selected.node!=""){
		page.fire("refreshCity",param.selected);
	}
	maskbg.animate(animMaskHide,function(){
		maskbg.visible = false;
	});
	bodyp.animate(animPanelHide);
});
//zdy
page.on("citysels",function(data){
	maskbg.visible = data;
	maskbg.animate(animMaskShow);
	bodyp.animate(animPanelShow);
});
var provincepick = ui("do_Picker_province");
var provincedate = mm("do_ListData");

//获取省
page.on("cityList",function(data){
	param.province=data;
	provincedate.removeAll();
	
	var province = [];
	var _index = 0;
	for(var i=0;i<data.length;i++){
		province[province.length] = data[i].title;
		if(deviceone.city!="" && deviceone.city.substring(0,2)+"0000"==data[i].node){
			_index=i;
		}
	}
	
	provincedate.addData(province);
	provincepick.bindItems(provincedate);
	provincepick.refreshItems();
	
	if(deviceone.city!=""){
		provincepick.index=_index;
		param.city = data[_index];
	}else{
		param.city = data[0];
	}
	cityLoad(param.city);
});


//省滑动
provincepick.on("selectChanged",function(index){
	param.city = param.province.length>0? param.province[index]:param.province;
	cityLoad(param.city);
});


var citypick = ui("do_Picker_city");
var citydata = mm("do_ListData");
//城市选择
citypick.on("selectChanged",function(index){
	param.district=param.city.cvm.length>0? param.city.cvm[index]:param.city;
	districtLoad(param.district)
});
///加载市
function cityLoad(data){
	citydata.removeAll();
	var city = [];
	var _cvm = [];
	var _index=0;
	if(data.cvm.length>0){
		for(var i=0;i<data.cvm.length;i++){
			city[city.length]=data.cvm[i].title;
			if(deviceone.city!="" && deviceone.city.substring(0,4)+"00"==data.cvm[i].node){
				_index=i;
			}
		}
		if(deviceone.city!=""){
			_cvm = data.cvm[_index];
		}else{
			_cvm = data.cvm[0];
		}
	}else{
		city[city.length]=data.title;
		_cvm = data;
		if(deviceone.city!=""){
			_index = provincepick.index;
		}
	}
	
	citydata.addData(city);
	citypick.bindItems(citydata);
	citypick.refreshItems();
	
	if(deviceone.city!=""){
		citypick.index = _index;
	}
	param.district=_cvm;
	districtLoad(_cvm);
}

var districtpick = ui("do_Picker_district");
var districtdata = mm("do_ListData");
//加载区
function districtLoad(data){
	districtdata.removeAll();
	var district=[];
	var _cvm = [];
	var _index=0;
	if(data.cvm.length>0){
		for(var i=0;i<data.cvm.length;i++){
			district[district.length]=data.cvm[i].title;
			if(deviceone.city!="" && deviceone.city==data.cvm[i].node){
				_index=i;
			}
		}
		if(deviceone.city!=""){
			_cvm = data.cvm[_index];
		}else{
			_cvm = data.cvm[0];
		}
	}else{
		district[district.length]=data.title;
		_cvm=data;
		if(deviceone.city!=""){
			_index = citypick.index;
		}
	}
	
	districtdata.addData(district);
	districtpick.bindItems(districtdata);
	districtpick.refreshItems();
	
	if(deviceone.city!=""){
		districtpick.index = _index;
		page.fire("defaultCity",districtdata.getOne(_index));
	}
	
	param.selected=_cvm;
}

districtpick.on("selectChanged",function(index){
	param.selected = param.district.cvm.length>0? param.district.cvm[index]:param.district;
});

