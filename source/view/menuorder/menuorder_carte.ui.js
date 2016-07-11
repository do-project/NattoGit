var page = sm("do_Page");
var app = sm("do_App");
var rootview = ui("$");
var storage = sm("do_Storage");
var nf = sm("do_Notification");
var open = require("open");
var socket = mm("do_Socket");
var algorithm = sm("do_Algorithm");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var Euc = encodeURIComponent;

var databus = page.getData();
var type = 0;
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	socket.close();
	app.closePage({type:type});
});
page.supportPanClosePage();
page.on("back", function(){
	socket.close();
	app.closePage({type:type});
}).on("loaded",function(){
	//加载当前点的菜品列表
	orderList();
});

var singlePrice = ui("do_Label_9");  //总价格
var singleNumber = ui("do_Label_7");  //份数
//已点菜单列表
var dcdlistgird = ui("do_GridView_diancaidan");
var dcddata = mm("do_ListData");
dcdlistgird.bindItems(dcddata);

function orderList(){
	var _price = 0;
	var _num = 0;
	dcddata.removeAll();
	dcddata.addData(databus.order);
	for(var i=0;i<databus.order.length;i++){
		var _data = databus.order[i];
		dcddata.updateOne(i, {
			"index":i+1,
			"title":_data.title,
			"price":_data.price+"元",
			"num":"x"+_data.num
		});
		_price+=_data.price*_data.num;
		_num+=_data.num;
	}
	dcdlistgird.refreshItems();
	
	singlePrice.text = _price;
	singleNumber.text = _num;
}


dcdlistgird.on("touch",function(){
	page.hideKeyboard();
});
rootview.on("touch",function(){
	page.hideKeyboard();
});
var note = ui("do_TextField_3");  //备注
//发送菜单
var sendMenu = ui("do_Button_subbtn");
sendMenu.on("touch","",300,function(){
	sendMenu.animate(buttonA, function(data, e) {
		var json = {type:1,sameId:databus.sameId,Message:algorithm.base64Sync("encode", note.text),user:$U.userToken()};
		json.orderList = databus.order;
		socket.connect(databus.ip,databus.port.toString(), function(data, e) {
			if(data){
				socket.send("UTF-8",JSON.stringify(json) , function(data1, e) {
					if(data1){
						type = 9;
						nf.toast("发送成功，请等待商家操作通知或在结账页中查看是否点菜成功");
					}
				});
			}else{
				nf.toast("发送菜单失败，请重新点击发送");
			}
		});
	});
});

//接收数据 
socket.on("receive", function(data, e) {
	var json = hexToString(data);
	var databus = JSON.parse(json);
	switch(databus.type){
		case "-1":
			type = 0;
			nf.toast(algorithm.base64Sync("decode", databus.message));
			break;
		case "9":  //点菜成功
			app.closePage({type:9});
			break;
	};
	socket.close();
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