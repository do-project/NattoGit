var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");

var isMore = false;
var isLoading = true;
var listbg = ui("listviewbody");
var loadbg = ui(listbg.add("loadings","source://view/cells/loadingbg.ui",0,0));
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,300);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;

var param = {type:0,size:15,index:1};

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	isMore=false;
	isLoading=true;
	orderlist();
}).on("result",function(data){
	if(data==-1){
		orderlist();
	}
});
page.supportPanClosePage();
var dataomd = mm("do_ListData");
var listomd = ui("do_ListView_1");

listomd.bindItems(dataomd);
function orderlist(){
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
	request_http.url = $U.token($U.url.appSinglePointAllList,"user")+"&size="+param.size+"&index="+param.index; // 请求的 URL
	request_http.request();
}

listomd.on("touch",function(index){
	var cell = dataomd.getOne(index);
	open.start("source://view/orders/order_menu_detail.ui",cell.token);
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
		tipLabel.text = "还没有点单订单!";
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
		var btn1Text="",btn1Vis=true,btn1Tag="",btn1Color="";
		var orderno = databus[i].orderno;
		var _param = {type:0,no:orderno,index:i+(param.size*(param.index-1))};
		switch(databus[i].state){
			case 0:
				_param.type = 0;
				btn1Text="付款";
				btn1Tag=_param;
				btn1Color = "00BF00FF";
				break;
			case 9:
				if(!databus[i].evaluate){
					btn1Text="评价";
					_param.type=9;
					btn1Tag=_param;
					btn1Color = "666666FF";
				}else{
					btn1Vis=false;
				}
				break;
		}
		var str = "",strColor="";
		switch(databus[i].pay){
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
		dataomd.updateOne(i+(param.size*(param.index-1)), {
			"token":databus[i].token,
			"buytypecolor":strColor,
			"buytime":"开台时间:"+databus[i].genTime,
			"buytype":str,
			"busimg":databus[i].path,
			"busname":databus[i].title,
			"buyprice":"￥"+parseFloat(databus[i].price).toFixed(2),
			"twrs":"台位:"+databus[i].sameNode+" | 人数:"+databus[i].num+"位",
			"btn1Vis":btn1Vis,
			"btn1Tag":btn1Tag,
			"btn1Text":btn1Text,
			"btn1Color":btn1Color,
			"orderno":databus[i].orderno,
			"ip":databus[i].ip,
			"port":databus[i].port
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
	orderlist();
}).on("pull",function(data){
	page.fire("pullevent", data);
	if (data.state != 2) return;
	isMore = false;
	isLoading = false;
	orderlist();
});