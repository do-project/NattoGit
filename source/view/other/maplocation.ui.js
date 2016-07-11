var page = sm("do_Page");
var app = sm("do_App");
var bdlocation = sm("do_BaiduLocation"); //定位
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var open = require("open");
var location = page.getData();

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
})
//page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
});


//
var map = ui("do_BaiduMapView_1");
var mark1 = [{"id":"id1","latitude":location[0],"longitude":location[1],"url":"source://image/startpage/mapbus.png","info":location[2]}];
var address = ui("do_Label_3");
address.text = location[3];
var title = ui("do_Label_2");
title.text = location[2];
//page.on("loaded",function(){
//	
//});
map.zoomLevel = 18;
map.setCenter({latitude:location[0], longitude:location[1]});
map.addMarkers({data:mark1});