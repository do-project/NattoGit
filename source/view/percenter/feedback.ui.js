var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var open = require("open");
var nf = sm("do_Notification");
var rootview = ui("$");
var $U = require("url");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var Euc = encodeURIComponent;

var leftclose = ui("do_ALayout_close");
leftclose.on("touch",function(){
	app.closePage();
});
page.supportPanClosePage();
page.on("back", function(){
	app.closePage();
});

var bgs = ui("do_LinearLayout_1");
bgs.on("touch",function(){
	page.hideKeyboard();
});

page.on("loaded",function(){
	
});
var msg=ui("do_TextBox_2");        //反馈内容
var contact=ui("do_TextField_1");  //联系方式
var btn = ui("do_Button_1");
btn.on("touch","",300,function(){
	page.hideKeyboard();
	if(msg.text.trim()==""){
		nf.toast("请填写您的问题与建议");
	}else if(contact.text.trim()==""){
		nf.toast("请填写您的联系方式");
	}else{
		nf.confirm({text:"是否确认提交内容?",title:"反馈",button1text:"提交",button2text:"取消"},function(datacall,e){
			if(datacall == 1){
				request_http.url = $U.url.appAdvice+"?msg="+Euc(msg.text)+"&contact="+Euc(contact.text);
			    request_http.request();
			    //deviceone.print(request_http.url);
			}
		});
	}
});

var request_http = mm("do_Http");
request_http.method = "POST";// GET | POST
request_http.timeout = 60000; // 超时时间 : 单位 毫秒
request_http.contentType = "application/json"; // Content-Type

request_http.on("success", function(databus) {
	if(databus.error_code==0){
		nf.alert("您的问题/意见提交成功,我们会认真处理您的问题/意见！",function(){
			app.closePage();
		});
	}else{
		nf.toast("提交反馈失败");
	}
});

var scrollbg = ui("do_ScrollView_1");
scrollbg.on("scroll",function(){
	page.hideKeyboard();
});