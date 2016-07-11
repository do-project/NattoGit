var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var seltix = ui(rootview.add("seltixian", "source://view/percenter/wallet/selectTixian.ui", 0, 0));
seltix.visible = false;
var payLayout = rootview.add("PayKey","source://view/other/pop_Password.ui",0,0);
var payUI = ui(payLayout);
payUI.visible = false;
var leftclose = ui("do_ALayout_close");
var Euc = encodeURIComponent;

var param={balance:0.0,type:-1,url:""}

leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.token($U.url.appUserWithdrawalAmount,"user");
    request_http.request();
}).on("ReturnPayPass",function(){  //密码输入成功
	submit_http.url = param.url;
	submit_http.request();
});
var bgsnd = ui("do_LinearLayout_1");
rootview.on("touch",function(){
	page.hideKeyboard();
});
bgsnd.on("touch",function(){
	page.hideKeyboard();
});

//提现记录
var tixiannote = ui("do_Button_2");
tixiannote.on("touch","",300,function(){
	page.hideKeyboard();
	tixiannote.animate(buttonA,function(){
		open.start("source://view/percenter/wallet/tixian_notes.ui");
	});
});

var txtytxt = ui("do_Label_8");
var zfbtix = ui("do_ALayout_zhifubao");
var yhktix = ui("do_ALayout_yinhangka");
page.on("reselutSel",function(data){
	txtytxt.text = data;
	if(data=="支付宝"){
		zfbtix.visible = true;
		yhktix.visible = false;
		zfbtix.height = 200;
		yhktix.height = 0;
		_bankName.text = "";
		param.type=0;
		bgsnd.height = 1187;
		bgsnd.redraw();
	}
	if(data=="银行卡"){
		zfbtix.visible = false;
		yhktix.visible = true;
		zfbtix.height = 0;
		yhktix.height = 310;
		param.type=1;
		bgsnd.height = 1387;
		bgsnd.redraw();
	}
	zfbtix.redraw();
	yhktix.redraw();
	
});
//选择方式
var seltixian = ui("do_ALayout_7");
seltixian.on("touch",function(){
	page.hideKeyboard();
	seltix.visible = true;
	page.fire("animShows","true");
});

var amount = ui("do_TextField_1");
var alipayName = ui("do_TextField_4");  //支付宝姓名
var alipayLogin = ui("do_TextField_5"); //支付宝账号

var bankName = ui("do_TextField_2");    //银行卡姓名
var bankCard = ui("do_TextField_3");    //银行卡卡号

var _bankName = ui("do_Label_10");   //显示银行名称
var tixianbtn = ui("do_Button_3");
tixianbtn.on("touch","",300,function(){
	page.hideKeyboard();
	tixianbtn.animate(buttonA,function(){
		var flag = false;
		var _reg = /^(([1-9]\d{0,9})|0)(\.\d{1,2})?$/;
		param.url = $U.token($U.url.appUserWithdrawal,"user");
		if(amount.text.trim()=="" || !_reg.test(amount.text) || parseFloat(amount.text)>param.balance){
			nf.toast("请输入正确的提现金额");
		}else if(param.type==-1){
			nf.toast("请选择提现方式");
		}else{
			
			param.url+="&amount="+amount.text;
			if(param.type==0){   //支付宝
				if(alipayName.text.trim()==""){
					nf.toast("请输入支付宝姓名");
				}else if(alipayLogin.text.trim()==""){
					nf.toast("请输入支付宝账号");
				}else{
					param.url+="&alipayLogin="+Euc(alipayLogin.text)+"&alipayName="+Euc(alipayName.text);
					flag=true;
				}
			}else if(param.type==1){   //银行卡
				if(bankName.text.trim()==""){
					nf.toast("请输入持卡人姓名");
				}else if(bankCard.text.trim()==""){
					nf.toast("请输入银行卡卡号");
				}else{
					param.url+="&alipayLogin="+Euc(bankCard.text)+"&alipayName="+Euc(bankName.text)+"&bankName="+Euc(_bankName.text);
					flag=true;
				}
			}
		}
		if(flag){
			nf.confirm({text:"提现金额"+amount.text+"元",title:"提现",button1text:"确定",button2text:"取消"},function(datacall,e){
				if(datacall == 1){
					page.fire("SendPayPass",0);
					param.url+="&type="+param.type;
				}
			});
		}
	});
});

bankCard.on("textChanged",function(){
	if(bankCard.text.length>=6){
		bank_http.url = $U.url.bankName+"?card="+bankCard.text;
		bank_http.request();
	}
});

var _price = ui("do_Label_5");
var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	_price.text = "￥"+databus.balance;
	param.balance = databus.balance;
});

var bank_http = mm("do_Http");
bank_http.method = "POST";// GET | POST
bank_http.timeout = 60000; // 超时时间 : 单位 毫秒
bank_http.contentType = "application/json"; // Content-Type
bank_http.on("success", function(databus) {
	if(databus!=""){
		if(databus.status=="1"){
			_bankName.text = databus.data.bankname;
		}else{
			_bankName.text = "";
		}
	}else{
		_bankName.text = "";
	}
});

var submit_http = mm("do_Http");
submit_http.method = "POST";// GET | POST
submit_http.timeout = 60000; // 超时时间 : 单位 毫秒
submit_http.contentType = "application/json"; // Content-Type
submit_http.on("success", function(databus) {
	if(databus.error_code==0){
		nf.toast("提现成功，请耐心等待纳豆审核");
		open.start("source://view/percenter/wallet/tixianfinish.ui");
	}else{
		nf.toast(databus.reason);
	}
});