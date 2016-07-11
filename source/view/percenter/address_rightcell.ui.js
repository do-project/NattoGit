var page = sm("do_Page");
var nf = sm("do_Notification");
var root = ui("$");
var $U = require("url");
var open = require("open");
var Euc = encodeURIComponent;
var _index = -1;
root.setMapping({
	"rightbg.width":"width",
	"do_Button_del.tag":"operate",
	"do_Button_edit.tag":"operate",
	"do_Button_set.tag":"operate"
});
root.on("dataRefreshed",function(){
	root.redraw();
});

var _del = ui("do_Button_del");
_del.on("touch","",300,function(){
	var _tag = this.tag;
	nf.confirm("确认删除地址", "删除地址", "确认", "取消", function(data, e) {
		if(data==1){
			var _data = JSON.parse(_tag);
			_index = _data.index;
			delete_http.url = $U.token($U.url.appDeleteShip,"user")+"&token="+Euc(_data.token); // 请求的 URL
			delete_http.request();
		}
	});
});
//编辑
var _edit = ui("do_Button_edit");
_edit.on("touch","",300,function(){
	var _data = JSON.parse(this.tag);
	open.start("source://view/percenter/addressEdit1.ui",_data.token);
});

var _set = ui("do_Button_set");
_set.on("touch","",300,function(){
	var _data = JSON.parse(this.tag);
	_index = _data.index;
	default_http.url = $U.token($U.url.appDefaultShip,"user")+"&token="+Euc(_data.token); // 请求的 URL
	default_http.request();
});

var delete_http = mm("do_Http");
delete_http.method = "POST";// GET | POST
delete_http.timeout = 60000; // 超时时间 : 单位 毫秒
delete_http.contentType = "application/json"; // Content-Type
delete_http.on("success", function(databus) {
	if(databus.error_code==0){
		page.fire("deleteShip",_index);
	}else{
		nf.toast("请求失败");
	}
});
var default_http = mm("do_Http");
default_http.method = "POST";// GET | POST
default_http.timeout = 60000; // 超时时间 : 单位 毫秒
default_http.contentType = "application/json"; // Content-Type
default_http.on("success", function(databus) {
	if(databus.error_code==0){
		page.fire("defaultShip",_index);
	}else{
		nf.toast("请求失败");
	}
});