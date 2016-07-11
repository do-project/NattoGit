var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var alipay = sm("do_Alipay");
var network = sm("do_Network");
var we = sm("do_TencentWX");
var open = require("open");
var rootview = ui("$");
var $U = require("url");
var global = sm("do_Global");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var orderno = page.getData();
var Euc = encodeURIComponent;
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loadingbg.ui", 0, 148));
var payLayout = ui(rootview.add("PayKey","source://view/other/pop_Password.ui",0,0));
payLayout.visible = false;

var loadpay = ui(rootview.add("loadingpay", "source://view/cells/loading_rect.ui", 0, 148));
loadpayF = ui("loadingpay");
loadpayF.fire("loadingrect",[0,""]);

var btnSubmit = ui("surepaybtn1");  //支付按钮
var total = ui("do_Label_4");   //支付价格
var _panel = ui("paytype1");    //支付列表面板

deviceone.title="";     //订单名称
deviceone.timeout="";   //超时时间
deviceone.price = 0;    //订单价格
deviceone.balance=0;    //用户余额
deviceone.useBalance=0;   //使用的余额
deviceone.payment=0;      //支付类型0：支付宝1：微信
deviceone.totalNo="";     //总订单号
deviceone.alipayIdentity="";    //支付宝身份
deviceone.alipayPrivateKey="";  //支付宝私钥
deviceone.alipayPublicKey="";   //支付宝公钥
deviceone.alipayReturnUrl="";   //支付宝返回地址
deviceone.alipayAccount="";     //支付宝收款账号
page.supportPanClosePage();
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage([9,orderno]);
});
//switch切换开关
var swbox = ui("switch_box");
var swbg = ui("switch_bg");
var swbtn = ui("switch_btn");

page.on("back", function(){
	app.closePage([9,orderno]);
}).on("loaded",function(){
	order_http.url = $U.token($U.url.appReserveShowOrder,"user")+"&orderno="+Euc(orderno); // 请求的 URL
	order_http.request();
}).on("ReturnPayPass",function(){  //正确的支付密码
	page.hideKeyboard();
	var _price = (deviceone.price-deviceone.balance).toFixed(2);
	total.text = _price>0? _price:0;
	deviceone.useBalance = _price>0? deviceone.balance:deviceone.price;
	orderZero();
}).on("canelPayPass",function(){
	swbtn.x = 5;
	swbtn.redraw();
	swbg.bgColor = "AFAFAFFF";
	total.text=deviceone.price;
});

swbox.on("touch",function(){
	swbtn.animate(buttonAS);
	if(swbg.bgColor == "AFAFAFFF"){  //应用余额
		swbtn.x = 65;
		swbtn.redraw();
		swbg.bgColor = "4DD965FF";
		page.fire("SendPayPass",0);
	}else{
		swbtn.x = 5;
		swbtn.redraw();
		swbg.bgColor = "AFAFAFFF";
		total.text=deviceone.price;
		deviceone.useBalance=0;
		orderZero();
	}
});



//支付方式选择
var pay1,pay2,check1,check2;
pay1 = ui("do_ALayout_pay1");pay2 = ui("do_ALayout_pay2");
check1 = ui("paycheck1");check2 = ui("paycheck2");
var pays = [pay1,pay2];
var checks = [check1,check2];
var paytouch = function(index){
	for(i = 0 ;i<pays.length;i++){
		checks[i].visible = i==index;
		if(i==index){
			deviceone.payment = pays[i].tag;
		}
	}
};
pays.forEach(function(dc,i){
	dc.on("touch", function(datac, e) {
		paytouch(i);
	});
});

//top1
var dtgird = ui("do_GridView_detail");
var dtdata = mm("do_ListData");
dtgird.bindItems(dtdata);

var order_http = mm("do_Http");
order_http.method = "POST";// GET | POST
order_http.timeout = 60000; // 超时时间 : 单位 毫秒
order_http.contentType = "application/json"; // Content-Type
order_http.on("success", function(databus) {
	loadbg.visible = false;
	if(databus==-1){
		app.closePage([-1,"订单已失效"]);
	}else{
		var balance = ui("do_Label_7");
		balance.text = databus.balance+"元";
		
		if(databus.balance>0){
			deviceone.balance=databus.balance;
		}else{
			swbox.visible=false;
		}
		
		var payprice = ui("do_Label_9");
		
		deviceone.price = databus.price;
		total.text = deviceone.price;
		payprice.text = deviceone.price+"元";
		
		dtdata.addData(databus.subOrder);
		dtgird.refreshItems();
		
		if(deviceone.price==0){
			swbox.visible=false;
			_panel.height=0;
			_panel.redraw();
			btnSubmit.text = "确认订单";
		}else{
			deviceone.title = "预订:"+databus.title+"("+databus.subTitle+")";
			deviceone.totalNo=databus.totalNo;  //总订单号
			deviceone.alipayIdentity=databus.alipayIdentity;      //身份
			deviceone.alipayPrivateKey=databus.alipayPrivateKey;  //私钥
			deviceone.alipayPublicKey=databus.alipayPublicKey;    //公钥
			deviceone.alipayReturnUrl=databus.alipayReturnUrl;    //返回地址
			deviceone.alipayAccount=databus.alipayAccount;        //收款账号
			deviceone.timeout=databus.timeout;   //超时时间
		}
	}
});

//需支付订单为0元
function orderZero(){
	if(deviceone.price-deviceone.useBalance>0){
		_panel.height=-1;
		_panel.redraw();
		btnSubmit.text = "确认并支付";
	}else{
		_panel.height=0;
		_panel.redraw();
		btnSubmit.text = "确认订单";
	}
}
//提交订单
btnSubmit.on("touch",function(){
	btnSubmit.enabled=false;
	loadpayF.fire("loadingrect",[1,"正在生成订单"]);
	submit_http.url = $U.token($U.url.ReserveTotalOrderZero,"user")+"&orderno="+Euc(orderno)+"&balance="+Euc(deviceone.useBalance)+"&payType="+deviceone.payment+"&totalNo="+deviceone.totalNo+"&spbillIP="+network.getIP(); // 请求的 URL
	submit_http.request();
});

var submit_http = mm("do_Http");
submit_http.method = "POST";// GET | POST
submit_http.timeout = 60000; // 超时时间 : 单位 毫秒
submit_http.contentType = "application/json"; // Content-Type
submit_http.on("success", function(databus) {
	if(databus.error_code==0){  //支付完成
		//订单修改完成
		removeDish();
		open.start("source://view/orders/orderfinish.ui",1);
	}else if(databus.error_code==1){   //支付未完成
		var _price = databus.amount;
		var str = "";
		if(deviceone.payment==1){
			str = "正在打开微信";
		}else if(deviceone.payment==0){
			str = "正在打开支付宝";
		}
		loadpayF.fire("loadingrect",[1,str]);
		
		//需要支付
		if(deviceone.payment==0){  //支付宝支付
			alipay.pay(deviceone.alipayPrivateKey, deviceone.alipayPublicKey, deviceone.alipayIdentity, deviceone.alipayReturnUrl, deviceone.totalNo, deviceone.title, deviceone.alipayAccount, _price, deviceone.title, deviceone.timeout, function(data, e) {
				
				switch(parseInt(data.code)){
					case 4000:
						nf.toast("订单支付失败");
						btnSubmit.enabled=true;
						break;
					case 6001:   //用户取消
						btnSubmit.enabled=true;
						break;
					case 6002:
						nf.toast("网络连接出错，请检查网络环境");
						btnSubmit.enabled=true;
						break;
					case 8000:  //正在处理中
						nf.toast("您的订单正在处理中，请耐心等候");
						app.closePage();
						break;
					case 9000:  //支付成功
						removeDish();
						open.start("source://view/orders/orderfinish.ui",1);
						break;
				};
			});
		}else if(deviceone.payment==1){    //微信支付
			//deviceone.print(databus.appid+","+databus.mch_id+","+databus.prepay_id+","+databus.package+","+databus.nonce_str+","+databus.timeStamp+","+databus.sign);
			we.pay({appId:databus.appid, partnerId:databus.mch_id, prepayId:databus.prepay_id, package:databus.package, nonceStr:databus.nonce_str,timeStamp:databus.timeStamp, sign:databus.sign}, function(data, e) {
				//deviceone.print(JSON.stringify(data));
				switch(parseInt(data)){
					case 0:   //支付完成
						removeDish();
						open.start("source://view/orders/orderfinish.ui",1);
						break;
					case -1:  //支付错误
						nf.toast("订单支付失败");
						btnSubmit.enabled=true;
						break;
					case -2:  //用户取消
						btnSubmit.enabled=true;
						break;
				};
			});
		}
	}else{
		btnSubmit.enabled=true;
		nf.toast(databus.reason);
	}
	loadpayF.fire("loadingrect",[0,""]);
});

//清除点菜信息
function removeDish(){
	global.setMemory("MENUCART", "");
}