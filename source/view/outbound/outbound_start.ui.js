var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var buttonAS = mm("do_Animation", "BUTTONTOUCHDOWN", "app");
var token = page.getData();
var global = sm("do_Global");
var user = global.getMemory("access_token");
var leftclose = ui("do_ALayout_close");
var Euc = encodeURIComponent;
var product = [];
var disPrice = 0;
//面板显示
var animPanelShow = mm("do_Animator");
var propsPS = {y:150,alpha:1};
animPanelShow.append(300,propsPS,"EaseOut");
//面板隐藏
var animPanelHide = mm("do_Animator");
var propsPH = {y:260,alpha:0};
animPanelHide.append(300,propsPH,"EaseOut");

deviceone.shopCart=[];    //购物车
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loading.ui", 0, 580));

var imgShow = rootview.add("imgShow","source://view/outbound/ob_cai_popcell.ui",0,0);
var imgShow_ui = ui(imgShow);
imgShow_ui.visible = false;
var collect = ui("do_ImageView_3");
var collect_ui = ui("do_ALayout_5");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("result",function(){
	if($U.tokenExist()){
		exist_http.url = $U.token($U.url.collectExist,"identity")+"&token="+Euc(token); // 请求的 URL
		exist_http.request();
	}
}).on("loaded",function(){
	global.setMemory("CARDDATA",[]);
	if($U.tokenExist()){
		exist_http.url = $U.token($U.url.collectExist,"identity")+"&token="+Euc(token); // 请求的 URL
		exist_http.request();
	}
	takeLoad();
}).on("EmptyAvailable",function(data){   //清空是否可用
	var do_empty = ui("do_empty");
	do_empty.visible = data;
});

function takeLoad(){
	var url = $U.url.takeInfo+"?token="+token; // 请求的 URL
	request_http.url = url;
    request_http.request();
}

var tb1,tb2,tb3,lb1,lb2,lb3,botline;
tb1 = ui("tab_1");tb2 = ui("tab_2");tb3 = ui("tab_3");
lb1 = ui("lab1");lb2 = ui("lab2");lb3 = ui("lab3");
var tbs = [tb1,tb2,tb3];
var lbs = [lb1,lb2,lb3];

var checkFun = function(index) {
	for (var i = 0; i < tbs.length; i++) {
		if (index == i) { // 表示选中了第几个
			lbs[i].fontStyle = "bold";
			lbs[i].fontSize = "36";
		} else {
			lbs[i].fontStyle = "normal";
			lbs[i].fontSize = "32";
		}
	}
}
//


var main_shower = ui("do_ViewShower_1");
//为viewshower增加3个页面，这3个页面和index.ui都属于上面的page对象的子控件
main_shower.addViews([ {
	id : "page1",// 页面的标示
	path : "source://view/outbound/caidan.ui"// 页面的路径
}, {
	id : "page2",
	path : "source://view/outbound/pingjia.ui"
}, {
	id : "page3",
	path : "source://view/outbound/shangjia.ui"
} ]);
// 初始化先显示第一个页面
main_shower.showView("page1");

tb1.on("touch", function() {
	show("page1",300);// 3000毫秒的动画效果
});
tb2.on("touch", function() {
	show("page2",300);// 3000毫秒的动画效果
});
tb3.on("touch", function() {
	show("page3",300);// 3000毫秒的动画效果
});

function show(pageid) {
	main_shower.showView(pageid);
	page.fire(pageid);
}

//已选好菜品列表
var listdataselyes = mm("do_ListData");
var listviewselyes = ui("do_ListView_selyes");
listviewselyes.bindItems(listdataselyes);


var selmask = ui("selyesmask");
var closesel = ui("do_ImageView_closesel");
var yespanel = ui("selyespanel");
yespanel.on("touch",function(){
	//面板touch事件,防止点击穿透
});
closesel.on("touch","",300,function(){
	closesel.animate(buttonA,function(){
		yespanel.animate(animPanelHide,function(){
			selmask.visible = false;
		});
	});
});
selmask.on("touch","","300",function(){
	yespanel.animate(animPanelHide,function(){
		selmask.visible = false;
	});
});
var take_file = "data://security/takeout";
//购物车
page.on("event1",function(display){
	selmask.visible = true;
	yespanel.animate(animPanelShow);
	cardLoad();
});
page.on("event2",function(display){
	cardLoad();
});

function cardLoad(){
	var cardData = global.getMemory("CARDDATA");
	listdataselyes.removeAll();
	if(cardData!=""){
		var m=-1,n=-1;
		for(var i=0;i<cardData.length;i++){
			if(cardData[i].token==token){
				m=i;
			}
		}
		var boxPrice = 0.0;
		if(m!=-1){
			listdataselyes.addData(cardData[m].list);
			for(var i=0;i<cardData[m].list.length;i++){
				var _data = cardData[m].list[i];
				for(var j=0;j<product.length;j++){
					if(product[j].type==1 && product[j].token==_data.token){
						n=j;
					}
				}
				listdataselyes.updateOne(i, {
					"template":0,
					"token":_data.token,
					"title":_data.title,
					"price":"￥"+_data.price,
					"boxPrice":_data.boxPrice,
					"index":n,
					"count":_data.count
				});
				boxPrice+=(_data.boxPrice*_data.count);  //餐盒费
			}
		}
	}
	if(listdataselyes.getCount()==0){
//		yespanel.animate(animBk,function(){
//			selmask.visible = false;
//		});
	}else{
		if(boxPrice>0){
			listdataselyes.addOne({"template":1,"title":"餐盒费","price":"￥"+parseFloat(boxPrice).toFixed(1)}); 
		}
	}
	listviewselyes.refreshItems();
}

//清空
var do_empty = ui("do_empty");
do_empty.on("touch","",300,function(){
	this.animate(buttonA);
	nf.confirm({text:"是否继续?",title:"清空已选",button1text:"确定",button2text:"取消"},function(datacall,e){
		if(datacall == 1){
			var json = [];
			var cardData = global.getMemory("CARDDATA");
			if(cardData!=""){
				for(var i=0;i<cardData.length;i++){
					if(cardData[i].token!=token){
						json[json.length] = cardData[i];
					}
				}
			}
			global.setMemory("CARDDATA",json);
			page.fire("cardNum",product);
			cardLoad();
		}
	});
	
});

var exist_http = mm("do_Http");
exist_http.method = "POST";// GET | POST
exist_http.timeout = 60000; // 超时时间 : 单位 毫秒
exist_http.contentType = "application/json"; // Content-Type
exist_http.on("success", function(databus) {
	if(databus.collect){
		collect.source = "source://image/fav_yes.png";
	}else{
		collect.source = "source://image/fav_no.png";
	}
});
//接收
var collect_http = mm("do_Http");
collect_http.method = "POST";// GET | POST
collect_http.timeout = 60000; // 超时时间 : 单位 毫秒
collect_http.contentType = "application/json"; // Content-Type
collect_http.on("success", function(databus) {
	if(databus.error_code!=-1){
		if(databus.token==1){
			collect.source = "source://image/fav_yes.png";
			nf.toast("收藏成功");
		}else{
			collect.source = "source://image/fav_no.png";
			nf.toast("取消收藏");
		}
	}else{
		nf.toast("网络异常");
	}
}).on("fail", function(data) {
    nf.toast("网络异常");
});
collect_ui.on("touch","",300,function(){
	collect_ui.animate(buttonAS,function(){
		if(!$U.tokenExist()){
			nf.toast("请先登录");
			app.openPage({
		    	source : "source://view/loginreg/login.ui",
		    	animationType: "slide_b2t",
		    	statusBarState : "transparent",
		    	statusBarFgColor : "white"
		    });
		}else{
		    collect_http.url = $U.token($U.url.collection,"userid")+"&_store="+Euc(token); // 请求的 URL
			collect_http.request(collect_http.url);
		}
	});
});

page.on("imgShow",function(data){
	var img = ui(imgShow + ".do_ImageView_1");
	if(data.path!=null){
		img.source = data.path;
	}else{
		img.source = "source://image/defult_food.png";
	}
	var title = ui(imgShow + ".do_Label_1");
	title.text = data.title;
	var sales = ui(imgShow + ".do_Label_3");
	sales.text = data.sales;
	var price = ui(imgShow + ".do_Label_2");
	price.text = data.price;
	var details = ui(imgShow + ".do_Label_4");
	details.text = data.details;
	
	//imgShow_ui.visible = true;
	page.fire("caipops","true");
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus!=-1){
		var title = ui("do_Label_1");
		title.text = databus.title;

		disPrice = databus.disPrice;
		
		page.fire("menuLoad",databus);
		
		tbs.forEach(function(dl,i){
			dl.on("touch", function(data) {
				checkFun(i);
				switch(i){
					case 1:
						page.fire("pingjia",[databus.token,databus.score,parseFloat(databus.score).toFixed(1),databus.number]);
						break;
					case 2:
						page.fire("infoLoad",databus);
						break;
				};
			})
		});
		menu_http.url = $U.url.appTakeMenu+"?token="+Euc(token); // 请求的 URL
		menu_http.request();
	}else{
		nf.toast("网络连接异常")
	}
});

var menu_http = mm("do_Http");
menu_http.method = "POST";// GET | POST
menu_http.timeout = 60000; // 超时时间 : 单位 毫秒
menu_http.contentType = "application/json"; // Content-Type
menu_http.on("success", function(databus) {
	loadbg.visible = false;
	product = databus;
	page.fire("menuList",databus);
});
