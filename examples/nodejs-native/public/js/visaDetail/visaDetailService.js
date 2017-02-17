'use strict'

function setCookie (name, value) {
    let Days = 30; //此 cookie 将被保存 30 天
    let exp = new Date(); //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};

var sprintInst = JSpring([function($scope, $, _this) {
	;
}, function($, module) {
	$.extend(__INITIAL_STATE__, {
		goBack () {
			history.go(-1);
		},
		toBr (str) {
			return str.replace(/[2-9]+[、\.]/g,"<br />$&");
		},
		toggleTab (flag) {
			this.visaDetailFlag = false;
			this.needInfoFlag = false; 
			this.reserveFlag = false; 
			this.commentFlag = false; 
			this[flag] = true;
		}
	});
	return __INITIAL_STATE__;
}, "#container"], {
	renderFn : __RENDER_FN__
});