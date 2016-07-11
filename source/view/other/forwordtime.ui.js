var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var param = page.getData();


var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
});


var lvseltime = ui("do_ListView_1");
var lvstData = mm("do_ListData");

lvseltime.bindItems(lvstData);
lvstData.addData(param[0]);
for(var i=0;i<param[0].length;i++){
	lvstData.updateOne(i, {
		"title":param[0][i].title,
		"imagevisible":param[1]==param[0][i].title? true:false
	});
}
lvseltime.refreshItems();

lvseltime.on("touch",function(index){
	//deviceone.print(index);
	var cell = lvstData.getOne(index);
	for(var i=0;i<param[0].length;i++){
		lvstData.updateOne(i, {
			"title":param[0][i].title,
			"imagevisible":i==index? true:false
		});
	}
	lvseltime.refreshItems();
	
	app.closePage([0,cell.title]);
});