var deviceone = require("deviceone");
var app = deviceone.sm("do_App");

module.exports.start = function(source, data, id){
    var option = {source: source};
    if (data) option.data = data;
    option.statusBarFgColor = "black";
    option.statusBarState = "transparent";
    option.animationType = "push_r2l_1";
    if(id) option.id = id;
    app.openPage(option);
};
