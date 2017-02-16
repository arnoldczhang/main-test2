/**
  * common method
  **/
module.exports = function() {
    var NODE_ENV = 'production';
    // var HOST = 'mock/';
    // if (window.location.host == "m.lvmama.com") {
    //     NODE_ENV = 'production';
    //     HOST = 'http://m.lvmama.com';
    // }

    //设置根域名cookie
    function setRootCookie(name, value, domain, path) {
        var _domain = domain;
        var _path = path;
        if (_domain) {
            _domain = ";domain=" + _domain;
        } else {
            _domain = "";
        }
        if (_path) {
            _path = ";path=" + _path;
        } else {
            _path = "";
        }
        var Days = 30; //此 cookie 将被保存 30 天
        var exp = new Date(); //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + _domain + _path + ";expires=" + exp.toGMTString();
    };

    //获取指定名称的cookie的值
    function getCookie(objName) {
        var arrStr = document.cookie.split(";");
        for (var i = 0; i < arrStr.length; i++) {
            var temp = arrStr[i].split("=");
            if (temp[0].trim() == objName) return decodeURIComponent(temp[1]);
        }
    };

    //设置cookie
    function setCookie(name, value) {
        var Days = 30; //此 cookie 将被保存 30 天
        var exp = new Date(); //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    };

    console.log(NODE_ENV)
    return {
        URL: NODE_ENV == 'production' ? {
            cmtCommentList : 'http://m.lvmama.com/api/router/rest.do?method=api.com.cmt.getCmtCommentList&version=1.0.0&isELong=N&placeIdType=PLACE&firstChannel=TOUCH&secondChannel=LVMM',
            latitudeScores : 'http://m.lvmama.com/api/router/rest.do?method=api.com.cmt.getLatitudeScores&version=1.0.0&category=VISA&firstChannel=TOUCH&secondChannel=LVMM',
            visaDetails : 'http://m.lvmama.com/api/router/rest.do?Ah5version=0.10192173861870768&h5Flag=Y&method=api.com.visa.product.getVisaDetails&version=1.0.0&firstChannel=TOUCH&secondChannel=LVMM',
            search : 'http://m.lvmama.com/api/router/rest.do?method=api.com.visa.product.search&firstChannel=TOUCH&secondChannel=LVMM&version=1.0.0',
            getInfo : 'http://m.lvmama.com/bullet/index.php?s=/Api/getInfos&channelCode=QZ&firstChannel=TOUCH&format=json&lvsessionid=2d088a83-b6a3-474d-aeff-5637c87f65b8&secondChannel=LVMM&stationCode=SH&tagCodes=QZ_BANNER,QZ_SJ,QZ_GJ,QZ_TJ,QZ_WD,QZ_RM,HDTJ_SMALL,HDTJ_BIG&udid=adc5b78a-6dfe-4833-ac41-28e3f664e68e-uuid'
        } : {
            cmtCommentList : '',
            latitudeScores : '',
            visaDetails : '',
            search : '',
            getInfo : ''
        },
        setRootCookie: setRootCookie,
        getCookie: getCookie,
        setCookie: setCookie
    };
};