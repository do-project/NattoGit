var deviceone = require("deviceone");
var global = deviceone.sm("do_Global");
var nf = deviceone.sm("do_Notification");

var domain = "http://www.nadouw.com/";
//var domain = "http://192.168.1.86:8081/";
var oatestapi = domain + "App/";
var Euc = encodeURIComponent;

var common = domain+"Common/";
var natto = oatestapi + "appNatto/";
var account = oatestapi + "appAccount/";
var reserve = oatestapi + "appReserve/";
var category = oatestapi + "appCategory/";
var appCity = oatestapi + "appCity/";
var appStore = oatestapi + "appStore/";
var appCollect = oatestapi + "appCollect/";
var appTake = oatestapi + "appTake/";
var appNotice = oatestapi + "appNotice/";
var appProduct = oatestapi + "appProduct/";
var appEval = oatestapi + "appEvaluate/";
var appSinglePoint = oatestapi + "appSinglePoint/";
var appOrder = oatestapi + "appOrder/";
var appMenu = oatestapi + "appMenu/";
var appTick = oatestapi + "appTick/";
var appAddress = oatestapi + "appAddress/";
var appUser = oatestapi + "appUser/";
var appMall = oatestapi + "appIntegralGoods/";
var appMessage = oatestapi + "appMessage/";
var appSMS = oatestapi + "appSMS/";
var appRefund = oatestapi + "appRefund/";
var appVersion = oatestapi + "appVersion/";
var appBean = oatestapi + "appBean/";
var appPlate = oatestapi + "appPlate/";
var url = {
	GetToken: account + "appLogin",
	appRegister: account + "appRegister",
	paypass:account+"appPayPass",
	
	nattoInfo:natto+"appNattoInfo",
	
	bankName: common+"GetBankName",
	
	appPlateList: appPlate+"appPlateList",
	appPlateDetail: appPlate+"appPlateDetail",
	
	appPublishBean: appBean+"appPublishBean",
	appBeanList: appBean+"appBeanList",
	appMyBeanList: appBean+"appMyBeanList",
	appUploadBeanImages: appBean+"appUploadBeanImages",
	appBeanPraise: appBean+"appBeanPraise",
	appDeleteBean: appBean+"appDeleteBean",
	
	appBindingPhone: appSMS + "appBindingPhone",
	appVerifyPhone: appSMS + "appVerifyPhone",
	appRegisterPhone: appSMS + "appRegisterPhone",
	appForgetPassSendCode: appSMS + "appForgetPassSendCode",
	appForgetPassVerifyCode: appSMS + "appForgetPassVerifyCode",
	
	appMessageList: appMessage + "appMessageList",
	appMessageDelete: appMessage + "appMessageDelete",
	
	appGoodList: appMall + "appGoodList",
	appGoodInfo: appMall + "appGoodInfo",
	appGoodOrder: appMall + "appGoodOrder",
	appGoodSubmitOrder: appMall + "appGoodSubmitOrder",
	appGoodOrderList: appMall + "appGoodOrderList",
	appGoodOrderInfo: appMall + "appGoodOrderInfo",
	
	SinglePointList: appSinglePoint + "appSinglePointList",
	SinglePointInfo: appSinglePoint + "appSinglePointInfo",
	appTheInvoicingSingle : appSinglePoint + "appSinglePointTheInvoicing",
	appSinglePointTotalOrderZero : appSinglePoint + "appSinglePointTotalOrderZero",
	appSinglePointInvoicingList : appSinglePoint + "appSinglePointInvoicingList",
	appSinglePointAllList : appSinglePoint + "appSinglePointAllList",
	appSinglePointAllDetails : appSinglePoint + "appSinglePointAllDetails",
	
	ReservationList: reserve + "appReserveList",
	ReservationInfo: reserve + "appReserveInfo",
	ReservationOrder: reserve + "appReserveOrder",
	ReserveSubmitOrder : reserve + "appReserveSubmitOrder",
	appReserveShowOrder : reserve + "appReserveShowOrder",
	appGainSame: reserve + "appGainSame",
	ReserveTotalOrderZero: reserve + "appReserveTotalOrderZero",
	
	reserveCategory: category + "reserveCategory",
	takeCategory: category + "takeCategory",
	
	areaList: appCity + "appAreaList",
	appProvinceList: appCity + "appProvinceList",
	
	storeList: appStore + "appStoreList",
	storeInfo: appStore + "appStoreInfo",
	appStoreNotice: appStore + "appStoreNotice",
	appStorePort: appStore + "appStorePort",
	LatestStore: appStore + "appLatestStore",
	
	collection : appCollect + "appCollection",
	collectExist : appCollect + "appCollectExist",
	collectStore : appCollect + "appCollectStore",
	deleteCollect : appCollect + "appDeleteCollect",
	
	takeList : appTake + "appTakeList",
	takeInfo : appTake + "appTakeInfo",
	takeOrder : appTake + "appTakeOrder",
	takeSubmitOrder : appTake + "appTakeSubmitOrder",
	takeShowOrder : appTake + "appTakeShowOrder",
	appTakeMenuClass : appTake + "appTakeMenuClass",
	appTakeMenu : appTake + "appTakeMenu",
	TakeTotalOrderZero : appTake + "appTakeTotalOrderZero",
	
	gainNotice : appNotice + "gainNotice",
	
	gainEval : appEval + "GetEvaluate",
	appEvaluate : appEval + "appEvaluate",
	appEvaluateClass : appEval + "appEvaluateClass",
	appUploadEvaluate : appEval + "appUploadEvaluate",
	
	appOrderMsg : appOrder + "appOrderMessage",
	appTakeOrderList : appOrder + "appTakeOrderList",
	appTakeOrderInfo : appOrder + "appTakeOrderInfo",
	appReserveOrderList : appOrder + "appReserveOrderList",
	appReserveOrderInfo : appOrder + "appReserveOrderInfo",
	
	appOrderListNumber : appOrder + "appOrderListNumber",
	appOrderDelete : appOrder + "appOrderDelete",
	appOrderConfirmGoods : appOrder + "appOrderConfirmGoods",
	appInTheOrder : appOrder + "appInTheOrder",
	
	appUsableTick : appTick + "appUsableTick",
	appUserTick : appTick + "appUserTick",
	
	appMenuClassList : appMenu + "appMenuClassList",
	appMenuList : appMenu + "appMenuList",
	
	appShipAddress : appAddress + "appShipAddress",
	appUpdateShipAddress : appAddress + "appUpdateShipAddress",
	appStoreArea : appAddress + "appAreaList",
	appUserShipAddress : appAddress + "appUserShipAddress",
	appDeleteShip : appAddress + "appDeleteShip",
	appDefaultShip : appAddress + "appDefaultShip",
	appShipSingle : appAddress + "appShipSingle",
	
	appShowRefund : appRefund + "appShowRefund",
	appRefundSubmit : appRefund + "appRefundSubmit",
	appRefundList : appRefund + "appRefundList",
	appRefundInfo : appRefund + "appRefundInfo",
	appCancelRefund : appRefund + "appCancelRefund",
	
	appUserInfo : appUser + "appUserInfo",
	appPersonalData : appUser + "appPersonalData",
	appUpdateNickName : appUser + "appUpdateNickName",
	appUpdateSex : appUser + "appUpdateSex",
	appUpdatePass : appUser + "appUpdatePass",
	appUpdatePayPass : appUser + "appUpdatePayPass",
	appUploadHeadPortrait : appUser + "appUploadHeadPortrait",
	appBalanceRecord : appUser + "appBalanceRecord",
	appIntegralRecord : appUser + "appIntegralRecord",
	appUserWithdrawalAmount : appUser + "withdrawalAmount",
	appUserWithdrawal : appUser + "withdrawal",
	appUserWithdrawalList : appUser + "withdrawalList",
	appAdvice : appUser + "AppAdvice",
	appForgetUpdatePass : appUser + "appForgetUpdatePass",
	appForgetPayPass : appUser + "appForgetPayPass",
	appUserMobile : appUser + "appUserMobile",
	appQueryPayPass : appUser + "appQueryPayPass",
	
	appContrastVersion:appVersion+"appContrastVersion"
};

var regular={
	phone:/^1[3|4|5|7|8][0-9]\d{8}$/
};

var token = function(url,name){
	var _token = global.getMemory("access_token");
	if(_token==undefined)
		_token = "";
    return url + "?"+name+"=" + Euc(_token);
};

var tokenExist = function(){
	return global.getMemory("access_token")==""? false:true;
};

var userToken = function(){
	return global.getMemory("access_token")==""? "0":global.getMemory("access_token");
};

var networkWIFI = function(data){
	var flag = false;
	if(data.indexOf("WIFI")!=-1 || data.indexOf("wifi")!=-1){
		flag=true;
	}
	return flag;
};

var queryString = function(obj, sep, eq, name){
    sep = sep || '&';
    eq = eq || '=';
    obj = obj === null ? undefined : obj;
    if (typeof obj === "object") return Object.keys(obj).map(function(k){
        var ks = Euc(k) + eq;
        if (Array.isArray(obj[k])) return obj[k].map(function(v){
            return ks + Euc(v)
        }).join(sep);
        else return ks + Euc(obj[k]);
    }).join(sep);
    if (!name) return "";
    return Euc(name) + eq + Euc(obj);
};

var headCodeCheck = function(data){
	if (data.error_code == "0") {
        return true;
    } else {
        nf.alert(data.reason);
        return false;
    }
};

var fail = function(data, pbar, listview){
    if (pbar.visible) pbar.visible = false;
    else if (listview) listview.rebound();
    if (data.status == 401)
        nf.alert("此帐号在另一设备上登录，您被强制下线", function(){
            global.exit();
        });
    else nf.alert(data.message);
};
module.exports.networkWIFI = networkWIFI;
module.exports.userToken = userToken;
module.exports.regular = regular;
module.exports.tokenExist = tokenExist;
module.exports.url = url;
module.exports.headCodeCheck = headCodeCheck;
module.exports.fail = fail;
module.exports.queryString = queryString;
module.exports.token = token;