var deviceone = require("deviceone");
var app = deviceone.sm("do_App");
var storage = deviceone.sm("do_Storage");
var device = deviceone.sm("do_Device");
var nf = deviceone.sm("do_Notification");
var global = deviceone.sm("do_Global");
var external = deviceone.sm("do_External");
var $U = require("url");
var version_file = "data://version";
var _flag = false;
var system = "";
var _version = "";
module.exports.compare = function(flag){
	_flag = flag;
	//对比
	var info = device.getInfo();
	if(info.OS=="android")
		system = "android";
	else{
		system = "ios";
	}
	storage.readFile(version_file, function(data, e) {
		if(system!="" && data!=""){
			version_http.url = $U.url.appContrastVersion+"?system="+system+"&version="+data; // 请求的 URL
			version_http.request();
		}
	});
};

var version_http = deviceone.mm("do_Http");
version_http.method = "POST";// GET | POST
version_http.timeout = 60000; // 超时时间 : 单位 毫秒
version_http.contentType = "application/json"; // Content-Type
version_http.on("success", function(databus) {
	if(!databus.newest && databus.newest!=undefined){
		_version = databus.versionNumber;
		var str = databus.mandatory? "(重要)":"";
		nf.confirm({text:databus.describe,title:"发现新大陆"+databus.versionNumber+str, button2text:"稍后再说", button1text:"立马就去"},function(data, e) {
			if(data==1){
				if(system=="ios" && !databus.mandatory){
					InUpdate(databus.path);
				}else{
					stratUpdate(databus.path);
				}
			}
		});
	}
});

function stratUpdate(path){
	external.openURL(path)
}
//内更新
function InUpdate(path){
	var http4;
	var zip = "data://update.zip";
	http4 = deviceone.mm("do_Http");
	http4.timeout = 30000;
	http4.contentType = "application/json";
	http4.url = path;
	 
	http4.on("success", function(data) {
		update(zip);
	});
	http4.download(zip)
}

//解压，然后覆盖旧的文件，然后更新本地版本号
function update(zip) {
    storage.unzip(zip, "data://update", function(data) {
        // 这里可以拷贝文件，也可以拷贝目录
        app.update(["data://update"],"source://", function(data, e) {
        	if(data){
                storage.writeFile("data://version", _version,function(data){
                	if(data){
                		global.exit();
                	}else{
                		nf.alert("版本更新失败","提示");
                	}
                });
        	}     
        });
    })
}