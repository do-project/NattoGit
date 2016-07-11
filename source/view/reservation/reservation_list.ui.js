var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var global = sm("do_Global");
var city_node = global.getMemory("city");
var location = global.getMemory("Location");
var listbg = ui("listviewbody");
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,350);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;
var $U = require("url");
var isMore = false;
var isLoading = true;
var pbar = ui(rootview.add("loadings","source://view/cells/loading2.ui",0,567));
//var _token = "";
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});

page.supportPanClosePage();
page.on("back","",300, function(){
	if(maskbody.visible == true){
		closepanel();
	}else{
		app.closePage();
	}
});

//商家列表
var listdatabus = mm("do_ListData");
var listviewbus = ui("do_ListView_outb");

listviewbus.bindItems(listdatabus);

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type

request_http.on("success", function(databus) {
	if(index==1){
		listdatabus.removeAll();
		var tipLabel = ui(tipFace + ".do_Label_1");
		tipLabel.text = "没有找到相关信息!";
		if(databus.rows.length==0){
			tipFace_ui.visible = true;
		}else{
			tipFace_ui.visible = false;
		}
	} else if(databus.rows.length==0){
		nf.toast("没有更多信息了");
		index--;
	}
	pbar.visible = false;
	listdatabus.addData(databus.rows);
	for(var i=0;i<databus.rows.length;i++){
		listdatabus.updateOne(i+(size*(index-1)), {
			"token":databus.rows[i].token,
			"path":databus.rows[i].path,
			"title":databus.rows[i].title,
			"cvm_str":databus.rows[i].cvm_str,
			"per_capita":"人均:"+databus.rows[i].per_capita,
			"discount":databus.rows[i].discount+"折",
			"showDiscount":databus.rows[i].showDiscount,
			"score":"source://image/star"+parseInt(databus.rows[i].score)+".png",
			"distance":parseFloat(databus.rows[i].distance/1000).toFixed(1)+"km"
		});
	}
	listviewbus.refreshItems();
	listviewbus.rebound();
}).on("fail", function(data) {
	pbar.visible = false;
	var tipLabel = ui(tipFace + ".do_Label_1");
	tipLabel.text = "服务器超时!";
	tipFace_ui.visible = true;
});

listviewbus.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	isMore = true;
	isLoading = false;
	reserveList();
}).on("pull",function(data){  //下拉刷新
	page.fire("pullevent", data);
	if (data.state != 2) return;
	isMore = false;
	isLoading = false; 
	reserveList();
});

page.on("loaded",function(){
	global.setMemory("MENUCART",[])
	
	panel1.visible = false;
	panel2.visible = false;
	panel3.visible = false;
	reserveList();
	category();
	areaLoad();
	sortLoad();
});
var size=15,index=1,sort=0,area="",node="",title="";

function reserveList(){
	//发送http(预定列表)
	if(isMore) index++;
	else index=1;
	if(isLoading){ 
		pbar.visible = true; 
		listdatabus.removeAll();
		listviewbus.refreshItems();
	}
	else pbar.visible = false;
	var url = $U.url.ReservationList+"?size="+size+"&index="+index+"&city="+city_node+"&area="+area+"&sort="+sort+"&node="+node+"&title="+title; // 请求的 URL
    if(location!=""){
    	url+="&userLocation="+location.latitude+","+location.longitude;
    }
    tipFace_ui.visible = false;
	request_http.url = url;
    request_http.request();
}

listviewbus.on("touch", function(index) {
	var token = listdatabus.getOne(index);
	open.start("source://view/reservation/reservation_start.ui",token.token);
});

var maskbody = ui("maskbox"); //遮罩
var dropbody = ui("droppanel"); //下拉面板
var listviewcon = ui("listviewbody"); //列表
var pane1 = dropbody.add("adcon1","source://view/cells/droppanel/dropcon1.ui",0,0);
var panel1 = ui(pane1);
var pane2 = dropbody.add("adcon2","source://view/cells/droppanel/dropcon2.ui",0,0);
var panel2 = ui(pane2);
var pane3 = dropbody.add("adcon3","source://view/cells/droppanel/dropcon3.ui",0,0);
var panel3 = ui(pane3);
var panels = [panel1,panel2,panel3];

//下拉列表点击事件
var dropbtn1,dropbtn2,dropbtn3;
dropbtn1 = ui("dropbtn1");dropbtn2 = ui("dropbtn2");dropbtn3 = ui("dropbtn3");
var dropbtns = [dropbtn1,dropbtn2,dropbtn3];
var paytouch = function(index){
	if(!panels[index].visible){
		dropbtns[index].fontColor = "FF6600FF";
		panels[index].visible = true;
		openpanel();
	}else{
		closepanel();
	}
	
	for(var i=0;i<dropbtns.length;i++){
		if(i!=index){
			dropbtns[i].fontColor = "444444FF";
			panels[i].visible = false;
		}
	}
};
dropbtns.forEach(function(dc,i){
	dc.on("touch", function(datac, e) {
		paytouch(i);
	});
});

//面板显示
var animPanelShow = mm("do_Animator");
var animPanelShow = mm("do_Animator");
var propsPS = {height:900};
var propsPS1 = {height:870};
animPanelShow.append(500,propsPS,"EaseOut");
animPanelShow.append(100,propsPS1,"EaseOut");
//面板隐藏
var animPanelHide = mm("do_Animator");
var propsPH = {height:0};
animPanelHide.append(400,propsPH,"EaseIn");
//遮罩显示
var animMaskShow = mm("do_Animator");
var propsMS = {bgColor:"000000AA"};
animMaskShow.append(500,propsMS,"EaseOut");
//遮罩隐藏
var animMaskHide = mm("do_Animator");
var propsMH = {bgColor:"00000000"};
animMaskHide.append(400,propsMH,"EaseIn");
//遮罩点击事件
maskbody.on("touch","",400,function(){
	closepanel();
});

function openpanel(){
	maskbody.visible = true;
	maskbody.animate(animMaskShow);
	dropbody.animate(animPanelShow);
}
function closepanel(n){
	maskbody.animate(animMaskHide,function(){
		panel1.visible = false;
		panel2.visible = false;
		panel3.visible = false;
		dropbtn1.fontColor = "444444FF";
		dropbtn2.fontColor = "444444FF";
		dropbtn3.fontColor = "444444FF";
		if(n){
			reserveList();
		}
		maskbody.visible = false;
	});
	dropbody.animate(animPanelHide);
}
//类目
function category(){
	var listviewlef = ui(pane1 + ".do_ListView_1");
	
	var leftdata = mm("do_ListData");
	
	var category_http = mm("do_Http");
	category_http.method = "POST";// GET | POST
	category_http.timeout = 60000; // 超时时间 : 单位 毫秒
	category_http.contentType = "application/json"; // Content-Type
	
	listviewlef.bindItems(leftdata);
	
	category_http.on("success", function(databus) {
		leftdata.addOne({ "token" : null, "title" : "全部"});
		leftdata.addData(databus);
		listviewlef.refreshItems();
	})
	
	//发送http(筛选目录)
	category_http.url = $U.url.reserveCategory+"?node=010000"; // 请求的 URL
	category_http.request();
	
	var btn = ui("dropbtn1");
	listviewlef.on("touch",function(index){
		var _node = leftdata.getOne(index).node;
		if(node!=_node){
			node = _node;
			node= node==undefined? "":node;
			var btnTitle = leftdata.getOne(index).title;
			isMore=false;
			closepanel(true);
			btn.text = btnTitle=="全部"? "全部菜系":btnTitle;
			isLoading = true;
			for(var i=0;i<leftdata.getCount();i++){
				leftdata.updateOne(i, {
					"title":leftdata.getOne(i).title,
					"count":leftdata.getOne(i).count,
					"node":leftdata.getOne(i).node,
					"bgcolor":i==index? "f2f2f2ff":"f2f2f200"
				});
			}
			listviewlef.refreshItems();
		}
	});
};
//区域
function areaLoad(){
	var listviewlef = ui(pane2 + ".do_ListView_1");
	
	var leftdata = mm("do_ListData");
	
	var category_http = mm("do_Http");
	category_http.method = "POST";// GET | POST
	category_http.timeout = 60000; // 超时时间 : 单位 毫秒
	category_http.contentType = "application/json"; // Content-Type
	
	listviewlef.bindItems(leftdata);
	
	category_http.on("success", function(databus) {
		leftdata.addOne({ "token" : null, "title" : "全城" });
		leftdata.addData(databus);
		listviewlef.refreshItems();
	})
	
	//发送http(筛选目录)
	category_http.url = $U.url.areaList+"?city="+city_node; // 请求的 URL
	category_http.request();
	var btn = ui("dropbtn2");
	listviewlef.on("touch",function(index){
		var _area = leftdata.getOne(index).token
		if(area!=_area){
			var btnTitle = leftdata.getOne(index).title;
			area = _area;
			area = area==undefined? "":area;
			isMore=false;
			closepanel(true);
			btn.text = btnTitle;
			isLoading = true;
			for(var i=0;i<leftdata.getCount();i++){
				leftdata.updateOne(i, {
					"title":leftdata.getOne(i).title,
					"token":leftdata.getOne(i).token,
					"bgcolor1":i==index? "f2f2f2ff":"f2f2f200"
				});
			}
			listviewlef.refreshItems();
		}
	});
}
var loadingbox = ui("listviewbody");
function loadings(){
	//rootview.add("loadings","source://view/cells/loading.ui",275,567);
};
//排序
function sortLoad(){
	var listviewlef = ui(pane3 + ".do_ListView_1");
	var leftdata = mm("do_ListData");
	listviewlef.bindItems(leftdata);
	storage.readFile("data://sorting.json",function(databus){
		leftdata.addData(databus);
		listviewlef.refreshItems();
	});
	var btn = ui("dropbtn3");
	listviewlef.on("touch",function(index){
		var _sort = leftdata.getOne(index).sort;
		if(sort!=_sort){
			var btnTitle = leftdata.getOne(index).TITTXT;
			sort = _sort;
			isMore=false;
			closepanel(true);
			btn.text = btnTitle;
			isLoading = true;
			for(var i=0;i<leftdata.getCount();i++){
				leftdata.updateOne(i, {
					"TITTXT":leftdata.getOne(i).TITTXT,
					"sort":leftdata.getOne(i).sort,
					"bgcolor2":i==index? "f2f2f2ff":"f2f2f200"
				});
			}
			listviewlef.refreshItems();
		}
	});
}

//搜索
var searchbtn = ui("do_ALayout_search");
searchbtn.on("touch","",300,function(){
	searchbtn.animate(buttonA,function(){
		app.openPage({
	    	source : "source://view/other/search.ui",
	    	animationType : "fade",
	    	keyboardMode:"visible",
	    	statusBarState : "transparent",
	    	statusBarFgColor : "black",
	    	data:1
	    });
	});
});
