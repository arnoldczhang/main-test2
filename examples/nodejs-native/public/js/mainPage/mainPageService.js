'use strict'
function setCookie (name, value) {
    let Days = 30; //此 cookie 将被保存 30 天
    let exp = new Date(); //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};

var sprintInst = JSpring([function($scope, $, _this) {
	Swipe($('.swiper-banner').eq(0), {
		startSlide: $scope.startSlide, //起始幻灯片
		speed: 500, //滑动速度
		auto: 2e3, //滑动间隔
		continuous: true, //是否连续滑动
		pageEl: $('.pagination1').eq(0) //自定义圆点
	});
	$scope.loadedFlag = true;
}, function($, module) {
	return __INITIAL_STATE__;
}, "#container"], {
	renderFn : __RENDER_FN__
});