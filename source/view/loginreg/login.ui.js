var page = sm("do_Page");
var app = sm("do_App");
var storage = sm("do_Storage");
var global = sm("do_Global");
var open = require("open");
var rootview = ui("$");
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var pbar = rootview.add("loadings","source://view/cells/loading.ui",0,567);
var pbar_ui = ui(pbar);
pbar_ui.visible = false;
var login_file = "data://security/login";
var nf = sm("do_Notification");
var param = page.getData();
var $U = require("url");

var Euc = encodeURIComponent;

var leftclose = ui("do_ALayout_close");

var login_http = mm("do_Http");
login_http.method = "POST";
login_http.timeout = "10000";
login_http.contentType = "application/json";
login_http.on("fail", function(data){
    $U.fail(data, pbar_ui);
}).on("success", function(data){
	pbar_ui.visible = false;
    if (!$U.headCodeCheck(data)) return;
    login_success(data.token,data.username,data.path);
    
    param.orderNum = data.orderNum;
    param.msgNum = data.msgNum;
    
    app.closePage(param);
}).on("fail", function(data) {
	nf.alert(JSON.stringify(data),"错误提示");
});

var login_success = function(access_token,access_login,access_img){
	pbar_ui.visible = true;
	var login_body = {
			access_login:access_login,
	        access_token : access_token,
	        access_img:access_img
	    };
	storage.writeFile(login_file, login_body);
	global.setMemory("access_token", access_token);
};

leftclose.on("touch",function(){
	app.closePage();
	page.hideKeyboard();
})

page.on("back", function(){
	app.closePage();
	page.hideKeyboard();
});

page.on("loaded",function(){
	var label = ui(pbar + ".do_Label_1");
	label.text = "登录中...";
});
var regbtn = ui("registerbtn");
regbtn.on("touch",function(){
	open.start("source://view/loginreg/register.ui");
});
var action_login = ui("action_login");
var tf_id = ui("tf_id");
var tf_password = ui("tf_password");
action_login.on("touch","",300, function(){
	action_login.animate(buttonA,function(){
		page.hideKeyboard();
		var itcode = tf_id.text.toLowerCase().trim();
		if (itcode == "") return nf.toast("帐号不可为空");
		var pwd = tf_password.text.trim();
		if (pwd == "") return nf.toast("密码不可为空");
		pbar_ui.visible = true;
		
		var channelId = global.getMemory("channelId");
		var equipment = global.getMemory("equipment");
		
		login_http.url = $U.url.GetToken + "?user_name="+itcode+"&password="+pwd+"&channelId="+channelId+"&equipment="+equipment;
		login_http.request();
	});
}).on("touchDown", function(){
    this.animate(buttonA);
});


//点击背景隐藏输入键盘
rootview.on("touch",function(){
	page.hideKeyboard();
})

//忘记密码
var forgetPass = ui("do_Button_2");
forgetPass.on("touch","",300,function(){
	open.start("source://view/percenter/back/phoneverify.ui");
});