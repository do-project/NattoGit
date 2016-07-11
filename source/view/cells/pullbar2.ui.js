//related to pullbar.ui
var page = sm("do_Page");
var texts = ui("do_Label_1");
page.on("pullevent",function(data){
	
	switch (data.state) {
	case 0:
		texts.text = "下拉刷新";
		break;
	case 1:
		texts.text = "松手即刷新";
		break;
	case 2:
		texts.text = "开始加载数据";
		break;
	}
	
//	if(data.state == 2)
//		return;
});