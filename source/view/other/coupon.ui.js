var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var payLayout = rootview.add("PayKey","source://view/other/pop_Password.ui",0,0);
var payUI = ui(payLayout);
payUI.visible = false;
var global = sm("do_Global");

var param = page.getData();

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("ReturnPayPass",function(data){
	selectOption(data);
});

function selectOption(index){
	var cell = lvstData.getOne(index);
	page.fire("switch",index);
	app.closePage([3,cell.token,cell.amount]);
}

var lvseltime = ui("do_ListView_1");
var lvstData = mm("do_ListData");

lvseltime.bindItems(lvstData);
lvstData.addData(param[0]);
for(var i=0;i<param[0].length;i++){
	lvstData.updateOne(i, {
		"title":tickStr(param[0][i].ticket)+"  "+param[0][i].amount+"元",
		"token":param[0][i].token,
		"amount":param[0][i].amount,
		"imagevisible":param[1]==param[0][i].token,
		"index":i+1
	});
}
if(param[0].length>0){
	lvstData.addOne({title:"不使用抵价券",token:"",amount:0,imagevisible:param[1]=="",index:0}, 0);
}
lvseltime.refreshItems();

lvseltime.on("touch",function(index){
	var cell = lvstData.getOne(index);
	if(!cell.imagevisible){
		if(cell.token==""){
			//支付密码
			page.fire("SendPayPass",index);
		}else{
			nf.confirm("确认使用抵价券？", "使用抵价券", "确认", "取消", function(data, e) {
				if(data==1){
					//支付密码
					page.fire("SendPayPass",index);
				}
			});
		}
	}
});

function tickStr(str){
	var s = "";
	for(var i=0;i<str.length;i++){
		s+=str[i];
		if(i!=0 && (i+1)%4==0){
			s+=" ";
		}
	}
	return s;
}