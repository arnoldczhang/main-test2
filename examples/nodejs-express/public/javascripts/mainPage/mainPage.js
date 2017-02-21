'use strict'

var SearchInput = __TEMPLATE__.SearchInput;
JSpring.addComponent('SearchInput', {
  data : 'word',
  $scope : SearchInput.$scope,
  template : SearchInput.template
});

var Swiper = __TEMPLATE__.Swiper;
JSpring.addComponent('Swiper', {
  data : 'list',
  $scope : Swiper.$scope,
  template : Swiper.template
});

var Hot = __TEMPLATE__.Hot;
JSpring.addComponent('Hot', {
  data : 'list',
  $scope : Hot.$scope,
  template : Hot.template
});

var HotItem = __TEMPLATE__.HotItem;
JSpring.addComponent('HotItem', {
  data : 'obj',
  $scope : HotItem.$scope,
  template : HotItem.template
});

var Special = __TEMPLATE__.Special;
JSpring.addComponent('Special', {
  data : 'list',
  $scope : Special.$scope,
  template : Special.template
});

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
	$.extend(__INITIAL_STATE__, {
		getInfo : function () {
			return $.get(cm.URL.getInfo);
		},
		goVisaList : function (pinyin, word) {
			setCookie('visa-country', word);
			location.href = 'visaList#' + pinyin;
		},
		goVisaDetail : function (productId, goodsId) {
			setCookie('visa-goodsId', goodsId);
			setCookie('visa-productId', productId);
			location.href = 'visaDetail#' + goodsId;
		},
	});

	return __INITIAL_STATE__;
}, "#container"], {
	renderFn: __RENDER_FN__
});