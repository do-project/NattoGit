var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var payLayout = ui(rootview.add("PayKey","source://view/other/pop_Password.ui",0,0));
payLayout.visible = false;
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var isMore = false;
var isLoading = true;

var listbg = ui("listviewbody");
var loadbg = ui(listbg.add("loadings","source://view/cells/loadingbg.ui",0,-100));
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,300);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

var dataomd = mm("do_ListData");
var listomd = ui("do_ListView_j");
listomd.bindItems(dataomd);

var param = {type:0,size:15,index:1};

var btnList = [ui("do_btntype1"),ui("do_btntype2"),ui("do_btntype3"),ui("do_btntype4")];
btnList.forEach(function(dc,i){
	dc.on("touch", function(datac, e) {
		paytouch(i);
	});
});
var paytouch = function(index){
	for(var i=0;i<btnList.length;i++){
		if(i!=index){
			btnList[i].bgColor = "FFFFFFFF";
			btnList[i].fontColor = "444444FF";
		}else{
			btnList[i].bgColor = "3C9DFFFF";
			btnList[i].fontColor = "FFFFFFFF";
			param.type = btnList[i].tag;
			isLoading = true;
			isMore = false;
			orderLoad();
		}
	}
};
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	HeavyGauge();
	orderLoad();
}).on("orderRefresh",function(){
	HeavyGauge();
	isLoading=true;
	isMore=false;
	orderLoad();
}).on("ReturnPayPass",function(index){  //支付密码输入正确
	var cell = dataomd.getOne(index);
	goods_http.url = $U.token($U.url.appOrderConfirmGoods,"user")+"&orderno="+cell.orderno; // 请求的 URL
	goods_http.request();
}).on("result",function(data){
	HeavyGauge();
	if(data==-1){
		isLoading=true;
		isMore=false;
		orderLoad();
	}
});
//重新计数
function HeavyGauge(){
	number_http.url = $U.token($U.url.appOrderListNumber,"user")+"&serId=2"; // 请求的 URL
	number_http.request();
}

function orderLoad(){
	if(isMore) param.index++;
	else param.index=1;
	if(isLoading) {
		tipFace_ui.visible = false;
		loadbg.visible = true;
		dataomd.removeAll();
		listomd.refreshItems();
	}
	else {
		loadbg.visible = false;
	}
	request_http.url = $U.token($U.url.appTakeOrderList,"user")+"&plan="+param.type+"&size="+param.size+"&index="+param.index; // 请求的 URL
	request_http.request();
}
listomd.on("touch",function(index){
	var cell = dataomd.getOne(index);
	open.start("source://view/orders/order_takway_detail.ui",cell.token);
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	loadbg.visible = false;
	if(param.index==1){
		dataomd.removeAll();
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "没有找到外卖订单!";
		if(databus.length==0){
			tipFace_ui.visible = true;
		}else{
			tipFace_ui.visible = false;
		}
	}else if(databus.length==0){
		nf.toast("没有更多信息了");
		param.index--;
	}
	dataomd.addData(databus);
	for(var i=0;i<databus.length;i++){
		var pay = databus[i].payMent;
		var btn1Text="",btn1Vis=true,btn1Tag="";
		var btn2Text="",btn2Vis=true,btn2Tag="";
		var orderno = databus[i].orderno;
		var _param = {type:0,no:orderno,index:i+(param.size*(param.index-1))};
		switch(databus[i].state){
			case 0:
				if(pay==1){
					if(databus[i].overdue){
						btn2Vis=false;
					}else{
						btn2Text="付款";
						btn2Tag = {type:1,no:orderno,index:i+(param.size*(param.index-1))};
					}
				}else{
					if(databus[i].overdue){
						btn2Vis=false;
					}else{
						databus[i].stateStr="用户未确认";
						btn2Text="确认订单";
						btn2Tag = {type:1,no:orderno,index:i+(param.size*(param.index-1))};
					}
				}
				btn1Text="删除";
				btn1Tag={type:0,no:orderno,index:i+(param.size*(param.index-1))};
				break;
			case 1:
				btn2Vis=false;
				if(pay==1){
					btn1Text="退款";
					btn1Tag={type:-1,no:orderno,index:i+(param.size*(param.index-1))};
				}else{
					btn1Vis=false;
				}
				break;
			case 2:
				btn2Vis=false;
				if(pay==1){
					btn1Text="退款";
					btn1Tag={type:-1,no:orderno,index:i+(param.size*(param.index-1))};
				}else{
					btn1Vis=false;
				}
				break;
			case 3:
				if(pay==1){
					btn1Text="退款";
					btn1Tag={type:-1,no:orderno,index:i+(param.size*(param.index-1))};
					btn2Text="确认收货";
					btn2Tag={type:2,no:orderno,index:i+(param.size*(param.index-1))};
				}else{
					btn1Vis=false;
					btn2Vis=false;
				}
				break;
			case 9:
				btn2Vis=false;
				if(!databus[i].evaluate){
					btn1Text="评价";
					btn1Tag={type:9,no:orderno,index:i+(param.size*(param.index-1))};
				}else{
					btn1Vis=false;
				}
				break;
		};
		dataomd.updateOne(i+(param.size*(param.index-1)), {
			"token":databus[i].token,
			"title":databus[i].title,
			"pay":databus[i].pay,
			"payColor":databus[i].pay=="在线支付"? "62B0FFFF":"008000FF",
			"deliveryTime":"送达时间:"+databus[i].deliveryTime,
			"price":"￥"+databus[i].price,
			"imgx":30+(databus[i].state*150),
			"orderno":orderno,
			"btn1Text":btn1Text,
			"btn1Vis":btn1Vis,
			"btn1Tag":btn1Tag,
			"btn2Text":btn2Text,
			"btn2Vis":btn2Vis,
			"btn2Tag":btn2Tag,
			"stateStr":databus[i].stateStr
		});
	}
	listomd.refreshItems();
	listomd.rebound();
}).on("fail", function(data) {
	loadbg.visible = false;
	var tipLabel = ui(tipFace + ".do_Label_1");
	tipLabel.text = "服务器超时";
	tipFace_ui.visible = true;
});

listomd.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	isMore = true;
	isLoading = false;
	orderLoad();
}).on("pull",function(data){
	page.fire("pullevent", data);
	if (data.state != 2) return;
	isMore = false;
	isLoading = false;
	orderLoad();
});

//确认收货
var goods_http = mm("do_Http");
goods_http.method = "POST";// GET | POST
goods_http.timeout = 60000; // 超时时间 : 单位 毫秒
goods_http.contentType = "application/json"; // Content-Type
goods_http.on("success", function(databus) {
	if(databus.error_code==0){
		isLoading=true;
		isMore=false;
		orderLoad();
	}else{
		nf.toast("更新订单失败，请稍后在试");
	}
});

var number_http = mm("do_Http");
number_http.method = "POST";// GET | POST
number_http.timeout = 60000; // 超时时间 : 单位 毫秒
number_http.contentType = "application/json"; // Content-Type
number_http.on("success", function(databus) {
	if(databus!=-1){
		if(databus.noPay>0){
			btnList[1].text = "未付款("+databus.noPay+")";
		}else{
			btnList[1].text = "未付款";
		}
		if(databus.onGoing>0){
			btnList[2].text = "进行中("+databus.onGoing+")";
		}else{
			btnList[2].text = "进行中";
		}
	}
});

