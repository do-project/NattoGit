var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var global = deviceone.sm("do_Global");
var city_node = global.getMemory("city");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var param = page.getData();
var Euc = encodeURIComponent;
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loadingbg.ui", 0, 148));

deviceone.deliveryTime = "";   //送达时间
deviceone.pay = 1;   //默认在线支付
deviceone.bill = "";  //发票
deviceone.note = "";  //备注
deviceone.ticket = "";  //抵价券
deviceone.address = "";  //收货地址
deviceone.minus = 0;  //订单优惠价格
deviceone.total = 0;  //订单价格
deviceone.tickprice = 0;    //抵价券价格
deviceone.orderno = "";    //订单编号

var tickLen = 0;


var _total = ui("do_Label_51");   //订单价格
var _yhlabel = ui("do_Label_48");
var minus = ui("do_Label_49");  //订单优惠价格
var privilege = ui("do_ALayout_20");  //优惠面板
var youhui = ui("do_Label_53");

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.token($U.url.takeOrder,"user")+"&token="+Euc(param[0])+"&city="+city_node+"&price="+param[1]; // 请求的 URL
	request_http.request();
});

//收货地址按钮
var shipNo = ui("do_ALayout_13");
var shipYes = ui("do_ALayout_14");

//支付方式选择
var pay1,pay2,check1,check2;
pay1 = ui("do_ALayout_pay1");pay2 = ui("do_ALayout_pay2");
check1 = ui("paycheck1");check2 = ui("paycheck2");
var pays = [pay1,pay2];
var checks = [check1,check2];
var paytouch = function(index){
	for(i = 0 ;i<pays.length;i++){
		if(i==index){
			checks[i].visible = true;
			deviceone.pay = pays[i].tag;
		}else{
			checks[i].visible = false;
		}
	}
	switch(parseInt(deviceone.pay)){
		case 0:  //货到付款
			minus.text = "￥0";
			_total.text = "￥"+parseFloat(param[1]-deviceone.tickprice).toFixed(1);
			deviceone.total = parseFloat(param[1]).toFixed(1);
			_yhlabel.visible = false;
			minus.visible = false;
			privilege.visible = false;
			deviceone.ticket = "";
			ticked.text = "货到付款不能使用 ";
			coupon.enabled = false;
			ticked.fontColor = "888888FF";
			deviceone.tickprice=0;
			_total.text = "￥"+parseFloat(deviceone.total).toFixed(1);
			break;
		case 1:  //在线支付
			if(deviceone.minus>0){
				minus.text = "￥"+deviceone.minus;
				_yhlabel.visible = true;
				minus.visible = true;
			}
			if(tickLen>0){
				ticked.text = "请选择抵价券";
				coupon.enabled = true;
			}else{
				ticked.text = "无可用的抵价券 ";
				coupon.enabled = false;
			}
			privilege.visible = true;
			_total.text = "￥"+parseFloat(param[1]-deviceone.minus-deviceone.tickprice).toFixed(1);
			deviceone.total = parseInt(param[1]-deviceone.minus);
			
			break;
	};
};
pays.forEach(function(dc,i){
	dc.on("touch", function(datac, e) {
		paytouch(i);
	});
});

var bztxt= ui("do_Label_beizhu");   //备注
var delivery = ui("do_Label_28");  //送达时间
var bill = ui("do_Label_22");  //发票
var ticked = ui("do_Label_32");  //抵价券
page.on("result",function(d){
	if(d!=""){
		switch(parseInt(d[0])){
			case -1:
				nf.toast(d[1]);
				break;
			case 0:  //送达时间
				deviceone.deliveryTime = d[1];
				delivery.text = d[1];
				delivery.fontColor = "646688FF";
				break;
			case 1:  //发票
				deviceone.bill = d[1];
				bill.text = d[1];
				bill.fontColor = "646688FF";
				break;
			case 2:  //备注
				deviceone.note = d[1];
				if(d[1]==""){
					bztxt.text="添加备注";
					bztxt.fontColor = "888888FF";
				}else{
					bztxt.text = d[1];
					bztxt.fontColor = "646688FF";
				}
				
				break;
			case 3:  //抵价券
				if(d[1]!=""){
					deviceone.ticket = d[1];
					ticked.text = "-"+d[2]+"元";
					ticked.fontColor = "ff3300ff";
					
					deviceone.tickprice = d[2];
					if(d[2]>deviceone.total){
						_total.text = "￥0.0";
					}else{
						_total.text = "￥"+parseFloat(deviceone.total - d[2]).toFixed(1);
					}
				}else{
					deviceone.ticket = "";
					ticked.text = "请选择抵价券";
					ticked.fontColor = "888888FF";
					deviceone.tickprice=0;
					_total.text = "￥"+parseFloat(deviceone.total).toFixed(1);
				}
				break;
			case 4:  //收货地址
				deviceone.address = d[2];
				shipYes.height = 140;
				shipNo.height = 0;
				var _name = ui("do_Label_18");
				_name.text = d[1].name;
				var _phone = ui("do_Label_19");
				_phone.text = d[1].phone;
				var _address = ui("do_Label_20");
				_address.text = d[1].address;
				shipYes.redraw();
				shipNo.redraw();
				break;
		};
	}
});

//确认订单
var surebtn = ui("do_Button_dopbtn");
surebtn.on("touch","",600,function(){
	if(deviceone.address==""){
		nf.toast("请选择收货地址");
	}else if(deviceone.deliveryTime==""){
		nf.toast("请选择送达时间");
	}else{
		var cardData = global.getMemory("CARDDATA");  //菜品信息
		var str = "";
		for(var i=0;i<cardData.length;i++){
			if(cardData[i].token == param[0]){  //是否是当前店铺
				for(var j=0;j<cardData[i].list.length;j++){
					var _data = cardData[i].list[j];
					str += _data.token+":"+_data.count+"|";
				}
			}
		}
		str = str==""? "":str.substring(0,str.length-1);
		if(str==""){
			nf.toast("未获取到商品信息");
		}else{
			order_http.url = $U.token($U.url.takeSubmitOrder,"user")+"&store="+Euc(param[0])+"&product="+Euc(str)+"&address="+Euc(deviceone.address)+"&pay="+deviceone.pay+"&deliveryTime="+Euc(deviceone.deliveryTime)+"&bill="+Euc(deviceone.bill)+"&note="+Euc(deviceone.note)+"&ticket="+Euc(deviceone.ticket)+"&orderno="+Euc(deviceone.orderno); // 请求的 URL
			order_http.request();
		}
	}

});

var order_http = mm("do_Http");
order_http.method = "POST";// GET | POST
order_http.timeout = 60000; // 超时时间 : 单位 毫秒
order_http.contentType = "application/json"; // Content-Type
order_http.on("success", function(databus) {
	if(databus.error_code==-1){
		nf.toast(databus.reason);
	}else{
		deviceone.orderno = databus.reason;
		surebtn.animate(buttonA,function(){
			open.start("source://view/outbound/outbound_sureorder.ui",databus.reason);
		});
	}
});

//备注
var beizhu = ui("beizhubox");
beizhu.on("touch","",300,function(){
	beizhu.animate(buttonA,function(){
		open.start("source://view/other/comments.ui",deviceone.note);
	});
});
//发票
var fapiao = ui("fapiaobox");
fapiao.on("touch","",300,function(){
	fapiao.animate(buttonA,function(){
		open.start("source://view/other/fapiao.ui",deviceone.bill);
	});
});


var forwtime = ui("forwordtimebox");
//抵价券
var coupon = ui("couponbox");


var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible = false;
	if(databus!=-1){
		//配送费
		var disPrice = ui("do_Label_34");
		disPrice.text = "￥"+databus.shipPrice;
		
		//送达时间
		if(databus.deliveryTime.length>0){
			forwtime.enabled = true;
		}else{
			forwtime.enabled = false;
		}
		forwtime.on("touch","",300,function(){
			forwtime.animate(buttonA,function(){
				open.start("source://view/other/forwordtime.ui",[databus.deliveryTime,deviceone.deliveryTime]);
			});
		});
		//支持在线支付
		if(!databus.supportOnline){
			pay1.visible = false;
			check2.visible = true;
			
			_yhlabel.visible = false;
			minus.visible = false;
			
			deviceone.pay = 0;
			pay1.height = 0;
			pay1.redraw();
			privilege.visible = false;
			_total.text = "￥"+parseFloat(param[1]).toFixed(1);
			minus.text = "￥"+"0";
			deviceone.minus = 0;
			deviceone.total = parseInt(param[1]);
		}else{
			pay1.visible = true;
			check2.visible = false;
			if(databus.avm!=undefined){
				privilege.visible = true;
				_yhlabel.visible = true;
				minus.visible = true;
				
				var label1 = ui("do_Label_37");  //优惠内容
				label1.text = databus.avm.title;
				var label2 = ui("do_Label_38");
				label2.text = "-￥"+databus.avm.minus;
				
				_total.text = "￥"+parseFloat(param[1]-databus.avm.minus).toFixed(1);
				deviceone.minus = databus.avm.minus;
				minus.text = "￥"+databus.avm.minus;
				deviceone.total = param[1]-databus.avm.minus;
				youhui.text = "享受减免优惠";
			}else{
				_yhlabel.visible = false;
				minus.visible = false;
				youhui.text = "";
				_total.text = "￥"+parseFloat(param[1]).toFixed(1);
				minus.text = "￥0";
				deviceone.total = param[1];
			}
		}
		//支持发票
		if(!databus.supportInvoice){
			fapiao.enabled = false;
		}else{
			fapiao.enabled = true;
			bill.text = "请填写发票抬头";
		}
		
		//抵价券
		tickLen = databus.tvm.length;
		if(databus.tvm.length>0){
			coupon.enabled = true;
			ticked.text = "请选择抵价券";
		}else{
			coupon.enabled = false;
			ticked.text = "无可用的抵价券";
		}
		
		coupon.on("touch","",300,function(){
			if(deviceone.pay==1){
				coupon.animate(buttonA,function(){
					open.start("source://view/other/coupon.ui",[databus.tvm,deviceone.ticket]);
				});
			}else{
				nf.toast("货到付款不允许使用抵价券");
			}
		});
		
		//收货地址
		shipNo.on("touch", function(datac, e) {
			open.start("source://view/percenter/shopaddress.ui",{token:param[0],address:deviceone.address});
		});
		shipYes.on("touch", function(datac, e) {
			open.start("source://view/percenter/shopaddress.ui",{token:param[0],address:deviceone.address});
		});
	}else{
		nf.toast("网络连接异常");
	}
});

