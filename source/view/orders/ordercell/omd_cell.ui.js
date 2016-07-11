var root = ui("$");
var open = require("open");
var nf = sm("do_Notification");
var algorithm = sm("do_Algorithm");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var $U = require("url");
root.setMapping({
	"buy_time.text":"buytime",
	"buy_type.text":"buytype",
	"buy_type.fontColor":"buytypecolor",
	"busniesspic.source":"busimg",
	"busniess_name.text":"busname",
	"buyprice.text":"buyprice",
	"taiwei_renshu.text":"twrs",
	"do_Button_1.text":"btn1Text",
	"do_Button_1.visible":"btn1Vis",
	"do_Button_1.tag":"btn1Tag",
	"do_Button_1.fontColor":"btn1Color",
	"buy_time.tag":"ip",
	"buy_type.tag":"port"
});

var param = {};

var btn = ui("do_Button_1");
var time = ui("buy_time");
var type = ui("buy_type");

btn.on("touch","",300,function(){
	btn.animate(buttonA,function(){
		var data = JSON.parse(btn.tag);
		param.orderno=data.no;
		param.ip = time.tag;
		param.port = type.tag;
		switch(data.type){
			case 0:   //付款
				nf.confirm("请在买单支付中付款", "点单付款", "确定", "取消", function(data, e) {
					if(data==1){
						open.start("source://view/other/payment.ui");
					}
				});
				//open.start("source://view/menuorder/menuorder_sureorder.ui",param);
				break;
			case 9:   //评价
				open.start("source://view/orders/order_discuss.ui",data.no);
				break;
		};
	})
});
