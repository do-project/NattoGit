var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var global = sm("do_Global");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var token = page.getData();
var timeChoose = ui(rootview.add("timeList","source://view/reservation/datetimeselect.ui",0,0));
timeChoose.visible = false;
var people = ui(rootview.add("peoList","source://view/reservation/popleselect.ui",0,0));
people.visible = false;
var same = ui(rootview.add("sameList","source://view/reservation/sameselect.ui",0,0));
same.visible = false;
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var Euc = encodeURIComponent;
var diancan = ui("do_LinearLayout_6");
diancan.visible=false;

var totalPrice = ui("do_Label_21");  //总价格
var discountName = ui("do_Label_22");   //折扣名称
var discountPrice = ui("do_Label_23");  //折扣价格

var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loadingbg.ui", 0, 148));
var param = {timeMin:"",timeMax:"",currentTime:"",selectedDate:"",selectedTime:"",people:0,same:"",samePrice:0,totalPrice:0,discountPrice:0,sameList:[],timeList:[],menuPrice:0,menuDisPrice:0,pay:0,sex:0,ticket:"",tickprice:0,ticklength:0,orderon:""};
var tickList = [];
var showMonth = ui("do_Label_31");  //月份
//var showDay = ui("do_Label_32");   //日
var showTime = ui("do_Label_33");   //时间
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
var sameName = ui("do_Label_36");

//已点菜单列表
var dcdlistgird = ui("do_GridView_dianle");
var dcddata = mm("do_ListData");
dcdlistgird.bindItems(dcddata);

var scbg = ui("do_LinearLayout_1");
scbg.on("touch",function(){
	page.hideKeyboard();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	diancan.redraw();
	var url = $U.token($U.url.ReservationOrder,"user")+"&token="+Euc(token); // 请求的 URL
	request_http.url = url;
    request_http.request();
    
    singlePoint();
    
    if($U.tokenExist()){
    	tickLoad();
    }
}).on("selectTime",function(data){
	var newDate = new Date(data[0]);
	showMonth.text = newDate.getMonth()+1+"月" + newDate.getDate()+"日" + "(" + data[1] + ")";
	//showDay.text = newDate.getDate()+"日";
	param.selectedDate = newDate.getFullYear()+"/"+(newDate.getMonth()+1)+"/"+newDate.getDate();
	//showTime.text = data[1];
	param.selectedTime = data[1];
	sameLoad();
}).on("refreshPeople",function(data){
	//var peopleNum = ui("do_Label_8");
	param.people = data;
	showTime.text = data;
	sameLoad();
}).on("refreshSame",function(data){
	sameName.text = data[1];
	param.same = data[0];
	param.samePrice = data[2];
	getPrice();
}).on("result",function(data){
	if(data.type!=undefined){
		switch(data.type){
			case 0:  //加载点单的商品
				singlePoint();
				break;
		};
	}else{
		switch(parseInt(data[0])){
			case -1:
				nf.toast(data[1]);
				break;
			case 0:
				tickLoad();
				break;
			case 3:  //抵价券
				if(data[1]!=""){
					param.ticket = data[1];
					var _price = 0;
					if(param.discountPrice>data[2])
						_price = data[2];
					else
						_price = param.discountPrice;
					ticked.text = "-"+_price+"元";
					ticked.fontColor = "ff3300ff";
					param.tickprice = _price;
				}else{
					param.ticket = "";
					ticked.text = "请选择抵价券";
					ticked.fontColor = "888888FF";
					param.tickprice = 0;
				}
				getPrice();
				break;
			case 9:    //订单支付返回
				param.orderon=data[1];
				break;
		};
	}
});

//加载点单的商品
function singlePoint(){
	if(param.pay==1){
		var _price = 0,_priceDis=0;
		var menuData = global.getMemory("MENUCART");
		dcddata.removeAll();
		for(var i=0;i<menuData.length;i++){
			if(menuData[i].token==token){
				dcddata.addData(menuData[i].list);
				for(var j=0;j<menuData[i].list.length;j++){
					var _data = menuData[i].list[j];
					dcddata.updateOne(j,{
						"index":j+1,
						"title":_data.title,
						"price":_data.price+"元",
						"num":"x"+_data.num
					});
					_priceDis+=_data.discountPrice*_data.num;
					_price+=_data.price*_data.num;
				}
			}
		}
		dcdlistgird.refreshItems();
		param.menuDisPrice = _priceDis.toFixed(2);
		param.menuPrice = _price;
		getPrice();
	}
	dcdlistgird.redraw();
}
//计算总价格
function getPrice(){
	if(param.pay==1){
		param.totalPrice = param.menuPrice>0? param.menuPrice:param.samePrice//param.samePrice+param.menuPrice;
		param.discountPrice = param.menuDisPrice>0? param.menuDisPrice:param.samePrice;
		
	}else if(param.pay==0){
		param.totalPrice = param.samePrice;
		param.discountPrice=param.samePrice;
	}
	
	if(param.totalPrice!=param.discountPrice){
		discountName.visible = true;
		discountPrice.visible = true;
	}else{
		discountName.visible = false;
		discountPrice.visible = false;
	}
	totalPrice.text = "￥"+parseFloat(param.totalPrice).toFixed(2);
	discountPrice.text = "￥"+parseFloat(param.discountPrice).toFixed(2); //param.discountPrice>param.tickprice? "￥"+(param.discountPrice-param.tickprice):"￥0";
	
}

//预订方式
var scrollviews = ui("do_ScrollView_1");
var pay1,pay2,check1,check2;
pay1 = ui("do_ALayout_pay1");pay2 = ui("do_ALayout_pay2");
check1 = ui("paycheck1");check2 = ui("paycheck2");
var pays = [pay1,pay2];
var checks = [check1,check2];
var paytouch = function(index){
	page.hideKeyboard();
	param.pay = pays[index].tag;
	diancan.visible=pays[index].tag==1? true:false;
	
	for(i = 0 ;i<pays.length;i++){
		checks[i].visible = i==index? true:false;
	}
	if(param.pay==1){
		singlePoint();
	}else{
		discountName.visible = false;
		discountPrice.visible = false;
		param.totalPrice = param.discountPrice = param.samePrice;
		totalPrice.text = "￥" + param.totalPrice;
		discountPrice.text = "￥" + param.discountPrice;
	}
};
pays.forEach(function(dc,i){
	dc.on("touch", function(datac, e) {
		paytouch(i);
		diancan.redraw();
		scrollviews.toEnd();
	});
});

//选择人数
var peoBtn = ui("do_ALayout_time");
peoBtn.on("touch","",300,function(){
	page.hideKeyboard();
	page.fire("presetPeo",param.people);  //传递人数
	page.fire("peples","true");
});
var _name = ui("do_TextField_2");
var _mobile = ui("do_TextField_3");
var _note = ui("do_TextField_4");
//提交确认
var pagesure = ui("do_Button_surebtn");
pagesure.on("touch","",300,function(){
	page.hideKeyboard();
	var _reg = /^1[3|4|5|8][0-9]\d{8}$/;
	if(!$U.tokenExist()){
		app.openPage({
	    	source : "source://view/loginreg/login.ui",
	    	animationType: "slide_b2t",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "white",
	    	data:[0]
	    });
	}else{
		
		if(param.selectedDate=="" || param.selectedTime==""){
			nf.toast("请选择预定时间")
		}else if(param.people<=0){
			nf.toast("请选择就餐人数");
		}else if(param.same==""){
			nf.toast("请选择台位");
		}else if(_name.text.trim()==""){
			nf.toast("请填写预定人姓名");
		}else if(!_reg.test(_mobile.text)){
			nf.toast("请填写正确的手机号码");
		}else{
			var str = "";
			var menuData = global.getMemory("MENUCART");
			for(var i=0;i<menuData.length;i++){
				if(menuData[i].token==token){
					for(var j=0;j<menuData[i].list.length;j++){
						var _data = menuData[i].list[j];
						str+=_data.token+":"+_data.num+"|";
					}
				}
			}
			str=str==""? "":str.substring(0,str.length-1);
			var url = $U.token($U.url.ReserveSubmitOrder,"user")+"&store="+Euc(token)+"&presetTime="+Euc(param.selectedDate+" "+param.selectedTime)+"&peopleNum="+param.people+"&same="+Euc(param.same)+"&name="+Euc(_name.text.trim())+"&mobile="+Euc(_mobile.text)+"&sex="+param.sex+"&note="+Euc(_note.text)+"&menuList="+Euc(str)+"&ticket="+Euc(param.ticket)+"&orderno="+param.orderon+"&type="+param.pay; // 请求的 URL

			submit_http.url = url;
			submit_http.request();
		}
	}
});

//选择到店时间
var seldate = ui("do_ALayout_26");
seldate.on("touch","",300,function(){
	page.hideKeyboard();
	page.fire("presetDate",param);  //传递日期
	//timeChoose.visible = true;
	page.fire("pshows","true");
});
//选择台位类型
var btnSame = ui("do_ALayout_12");
btnSame.on("touch","",300,function(){
	page.hideKeyboard();
	if(param.selectedDate!="" && param.selectedTime!="" && param.people>0){
		if(param.sameList.length>0){
			//same.visible = true;
			page.fire("presetSame",param.sameList);
			page.fire("selsets","true");
		}else{
			nf.toast("没有查到符合条件的台位");
		}
	}else{
		nf.toast("请选择到店时间和就餐人数");
	}
	
});

//点菜
var benDiancan = ui("do_Button_2");
benDiancan.on("touch","",300,function(){
	page.hideKeyboard();
	benDiancan.animate(buttonA,function(){
		open.start("source://view/reservation/reservation_menu.ui",token,"myMenuList");
	});
});
//抵价券
var coupon = ui("couponbox");
var ticked = ui("do_Label_39");

//-------------弹出提示-------------------
var tishimask = ui("tishimask");
var tishibox = ui("tishibox");
var hidetishibtn = ui("do_Button_hidetishi");

//提示隐藏
var animTHide = mm("do_Animation");
animTHide.fillAfter = true;
animTHide.alpha({
    duration : 150,
    alphaFrom : 1,
    alphaTo : 0
}, "id1");
animTHide.scale({
    duration : 150,
    scaleFromX : 1,
    scaleFromY : 1,
    scaleToX : 0.8,
    scaleToY : 0.8,
    pivotX : 0.5,
    pivotY : 0.5
}, "id2");
//面板事件
tishibox.on("touch",function(){
	//防止穿透
});
//遮罩关闭事件
tishimask.on("touch","",300,function(){
	tishibox.animate(animTHide,function(){
		tishimask.visible = false;
	});
});
//提示关闭事件
hidetishibtn.on("touch","",300,function(){
	this.animate(buttonA);
	tishibox.animate(animTHide,function(){
		tishimask.visible = false;
	});
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus!=-1){
		deviceone.print(databus);
		loadbg.visible=false;
		var topTitle = ui("do_Label_1");
		topTitle.text = databus.title;
		param.timeMax = databus.timeMax;
		param.timeMin = databus.timeMin;
		param.currentTime = databus.currentTime;   //当前时间
		param.selectedDate = param.timeMin;  //已选日期
		param.timeList = databus.dtvm;   //时间列表
		
		var myDate = new Date(param.timeMin);
		//showMonth.text = myDate.getMonth()+1+"月"+myDate.getDate()+"日";
		showMonth.text = "日期时间";
		//showDay.text = myDate.getDate()+"日";
		
		//公告
		var notice = ui("do_MarqueeLabel_1");
		notice.text = databus.notice==null? "暂无":databus.notice;
		
		if(databus.applyDiscount){
			var discount = ui("do_Label_19");
			discount.text = databus.discount+"折优惠";
		}
		
		
		//弹出提示界面
		tishimask.visible = true;
		
		//是否有菜品
		if(databus.dishNumber==0){
			pay2.height = 0;
			pay2.redraw();
		}
	}else{
		nf.alert("预定信息获取失败","提示");
		app.closePage();
	}
});
coupon.on("touch","",300,function(){
	this.animate(buttonA,function(){
		if(param.totalPrice>0){
			page.hideKeyboard();
			if(!$U.tokenExist()){
				app.openPage({
			    	source : "source://view/loginreg/login.ui",
			    	animationType: "slide_b2t",
			    	statusBarState : "transparent",
			    	statusBarFgColor : "white",
			    	data:[0]
			    });
			}else{
				if(param.totalPrice>0){
					coupon.animate(buttonA,function(){
						open.start("source://view/other/coupon.ui",[tickList,param.ticket]);
					});
				}else{
					nf.toast("金额需大于0");
				}
			}
		}else{
			nf.alert("订单金额为0，不能使用抵价券");
		}
	
	});
});
//加载纳豆券
function tickLoad(){
	var url = $U.token($U.url.appUsableTick,"user")+"&store="+Euc(token); // 请求的 URL
	tick_http.url = url;
	tick_http.request();
}

var tick_http = mm("do_Http");
tick_http.method = "POST";// GET | POST
tick_http.timeout = 60000; // 超时时间 : 单位 毫秒
tick_http.contentType = "application/json"; // Content-Type
tick_http.on("success", function(databus) {
	tickList = databus;
	if(databus.length>0){
		param.ticklength = databus.length;
		ticked.text = "请选择抵价券";
	}else{
		ticked.text = "无可用抵价券";
		coupon.enabled = false;
	}
});

function sameLoad(){
	sameName.text = "选择台位类型";
	param.same="";
	param.samePrice=0;
	if(param.selectedDate!="" && param.selectedTime!="" && param.people>0){
		var url = $U.url.appGainSame+"?token="+Euc(token)+"&time="+Euc(param.selectedDate+" "+param.selectedTime)+"&people="+param.people; // 请求的 URL
		same_http.url = url;
		same_http.request();
	}
	getPrice();
}
var same_http = mm("do_Http");
same_http.method = "POST";// GET | POST
same_http.timeout = 60000; // 超时时间 : 单位 毫秒00
same_http.contentType = "application/json"; // Content-Type
same_http.on("success", function(databus) {
	param.sameList = databus;
	if(databus.length==0){
		nf.toast("没有查到符合条件的台位");
	}
});


//switch切换开关
var swbox = ui("switch_box");
var swbg = ui("switch_bg");
var swbtn = ui("switch_btn");
swbox.on("touch",function(){
	page.hideKeyboard();
	swbtn.animate(buttonAS);
	if(swbg.bgColor == "FF80C0FF"){
		param.sex = 1;
		swbtn.x = 78;
		swbtn.text = "先生";
		swbtn.fontColor = "2D96FFFF";
		swbtn.redraw();
		swbg.bgColor = "2D96FFFF";
		
	}else{
		param.sex = 0;
		swbtn.x = 3;
		swbtn.text = "女士";
		swbtn.fontColor = "FF80C0FF";
		swbtn.redraw();
		swbg.bgColor = "FF80C0FF";
	}
});

var submit_http = mm("do_Http");
submit_http.method = "POST";// GET | POST
submit_http.timeout = 60000; // 超时时间 : 单位 毫秒00
submit_http.contentType = "application/json"; // Content-Type
submit_http.on("success", function(databus) {
	if(databus.error_code==0){
		pagesure.animate(buttonA,function(){
			open.start("source://view/reservation/reservation_sureorder.ui",databus.reason);
		});
	}else{
		nf.toast("生成订单失败");
	}
});

var _detail = ui("do_ALayout_14");
_detail.on("touch","",300,function(){
	this.animate(buttonA,function(){
		open.start("source://view/reservation/reservation_detail.ui",token);
	});
});