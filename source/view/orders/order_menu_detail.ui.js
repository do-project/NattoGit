var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var loadbg = ui(rootview.add("loadings","source://view/cells/loadingbg.ui",0,148));
var token = page.getData();
var param = {};
var Euc = encodeURIComponent;
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	request_http.url = $U.token($U.url.appSinglePointAllDetails,"user")+"&token="+Euc(token); // 请求的 URL
	request_http.request();
});
page.supportPanClosePage();
//已点菜单列表
var dcdlistgird = ui("do_GridView_1");
var dcddata = mm("do_ListData");
dcdlistgird.bindItems(dcddata);

var genTime = ui("do_Label_3");   //开台时间
var price = ui("do_Label_4");     //订单价格
var sameInfo = ui("do_Label_5");    //台位信息
var payType = ui("do_Label_16");    //支付类型
var storeTitle = ui("do_Label_7");  //店铺名称
var storeAddress = ui("do_Label_8");   //店铺地址
var panel = ui("do_LinearLayout_2");   //完成订单显示
var orderno = ui("do_Label_10");     //订单编号
var payTime = ui("do_Label_11");     //付款时间
var btn = ui("do_Button_1");

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible = false;
	if(databus!=-1){
		var str = "",strColor="";
		switch(databus.pay){
			case -1:
				str = "未付款";
				strColor = "FF2D00FF";
				break;
			case 0:
				str = "现金付款";
				strColor = "EDA327FF";
				break;
			case 1:
				str = "在线支付";
				strColor = "2291FFFF";
				break;
		};
		param.orderno = databus.orderno;
		param.ip = databus.ip;
		param.port = databus.port;
		genTime.text = "开台时间:"+databus.genTime;
		price.text = "￥"+parseFloat(databus.price).toFixed(2);
		sameInfo.text = "台位:"+databus.sameNode+" | 人数:"+databus.num+"位";
		payType.text = str;
		payType.fontColor = strColor;
		storeTitle.text = databus.title;
		storeAddress.text = databus.address;
		if(databus.state==9){
			if(!databus.evaluate){
				btn.visible = true;
				btn.text = "评价";
				btn.tag = "9";
				btn.fontColor="666666FF";
			}else{
				btn.visible = false;
			}
			panel.visible = true;
			orderno.text = "订单编号:"+databus.orderno;
			payTime.text = "付款时间:"+databus.payTime;
		}else{
			panel.visible = false;
			btn.visible = true;
			btn.text = "付款";
			btn.tag = "0";
			btn.fontColor="00BF00FF";
		}
		
		if(btn.visible){
			var _panel = ui("do_ALayout_7");
			_panel.visible=true;
		}
		
		dcddata.addData(databus.mvm);
		dcdlistgird.refreshItems();
	}else{
		nf.toast("获取订单信息失败");
		app.closePage();
	}
}).on("fail", function(data) {
	loadbg.visible = false;
	nf.toast("获取订单信息失败");
	app.closePage();
});

btn.on("touch","",300,function(){
	btn.animate(buttonA);
	if(btn.tag=="0"){
		nf.confirm("请在买单支付中付款", "点单付款", "确定", "取消", function(data, e) {
			if(data==1){
				open.start("source://view/other/payment.ui");
			}
		});
		
		//open.start("source://view/menuorder/menuorder_sureorder.ui",param);
	}else if(btn.tag=="9"){
		open.start("source://view/orders/order_discuss.ui",param.orderno);
	}
});