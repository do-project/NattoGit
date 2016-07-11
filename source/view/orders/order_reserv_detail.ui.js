var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var QRcodea = sm("do_QRCode");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var token = page.getData();
var loadbg = ui(rootview.add("loadingbg", "source://view/cells/loadingbg.ui", 0, 148));
var Euc = encodeURIComponent;
var QRimage = ui("do_ImageView_2");
var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
}).on("loaded",function(){
	reserveLoad();
	
}).on("result",function(data){
	if(data==-1){
		app.closePage(-1);
	}
});
//已点菜单列表
var dcdlistgird = ui("do_GridView_1");
var dcddata = mm("do_ListData");
dcdlistgird.bindItems(dcddata);


function reserveLoad(){
	request_http.url = $U.token($U.url.appReserveOrderInfo,"user")+"&token="+Euc(token); // 请求的 URL
	request_http.request();
}
var btn1 = ui("do_Button_1");
var btn2 = ui("do_Button_2");

btn1.on("touch",function(){
	operate(this.tag);
});
btn2.on("touch",function(){
	operate(this.tag);
});

function operate(param){
	var data = JSON.parse(param);  //type,no
	switch(data.type){
		case -1:  //退款
			open.start("source://view/orders/userdrawback.ui",data.no);
			break;
		case 0:  //删除
			nf.confirm("确认取消订单？", "取消订单", "确认", "取消", function(index, e) {
				if(index==1){
					delete_http.url = $U.token($U.url.appOrderDelete,"user")+"&orderno="+data.no; // 请求的 URL
					delete_http.request();
				}
			});
			break;
		case 1:  //付款
			open.start("source://view/reservation/reservation_sureorder.ui",data.no);
			break;
		case 9:  //评价
			open.start("source://view/orders/order_discuss.ui",data.no);
			break;
	};
}

//删除订单
var delete_http = mm("do_Http");
delete_http.method = "POST";// GET | POST
delete_http.timeout = 60000; // 超时时间 : 单位 毫秒
delete_http.contentType = "application/json"; // Content-Type
delete_http.on("success", function(databus) {
	if(databus==-1){
		nf.toast("删除订单失败");
	}else{
		app.closePage(-1);
	}
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type
request_http.on("success", function(databus) {
	if(databus!=-1){
		loadbg.visible = false;
		var resName = ui("do_Label_25");  //预定人姓名
		resName.text = "预订人姓名: "+databus.res_name;
		var resMobile = ui("do_Label_26");  //预定人电话
		resMobile.text = "预订人电话: "+databus.res_mobile;
		var shopName = ui("do_Label_27");  //到店人姓名
		shopName.text = "到店人姓名: "+databus.shop_name;
		var shopMobile = ui("do_Label_28");  //到店人电话
		shopMobile.text = "到店人电话: "+databus.shop_mobile;
		
		var _time = ui("do_Label_3");
		_time.text = "到店时间:"+databus.shopTime;
		var _state = ui("do_Label_18");  //状态
		_state.text = databus.stateStr;
		var renshu = ui("do_Label_5");  //人数
		renshu.text = databus.subTitle+" | 人数:"+databus.people+"位";
		var _price = ui("do_Label_4");
		_price.text = databus.preDishes? "预点菜(￥"+databus.price+")":"订座(￥"+databus.price+")";
		var tickPanel = ui("do_ALayout_9");
		if(databus.state==0){
			tickPanel.height = 0;
			tickPanel.redraw();
		}else{
			var tick = ui("do_Label_16");
			if(databus.tvm.ticket!=null && databus.tvm.ticket!=""){
				tick.text = "纳豆券:"+tickChange(databus.tvm.ticket);
				QRcodea.create("voucher:" + databus.tvm.encryptTick,"500", function(dataQ, e) {
					QRimage.source = dataQ;
					//deviceone.print(QRimage.source + tick.text);
			    });
			}
			
			var tickState = ui("do_Label_17");
			switch(databus.tvm.touse){
				case -1:
					tickState.text = "退款";
					break;
				case 0:
					tickState.text = "未使用";
					break;
				case 1:
					tickState.text = "已使用";
					break;
			}
		}
		var _title = ui("do_Label_7");
		_title.text = databus.title;
		
		var _address = ui("do_Label_8");
		_address.text = databus.address;
		
		var _no = ui("do_Label_10");
		_no.text = "订单编号:"+databus.orderno;
		
		var gentime = ui("do_Label_11");
		if(databus.payTime!=null && databus.payTime!=""){
			gentime.text = "付款时间:"+databus.payTime;
		}else{
			gentime.text = "下单时间:"+databus.genTime;
		}
		if(databus.mvm.length>0)
		{
			dcddata.addData(databus.mvm);
			for(var i=0;i<databus.mvm.length;i++){
				var me = databus.mvm[i];
				dcddata.updateOne(i,{
					"index":me.index,
					"title":me.title,
					"num":"x"+me.num,
					"price":me.price+"元"
				});
			}
			dcdlistgird.refreshItems();
		}else{
			dcdlistgird.height=0;
			dcdlistgird.redraw();
		}
		var _param = {type:0,no:databus.orderno};
		switch(databus.state){
			case 0:
				if(databus.overdue){
					btn2.visible=false;
				}else{
					if(databus.price>0){
						btn2.text="付款";
					}else{
						_state.text = "用户未确认";
						btn2.text="确认订单";
					}
					_param.type = 1;
					btn2.tag=_param;
				}
				btn1.text="删除";
				_param.type = 0;
				btn1.tag=_param;
				break;
			case 1:
				if(databus.price>0){
					btn1.text="退款";
					_param.type = -1;
					btn1.tag=_param;
				}else{
					btn1.text="取消";
					_param.type = 0;
					btn1.tag=_param;
				}
				btn2.visible=false;
				break;
			case 2:
				if(databus.price>0){
					btn1.text="退款";
					_param.type = -2;
					btn1.tag=_param;
				}else{
					btn1.visible=false;
				}
				btn2.visible=false;
				break;
			case 9:
				if(!databus.evaluate){
					btn1.text="评价";
					_param.type=9;
					btn1.tag=_param;
				}else{
					btn1.visible=false;
				}
				btn2.visible=false;
				break;
		};
		if(btn2.visible || btn1.visible){
			var _panel = ui("do_ALayout_7");
			_panel.visible=true;
		}
	}else{
		nf.toast("加载失败");
	}
});

function tickChange(tick){
	return tick.substring(0,4)+" "+tick.substring(4,8)+" "+tick.substring(8);
}