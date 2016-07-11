var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var open = require("open");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");

var param={way:0,token:""};
var orderno=page.getData();
var Euc = encodeURIComponent;

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.token($U.url.appShowRefund,"user")+"&no="+orderno;
    request_http.request();
});

//提交退款
var btnSubmit=ui("surepaybtn1");
//先不退了
var _back=ui("surepaybtn2");
_back.on("touch","",300,function(){
	app.closePage();
});

var bgsx = ui("do_LinearLayout_2");
bgsx.on("touch",function(){
	page.hideKeyboard();
});


//支付方式选择
var pay1,pay2,check1,check2;
pay1 = ui("do_ALayout_pay1");pay2 = ui("do_ALayout_pay2");pay3=ui("do_ALayout_pay3");
check1 = ui("paycheck1");check2 = ui("paycheck2");check3 = ui("paycheck3");
var pays = [pay1,pay2,pay3];
var checks = [check1,check2,check3];
var paytouch = function(index){
	for(i = 0 ;i<pays.length;i++){
		if(i==index){
			checks[i].visible = true;
		}else{
			checks[i].visible = false;
		}
	}
};
pays.forEach(function(dc,i){
	dc.on("touch", function(datac, e) {
		paytouch(i);
		switch(i){
			case 0:
				param.way=0;
				break;
			case 1:
				param.way=1;
				break;
			case 2:
				param.way=9;
				break;
		};
		//page.fire(data);
	});
});
var txtWhy=ui("do_TextField_1");  //原因
btnSubmit.on("touch","",300,function(){
	if(txtWhy.text.trim()==""){
		nf.toast("请输入退款原因");
		txtWhy.setFocus(true);
	}else{
		nf.confirm({text:"确认提交退款?", title:"操作提示", button1text:"确定", button2text:"取消"}, function(data, e) {
			if(data == 1){
				submit_http.url = $U.token($U.url.appRefundSubmit,"user")+"&token="+Euc(param.token)+"&way="+param.way+"&why="+Euc(txtWhy.text);
				submit_http.request();
			}
		});
		
	}
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus!=-1){
		var title = ui("do_Label_7");
		title.text=databus.title;
		var price=ui("do_Label_9");
		price.text=databus.price+"元";
		param.token=databus.token;
		if(databus.refundTick){
			pay3.height=150;
			pay3.redraw();
			param.way = 9;
		}else{
			pay1.height=150;
			pay1.redraw();
			param.way = 0;
		}
	}else{
		nf.toast("网络无响应");
	}
});
var submit_http = mm("do_Http");
submit_http.method = "POST";// GET | POST
submit_http.timeout = 60000; // 超时时间 : 单位 毫秒
submit_http.contentType = "application/json"; // Content-Type
submit_http.on("success", function(databus) {
	if(databus.error_code==0){
		//成功
		nf.toast("退款提交成功");
		app.closePage(-1);
	}else{
		nf.toast(databus.reason);
	}
});