var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var socket = mm("do_Socket");
var algorithm = sm("do_Algorithm");
var rootview = ui("$");
var open = require("open");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loading.ui", 0, 550));

var param = page.getData();
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	menuOrder();
});

//获取已点菜单
function menuOrder(){
	var sameStr = {type:2,sameId:param.sameId,user:$U.userToken()};
	socket.connect(param.ip,param.port.toString(), function(data, e) {
		if(data){
			socket.send("UTF-8",JSON.stringify(sameStr) , function(data1, e) {
				if(!data1){
					nf.toast("获取点单列表失败，请重新点击获取");
					app.closePage();
				}
			});
		}else{
			nf.toast("发送失败，请重新点击发送");
		}
	});
}

//已点菜单列表
var dcdlistgird = ui("do_GridView_diancaidan");
var dcddata = mm("do_ListData");
dcdlistgird.bindItems(dcddata);

var subbtn = ui("do_Button_subbtn");
subbtn.on("touch","",300,function(){
	subbtn.animate(buttonA,function(){
		open.start("source://view/menuorder/menuorder_sureorder.ui",param);
	});
});
var scrollview1 = ui("do_ScrollView_1");
page.on("loaded",function(){
	scrollview1.toBegin();
});

var people = ui("do_Label_6");   //人数
var sameNode = ui("do_Label_7"); //台位
var fenshu = ui("do_Label_8");   //份数
var total = ui("do_Label_10");   //总金额

//接收数据 
socket.on("receive", function(data, e) {
	try{
		var json = hexToString(data);
		var databus = JSON.parse(json);
		
		switch(databus.type){
			case "-1":
				nf.toast(algorithm.base64Sync("decode", databus.message));
				socket.close();
				app.closePage();
				break;
			case "9":   //获取点单列表
				param.orderno = databus.orderno;
				people.text = "人数:"+databus.people;
				sameNode.text = "台位:"+databus.sameNode;
				fenshu.text = databus.totalNumber;
				total.text = parseFloat(databus.totalPrice);
				dcddata.removeAll();
				dcddata.addData(databus.menuList);
				for(var i=0;i<databus.menuList.length;i++){
					var _data = databus.menuList[i];
					_str="";
					if(_data.stateStr=="-1"){
						_str = "退";
					}else if(_data.stateStr=="-2"){
						_str="赠";
					}
					dcddata.updateOne(i, {
						"index":i,
						"title":algorithm.base64Sync("decode", _data.title),
						"price":_data.price+"元",
						"num":"X"+_data.num,
						"state":_str
					});
				}
				dcdlistgird.refreshItems();
				loadbg.visible=false;
				break;
		};
		socket.close();
	}catch(e){
		nf.toast("接受信息有误，请重新操作");
		socket.close();
		app.closePage();
	}
});
//16进制转换字符串
function hexToString(val){
	var strInput = val;
    var nInputLength = strInput.length;
    if(nInputLength%2 == 0) //当输入够偶数位；
    {                 
        var StrHex = "";
        for (var i=0; i < nInputLength; i = i + 2 )
        {
        	var str = strInput.substr(i, 2); //16进制；
        	var n = parseInt(str, 16);//10进制；
        	StrHex = StrHex + String.fromCharCode(n);
        }
        return StrHex;
    }
    return "";
}