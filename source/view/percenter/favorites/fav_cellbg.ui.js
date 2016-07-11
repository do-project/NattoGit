var page = sm("do_Page");
var root = ui("$");
var $U = require("url");
var nf = sm("do_Notification");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var button1 = ui("do_Button_1");
var Euc = encodeURIComponent;

root.setMapping({
	"do_Button_1.tag":"token"
});

button1.on("touch","",300,function(){
	nf.confirm("是否取消收藏", "取消收藏", "确定", "取消", function(data, e) {
		if(data==1){
			cancel_http.url=$U.token($U.url.deleteCollect,"user")+"&token="+Euc(button1.tag)+"&soc=1";
			cancel_http.request();
		}
	});
});

var cancel_http = mm("do_Http");
cancel_http.method = "POST";// GET | POST
cancel_http.timeout = 60000; // 超时时间 : 单位 毫秒
cancel_http.contentType = "application/json"; // Content-Type
cancel_http.on("success", function(databus) {
	if(databus.error_code==0){
		page.fire("cancelRefresh");
	}else{
		nf.toast("操作失败");
	}
});