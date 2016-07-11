var storage = sm("do_Storage");
var page = sm("do_Page");
var gridviewhd = ui("do_GridView_hd");
var hdData = mm("do_ListData");
gridviewhd.bindItems(hdData);

page.on("infoLoad",function(data){
	var title = ui("do_Label_4");
	title.text = data.title;
	var img = ui("do_ImageView_2");
	img.source = data.path;
	var className = ui("do_Label_5");
	className.text = data.cvm_str;
	var sinPrice = ui("do_Label_6");  //起送价
	sinPrice.text = data.sincePrice+"元";
	var disPrice = ui("do_Label_8");  //配送价
	disPrice.text = data.disPrice+"元";
	var distributionSide = ui("do_Label_10");   //配送方
	distributionSide.text = data.distributionSide;
	var disTime = ui("do_Label_13");
	disTime.text = "配送时间: "+data.deliveryTime;
	var address = ui("do_Label_15");
	address.text = data.address;
	
	hdData.removeAll();
	hdData.addData(data.avm);
	for(var i=0;i<data.avm.length;i++){
		hdData.updateOne(i, {
			"title":data.avm[i].title,
			"path":data.avm[i].path==null? "source://image/jian.png":data.avm[i].path
		});
	}
	gridviewhd.refreshItems();
});
