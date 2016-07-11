var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var param = {timeList:[],dateJson:[],timeMin:"",currentTime:"",selectedTime:"",selectedDate:""};

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
//自定义事件
page.on("pshows",function(data){
	maskbg.visible = data;
	bodyp.animate(animPanelShow);
	maskbg.animate(animMaskShow);
});
//遮罩事件
var maskbg = ui("bgmask");
maskbg.on("touch","",300,function(){
	bodyp.animate(animPanelHide);
	maskbg.animate(animMaskHide,function(){
		maskbg.visible = false;
	});
});
//防止穿透
var bodyp = ui("pbody");
bodyp.on("touch","",300,function(){
	
});
//确定
var surebtn = ui("do_Button_sure");
surebtn.on("touch","",300,function(){
	this.animate(buttonA,function(){
		if(param.selectedTime.indexOf(':')!=-1){
			page.fire("selectTime",[param.selectedDate,param.selectedTime]);
		}
		bodyp.animate(animPanelHide);
		maskbg.animate(animMaskHide,function(){
			maskbg.visible = false;
		});
	});
});

var datepick = ui("do_Picker_date");
var datadate = mm("do_ListData");

//获取日期
page.on("presetDate",function(data){
	datadate.removeAll();
	param.dateJson = [];
	param.timeList = data.timeList;
	param.timeMin = data.timeMin;
	param.currentTime = data.currentTime;
	param.selectedTime = data.selectedTime;
	//日期
	var begin = new Date(data.timeMin);
	var end = new Date(data.timeMax);
	while(begin<=end){
		param.dateJson[param.dateJson.length] = begin.getFullYear()+"/"+(begin.getMonth()+1)+"/"+begin.getDate();
		begin.setDate(begin.getDate()+1);
	}
	datadate.addData(param.dateJson);
	datepick.bindItems(datadate);
	datepick.refreshItems();
	
	var cell = datadate.getOne(datepick.index);
	param.selectedDate = GetReserveDate(cell);
	
	//时间
	var _time = "";
	if(new Date(data.selectedDate).toLocaleString()==new Date(data.timeMin).toLocaleString()){
		_time = presetTime(data.timeList[0].title,data.currentTime);
	}
	timeLoad(_time);
});


//日期滑动
datepick.on("selectChanged",function(index){
	var cell = datadate.getOne(index);
	param.selectedDate = GetReserveDate(cell);
	var _time = "";
	if(new Date(param.timeMin).toLocaleString()==new Date(cell).toLocaleString()){
		_time = presetTime(param.timeList[0].title,param.currentTime);
	}
	timeLoad(_time);
});

//时间选择
var timepick = ui("do_Picker_time");
var datapick = mm("do_ListData");

timepick.on("selectChanged",function(index){
	var cell = datapick.getOne(index);
	//nf.alert(cell);
	param.selectedTime=cell;
});

function timeLoad(_time){
	datapick.removeAll();
	var timeJson = [];
	for(var i=0;i<param.timeList.length;i++){
		if(param.timeList[i].title>=_time){
			timeJson[timeJson.length] = param.timeList[i].title;
		}
	}
	if(timeJson.length==0){
		timeJson[0] = "没有可预订的时间";
	}
	
	datapick.addData(timeJson);
	timepick.bindItems(datapick);
	timepick.refreshItems();
	
	var cell = datapick.getOne(timepick.index);
	param.selectedTime=cell;
}

function presetTime(beginTime,currentTime){
	var dayTime = "";
	if(beginTime<currentTime){
		if(currentTime.split(':')[1]!="00" && currentTime.split(':')[1]!="30"){
			if(parseInt(currentTime.split(':')[1])<30){
				dayTime = (parseInt(currentTime.split(':')[0])+1)+":30";
			}else{
				dayTime = (parseInt(currentTime.split(':')[0])+2)+":00";
			}
		}else{
			dayTime = (parseInt(currentTime.split(':')[0])+1)+":"+currentTime.split(':')[1];
		}
	}else{
		if(beginTime.split(':')[1]!="00" && beginTime.split(':')[1]!="30"){
			if(parseInt(beginTime.split(':')[1])<30){
				dayTime = (parseInt(beginTime.split(':')[0])+1)+":30";
			}else{
				dayTime = (parseInt(beginTime.split(':')[0])+2)+":00";
			}
		}else{
			dayTime = (parseInt(beginTime.split(':')[0])+1)+":"+beginTime.split(':')[1];
		}
	}
	
	return dayTime;
}

function GetReserveDate(timer){
	var _time = new Date(timer);
	var str = _time.getFullYear()+"/"+(_time.getMonth()+1)+"/"+_time.getDate();
	return str;
}