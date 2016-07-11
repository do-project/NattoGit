var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var token = page.getData();
var payLayout = ui(rootview.add("PayKey","source://view/other/pop_Password.ui",0,0));
payLayout.visible = false;
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loadingbg.ui", 0, 148));
var _state=0;
var orderno = "";
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage(_state);
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage(_state);
}).on("loaded",function(){
	takeLoad();
}).on("ReturnPayPass",function(index){  //支付密码输入正确
	goods_http.url = $U.token($U.url.appOrderConfirmGoods,"user")+"&orderno="+orderno; // 请求的 URL
	goods_http.request();
}).on("result",function(data){
	if(data==-1){
		app.closePage(-1);
	}
});

function takeLoad(){
	request_http.url = $U.token($U.url.appTakeOrderInfo,"user")+"&token="+token; // 请求的 URL
	request_http.request();
}

//确认收货
var goods_http = mm("do_Http");
goods_http.method = "POST";// GET | POST
goods_http.timeout = 60000; // 超时时间 : 单位 毫秒
goods_http.contentType = "application/json"; // Content-Type
goods_http.on("success", function(databus) {
	if(databus.error_code==0){
		_state=-1;
		loadbg.visible=true;
		takeLoad();
	}else{
		nf.toast("更新订单失败，请稍后在试");
	}
});

var btn1 = ui("do_Button_1");
var btn2 = ui("do_Button_2");
btn1.on("touch",function(){
	operate(this.tag);
});
btn2.on("touch",function(){
	operate(this.tag);
});

function operate(param){
	var data = JSON.parse(param);
	switch(data.type){
		case -1:  //退款
			open.start("source://view/orders/userdrawback.ui",data.no);
			break;
		case 0:  //删除
			nf.confirm("确认取消订单？", "取消订单", "确认", "取消", function(index, e) {
				if(index==1){
					delete_http.url = $U.token($U.url.appOrderDelete,"user")+"&orderno="+data.no; // 请求的 URL
					delete_http.request();
				}
			});
			break;
		case 1:  //付款
			open.start("source://view/outbound/outbound_sureorder.ui",data.no);
			break;
		case 2:  //货到付款
			nf.confirm("请确保商品已收到？", "确认收货", "确认", "取消", function(index, e) {
				if(index==1){
					page.fire("SendPayPass",data.index);
				}
			});
			break;
		case 9:  //评价
			open.start("source://view/orders/order_discuss.ui",data.no);
			break;
	};
}

//删除订单
var delete_http = mm("do_Http");
delete_http.method = "POST";// GET | POST
delete_http.timeout = 60000; // 超时时间 : 单位 毫秒
delete_http.contentType = "application/json"; // Content-Type
delete_http.on("success", function(databus) {
	if(databus==-1){
		nf.toast("删除订单失败");
	}else{
		app.closePage(-1);
	}
});
//支持
var gridviewhd = ui("do_GridView_hd");
var hdData = mm("do_ListData");
gridviewhd.bindItems(hdData);
//已点菜单列表
var dcdlistgird = ui("do_GridView_1");
var dcddata = mm("do_ListData");
dcdlistgird.bindItems(dcddata);

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible = false;
	orderno = databus.orderno;
	var price = ui("do_Label_3");
	price.text = "订单金额: "+databus.price+"元"
	var payMent = ui("do_Label_18");  //支付方式
	payMent.text = databus.pay;
	var shipName = ui("do_Label_5");  //收货人姓名
	shipName.text = "收货人: "+databus.shipName;
	var mobile = ui("do_Label_4");  //手机号码
	mobile.text = databus.mobile;
	var deliveryTime = ui("do_Label_19");  //送达时间
	deliveryTime.text = "送达时间: "+databus.deliveryTime;
	var address = ui("do_Label_20");  //收货地址
	address.text = "收货地址: "+databus.address;
	var note = ui("do_Label_21");  //备注
	note.text = "备注: "+(databus.note==null? "无":databus.note);
	var storeTitle = ui("do_Label_7");  //店铺名称
	storeTitle.text = databus.title;
	var storeAddress = ui("do_Label_8");  //店铺地址
	storeAddress.text = databus.storeAddress;
	var order = ui("do_Label_10");  //订单编号
	order.text = "订单编号: "+databus.orderno;
	var gentime = ui("do_Label_11");  //创建时间
	if(databus.payTime!=null && databus.payTime!=""){
		gentime.text = "付款时间: "+databus.payTime;
	}else{
		gentime.text = "下单时间: "+databus.genTime;
	}
	
	if(databus.avm.length>0){
		hdData.addData(databus.avm);
		gridviewhd.refreshItems();
	}
	
	dcddata.addData(databus.pvm);
	for(var i=0;i<databus.pvm.length;i++){
		var pro = databus.pvm[i];
		dcddata.updateOne(i,{
			"index":pro.index,
			"title":pro.title,
			"num":pro.num>0? "x"+pro.num:"",
			"price":pro.price+"元"
		});
	}
	dcdlistgird.refreshItems();
	var _param = {type:0,no:orderno};
	switch(databus.state){
		case 0:
			if(databus.payMent==1){
				if(databus.overdue){
					btn2.visible=false;
				}else{
					btn2.text="付款";
					_param.type = 1;
					btn2.tag = _param;
				}
			}else{
				if(databus.overdue){
					btn2.visible=false;
				}else{
					btn2.text="确认订单";
					btn2.tag = {type:1,no:orderno};
				}
			}
			btn1.text="删除";
			_param.type=0;
			btn1.tag=_param;
			break;
		case 1:
			btn2.visible=false;
			if(databus.payMent==1){
				btn1.text="退款";
				_param.type=-1;
				btn1.tag=_param;
			}else{
				btn1.visible=false;
			}
			break;
		case 2:
			btn2.visible=false;
			if(databus.payMent==1){
				btn1.text="退款";
				_param.type=-1;
				btn1.tag=_param;
			}else{
				btn1.visible=false;
			}
			break;
		case 3:
			if(databus.payMent==1){
				btn1.text="退款";
				_param.type=-1;
				btn1.tag=_param;
				btn2.text="确认收货";
				_param.type=2;
				btn2.tag=_param;
			}else{
				btn1.visible=false;
				btn2.visible=false;
			}
			break;
		case 9:
			btn2.visible=false;
			if(!databus.evaluate){
				btn1.text="评价";
				_param.type=9;
				btn1.tag=_param;
			}else{
				btn1.visible=false;
			}
			break;
	};
	if(btn2.visible || btn1.visible){
		var _panel = ui("do_ALayout_7");
		_panel.visible=true;
	}
});