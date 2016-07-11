var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var $U = require("url");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var listviewcai = ui("do_ListView_1");
var caiData = mm("do_ListData");
var global = sm("do_Global");
var Euc = encodeURIComponent;
var token = "";  //店铺令牌
var disPrice = 0;    //配送费
var sincePrice = 0;  //起送价
var totalPrice = 0;  //总价格
var inRest = false;  //店铺是否休息中
var label = ui("do_Label_13"); //购物车数量
var totalLabel = ui("do_Label_11");  //总价格
var gopay = ui("do_Button_gopay");
var menuLocation = [];  //菜系点击菜品变换位置
var proLocation = [];   //菜品滚动菜系变换


listviewcai.bindItems(caiData);

//已选touch事件
var ob_btnselyes = ui("ob_btnselyes");
ob_btnselyes.on("touch",function(){
	if(parseInt(label.text)>0){
		page.fire("event1",true);
	}
});
//加载店铺信息
page.on("menuLoad",function(data){
	token = data.token;  
	var disPriceui = ui("do_Label_15");
	disPriceui.text = "配送费:￥"+data.disPrice;
	disPrice = data.disPrice;
	inRest = data.inRest;
	//deviceone.print(data.inRest);
	sincePrice = data.sincePrice;

	notice_http.url = $U.url.appStoreNotice+"?token="+Euc(token)+"&ser_id=2"; // 请求的 URL
	notice_http.request();
	
	class_http.url = $U.url.appTakeMenuClass+"?token="+Euc(token); // 请求的 URL
	class_http.request();
	cardInfo();
}).on("menuList",function(databus){
	takeProduct(databus);
}).on("result",function(data){
	if(data.url!=undefined && data.url!=""){
		if(data.param!=undefined && data.param!=""){
			open.start(data.url,data.param);
		}else{
			open.start(data.url);
		}
	}
});

listviewcai.on("touch",function(index){
	//page.fire("colorupdate",index);
	var cell = caiData.getOne(index);
	for(var i=0;i<caiData.getCount();i++){
		var cell = caiData.getOne(i);
		caiData.updateOne(i, {
			"token":cell.token,
			"title":cell.title,
			"FONTCOL":i==index? "2291FFFF":"444444FF",
			"BGCOL":i==index? "FFFFFFFF":"F2F2F2FF",
			"index":i
		});
	}
	listviewcai.refreshItems();
	//点击滚到到指定位置
	viewcailist.scrollToPosition(menuLocation[index],false);
});
//加载商品
function takeProduct(databus){
	if(databus!=-1){
		caiDatalist.removeAll();
		caiDatalist.addData(databus);
		var cardData = global.getMemory("CARDDATA");
		var _menu=0;
		for(var i=0;i<databus.length;i++){
			if(databus[i].type==0){
				_menu++;
				menuLocation[menuLocation.length]=i;
				caiDatalist.updateOne(i, {
					"template":0,
					"title":databus[i].title,
					"cateToken":databus[i].cateToken,
					"token":databus[i].token
				});
			}else{
				var dataList = {count:0,panel:false};
				var _token = databus[i].token;
				if(cardData!=undefined){
					for(var n=0;n<cardData.length;n++){
						if(cardData[n].token == token){  //判断是否同一个店铺
							for(var j=0;j<cardData[n].list.length;j++){
								var _data = cardData[n].list[j];
								if(_data.token==_token){ //判断是否同一个商品
									dataList.count = _data.count;
									dataList.panel = _data.count>0? true:false;
								}
							}
						}
					}
				}
				var forbid = false;
				var inventorypanel=false;
				if(!inRest && databus[i].inventory!=0)
					forbid=true;
				if(!inRest && databus[i].inventory==0)
					inventorypanel = true;
				
				var _tem = 1;
				if(databus[i].path== "" || databus[i].path==null){
					_tem = 2;
				}
				var _details = databus[i].details;
				if(databus[i].details == "" || databus[i].details == null){
					_details = " ";
				}
				caiDatalist.updateOne(i, {
					"template":_tem,
					"path":databus[i].path,
					"title":databus[i].title,
					"sales":"月售:"+databus[i].sales,
					"cateToken":databus[i].cateToken,
					"price":"￥"+ databus[i].price+"/"+databus[i].unit,
					"_price": + databus[i].price,
					"token":_token,
					"inventory":databus[i].inventory,
					"index":i,
					"count":dataList.count,
					"panel":dataList.panel,
					"boxPrice":databus[i].boxPrice,
					"forbid":forbid,//inRest || databus[i].inventory==0? false:true,
					"inventorypanel":inventorypanel,//!inRest && databus[i].inventory==0? true:false,
					"bigPath":databus[i].bigPath,
					"details":_details
				});
			}
			proLocation[proLocation.length]=_menu-1;
		}
		viewcailist.refreshItems();
	}
}
var viewcailist = ui("do_ListView_2");
var caiDatalist = mm("do_ListData");
viewcailist.bindItems(caiDatalist);

viewcailist.on("scroll",function(data){
	var _index = proLocation[data.firstVisiblePosition];  //当前菜系应滚动的位置
	//deviceone.print(_index);
	var cell = caiData.getOne(_index);
	for(var i=0;i<caiData.getCount();i++){
		var cell = caiData.getOne(i);
		caiData.updateOne(i, {
			"token":cell.token,
			"title":cell.title,
			"FONTCOL":i==_index? "2291FFFF":"444444FF",
			"BGCOL":i==_index? "FFFFFFFF":"F2F2F2FF",
			"index":i
		});
	}
	listviewcai.refreshItems();
	//page.fire("colorupdate",_index);
});
page.on("countupdate",function(data){
	cartUpdate(data);
}).on("shopupdate",function(data){
	cartUpdate(data);
});
//更新购物车
function cartUpdate(data){
	var index = data.index;
	var count = data.count;
	var celldata = caiDatalist.getOne(index);
	if(celldata.inventory!=-1 && count>celldata.inventory){
		nf.toast(celldata.title+"剩余数量不足");
		count = celldata.inventory;
	}
	//page.fire("productNumber",{index:index,count:count});
	var cell = caiDatalist.getOne(index);
	var _panel = count>0?true:false;
	cell.count = count;
	cell.panel=_panel;
	caiDatalist.updateOne(index,cell);
	viewcailist.refreshItems();
	var product = {
			token:celldata.token,
			title:celldata.title,
			count:count,
			inventory:celldata.inventory,
			price:celldata._price,
			boxPrice:celldata.boxPrice
	};
	var flag = true;
	var cardData = global.getMemory("CARDDATA");
	var datastr = product;
	if(cardData!=""){
		var m = -1;
		for(var i = 0;i<cardData.length;i++){
			if(cardData[i].token == token){  //判断是否同一个店铺
				for(var j=0;j<cardData[i].list.length;j++){
					var _data = cardData[i].list[j];
					if(_data.token==celldata.token){ //判断是否同一个商品
						_data.count = count;
						if(count>0){
							datastr = cardData;
						}else{
							datastr = deleteJson(cardData,_data.token);
						}
						flag = false;
					}
				}
				m=i;
			}
		}
		if(flag){
			if(m==-1){  //添加一个新的店铺
				cardData[cardData.length] = {token:token,list:[product]}
			}else{  //在当前店铺中修改添加商品
				var n = cardData[m].list.length;
				cardData[m].list[n] = product;
			}
			datastr = cardData;
		}
	}else{
		datastr = [{token:token,list:[product]}];
	}
	global.setMemory("CARDDATA",datastr);
	cardInfo();
	page.fire("event2",false);
}
function deleteJson(obj,id){
	var json = [];
	for(var i=0;i<obj.length;i++){
		if(obj[i].token == token){  //判断是否同一个店铺
			var j1 = {token:token,list:[]};
			for(var j=0;j<obj[i].list.length;j++){
				var _data = obj[i].list[j];
				if(_data.token!=id && _data.count>0){
					j1.list[j1.list.length] = _data;
				}
			}
			if(j1.list.length>0){
				json[json.length] = j1;
			}
		}else{
			json[json.length] = obj[i];
		}
	}
	return json;
}
page.on("cardNum",function(data){
	var cardData = global.getMemory("CARDDATA");
	cardInfo();
	takeProduct(data);
});
function cardInfo(){
	var cardData = global.getMemory("CARDDATA");
	
	if(inRest){
		gopay.bgColor = "2291FF00";
		gopay.enabled = false;
		gopay.text = "休息中";
	}else{
		var num = 0;
		var total = 0;
		var flag = false;
		if(cardData!=null && cardData.length>0){
			for(var i=0;i<cardData.length;i++){
				if(cardData[i].token == token){  //判断是否同一个店铺
					for(var j=0;j<cardData[i].list.length;j++){
						var _data = cardData[i].list[j];
						num += _data.count*1;
						total+=_data.count*_data.price;
						total+=_data.count*_data.boxPrice;
					}
				}
			}
		}
		if(num>0){
			ob_btnselyes.bgColor = "DCCA23FF";
			if(total<sincePrice*1){
				gopay.bgColor = "0BBCFF00";
				gopay.enabled = false;
				gopay.text = "差"+parseFloat(sincePrice-total).toFixed(2)+"元起送";
			}else{
				gopay.bgColor = "0BBCFFFF";
				gopay.enabled = true;
				gopay.text = "去结算";
				flag=true;
			}
			//total+=disPrice;  //加上配送费
		}else{
			ob_btnselyes.bgColor = "D0D0D0FF";
			gopay.bgColor = "0BBCFF00";
			gopay.enabled = false;
			if(sincePrice*1>0){
				gopay.text = "差"+sincePrice+"元起送";
			}else{
				gopay.text = "去结算";
				flag=true;
			}
		}
		label.text = num;
		totalPrice = total;
		totalLabel.text = "￥"+parseFloat(total).toFixed(2);
		page.fire("EmptyAvailable",flag);
	}
}
//结算按钮事件
gopay.on("touch","",300,function(){
	if(!$U.tokenExist()){
		app.openPage({
	    	source : "source://view/loginreg/login.ui",
	    	animationType: "slide_b2t",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "white",
	    	data:{url:"source://view/outbound/outbound_suborder.ui",param:[token,(totalPrice+disPrice)]}
	    });
	}else{
		gopay.animate(buttonA,function(){
			open.start("source://view/outbound/outbound_suborder.ui",[token,(totalPrice+disPrice)]);
		});
	}
});

var notice_http = mm("do_Http");
notice_http.method = "POST";// GET | POST
notice_http.timeout = 60000; // 超时时间 : 单位 毫秒
notice_http.contentType = "application/json"; // Content-Type
notice_http.on("success", function(databus) {
	var notice = ui("do_MarqueeLabel2");
	if(databus.error_code==0){
		notice.text = databus.reason==null? "暂无":databus.reason;
	}else{
		databus.reason = "暂无";
	}
});

var class_http = mm("do_Http");
class_http.method = "POST";// GET | POST
class_http.timeout = 60000; // 超时时间 : 单位 毫秒
class_http.contentType = "application/json"; // Content-Type
class_http.on("success", function(databus) {
	if(databus!=-1){
		caiData.addData(databus);
		for(var i=0;i<databus.length;i++){
			caiData.updateOne(i, {
				"token":databus[i].token,
				"title":databus[i].title,
				"FONTCOL":i==0? "2291FFFF":"444444FF",
				"BGCOL":i==0? "FFFFFFFF":"F2F2F2FF",
				"index":i
			});
		}
		listviewcai.refreshItems();
	}
});