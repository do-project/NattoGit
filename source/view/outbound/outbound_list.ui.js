var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var pbar = ui(rootview.add("loadings","source://view/cells/loading2.ui",0,567));
var listbg = ui("listviewbody");
var tipFace = listbg.add("tipFace","source://view/other/tipInterface/tipFace.ui",0,350);
var tipFace_ui = ui(tipFace);
tipFace_ui.visible = false;
var global = sm("do_Global");
var city_node = global.getMemory("city");
var location = global.getMemory("Location");
var $U = require("url");
var isMore = false;
var isLoading = true;
var leftclose = ui("do_ALayout_close");
var currentPosition = ui("do_MarqueelLabel_1");  //当前位置
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
//当前位置 currentPosition
if(location!=""){
	currentPosition.text = location.address;
}else{
	currentPosition.text = "";
}
page.on("back", function(){
	if(maskbody.visible == true){
		closepanel();
	}else{
		app.closePage();
	}
});
//外卖列表
var listdatab = mm("do_ListData");
var listviewb = ui("do_ListView_outb");

listviewb.bindItems(listdatab);
var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type

request_http.on("success", function(databus) {
	if(index==1){
		listdatab.removeAll();
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
	listdatab.addData(databus.rows);
	for(var i=0;i<databus.rows.length;i++){
		var temp = databus.rows[i].avm.length>0? 1:0;
		var path = databus.rows[i].lvm;
		var at = databus.rows[i].avm;
		listdatab.updateOne(i+(size*(index-1)), {
			"template":temp,
			"path":databus.rows[i].path,
			"title":databus.rows[i].title,
			"score":"source://image/star"+parseInt(databus.rows[i].score)+".png",
			"sales":"月销:"+databus.rows[i].sales,
			//"annotation":"配送费"+databus.rows[i].disPrice+"元/"+parseFloat(databus.rows[i].distance/1000).toFixed(1)+"km",
			"annotation":"￥"+databus.rows[i].disPrice,
			"loactpos":"距离:"+parseFloat(databus.rows[i].distance/1000).toFixed(1)+"km",
			"token":databus.rows[i].token,
			"path1":path.length>0? path[0].path:"",
			"path2":path.length>1? path[1].path:"",
			"path3":path.length>2? path[2].path:"",
			"vpath1":path.length>0,
			"vpath2":path.length>1,
			"vpath3":path.length>2,
			"activity":at.length>0? at[0].title+"(在线支付专享)":"",
			"inBusiness":databus.rows[i].inBusiness,
			"inRest":databus.rows[i].inRest,
			"inReserve":databus.rows[i].inReserve,
			"beginTime":"接受预订,"+databus.rows[i].beginTime+"开始送餐",
			"deliveryTime":databus.rows[i].deliveryTime,
			"distance":"￥"+databus.rows[i].sincePrice
		});
	}
	listviewb.refreshItems();
	listviewb.rebound();
}).on("fail", function(data) {
	pbar.visible = false;
	var tipLabel = ui(tipFace + ".do_Label_1");
	tipLabel.text = "服务器超时!";
	tipFace_ui.visible = true;
});
var size=15,index=1,sort=0,area="",node="",title="";
page.on("loaded",function(){
	panel1.visible = false;
	panel2.visible = false;
	panel3.visible = false;
	
	category();
	areaLoad();
	sortLoad();
});

listviewb.on("push",function(data){
	page.fire("pushevent", data);
	if (data.state != 2) return;
	isMore = true;
	isLoading = false;
	takeList();
}).on("pull",function(data){
	page.fire("pullevent", data);
	if (data.state != 2) return;
	isMore = false;
	isLoading = false;
	takeList();
});

function takeList(){
	//发送http(外卖列表)
	if(isMore) index++;
	else index=1;
	if(isLoading) {
		tipFace_ui.visible = false;
		pbar.visible = true;
		listdatab.removeAll();
		listviewb.refreshItems();
	}
	else pbar.visible = false;
	var url = $U.url.takeList+"?size="+size+"&index="+index+"&city="+city_node+"&area="+area+"&sort="+sort+"&node="+node+"&title="+title; // 请求的 URL
	if(location!=""){
    	url+="&userLocation="+location.latitude+","+location.longitude;
    }
	request_http.url = url;
    request_http.request();
}

listviewb.on("touch", function(index) {
	var token = listdatab.getOne(index);
	open.start("source://view/outbound/outbound_start.ui",token.token);
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
	//deviceone.print(index);
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
			takeList();
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
		leftdata.addOne({ "token" : null, "title" : "全部菜系"});
		leftdata.addData(databus);
		listviewlef.refreshItems();
	})
	
	//发送http(筛选目录)
	category_http.url = $U.url.takeCategory+"?ser_id=2"; // 请求的 URL
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
			btn.text = btnTitle;
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
	var btn = ui("dropbtn2");
	var listviewlef = ui(pane2 + ".do_ListView_1");
	
	var leftdata = mm("do_ListData");
	
	var category_http = mm("do_Http");
	category_http.method = "POST";// GET | POST
	category_http.timeout = 60000; // 超时时间 : 单位 毫秒
	category_http.contentType = "application/json"; // Content-Type
	
	listviewlef.bindItems(leftdata);
	
	category_http.on("success", function(databus) {
		//leftdata.addOne({ "token" : null, "title" : "全城" });
		leftdata.addData(databus);
		area = databus[0].token;
		btn.text = databus[0].title;
		for(var i=0;i<leftdata.getCount();i++){
			leftdata.updateOne(i, {
				"title":leftdata.getOne(i).title,
				"token":leftdata.getOne(i).token,
				"bgcolor1":i==0? "f2f2f2ff":"f2f2f200"
			});
		}
		listviewlef.refreshItems();
		takeList();
	})
	
	//发送http(筛选目录)
	category_http.url = $U.url.areaList+"?city="+city_node; // 请求的 URL
	category_http.request();
	
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
	storage.readFile("data://sorting1.json",function(databus){
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
	    	data:2
	    });
	});
});
