//related to Bbar.ui
var page = sm("do_Page");
var label = ui("do_Label_1");

page.on("pushevent", function(data) {
	switch (data.state) {
	case 0:
		label.text = "上拉加载";
		break;
	case 1:
		label.text = "松手即加载";
		break;
	case 2:
		label.text = "开始加载数据...";
		break;
	}
});