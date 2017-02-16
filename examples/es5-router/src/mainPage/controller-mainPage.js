module.exports = function ($scope, $, module, _this) {
	
	$scope.getInfo().then(function (res) {
		const data = res.datas;
		$.each(data, function (info, index) {

			if (info.tag_code == 'QZ_RM') {
				$scope.hotList = info.infos.slice(0, 9);
			}

			else if (info.tag_code == 'QZ_BANNER') {
				$scope.swiperList = info.infos;
			}

			else if (info.tag_code == 'QZ_TJ') {
			 	$scope.specialList = info.infos;
			 }
		});

		//异步初始化swiper
		_this.pushHook(function () {
			Swipe($('.swiper-banner').eq(0), {
				startSlide: $scope.startSlide, //起始幻灯片
				speed: 500, //滑动速度
				auto: 2e3, //滑动间隔
				continuous: true, //是否连续滑动
				pageEl: $('.pagination1').eq(0) //自定义圆点
			});
			$('.visa-home').addClass('fadeIn');
		});
	}).catch(function (err) {

	});
};