var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var network = sm("do_Network");
var algorithm = sm("do_Algorithm");
var socket = mm("do_Socket");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loading.ui", 0, 550));

var networkStatus = network.getStatus();
var param = {};
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	menuOrderLoad();
}).on("result",function(){
	menuOrderLoad();
});

//网络状态更换
network.on("changed", function(data) {
	if($U.networkWIFI(data)){
		//获取IP和端口
		request_http.url = $U.token($U.url.appSinglePointInvoicingList,"user"); // 请求的 URL
		request_http.request();
	}else{
		nf.toast("不在店铺WIFI,无法获取订单");
		panel.visible = false;
		loadbg.visible=false;
	}
});

function menuOrderLoad(){
	if($U.networkWIFI(networkStatus)){
		//获取IP和端口
		request_http.url = $U.token($U.url.appSinglePointInvoicingList,"user"); // 请求的 URL
		request_http.request();
	}else{
		nf.toast("不在店铺WIFI,无法获取订单");
		panel.visible = false;
	}
}

var aldetail = ui("do_ALayout_aldetail");
aldetail.on("touch",function(){
	aldetail.animate(buttonA,function(){
		//执行详情
		open.start("source://view/menuorder/menuorder_reckon.ui",{sameId:param.sameId,ip:param.ip,port:param.port});
	});
});

//计时器
var mTimer = mm("do_Timer");
mTimer.interval = 1000;
var maxVal = 59;

mTimer.on("tick", function(data, e) {
	btn2.text = maxVal-- +"秒后重发";
    if (maxVal < 0) {
    	maxVal = 59;
    	mTimer.stop();
    	btn2.text = "现金买单";
    	btn2.enabled = true;
    	btn2.fontColor = "EDA327FF";
    	textalyout.visible = false;
    }
});



var imgpays = ui("do_ImageView_5");
var prosbars = ui("do_ProgressBar_1");
var btn1 = ui("do_Button_1");
var btn2 = ui("do_Button_2");
btn1.on("touch",function(){
	btn1.animate(buttonA,function(){
		//loadbg.visible = true;
		open.start("source://view/menuorder/menuorder_reckon.ui",{sameId:param.sameId,ip:param.ip,port:param.port});
//		var sameStr = {type:5,sameId:param.sameId};
//		socket.connect(param.ip,param.port.toString(), function(data, e) {
//			if(data){
//				socket.send("UTF-8",JSON.stringify(sameStr) , function(data1, e) {
//					if(!data1){
//						loadbg.visible = false;
//						nf.alert("同步订单失败","在线支付");
//					}
//				});
//			}else{
//				nf.alert("呼叫信息发出失败!");
//			}
//		});
	});
});
//现金买单
var textalyout = ui("do_ALayout_10");
btn2.on("touch",function(){
	btn2.animate(buttonA,function(){
		imgpays.visible = false;
		prosbars.visible = true;
		nf.confirm({text:"呼叫前台买单?",title:"现金买单",button1text:"确定",button2text:"取消"},function(datacall,e){
			if(datacall == 1){
				//发出完成,并成功后执行下面的内容--如果失败,提示失败,并不执行下面的内容(但是执行imgpays.visible = true;prosbars.visible = false;)
				var sameStr = {type:6,sameId:param.sameId,user:$U.userToken()};
				socket.connect(param.ip,param.port.toString(), function(data, e) {
					if(data){
						socket.send("UTF-8",JSON.stringify(sameStr) , function(data1, e) {
							if(data1){
								nf.alert("呼叫信息已发出!");
								mTimer.start();
							}else{
								nf.alert("呼叫信息发出失败!");
							}
						});
					}else{
						nf.alert("呼叫信息发出失败!");
					}
				});
				imgpays.visible = true;
				prosbars.visible = false;
				btn2.enabled = false;
				btn2.fontColor = "999999FF";
				textalyout.visible = true;
				//执行内容END
			}else{
				imgpays.visible = true;
				prosbars.visible = false;
			}
		});
	});
});

var panel = ui("do_ALayout_6");
var img = ui("do_ImageView_3");   //店铺图片
var title = ui("do_Label_7");     //店铺名称
var price = ui("do_Label_9");     //订单金额

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus!=-1){
		socketListen(databus);
	}else{
		loadbg.visible = false;
		panel.visible = false;
	}
});

function socketListen(databus){
	param.ip = databus.ip;
	param.port = databus.port;
	var sameStr = {type:7,orderno:databus.orderno,user:$U.userToken()};
	socket.connect(databus.ip,databus.port.toString(), function(data, e) {
		if(data){
			socket.send("UTF-8",JSON.stringify(sameStr) , function(data1, e) {
				if(data1){
					param.orderno = databus.orderno;
					img.source = databus.path;
					title.text = databus.title;
					//price.text = parseFloat(databus.price);
					//panel.visible = true;
				}else{
					loadbg.visible = false;
				}
			});
		}else{
			loadbg.visible = false;
			panel.visible = false;
		}
	});
}

//接收数据 
socket.on("receive", function(data, e) {
	var json = hexToString(data);
	var databus = JSON.parse(json);
	
	switch(databus.type){
		case "-1":
			nf.toast(algorithm.base64Sync("decode", databus.message));
			break;
		case "0":
			price.text = parseFloat(databus.price).toFixed(2);
			param.sameId = databus.sameId;
			panel.visible = true;
			break;
		case 1:
			//在线支付
			param.type = 0;
			price.text = parseFloat(databus.price).toFixed(2);
			open.start("source://view/menuorder/menuorder_sureorder.ui",param);
			break;
	};
	loadbg.visible = false;
	socket.close();
});

//16进制转换字符串
function hexToString(val){
	var strInput = val;
    var nInputLength = strInput.length;
    if(nInputLength%2 == 0) //当输入够偶数位；
    {                 
        var StrHex = "";
        for (var i=0; i < nInputLength; i = i + 2 )
        {
        	var str = strInput.substr(i, 2); //16进制；
        	var n = parseInt(str, 16);//10进制；
        	StrHex = StrHex + String.fromCharCode(n);
        }
        return StrHex;
    }
    return "";
}