var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var network = sm("do_Network");
var socket = mm("do_Socket");
var algorithm = sm("do_Algorithm");
var rootview = ui("$");
var $U = require("url");
var open = require("open");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loading.ui", 0, 550));

var popmenu = ui(rootview.add("menupop","source://view/menuorder/pop_menu.ui",0,0));
popmenu.visible = false;

var inputpople = ui(rootview.add("popleinput","source://view/menuorder/inputPople.ui",0,0));
inputpople.visible = false;

var Euc = encodeURIComponent;
deviceone.param = page.getData();
deviceone.param.sameId="";
var menuHeight=[];
var title = ui("do_Label_1");
title.text = deviceone.param.title;
var _height=390;

deviceone.checked = "source://image/selyes.png";
deviceone.unchecked = "source://image/selno.png";

deviceone.order = [];

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

var samePanel = ui("do_LinearLayout_7"); //台位面板
var sameNode = ui("do_Label_18");        //台位号
var sameNumber = ui("do_Label_19");      //台位人数
var samePrice = ui("do_Label_12");   //点单价格
var number = ui("do_Label_17");      //点单数量

var dian = ui("do_ALayout_21");

var menuScroll = ui("do_ScrollView_2");

var _bottom = ui("do_ALayout_17");
_bottom.on("touch",function(){
	//穿透
});
page.supportPanClosePage();
page.on("back", function(){
	if(popcaidemask.visible == true || selmask.visible == true){
		hideCaiDetailPanel();
		selmask.visible = false;
	}else{
		app.closePage();
	}
}).on("loaded",function(){
	if(deviceone.param.type==0){
		_height = 340;
		menuClassLoad();
		menuLoad();
	}else if(deviceone.param.type==1){
		_bottom.visible=true;
		detectionListen();
	}
}).on("OpenSame",function(data){   //开台
	var sameStr = {type:0,sameNode:data.sameName,people:data.People,user:$U.userToken()};
	socket.connect(deviceone.param.ip,deviceone.param.port.toString(), function(data, e) {
		if(data){
			socket.send("UTF-8",JSON.stringify(sameStr) , function(data1, e) {
				if(data1){
					nf.toast("开台成功,等待商家确认中...");
					inputpople.visible = false;
					//page.fire("disableButton");  //禁用开台确认按钮
					loadbg.visible=true;
				}
			});
		}else{
			nf.toast("发送失败，请重新点击发送");
		}
	});
}).on("countupdate",function(data){
	var index = data.index;
	var count = data.count;
	var cell = caipindata.getOne(index);
	//添加到下单
	var product = {
		token:cell.token,
		title:cell.title,
		discountPrice:cell.discountPrice,
		price:cell._price,
		num:count,
		index:index
	};
	if(count<=0){
		page.fire("removeMenu",index);
	}
	var flag = true;
	var datastr = product;
	for(var i = 0;i<deviceone.order.length;i++){
		if(deviceone.order[i].token==cell.token){
			flag = false;
			if(count>0){
				deviceone.order[i].num = count;
			}else{
				deviceone.order = deleteJson(i);
			}
		}
	}
	if(flag && count>0){
		deviceone.order[deviceone.order.length] = product;
	}
	cartLoad();
}).on("result",function(data){
	if(data!=""){
		if(data.type==9){   //点菜完成
			nf.toast("通知商家成功，请在结账单中确认已点的菜品");
			deviceone.order = [];
			page.fire("removeAll");
			cartLoad();
		}
	}
}).on("LoginVisible",function(data){
	loadbg.visible=data;
});
function deleteJson(n){
	var json = [];
	for(var i=0;i<deviceone.order.length;i++){
		if(i!=n){
			json[json.length] = deviceone.order[i];
		}
	}
	return json;
}
//已选好菜品列表
var listdataselyes = mm("do_ListData");
var listviewselyes = ui("do_ListView_selyes");
listviewselyes.bindItems(listdataselyes);

//加载点单
function cartLoad(){
	var _price = 0;
	number.text = "已选("+deviceone.order.length+")";
	if(deviceone.order.length>0){
		opensel.enabled = true;
	}else{
		opensel.enabled = false;
	}
	listdataselyes.removeAll();
	listdataselyes.addData(deviceone.order);
	for(var i=0;i<deviceone.order.length;i++){
		var _data = deviceone.order[i];
		listdataselyes.updateOne(i, {
			"title":_data.title,
			"price":_data.price+"元",
			"index":_data.index,
			"count":_data.num
		});
		_price+=_data.price*_data.num;
	}
	listviewselyes.refreshItems();
	
	samePrice.text = _price;
};

//加载菜品
function menuLoad(){
	menu_http.url = $U.url.appMenuList+"?token="+Euc(deviceone.param.token)+"&title=";
	menu_http.request();
}
//加载菜系
function menuClassLoad(){
	menuclass_http.url = $U.url.appMenuClassList+"?token="+Euc(deviceone.param.token);;
	menuclass_http.request();
}

//菜系列表
var caixilistgird = ui("do_SegmentView_caixilist");
var caixidata = mm("do_ListData");
caixilistgird.bindItems(caixidata);

var menuclass_http = mm("do_Http");
menuclass_http.method = "POST";// GET | POST
menuclass_http.timeout = 60000; // 超时时间 : 单位 毫秒
menuclass_http.contentType = "application/json"; // Content-Type
menuclass_http.on("success", function(databus) {
	//菜系分类
	caixidata.addData(databus);
	for(var i=0;i<databus.length;i++){
		caixidata.updateOne(i,{
			"token":databus[i].token,
			"title":databus[i].title,
			"fontColor" : i==0? "E6852DFF":"555555FF",
			"bgColor" : i==0? "F6F6F6FF":"F6F6F600",
			"fontStyle" : i==0? "bold":"normal",
			"index":i
		})
	}
	caixilistgird.refreshItems();
});
//菜系选择
caixilistgird.on("indexChanged",function(index){
	var data_temp = caixidata.getRange(0);
	var cdatacount = caixidata.getCount();
	for(var i = 0; i < cdatacount; i++){
		caixidata.updateOne(i,{
			"token":data_temp[i].token,
			"title" : data_temp[i].title,
			"fontColor" : i==index? "E6852DFF":"555555FF",
			"bgColor" : i==index? "F6F6F6FF":"F6F6F600",
			"fontStyle" : i==index? "bold":"normal",
			"index":i
		});
	}
	caixilistgird.refreshItems();
	//滑动高度
	if(menuHeight.length>index){
		if(menuHeight[index].height>0){
			menuScroll.scrollTo(menuHeight[index].height);
		}else{
			menuScroll.toBegin();
		}
	}
});

//菜品列表
var caipinlistgird = ui("do_GridView_caipinlist");
var caipindata = mm("do_ListData");
caipinlistgird.bindItems(caipindata);

var menu_http = mm("do_Http");
menu_http.method = "POST";// GET | POST
menu_http.timeout = 60000; // 超时时间 : 单位 毫秒
menu_http.contentType = "application/json"; // Content-Type
menu_http.on("success", function(databus) {
	//菜品
	caipindata.addData(databus);
	for(var i=0;i<databus.length;i++){
		var flag = true;
		for(var j=0;j<menuHeight.length;j++){
			if(menuHeight[j].token==databus[i].classToken){
				flag=false;
			}
		}
		if(flag){
			menuHeight[menuHeight.length]={token:databus[i].classToken,height:parseInt(i/2)*_height};
		}
		databus[i].index = i;
		caipindata.updateOne(i, {
			"template":1,
			"token":databus[i].token,
			"path":databus[i].path,
			"BigPath":databus[i].BigPath,
			"title":databus[i].title,
			"discountPrice":databus[i].discountPrice,
			"price":databus[i].price+"元/例",
			"_price":databus[i].price,
			"sales":"月售 : "+databus[i].sales+"份",
			"note":databus[i].note,
			"type":6,
			"selected":0,
			"classToken":databus[i].classToken,
			"index":i,
			"note":databus[i].note,
			"BigPath":databus[i].BigPath
		});
	}
	caipinlistgird.refreshItems();
	deviceone.param.menuList = databus;
	loadbg.visible=false;
});


//添加菜品弹出内容
var cpdinnerbox = ui("cpdetailinnerbox"); //添加UI面板
var popcaidemask = ui("popcaidetailmask"); //遮罩
cpdinnerbox.on("touch",function(){
});
popcaidemask.on("touch","","300",function(){
	hideCaiDetailPanel();
});

function showCaiDetailPanel(){
	popcaidemask.visible = true;
	
	cpdinnerbox.animate(animpopp);
	
};
function hideCaiDetailPanel(){
	cpdinnerbox.animate(animpoppHide,function(){
		popcaidemask.visible = false;
	});
};
//遮罩显示
var animMaskShow = mm("do_Animator");
var propsMS = {bgColor:"000000AA"};
animMaskShow.append(500,propsMS,"EaseOut");
//遮罩隐藏
var animMaskHide = mm("do_Animator");
var propsMH = {bgColor:"00000000"};
animMaskHide.append(400,propsMH,"EaseIn");

//面板显示
var animPanelShow = mm("do_Animator");
var propsPS = {y:355};
animPanelShow.append(500,propsPS,"EaseOut");
//面板隐藏
var animPanelHide = mm("do_Animator");
var propsPH = {y:1230};
animPanelHide.append(400,propsPH,"EaseIn");

var selmask = ui("selyesmask");
var opensel = ui("lookyixuan");//已选
var closesel = ui("do_ImageView_closesel");
var yespanel = ui("selyespanel");
yespanel.on("touch",function(){
	//面板touch事件,防止点击穿透
});
closesel.on("touch",function(){
	closesel.animate(buttonAS);
	yespanel.animate(animPanelHide);
	selmask.animate(animMaskHide,function(){
		selmask.visible = false;
	});
});
//已选
opensel.on("touch",function(){
	if(deviceone.order.length>0){
		opensel.animate(buttonA);
		if(selmask.visible == false){
			selmask.visible = true;
			selmask.animate(animMaskShow);
			yespanel.animate(animPanelShow);
		}else{
			yespanel.animate(animPanelHide);
			selmask.animate(animMaskHide,function(){
				selmask.visible = false;
			});
		}
	}
});
selmask.on("touch","","300",function(){
	yespanel.animate(animPanelHide);
	selmask.animate(animMaskHide,function(){
		selmask.visible = false;
	});
});
//发送menu
var sendmenubtn = ui("do_Button_sendmenu");
sendmenubtn.on("touch","",300,function(){
	sendmenubtn.animate(buttonA,function(){
		if(deviceone.param.sameId==""){
			inputpople.visible = true;
		}else{
			if(deviceone.order.length>0){
				open.start("source://view/menuorder/menuorder_carte.ui",{sameId:deviceone.param.sameId,order:deviceone.order,ip:deviceone.param.ip,port:deviceone.param.port});
			}else{
				nf.toast("空菜单不能提交，请选择您要点的菜品");
			}
		}
	});
});
//呼叫服务
var hujiaobtn = ui("do_ALayout_3");
hujiaobtn.on("touch","",300,function(){
	hujiaobtn.animate(buttonA);
	popmenu.visible = true;
});
page.on("popmenu",function(data){
	popmenu.visible = data;
});
//搜索菜品
var foodsearch = ui("do_ALayout_foodsearch");
foodsearch.on("touch","",300,function(){
	foodsearch.animate(buttonA,function(){
		app.openPage({
	    	source : "source://view/menuorder/caiSearch.ui",
	    	animationType : "fade",
	    	keyboardMode:"visible",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "black",
	    	data : {orderList:deviceone.order,foodList:deviceone.param.menuList,type:deviceone.param.type}
	    });
	});
});
//LOADED事件
page.on("loaded",function(){
	cpdinnerbox.add("caodcell","source://view/cells/caidetail_cell.ui",0,0);
});
//网络状态更换
//network.on("changed", function(data) {
//    nf.toast("网络状态已更改，请重新连接");
//    app.closePage();
//});

//检测侦听
function detectionListen(){
	var data = network.getStatus();
	if($U.networkWIFI(data)){
		//获取IP和端口
		ip_http.url = $U.url.appStorePort+"?token="+Euc(deviceone.param.token); // 请求的 URL
		ip_http.request();
	}else{
		nf.toast("您当前环境不是WIFI状态");
		app.closePage();
	}
}
//开始侦听
function startListen(flag){
	socket.connect(deviceone.param.ip,deviceone.param.port.toString(), function(data, e) {
		if(data){
			//发送用户ID获取菜品列表
			var str = {type:-1,user:$U.userToken()};
			socket.send("UTF-8",JSON.stringify(str) , function(data1, e) {
				if(!data1){
					nf.toast("连接已断开，请重新连接");
					app.closePage();
				}
			});
		}else{
			nf.alert("无法与商家交互，请查看网络状态或询问商家是否开启点单功能","商家点单");
			app.closePage();
		}
	});
}
// 接收数据
var joint = "";
socket.on("receive", function(data, e) {
	var flag = true;
	var json = hexToString(data);
	if(json.indexOf("[Begin]")!=-1 && json.indexOf("[/Begin]")!=-1){
		json = json.replace("[Begin]","");
		json = json.replace("[/Begin]","");
		flag=true;
	}else if(json.indexOf("[Begin]")!=-1){
		json = json.replace("[Begin]","");
		joint = json;
		flag=false;
	}else if(json.indexOf("[/Begin]")!=-1){
		json = json.replace("[/Begin]","");
		joint += json;
		json = joint;
		joint = "";
		flag=true;
	}
	if(flag){
		var databus = JSON.parse(json);
		
		switch(databus.type){
			case "-2":
				nf.toast("该台位账单已结清");
				socket.close();
				app.closePage();
				break;
			case "-1":
				loadbg.visible=false;
				nf.toast(algorithm.base64Sync("decode", databus.message));
				break;
			case "0":   //菜品列表
				if(databus.token==deviceone.param.token){
					//开始显示菜系和菜品
					//菜系分类
					caixidata.addData(databus.FoodClass);
					for(var i=0;i<databus.FoodClass.length;i++){
						caixidata.updateOne(i,{
							"token":databus.FoodClass[i].token,
							"title":algorithm.base64Sync("decode", databus.FoodClass[i].title),
							"fontColor" : i==0? "E6852DFF":"555555FF",
						    "bgColor" : i==0? "F6F6F6FF":"F6F6F600",
						    "fontStyle" : i==0? "bold":"normal",
						    "index":i
					    });
				    }
				caixilistgird.refreshItems();
				//菜品列表
				caipindata.addData(databus.FoodList);
				for(var i=0;i<databus.FoodList.length;i++){
					var flag = true;
					for(var j=0;j<menuHeight.length;j++){
						if(menuHeight[j].token==databus.FoodList[i].classToken){
							flag=false;
						}
					}
					if(flag){
						menuHeight[menuHeight.length]={token:databus.FoodList[i].classToken,height:parseInt(i/2)*_height};
					}
					databus.FoodList[i].index = i;
					caipindata.updateOne(i, {
						"template":0,
						"token":databus.FoodList[i].token,
						"path":databus.FoodList[i].path,
						"title":algorithm.base64Sync("decode", databus.FoodList[i].title),
						"discountPrice":parseFloat(databus.FoodList[i].discountPrice),
						"price":parseFloat(databus.FoodList[i].price)+"元/例",
						"_price":parseFloat(databus.FoodList[i].price),
						"sales":"已售 : "+databus.FoodList[i].sales+"份",
						"note":databus.FoodList[i].note,
						"selected":0,
						"classToken":databus.FoodList[i].classToken,
						"index":i,
						"note":algorithm.base64Sync("decode", databus.FoodList[i].note),
						"BigPath":databus.FoodList[i].BigPath
					});
				}
				caipinlistgird.refreshItems();
				if(databus.same!=""){   //已有台位信息
					openSame(databus);
				}else{
					//选择台位
					inputpople.visible = true;
				}
				deviceone.param.menuList = databus.FoodList;
				loadbg.visible=false;
			}else{
				nf.toast("店铺选择有误，请选择当前WIFI所在的店铺");
				app.closePage();
			}
			break;
		case "1":  //开台成功
			openSame(databus);
			loadbg.visible=false;
			break;
		};
		socket.close();
	}
});
//已经开台后显示信息
function openSame(databus){
	hujiaobtn.enabled=true;  //操作按钮可用
	inputpople.visible = false;  //隐藏台位面板
	sameNode.text = "台位:"+databus.same;
	sameNumber.text = "人数:"+databus.people+"位";
	samePanel.visible = true;
	deviceone.param.sameId = databus.sameId;
	sendmenubtn.text = "下单";
}

//获取ip和端口
var ip_http = mm("do_Http");
ip_http.method = "POST";// GET | POST
ip_http.timeout = 60000; // 超时时间 : 单位 毫秒
ip_http.contentType = "application/json"; // Content-Type
ip_http.on("success", function(databus) {
	if(databus!=-1){
		deviceone.param.ip = databus.ip;
		deviceone.param.port = databus.port;
		startListen(true);
	}else{
		nf.toast("获取店铺IP失败，请检查网络");
		app.closePage();
	}
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

if(deviceone.param.type==0){
	dian.visible=false;
	sendmenubtn.visible=false;
	opensel.visible=false;
	hujiaobtn.visible=false;
}
