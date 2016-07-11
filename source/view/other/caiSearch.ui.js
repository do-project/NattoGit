var page = sm("do_Page");
var app = sm("do_App");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var Euc = encodeURIComponent;
var caibg = ui("searchbg");
var open = require("open");
var rootview = ui("$");
var param=page.getData();

var caiclose = ui("do_ALayout_close");
caiclose.on("touch","",500,function(){
	caiclose.animate(buttonA,function(){
		app.closePage();
	});
});
page.on("back",function(){
	app.closePage();
});
var scrollt = ui("do_ScrollView_1");
caibg.on("touch",function(){
	page.hideKeyboard();
	textf.setFocus(false);
});
rootview.on("touch",function(){
	page.hideKeyboard();
	textf.setFocus(false);
});
var textf = ui("do_TextField_1");  //搜索框

var searchUI=ui("do_GridView_1");
var searchData=mm("do_ListData");
searchUI.bindItems(searchData);
//顶部显示动画
var animHDdown = mm("do_Animator");
var propshd = {y:0};
animHDdown.append(300,propshd,"EaseOut");
var hdbgs = ui("do_ALayout_1");


page.on("loaded",function(){
	hdbgs.animate(animHDdown);
});

textf.on("textChanged",function(){
	if(this.text==""){
		searchData.removeAll();
		searchUI.refreshItems();
	}else{
		searchData.removeAll();
		var _databus=param.databus;
		var databus=[];
		for(var i=0;i<_databus.length;i++){
			if(_databus[i].title.indexOf(this.text)!=-1){
				_databus[i].index=i;
				databus[databus.length]=_databus[i];
			}
		}
		searchData.addData(databus);
		for(var i=0;i<databus.length;i++){
			var _num = getMenuNum(databus[i].token);
			searchData.updateOne(i, {
				"token":databus[i].token,
				"path":databus[i].path,
				"title":databus[i].title,
				"price":databus[i].price+"元/例",
				"sales":"已售 : "+databus[i].sales+"份",
				"note":databus[i].note,
				"classToken":databus[i].classToken,
				"index":databus[i].index,
				"note":databus[i].note,
				"count":_num,
				"show":_num>0,
				"BigPath":databus[i].BigPath,
				"type":1
			});
		}
		searchUI.refreshItems();
	}
});

//searchUI.on("touch",function(index){
//	page.hideKeyboard();
//	var cell=searchData.getOne(index);
//	var json = {path:cell.path,title:cell.title,sales:cell.sales,price:cell.price,note:cell.note,selected:cell.count>0,index:cell.index};
//	open.start("source://view/other/fooddetail.ui",json);
//});

//获取当前菜品的数量
function getMenuNum(_token){
	var _num=0;
	for(var i=0;i<param.menuList.length;i++){
		var _data = param.menuList[i];
		if(_data.token==_token){
			_num = _data.num;
			break;
		}
	}
	return _num;
}