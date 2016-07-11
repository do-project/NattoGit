var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var alipay = sm("do_Alipay");
var we = sm("do_TencentWX");
var socket = mm("do_Socket");
var network = sm("do_Network");
var open = require("open");
var $U = require("url");
var rootview = ui("$");
var global = sm("do_Global");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loadingbg.ui", 0, 148));
var Euc = encodeURIComponent;
var payLayout = ui(rootview.add("PayKey","source://view/other/pop_Password.ui",0,0));
payLayout.visible = false;

var loadpay = ui(rootview.add("loadingpay", "source://view/cells/loading_rect.ui", 0, 148));
loadpayF = ui("loadingpay");
loadpayF.fire("loadingrect",[0,""]);

var param = page.getData();

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
deviceone.ticket = "";          //选择的抵价券
deviceone.tickprice = 0;        //选择抵价券的金额
deviceone.totalTickPrice = 0;   //抵价券总金额

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

//抵价券
var coupon = ui("couponbox");
var ticked = ui("do_Label_34");  //抵价券
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	order_http.url = $U.token($U.url.appTheInvoicingSingle,"user")+"&orderno="+Euc(param.orderno); // 请求的 URL
	order_http.request();
}).on("ReturnPayPass",function(){  //正确的支付密码
	page.hideKeyboard();
	var _price = (deviceone.price-deviceone.balance-deviceone.tickprice).toFixed(2);
	total.text = _price>0? _price:0;
	deviceone.useBalance = _price>0? deviceone.balance:deviceone.price-deviceone.tickprice;
	orderZero();
}).on("canelPayPass",function(){
	swbtn.x = 5;
	swbtn.redraw();
	swbg.bgColor = "AFAFAFFF";
	total.text=deviceone.price;
}).on("result",function(d){
	if(d!=""){
		switch(parseInt(d[0])){
			case 3:  //抵价券
				if(d[1]!=""){
					deviceone.ticket = d[1];
					var _price = deviceone.price-deviceone.useBalance;
					deviceone.totalTickPrice = d[2];
					if(_price>parseFloat(d[2])){
						ticked.text = "-"+d[2]+"元";
						deviceone.tickprice = d[2];
					}else{
						ticked.text = "-"+_price+"元";
						deviceone.tickprice = _price;
					}
					
					ticked.fontColor = "ff3300ff";
					if(d[2]>deviceone.price-deviceone.useBalance){
						total.text = "0";
					}else{
						total.text = parseFloat((deviceone.price -deviceone.useBalance - deviceone.tickprice).toFixed(2));
					}
				}else{  //不选择抵价券
					deviceone.ticket = "";
					ticked.text = "请选择抵价券";
					ticked.fontColor = "888888FF";
					deviceone.tickprice = 0;
					total.text = deviceone.price-deviceone.useBalance;
					deviceone.totalTickPrice = 0;
				}
				orderZero();
				break;
		}
	}
});

//top1
var dtgird = ui("do_GridView_detail");
var dtdata = mm("do_ListData");
dtgird.bindItems(dtdata);

//switch切换开关
var swbox = ui("switch_box");
var swbg = ui("switch_bg");
var swbtn = ui("switch_btn");
swbox.on("touch",function(){
	swbtn.animate(buttonAS);
	if(swbg.bgColor == "AFAFAFFF"){
		if(deviceone.price-deviceone.tickprice>0){
			swbtn.x = 65;
			swbtn.redraw();
			swbg.bgColor = "4DD965FF";
			page.fire("SendPayPass",0);
		}else{
			nf.toast("已没有可支付的金额");
		}
	}else{
		swbtn.x = 5;
		swbtn.redraw();
		swbg.bgColor = "AFAFAFFF";
		if(deviceone.tickprice!=deviceone.totalTickPrice){  //重置抵价券金额
			if(deviceone.price>deviceone.totalTickPrice){
				deviceone.tickprice = deviceone.totalTickPrice;
				ticked.text = "-"+deviceone.totalTickPrice+"元";
			}else{
				deviceone.tickprice = deviceone.price;
				ticked.text = "-"+deviceone.price+"元";
			}
		}
		total.text=deviceone.price-deviceone.tickprice;
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
		nf.toast("未获取到订单信息，请稍后从试");
		app.closePage();
	}else{
		if(databus.state==9){
			nf.toast("该订单已支付过了，请勿重新支付");
			app.closePage();
		}else{
			var balance = ui("do_Label_7");
			balance.text = databus.balance+"元";
			
			if(databus.balance>0){
				deviceone.balance=databus.balance;
			}else{
				swbox.visible=false;
			}
			
			var payprice = ui("do_Label_9");
			
			deviceone.price = databus.price.toFixed(2);
			total.text = deviceone.price;
			payprice.text = deviceone.price+"元";
			
			dtdata.addData(databus.sovm);
			dtgird.refreshItems();
			
			//抵价券
			if(databus.tvm.length>0){
				coupon.enabled = true;
				ticked.text = "请选择抵价券";
			}else{
				coupon.enabled = false;
			}
			
			coupon.on("touch","",300,function(){
				if(deviceone.price-deviceone.useBalance>0){
					coupon.animate(buttonA,function(){
						open.start("source://view/other/coupon.ui",[databus.tvm,deviceone.ticket]);
					});
				}else{
					nf.toast("已没有可支付的金额");
				}
				
			});
			
			if(deviceone.price==0){
				swbox.visible=false;
				_panel.height=0;
				_panel.redraw();
				btnSubmit.text = "确认订单";
			}else{
				deviceone.title = "点单"+databus.title;
				deviceone.totalNo=databus.totalNo;  //总订单号
				deviceone.alipayIdentity=databus.alipayIdentity;      //身份
				deviceone.alipayPrivateKey=databus.alipayPrivateKey;  //私钥
				deviceone.alipayPublicKey=databus.alipayPublicKey;    //公钥
				deviceone.alipayReturnUrl=databus.alipayReturnUrl;    //返回地址
				deviceone.alipayAccount=databus.alipayAccount;        //收款账号
				deviceone.timeout=databus.timeout;   //超时时间
			}
		}
	}
});
//需支付订单为0元
function orderZero(){
	if(deviceone.price-deviceone.useBalance-deviceone.tickprice>0){
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
	loadpayF.fire("loadingrect",[1,"正在生成订单"]);
	submit_http.url = $U.token($U.url.appSinglePointTotalOrderZero,"user")+"&orderno="+Euc(param.orderno)+"&balance="+Euc(deviceone.useBalance)+"&tickId="+Euc(deviceone.ticket)+"&payType="+deviceone.payment+"&totalNo="+deviceone.totalNo+"&spbillIP="+network.getIP(); // 请求的 URL
	submit_http.request();
});

var submit_http = mm("do_Http");
submit_http.method = "POST";// GET | POST
submit_http.timeout = 60000; // 超时时间 : 单位 毫秒
submit_http.contentType = "application/json"; // Content-Type
submit_http.on("success", function(databus) {
	if(databus.error_code==0){ //支付完成
		//订单修改完成
		socketSend();  //通知商户订单已经结账
	}else if(databus.error_code==1){  //支付未完成
		var _price = databus.amount;
		btnSubmit.enabled=false;
		
		var str = "";
		if(deviceone.payment==1){
			str = "正在打开微信";
		}else if(deviceone.payment==0){
			str = "正在打开支付宝";
		}
		loadpayF.fire("loadingrect",[1,str]);
		
		if(deviceone.payment==0){
			alipay.pay({rsaPrivate:deviceone.alipayPrivateKey,rsaPublic:deviceone.alipayPublicKey,partner:deviceone.alipayIdentity,notifyUrl:deviceone.alipayReturnUrl,tradeNo:deviceone.totalNo,subject:deviceone.title,sellerId:deviceone.alipayAccount,totalFee:_price,body:deviceone.title,timeOut:"15d"},function(data, e){
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
					if(typeof(param.sameId)=="undefined" || param.sameId==""){
						open.start("source://view/orders/orderfinish.ui",5);
					}else{
						socketSend();
					}
					break;
				};
			});
		}else if(deviceone.payment==1){    //微信支付  timeStamp:databus.timeStamp
			we.pay({appId:databus.appid, partnerId:databus.mch_id, prepayId:databus.prepay_id, package:databus.package, nonceStr:databus.nonce_str,timeStamp:databus.timeStamp, sign:databus.sign}, function(data, e) {
				//deviceone.print(JSON.stringify(data));
				switch(parseInt(data)){
					case 0:   //支付完成
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

function socketSend(){
	var sameStr = {type:8,sameId:param.sameId,user:$U.userToken()};
	socket.connect(param.ip,param.port.toString(), function(data, e) {
		if(data){
			socket.send("UTF-8",JSON.stringify(sameStr) , function(data1, e) {
				if(data1){
					nf.toast("已成功通知吧台结账完成");
				}
			});
		}
	});
	var _type = 6;
	if(param.type==0){
		_type = 7;
	}
	open.start("source://view/orders/orderfinish.ui",_type);
}