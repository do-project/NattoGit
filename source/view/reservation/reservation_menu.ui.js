var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var open = require("open");
var global = sm("do_Global");
var rootview = ui("$");
var $U = require("url");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var Euc = encodeURIComponent;
var leftclose = ui("do_ALayout_close");
var token = page.getData();
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loading.ui", 0, 550));
var menuList = [];
deviceone.checked = "source://image/selyes.png";
deviceone.unchecked = "source://image/selno.png";

var menuHeight=[];
var _databus=[];
var _height=390;


var menuScroll = ui("do_ScrollView_2");
//遮罩显示
var animMaskShow = mm("do_Animator");
var propsMS = {bgColor:"000000AA"};
animMaskShow.append(600,propsMS,"EaseOut");
//遮罩隐藏
var animMaskHide = mm("do_Animator");
var propsMH = {bgColor:"00000000"};
animMaskHide.append(500,propsMH,"EaseIn");

//面板显示
var animPanelShow = mm("do_Animator");
var propsPS = {y:150};
animPanelShow.append(600,propsPS,"EaseOut");
//面板隐藏
var animPanelHide = mm("do_Animator");
var propsPH = {y:1350};
animPanelHide.append(500,propsPH,"EaseIn");

leftclose.on("touch",function(){
	empty();
	app.closePage({type:0});
});

page.on("back", function(){
	empty();
	app.closePage({type:0});
}).on("loaded",function(){
	var menuData = global.getMemory("MENUCART");
	if(menuData!=""){
		for(var i=0;i<menuData.length;i++){
			if(menuData[i].token==token){
				menuList = menuData[i].list;
				break;
			}
		}
	}
	menuLoad();
	menuClassLoad();
	totalPrice();
}).on("countupdate",function(data){
	var index = data.index;
	var count = data.count;
	var cell = caipindata.getOne(index);
	//添加购物车
	var product = {
		token:cell.token,
		title:cell.title,
		discountPrice:cell.discountPrice,
		price:cell._price,
		num:count,
		index:index
	};
	var flag = true;
	var datastr = product;
	for(var i = 0;i<menuList.length;i++){
		if(menuList[i].token==cell.token){
			flag = false;
			if(count>0){
				menuList[i].num = count;
			}else{
				menuList = deleteJson(i);
			}
		}
	}
	if(flag && count>0){
		menuList[menuList.length] = product;
	}
	totalPrice();
}).on("shopupdate",function(data){
	var index = data.index;
	var count = data.count;
	var cell = caipindata.getOne(index);
	for(var i = 0;i<menuList.length;i++){
		if(menuList[i].token==cell.token){
			flag = false;
			if(count>0){
				menuList[i].num = count;
			}else{
				page.fire("removeMenu",menuList[i].index);
				menuList = deleteJson(i);
			}
		}
	}
	cartLoad();
});
function deleteJson(n){
	var json = [];
	for(var i=0;i<menuList.length;i++){
		if(i!=n){
			json[json.length] = menuList[i];
		}
	}
	return json;
}

var number = ui("selnums");
var txtPrice = ui("do_Label_4");

//已选好菜品列表
var listdataselyes = mm("do_ListData");
var listviewselyes = ui("do_ListView_selyes");
listviewselyes.bindItems(listdataselyes);
//加载购物车
function cartLoad(){
	var _num=0,_price=0;
	listdataselyes.removeAll();
	listdataselyes.addData(menuList);
	for(var i=0;i<menuList.length;i++){
		listdataselyes.updateOne(i,{
			"token":menuList[i].token,
			"title":menuList[i].title,
			"price":menuList[i].price+"元",
			"index":menuList[i].index,
			"count":menuList[i].num,
		});
		_num+=menuList[i].num;
		_price+=menuList[i].price*menuList[i].num;
	}
	listviewselyes.refreshItems();
	
	number.text = _num;
	reckonbtn.visible=_num>0;
	btnEmpty.visible=_num>0;
	txtPrice.text = "￥"+_price.toFixed(2);
	
	selmask.visible = true;
	selmask.animate(animMaskShow);
	yespanel.animate(animPanelShow);
}
//计算价格
function totalPrice(){
	var _num=0,_price=0;
	for(var i=0;i<menuList.length;i++){
		_num+=menuList[i].num;
		_price+=menuList[i].price*menuList[i].num;
	}
	number.text = _num;
	txtPrice.text = "￥"+_price.toFixed(2);
	reckonbtn.visible=_num>0;
	btnEmpty.visible=_num>0;
}
//加载菜品
function menuLoad(){
	menu_http.url = $U.url.appMenuList+"?token="+Euc(token)+"&title=";
	menu_http.request();
}
//加载菜系
function menuClassLoad(){
	menuclass_http.url = $U.url.appMenuClassList+"?token="+Euc(token);;
	menuclass_http.request();
}

//菜系列表
var caixilistgird = ui("do_SegmentView_caixilist");
var caixidata = mm("do_ListData");
caixilistgird.bindItems(caixidata);

//菜品列表
var caipinlistgird = ui("do_GridView_caipinlist");
var caipindata = mm("do_ListData");
caipinlistgird.bindItems(caipindata);

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
var menu_http = mm("do_Http");
menu_http.method = "POST";// GET | POST
menu_http.timeout = 60000; // 超时时间 : 单位 毫秒
menu_http.contentType = "application/json"; // Content-Type
menu_http.on("success", function(databus) {
	_databus=databus;
	//菜品
	caipindata.addData(databus);
	for(var i=0;i<databus.length;i++){
		//menuHeight
		var flag = true;
		for(var j=0;j<menuHeight.length;j++){
			if(menuHeight[j].token==databus[i].classToken){
				flag=false;
			}
		}
		if(flag){
			menuHeight[menuHeight.length]={token:databus[i].classToken,height:parseInt(i/2)*_height};
		}
		var _num = getMenuNum(databus[i].token);
		databus[i].index = i;
		caipindata.updateOne(i, {
			"token":databus[i].token,
			"path":databus[i].path,
			"title":databus[i].title,
			"discountPrice":databus[i].discountPrice,
			"price":databus[i].price+"元/例",
			"_price":databus[i].price,
			"sales":"月售 : "+databus[i].sales+"份",
			"note":databus[i].note,
			"selected":_num>0? deviceone.checked:deviceone.unchecked,
			"classToken":databus[i].classToken,
			"index":i,
			"note":databus[i].note
		});
	}
	caipinlistgird.refreshItems();
	loadbg.visible=false;
});
//获取当前菜品的数量
function getMenuNum(_token){
	var _num=0;
	for(var i=0;i<menuList.length;i++){
		var _data = menuList[i];
		if(_data.token==_token){
			_num = _data.num;
			break;
		}
	}
	return _num;
}

var caixrighticon = ui("do_ImageView_right");
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

//菜品滚动事件
menuScroll.on("scroll",function(data){
	var n = parseInt(data/_height)*2;
	var cell = caipindata.getOne(n+1);
	var data_temp = caixidata.getRange(0);
	var cdatacount = caixidata.getCount();
	var _m=0,_n=[];
	for(var i = 0; i < cdatacount; i++){
		if(cell.classToken==data_temp[i].token){
			_m=i;
		}
	}
	//page.fire("caixiColor",_m);
});


var selmask = ui("selyesmask");
var opensel = ui("do_ALayout_opensel");
var closesel = ui("do_ImageView_closesel");
var yespanel = ui("selyespanel");
yespanel.on("touch",function(){
	//面板touch事件,防止点击穿透
});
closesel.on("touch","",300,function(){
	closesel.animate(buttonA,function(){
		selmask.animate(animMaskHide,function(){
			selmask.visible = false;
		});
		yespanel.animate(animPanelHide);
	});
});
opensel.on("touch","",300,function(){
	cartLoad();
});
selmask.on("touch","","300",function(){
	selmask.animate(animMaskHide,function(){
		selmask.visible = false;
	});
	yespanel.animate(animPanelHide);
});

//选好了
var reckonbtn = ui("do_ALayout_reckonbtn");
reckonbtn.on("touch","","300",function(){
	var menuData = global.getMemory("MENUCART");
	var _dataList = [];
	var flag = true;
	for(var i=0;i<menuData.length;i++){
		if(menuData[i].token==token){
			menuData[i].list = menuList;
			flag=false;
		}
	}
	_dataList = menuData;
	if(flag || menuData==""){
		if(menuList.length>0){
			_dataList[_dataList.length]={token:token,list:menuList};
		}
	}
	if(menuData=="" && menuList.length>0){
		_dataList=[{token:token,list:menuList}];
	}
	global.setMemory("MENUCART", _dataList);
	app.closePage({type:0});
});

//清空
var btnEmpty=ui("do_Button_1");
btnEmpty.on("touch","",300,function(){
	btnEmpty.animate(buttonA,function(){
	nf.confirm("确定要清空菜品？", "清空", "确定", "取消", function(data, e) {
		if(data==1){
			menuList=[];
			var menuData = global.getMemory("MENUCART");
			var _dataList = [];
			for(var i=0;i<menuData.length;i++){
				if(menuData[i].token!=token){
					_dataList[_dataList.length]=menuData[i];
				}
			}
			global.setMemory("MENUCART", _dataList);
			
			
			page.fire("removeAll");
			
			number.text = 0;
			txtPrice.text = "￥0.00";
			reckonbtn.visible=false;
			btnEmpty.visible=false;
		}
	});
	});
});

function empty(){
	if(menuList.length==0){
		menuList=[];
		var menuData = global.getMemory("MENUCART");
		var _dataList = [];
		for(var i=0;i<menuData.length;i++){
			if(menuData[i].token!=token){
				_dataList[_dataList.length]=menuData[i];
			}
		}
		global.setMemory("MENUCART", _dataList);
		
		
		page.fire("removeAll");
		
		number.text = 0;
		txtPrice.text = "￥0.00";
	}
}


//搜索菜品
var foodsearch = ui("do_ALayout_foodsearch");
foodsearch.on("touch","",300,function(){
	foodsearch.animate(buttonA,function(){
		app.openPage({
	    	source : "source://view/other/caiSearch.ui",
	    	animationType : "fade",
	    	keyboardMode:"visible",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "black",
	    	data : {databus:_databus,token:token,menuList:menuList}
	    });
	});
});
